---
title: OpenID Connect 1.0 协议要点梳理
author: leileiluoluo
type: post
date: 2020-02-26T01:29:09+00:00
url: /posts/openid-connect-core-1-0.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - 架构设计

---
OpenID Connect 1.0协议是基于OAuth 2.0授权框架之上的一个身份鉴别层。其使得客户端可以基于授权服务的鉴权能力来验证及识别终端用户的身份。此外，还可以一种类REST的方式来获取终端用户的基本画像信息。

OpenID Connect 1.0使用`Claims`来获取终端用户信息，其还描述了一些安全及隐私方面的考量。

我们知道，OAuth 2.0授权框架为三方应用获得对受保护资源的访问提供了通用标准。其定义了以访问令牌获取受保护资源的机制，但未定义身份鉴别方面的标准。

OpenID Connect 1.0协议即是为此而生，即其为OAuth 2.0授权框架扩展了鉴权能力。使用起来也很简单，客户端只需在发起授权请求时将scope值设为`openid`即可。其返回一个`JWT`格式的身份令牌（ID Token）即具有鉴权能力。

OAuth 2.0中，实现了OpenID Connect的`授权服务（Authentication Server）`被叫作`开放身份认证提供商（OpenID Providers）`，使用了OpenID Connect的`客户端（Client）`被叫作`依赖方（Relying Parties）`。

**1 概览**
  
OpenID Connect协议的概览图如下。
  
