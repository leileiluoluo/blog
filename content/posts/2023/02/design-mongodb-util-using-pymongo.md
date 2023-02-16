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

### 1 代码

#### connection.py

```python
from typing import Dict, List, Tuple

import os
from pymongo import MongoClient


class Connection:
    def __init__(self, collect_name: str):
        conn_str = os.getenv('MONGO_URL')
        db_name = os.getenv('MONGO_DB')
        if conn_str is None or db_name is None:
            raise EnvironmentError("MONGO_URL or MONGO_DB is not set")

        self.collection = MongoClient(conn_str)[db_name][collect_name]

    def insert(self, item: Dict) -> str:
        return self.collection.insert_one(item).inserted_id

    def count(self, condition: Dict) -> int:
        return self.collection.count_documents(condition)

    def get(self, condition: Dict) -> Dict:
        return self.collection.find_one(condition)

    def list_with_pagination(self, condition: Dict,
                             page_no: int, page_size: int, sort_tuples: List[Tuple]) -> List[Dict]:
        items_skipped = (page_no - 1) * page_size
        cursor = self.collection.find(condition).skip(items_skipped).sort(sort_tuples).limit(page_size)

        items = []
        for item in cursor:
            items.append(item)
        return items

    def update(self, condition: Dict, update_dict: Dict) -> None:
        self.collection.update_many(condition, {'$set': update_dict})

    def delete(self, condition: Dict) -> None:
        self.collection.delete_many(condition)
```

#### connection_test.py

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
        page_size = 10
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
