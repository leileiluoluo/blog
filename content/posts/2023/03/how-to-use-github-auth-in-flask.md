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

```shell
python3 -m pip install requirements.txt

export CLIENT_ID=XXX
export CLIENT_SECRET=XXX
python3 app.py
```

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