![](https://leileiluoluo.github.io/static/images/uploads/2020/02/oidc-1.0-overview.png)
  
(1) 客户端向授权服务发送授权请求。
  
(2) 授权服务对终端用户进行鉴权并获得其授权。
  
(3) 授权服务对客户端响应以身份令牌及访问令牌。
  
(4) 客户端对身份令牌进行校验，并携带访问令牌向授权服务的用户信息端点请求用户信息。
  
(5) 授权服务用户信息端点返回终端用户的`Claims`。

OpenID Connect对OAuth 2.0作的主要扩展即是引入以`JWT`格式表示的身份令牌，使用其即可对终端用户作鉴权。下面列出一个身份令牌（ID Token）的样例。

```
{
   "iss": "https://server.example.com",
   "sub": "mail@leileiluoluo.com",
   "aud": "s6BhdRkqt3",
   "nonce": "n-0S6_WzA2Mj",
   "exp": 1311281970,
   "iat": 1311280970,
   "auth_time": 1311280969,
   "acr": "urn:mace:incommon:iap:silver"
}
```

如下是身份令牌的必须字段：
  
* iss 令牌签发者，以https打头的一串URL。
  
* sub 终端用户唯一标识。
  
* aud 身份另牌的使用对象，其必包含客户端ID（Client ID）。
  
* exp 身份令牌失效截止时间，表示为自`1970-01-01 00:00:00`的秒数。
  
* iat 签发时间，单位同样为秒。

如下是一个非常重要的可选字段：
  
* nonce 联系客户端及身份令牌会话的一个字符串。客户端若收到该字段，须校验是否为其请求授权时所携带。

**2 鉴权**
  
**2.1 使用授权码模式进行鉴权**
  
我们知道，在OAuth 2.0中，授权码模式的一大优点是令牌的签发由授权服务直接给到客户端，未暴露给用户代理。且在客户端携带授权码请求访问令牌前，授权服务还可对其进行鉴权。授权码模式使得客户端可与授权服务间维护一个客户端密钥（Client Secret）。

下图为OAuth 2.0授权码模式流程图。
  
![](https://leileiluoluo.github.io/static/images/uploads/2020/02/oauth2-authorization-code-flow.png)

下面结合该图的每一步，阐释OpenID Connect授权码模式的鉴权流程。
  
(1) 初始由客户端发起，将资源所有者的用户代理导向授权服务的授权端点。
  
授权服务会对客户端信息进行校验，若校验通过，会对终端用户进行鉴权。鉴权方法有用户名密码，sesson cookie等。
  
样例请求如下：

```
HTTP/1.1 302 Found
  Location: https://server.example.com/authorize?
    response_type=code
    &scope=openid%20profile%20email
    &client_id=s6BhdRkqt3
    &state=af0ifjsldkj
    &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
```

必须字段有：
  
* scope 要支持OpenID Connect，该字段必须包含openid。
  
* response_type 授权码模式，值为code。
  
* client_id 客户端ID
  
* redirect_uri 在OpenID Provider注册客户端时所填。
  
推荐字段有：
  
* state 维护请求及回调状态，一般为与浏览器cookie绑定后的加密字段。
  
可选字段有：
  
* prompt 若为login，请求授权服务对终端用户重新鉴权。若为consent，请求授权服务获取终端用户许可。


(2) 授权服务对终端用户鉴权通过后，须在返回信息给客户端前获取资源所有者的授权结果。可能会建立一个交互式窗口让终端用户决定授权哪些权限。

(3) 授权服务对客户端及资源所有者鉴权完成后，会携带结果将请求重定向至客户端所指定的回调URI。
  
若鉴权成功，会生成一个一次性授权码，同时将客户端请求时携带的state参数一并通过用户代理返回到客户端。
  
鉴权成功的响应样例如下：

```
HTTP/1.1 302 Found
  Location: https://client.example.org/cb?
    code=SplxlOBeZQQYbYS6WxSbIA
    &state=af0ifjsldkj
```

若终端用户拒绝授权或者授权服务对终端用户验证失败，在客户端回调地址正确的情况下，授权服务会将错误信息返回。
  
鉴权失败的响应样例如下：

```
HTTP/1.1 302 Found
  Location: https://client.example.org/cb?
    error=invalid_request
    &error_description=
      Unsupported%20response_type%20value
    &state=af0ifjsldkj
```

错误码有：
  
* interaction_required
  
* login_required
  
* consent_required
  
...

(4) 客户端携带授权码及回调地址向授权服务令牌端点请求令牌。
  
客户端对授权服务返回的授权码等信息进行校验，同时验证state参数是否与自己发请求时携带的一致等。若验证通过，会携带授权码及回调地址向授权服务请求访问令牌。
  
这次携带的回调地址只是用于授权服务端的验证。
  
客户端获取令牌的样例请求如下：

```
POST /token HTTP/1.1
  Host: server.example.com
  Content-Type: application/x-www-form-urlencoded
  Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW

  grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
    &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
```

注意客户端密钥信息通过`Authorization: Basic ...`的方式进行传递。授权码模式的grant_type字段值须设为authorization_code。

(5) 授权服务为客户端签发令牌
  
签发令牌前，授权服务需要校验客户端密钥信息，校验授权码是否有效且是否已使用，校验回调地址是否与初始请求授权码时一致等。
  
验证通过，则签发身份令牌及访问令牌。
  
授权服务成功签发令牌的样例响应如下。

```
HTTP/1.1 200 OK
  Content-Type: application/json
  Cache-Control: no-store
  Pragma: no-cache

  {
   "access_token": "SlAV32hkKG",
   "token_type": "Bearer",
   "refresh_token": "8xLOxBtZp8",
   "expires_in": 3600,
   "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOWdkazcifQ.ewogImlzc
     yI6ICJodHRwOi8vc2VydmVyLmV4YW1wbGUuY29tIiwKICJzdWIiOiAiMjQ4Mjg5
     NzYxMDAxIiwKICJhdWQiOiAiczZCaGRSa3F0MyIsCiAibm9uY2UiOiAibi0wUzZ
     fV3pBMk1qIiwKICJleHAiOiAxMzExMjgxOTcwLAogImlhdCI6IDEzMTEyODA5Nz
     AKfQ.ggW8hZ1EuVLuxNuuIJKX_V8a_OMXzR0EHR9R6jgdqrOOF4daGU96Sr_P6q
     Jp6IcmD3HP99Obi1PRs-cwh3LO-p146waJ8IhehcwL7F09JdijmBqkvPeB2T9CJ
     NqeGpe-gccMg4vfKjkM8FcGvnzZUN4_KSP0aAp1tOJ1zZwgjxqGByKHiOtX7Tpd
     QyHE5lcMiKPXfEIQILVq0pc_E2DzL7emopWoaoZTF_m0_N0YzFC6g6EJbOEoRoS
     K5hoDalrcvRYLSrQAZZKflyuVCyixEoV9GfNQC3_osjzw2PAithfubEEBLuVVk4
     XUVrWOLrLl0nx7RkKU8NXNHq-rvKMzqg"
  }
```

可以看到，响应体为json格式。令牌类型为`Bearer`，身份令牌为`JWT`格式。且特别注意响应头`Cache-Control`及`Pragma`，说明了签发的令牌为敏感信息。
  
若鉴权失败，授权服务令牌签发失败的样例响应如下：

```
HTTP/1.1 400 Bad Request
  Content-Type: application/json
  Cache-Control: no-store
  Pragma: no-cache

  {
   "error": "invalid_request"
  }
```

客户端接收到响应后，须按如下步骤校验身份令牌：
  
* 使用公钥（注册OpenID Connect Provider时所生成）及约定算法解码身份令牌。
  
* 校验身份令牌`iss`字段，查看签发者是否有效。
  
* 校验`aud`字段是否包含自身客户端ID。
  
...
  
按如下步骤校验访问令牌：
  
* 若身份令牌包含`at_hash`字段，须按如下步骤校验其是否合法。
  
取身份令牌头字段`alg`所指定哈希算法，计算访问令牌的八进制哈希值；将哈希值左半部分使用base64url加密；其应与at_hash字段值相等。

**2.2 使用隐式授权模式进行鉴权**
  
我们知道OAuth 2.0中，隐式授权主要针对在浏览器脚本语言实现的客户端，会暴露给用户代理，具有一定安全风险。使用隐式授权，令牌直接从授权端点返回，并未用到令牌端点。隐式授权的鉴权部分大部分与授权码模式一致，仅对nonce字段的校验是必须的。

下图为OAuth 2.0隐式授权模式流程图。
  
![](https://leileiluoluo.github.io/static/images/uploads/2020/02/oauth2-implicit-flow.png)

下面对图中每一步作解释。
  
(1) 初始，客户端将资源所有者的用户代理导向授权端点。
  
指定client_id，scope，state参数，同时指定回调地址以便授权服务将用户代理重定向回来。
  
鉴权方式与采用授权码模式一致。
  
样例请求如下：

```
GET /authorize?
    response_type=id_token%20token
    &client_id=s6BhdRkqt3
    &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
    &scope=openid%20profile
    &state=af0ifjsldkj
    &nonce=n-0S6_WzA2Mj HTTP/1.1
  Host: server.example.com
```

必须字段：
  
* response_type 可传`id_token`或`id_token token`。
  
* redirect_uri 客户端回调地址，须与注册时一致。
  
* nonce 用于建立客户端会话与令牌的对应关系，将被授权服务原封不动传回。

(2) 取得资源所有者授权。
  
授权服务对资源所有者鉴权（通过用户代理），获取是否准许授权的结果。
  
鉴权方式与采用授权码模式一致。

(3) 若准许授权，授权服务将访问令牌拼在URL上，然后将用户代理重定向至客户端回调地址。
  
鉴权方式与采用授权码模式一致。
  
成功响应样例如下：

```
HTTP/1.1 302 Found
  Location: https://client.example.org/cb#
    access_token=SlAV32hkKG
    &token_type=bearer
    &id_token=eyJ0 ... NiJ9.eyJ1c ... I6IjIifX0.DeWt4Qu ... ZXso
    &expires_in=3600
    &state=af0ifjsldkj
```

错误响应样例与采用授权码模式类似。

(4) 用户代理接到重定向指令，并请求服务端静态资源（用于解码令牌）。

(5) 客户端服务器部分返回内置脚本的资源，可以用来将URI中的令牌取出。

(6) 用户代理使用上述脚本将令牌取出，并给到客户端。
  
使用隐式授权获得的身份令牌须包含如下字段：
  
* nonce 用于客户端验证响应合法性。
  
可能包含如下字段：
  
* at_hash 用于验证访问令牌

**2.3 使用混合模式进行鉴权**
  
OpenID Connect混合模式的response_type的组合方式有如下几种，`code id_token`，`code token`，`code id_token token`。
  
所以混合模式的授权与鉴权流程大致与授权码模式一致。只是在获取授权码的时候可以顺带获取令牌，也多了一些校验。
  
样例请求及响应：

```
GET /authorize?
    response_type=code%20token
    &client_id=s6BhdRkqt3
    &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
    &state=af0ifjsldkj HTTP/1.1
  Host: server.example.com

  HTTP/1.1 302 Found
  Location: https://client.example.org/cb#
    access_token=2YotnFZFEjr1zCsicMWpAA
    &token_type=Bearer
    &code=SplxlOBeZQQYbYS6WxSbIA
    &state=af0ifjsldkj
    &expires_in=3600
```

详细流程不再赘述。

> 参考资料
>
> [1]&nbsp;<a href="https://openid.net/specs/openid-connect-core-1_0.html" target="blank">https://openid.net/specs/openid-connect-core-1_0.html</a>