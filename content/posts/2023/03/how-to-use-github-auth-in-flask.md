---
title: 如何在 Flask 框架中使用 GitHub Auth 做授权登陆？
author: olzhy
type: post
date: 2023-03-17T08:00:00+08:00
url: /posts/how-to-use-github-auth-in-flask.html
categories:
  - 计算机
tags:
  - Python
keywords:
  - Flask
  - Python
  - GitHub Auth
  - 授权
  - 登陆
description: 如何在 Flask 框架中使用 GitHub Auth 做授权登陆？
---

本文探讨如何在 Python Flask 框架中使用 GitHub Auth 做授权登陆？即一个 Flask 应用，如何集成第三方的 GitHub 账号系统来做登录。

## 1 申请 GitHub Auth 应用

![申请 GitHub Auth 应用](https://olzhy.github.io/static/images/uploads/2023/03/appy-github-auth-app.png#center)

## 2 使用 Authlib 包集成 GitHub Auth

如下 Python Flask 程序有四个页面，分别为：

- 首页（index）

  根据 Session 信息，判断用户是否已登录，若已登录，则显示欢迎信息；未登录，则显示登录链接。

- 登录页面（login）

  跳转至 GitHub 认证页面，并指定接收 Code 的回调地址。

- GitHub 回调页面（callback）

  GitHub 登录并授权后，接收 Code 并获取 Token，然后根据 Token 请求用户信息并写入 Session，最后跳转至首页。

- 登出页面（logout）

  清除 Session 信息。

```python
from flask import Flask, url_for, redirect, session
from authlib.integrations.flask_client import OAuth
import os

app = Flask(__name__)
app.secret_key = '812848ea396c6aa794e6b6c9'

github = OAuth(app).register(
    name='github',
    client_id=os.getenv('CLIENT_ID'),
    client_secret=os.getenv('CLIENT_SECRET'),
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)


@app.route('/')
def index():
    user = session.get('user_email')
    if user is None:
        login_url = url_for('login', _external=True)
        return f'<p><a href="{login_url}">Login</a></p>'
    logout_url = url_for('logout', _external=True)
    return f'<p>Welcome {user}! | <a href="{logout_url}">Logout</a></p>'


@app.route('/login')
def login():
    callback_uri = url_for('callback', _external=True)
    return github.authorize_redirect(callback_uri)


@app.route('/callback')
def callback():
    token = github.authorize_access_token()
    resp = github.get('user', token=token)
    profile = resp.json()
    session['user_email'] = profile['email']
    return redirect('/')


@app.route('/logout')
def logout():
    session.pop('user_email', None)
    return redirect('/')


if '__main__' == __name__:
    app.run(debug=True)
```

## 3 程序运行和验证

```shell
python3 -m pip install requirements.txt

export CLIENT_ID=XXX
export CLIENT_SECRET=XXX
python3 app.py
```

![登录演示](https://olzhy.github.io/static/images/uploads/2023/03/app-login.gif#center)

综上，本文探索了如何在 Python Flask 框架中集成 GitHub Auth 来做登录。示例程序代码已托管至本人 [GitHub](https://github.com/olzhy/python-exercises/tree/main/use-github-auth-in-flask)，欢迎关注和 Fork。

> 参考资料
>
> [1] [Flask Quickstart | Flask - flask.palletsprojects.com](https://flask.palletsprojects.com/en/2.2.x/quickstart/)
>
> [2] [New OAuth Application | GitHub - github.com](https://github.com/settings/applications/new)
>
> [3] [Authenticating to the REST API with an OAuth App | GitHub Docs - docs.github.com](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authenticating-to-the-rest-api-with-an-oauth-app)
>
> [4] [GitHub OAuth 第三方登录示例教程 | 阮一峰的网络日志 - www.ruanyifeng.com](https://www.ruanyifeng.com/blog/2019/04/github-oauth.html)
>
> [5] [Authentication with Flask and GitHub | Dev Community - dev.to](https://dev.to/nelsoncode/authentication-with-flask-and-github-authlib-19ej)
>
> [6] [Authentication with Cookies and Sessions in Flask | Rithm School - www.rithmschool.com](https://www.rithmschool.com/courses/intermediate-flask/cookies-sessions-flask)
