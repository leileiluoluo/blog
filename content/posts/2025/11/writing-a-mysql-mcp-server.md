---
title: 使用 FastMCP 编写一个 MySQL MCP Server
author: leileiluoluo
type: post
date: 2025-11-08T10:00:00+08:00
url: /posts/writing-a-mysql-mcp-server.html
categories:
  - 计算机
tags:
  - AI
  - Python
keywords:
  - Python
  - FastMCP
  - MCP
  - MySQL
  - Server
  - Windsurf
description: 在日常工作中，当我们针对某个业务场景不知 SQL 如何编写时，或在应用程序中找到一些慢 SQL 需要优化而不知所措时，通常会询问 AI 助手。但我们若不提供任何上下文，仅仅是用一句话将业务场景描述给 AI 助手让其实现，或贴一段很长的 SQL 让 AI 助手来优化，其给出的指导意见的质量通常会大打折扣。所以，假设我们使用的数据库为 MySQL，那就可以编写一个 MySQL MCP Server 来给使用大语言模型的 AI 助手提供上下文。这样，拥有了足够上下文的 AI 工具在回答数据库相关的问题时就会更加准确可靠。本文即是针对这个设想的实现：首先会使用 Python 语言编写一个 MySQL MCP Server，然后在 AI 助手 Windsurf 中进行使用。
---

在日常工作中，当我们针对某个业务场景不知 SQL 如何编写时，或在应用程序中找到一些慢 SQL 需要优化而不知所措时，通常会询问 AI 助手。但我们若不提供任何上下文，仅仅是用一句话将业务场景描述给 AI 助手让其实现，或贴一段很长的 SQL 让 AI 助手来优化，其给出的指导意见的质量通常会大打折扣。

所以，要让 AI 助手给出高效的指导意见，需要提供充分的上下文。在数据库场景下，最重要的上下文就是表结构。

而诸如表结构的上下文如何提供给 AI 助手呢？手动把数据库中的表结构抓取出来放到文件里？然后提问时，附上这些文件？这个方法不是不行，但效率实在是太低。

由前文「[MCP 是什么？它是如何工作的？](https://leileiluoluo.github.io/posts/what-is-mcp.html)」可以知道，MCP 是大语言模型连接外部工具或服务的桥梁，MCP Server 就是用来给大语言模型提供上下文的。

所以，假设我们使用的数据库为 MySQL，那就可以编写一个 MySQL MCP Server 来给使用大语言模型的 AI 助手提供上下文。这样，拥有了足够上下文的 AI 工具在回答数据库相关的问题时就会更加准确可靠。

本文即是针对这个设想的实现：首先会使用 Python 语言编写一个 MySQL MCP Server，然后在 AI 助手 Windsurf 中进行使用。

```python
#! /usr/bin/env python3
import os
import traceback
from typing import Any, Dict, List

import pymysql
from fastmcp import FastMCP
from pymysql import Connection

mcp = FastMCP("mysql-mcp-server")


def get_db_config() -> Dict[str, Any]:
    """Read database config from environment variables and return a dictionary."""
    return {
        "host": os.getenv("MYSQL_HOST", "localhost"),
        "port": int(os.getenv("MYSQL_PORT", "3306")),
        "user": os.getenv("MYSQL_USER", "root"),
        "password": os.getenv("MYSQL_PASSWORD", ""),
        "database": os.getenv("MYSQL_DATABASE", ""),
        "cursorclass": pymysql.cursors.DictCursor
    }


def get_connection() -> Connection[Any]:
    """Get a database connection"""
    return pymysql.connect(**get_db_config())


@mcp.tool("list_tables", description="List all the tables in the database")
def list_tables() -> List[str]:
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SHOW TABLES")
            tables = [row[next(iter(row))] for row in cur.fetchall()]
            return tables
    except Exception as e:
        print("Error in list tables:", e)
        traceback.print_exc()
        raise RuntimeError(f"list tables failed: {e}")
    finally:
        conn.close()


@mcp.tool("describe_table", description="Query the table structure for a specified table")
def describe_table(table_name: str) -> List[Dict[str, Any]]:
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(f"DESCRIBE {table_name}")
            columns = cur.fetchall()
            return list(columns) if columns else []
    except Exception as e:
        print("Error in describe table:", e)
        traceback.print_exc()
        raise RuntimeError(f"describe table failed: {e}")
    finally:
        conn.close()


@mcp.tool("explain_sql", description="Explain a SQL query")
def explain_sql(query: str) -> List[Dict[str, Any]]:
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(f"EXPLAIN {query}")
            result = cur.fetchall()
            return result
    except Exception as e:
        print("Error in explain sql:", e)
        traceback.print_exc()
        raise RuntimeError(f"explain sql failed: {e}")
    finally:
        conn.close()


@mcp.tool("run_sql", description="Run SELECT SQL query")
def run_sql(query: str, limit: int = 1000) -> List[Dict[str, Any]]:
    if not query.strip().lower().startswith("select"):
        raise RuntimeError("Only SELECT queries are supported")

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(f"{query} LIMIT {limit}")
            result = cur.fetchall()
            return result
    except Exception as e:
        print("Error in run sql:", e)
        traceback.print_exc()
        raise RuntimeError(f"run sql failed: {e}")
    finally:
        conn.close()


if __name__ == "__main__":
    mcp.run()
    # mcp.run(transport="http", host="0.0.0.0", port=8000)
```

```json
{
  "mcpServers": {
    "mysql-mcp-server": {
      "command": "python3",
      "args": [
        "/Users/larry/python-exercises/mysql-mcp-server-demo/mysql_mcp_server.py"
      ],
      "env": {
        "MYSQL_HOST": "localhost",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "root",
        "MYSQL_PASSWORD": "root",
        "MYSQL_DATABASE": "test"
      }
    }
  }
}
```

```python
if __name__ == "__main__":
    mcp.run(transport="http", host="0.0.0.0", port=8000)
```

```json
{
  "mcpServers": {
    "mysql-mcp-server": {
      "url": "http://localhost:8000/mcp"
    }
  }
}
```

> 参考资料
>
> [1] GitHub: The FastMCP, Pythonic way to build MCP servers and clients - [https://github.com/jlowin/fastmcp](https://github.com/jlowin/fastmcp)
