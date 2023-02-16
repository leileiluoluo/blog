---
title: Python 中如何使用 PyMongo 封装一个易用的 MongoDB 工具类
author: olzhy
type: post
date: 2023-02-15T08:00:00+08:00
url: /posts/design-mongodb-util-using-pymongo.html
categories:
  - 计算机
tags:
  - Python
keywords:
  - Python
description: Python 中如何使用 PyMongo 封装一个易用的 MongoDB 工具类。
---

本文介绍在 Python 中如何使用 PyMongo 来封装一个简单易用的 MongoDB 工具类。

进行编码之前，应考虑一下这个工具类应具有的几个基本的功能：

- 新增 `insert`

  支持插入单条记录，并返回插入后所生成的 ID。

- 查询条数 `count`

  查询满足条件的数据条数。

- 查询单条记录 `get`

  查询满足条件的一条记录。

- 分页查询一组记录 `list_with_pagination`

  指定查询条件、页码（`page_no`）、单页记录数(`page_size`)和排序规则进行查询，返回满足条件的一组排序记录。

- 更新 `update`

  指定查询条件和待更新字段健值对来进行更新。

- 删除 `delete`

  指定条件对数据进行删除。

### 1 进行封装

封装后的工具类名为`connection.py`，源码如下：

```python
from typing import Dict, List, Tuple

import os

import pymongo
from bson import ObjectId


class Connection:
    def __init__(self, collect_name: str):
        conn_str = os.getenv('MONGO_URL')
        db_name = os.getenv('MONGO_DB')
        if conn_str is None or db_name is None:
            raise EnvironmentError("MONGO_URL or MONGO_DB is not set")

        self.collection = pymongo.MongoClient(conn_str)[db_name][collect_name]

    def insert(self, item: Dict) -> ObjectId:
        return self.collection.insert_one(item).inserted_id

    def count(self, condition: Dict) -> int:
        return self.collection.count_documents(condition)

    def get(self, condition: Dict) -> Dict:
        return self.collection.find_one(condition)

    def list_with_pagination(self, condition: Dict,
                             page_no: int = 1, page_size: int = 10,
                             sort_tuples: List[Tuple] = list()) -> List[Dict]:
        items_skipped = (page_no - 1) * page_size
        cursor = self.collection.find(condition).skip(items_skipped)
        if len(sort_tuples) > 0:
            cursor = cursor.sort(sort_tuples).limit(page_size)
        else:
            cursor = cursor.limit(page_size)

        items = []
        for item in cursor:
            items.append(item)
        return items

    def update(self, condition: Dict, update_dict: Dict) -> None:
        self.collection.update_many(condition, {'$set': update_dict})

    def delete(self, condition: Dict) -> None:
        self.collection.delete_many(condition)
```

创建该工具类需要隐式提供两个环境变量：`MONGO_URL`与`MONGO_DB`。
`MONGO_URL`为 MongoDB 连接地址，格式为`mongodb://{username}:{password}@{host}:{port}`；
`MONGO_DB`为数据库名。

### 2 进行测试

封装完成后，我们对`connection.py`编写测试类进行单元测试。

测试类`connection_test.py`源码如下：

```python
import datetime
from unittest import TestCase

import pymongo
import mongomock
from bson import ObjectId

from connection import Connection


class TestConnection(TestCase):
    def setUp(self) -> None:
        self.connection = Connection('users')

        # mock
        self.connection.collection = mongomock.MongoClient().db.collection

        # insert initial data
        id = ObjectId('63eca79d252cd5ac908a7f06')
        user = self.connection.get({'_id': id})
        if user is None:
            user = {
                '_id': id,
                'name': 'Larry',
                'age': 19,
                'createdAt': '2023-02-16 14:43:45',
                'updatedAt': '2023-02-16 14:43:45'
            }
            self.connection.insert(user)

    def test_insert(self):
        now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        user = {
            '_id': ObjectId('63eca79d252cd5ac908a7f07'),
            'name': 'Larry',
            'age': 19,
            'createdAt': now,
            'updatedAt': now
        }

        id = self.connection.insert(user)

        self.assertEqual(user['_id'], id)

    def test_count(self):
        condition = {'name': 'Larry'}
        user_count = self.connection.count(condition)

        self.assertTrue(user_count > 0)

    def test_get(self):
        condition = {'_id': ObjectId('63eca79d252cd5ac908a7f06')}
        user = self.connection.get(condition)

        self.assertIsNotNone(user)

    def test_list_with_pagination(self):
        condition = {'name': 'Larry'}
        page_no = 1
        page_size = 20
        sort_tuples = [('createdAt', pymongo.DESCENDING)]

        users = self.connection.list_with_pagination(condition, page_no, page_size, sort_tuples)

        self.assertTrue(len(users) > 0)

    def test_update(self):
        condition = {'_id': ObjectId('63eca79d252cd5ac908a7f06')}
        now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        update_dict = {
            'name': 'Larry Update',
            'updatedAt': now
        }

        # update
        self.connection.update(condition, update_dict)

        # get
        user = self.connection.get(condition)

        self.assertEqual(update_dict['name'], user['name'])

    def test_delete(self):
        condition = {'name': 'Larry'}

        # delete
        self.connection.delete(condition)

        count = self.connection.count(condition)

        self.assertEqual(0, count)
```

> 参考资料
>
> [1] [PyMongo 4.3.3 documentation - pymongo.readthedocs.io](https://pymongo.readthedocs.io/en/4.3.3/tutorial.html)
