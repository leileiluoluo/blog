---
title: Istio证书管理之植入CA证书
author: olzhy
type: post
date: 2021-01-10T18:27:31+08:00
url: /posts/istio-plug-in-ca-certificates.html
categories:
  - 计算机
tags:
  - 工具使用
keywords:
  - 工具使用
  - 服务网格
  - Service Mesh
  - Istio
description: Istio证书管理之植入CA证书 (Plug in CA Certificates of Istio Certificate Management)

---
本文介绍管理员如何使用根证书、签发证书及秘钥为Istio配置CA（证书颁发机构）。Istio CA使用由中间CA签发的私钥及证书，而中间CA由根CA签发。这样，Istio CA即可为工作负载签发根证书及私钥。CA层次结构图如下。

![](https://olzhy.github.io/static/images/uploads/2021/01/ca-hierarchy.svg#center)

         （图片引自[Plug in CA Certificates](https://istio.io/latest/docs/tasks/security/cert-management/plugin-ca-cert/)）

接下来即介绍如何为Istio生成及植入CA。

### 1 为集群植入证书及私钥

首先，进入Istio安装目录`/usr/local/istio-1.8.1`，创建证书目录`certs`后进入该目录。

```shell
$ cd /usr/local/istio-1.8.1
$ mkdir certs
$ cd certs
```

然后，使用如下命令生成根证书及私钥。

```shell
$ make -f ../tools/certs/Makefile.selfsigned.mk root-ca
```

其会生成4个文件。

|  FILE          | DESCRIPTION             |
|  ----          | ----                    |
| root-cert.pem  | 根证书                   |
| root-key.pem   | 根秘钥                   |
| root-ca.conf   | 生成根证书的`openssl`配置  |
| root-cert.csr  | 根证书的`CSR`             |

接下来，使用如下命令生成中间证书及私钥。

```shell
$ make -f ../tools/certs/Makefile.selfsigned.mk cluster1-cacerts
```

其会在`cluster1`文件夹下生成4个文件。

|  FILE          | DESCRIPTION             |
|  ----          | ----                    |
| ca-cert.pem    | 中间证书                  |
| ca-key.pem     | 中间秘钥                  |
| cert-chain.pem | `istiod`所使用的证书链     |
| root-cert.pem  | 根证书                    |

最后，创建namespace `istio-system`，接着基于`cluster1`文件夹下生成的文件创建Secret `cacerts`。

```shell
$ kubectl create ns istio-system
$ kubectl create secret generic cacerts -n istio-system \
      --from-file=cluster1/ca-cert.pem \
      --from-file=cluster1/ca-key.pem \
      --from-file=cluster1/root-cert.pem \
      --from-file=cluster1/cert-chain.pem
```

### 2 部署Istio及样例服务

指定模式为`demo`，安装Istio，Istio CA将从`cacerts`读取证书及私钥。

```shell
$ istioctl install --set profile=demo
```

接着，进入Istio安装根目录，创建namespace `istio-demo`，然后在该namespace下部署样例服务`httpbin`及用于测试的服务`sleep`。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl create ns istio-demo
$ kubectl apply -f <(istioctl kube-inject -f samples/httpbin/httpbin.yaml) -n istio-demo
$ kubectl apply -f <(istioctl kube-inject -f samples/sleep/sleep.yaml) -n istio-demo
```

然后，使用如下命令指定`istio-demo`下的工作负载只接受双向TLS的流量。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
heredoc> apiVersion: "security.istio.io/v1beta1"
kind: "PeerAuthentication"
metadata:
  name: "default"
spec:
  mtls:
    mode: STRICT
heredoc> EOF
```

### 3 校验证书

下面，我们将验证工作负载是否使用了我们所植入的CA所签发的证书。

首先，等待`20s`，让所配置的mTLS规则生效。然后使用如下命令进入`sleep`的`istio-proxy` Sidecar来尝试获取`httpbin`的证书链。

```shell
$ kubectl exec "$(kubectl get pod -l app=sleep -n istio-demo -o jsonpath={.items..metadata.name})" -c istio-proxy -n istio-demo -- openssl s_client -showcerts -connect httpbin.istio-demo:8000 > httpbin-proxy-cert.txt
```

然后，得到错误“`verify error:num=19:self signed certificate in certificate chain`”，符合预期。

查看文件`httpbin-proxy-cert.txt`，发现里边有4套证书，将其拷贝出来，分别以`proxy-cert-i.pem (i=1,2,3,4)`命名。

然后，使用如下命令校验根证书是否与管理员所签发的一致。

```shell
$ openssl x509 -in certs/cluster1/root-cert.pem -text -noout > /tmp/root-cert.crt.txt
$ openssl x509 -in ./proxy-cert-3.pem -text -noout > /tmp/pod-root-cert.crt.txt
$ diff -s /tmp/root-cert.crt.txt /tmp/pod-root-cert.crt.txt
Files /tmp/root-cert.crt.txt and /tmp/pod-root-cert.crt.txt are identical
```

接着，使用如下命令校验CA证书是否与管理员所签发的一致。

```shell
$ openssl x509 -in certs/cluster1/ca-cert.pem -text -noout > /tmp/ca-cert.crt.txt
$ openssl x509 -in ./proxy-cert-2.pem -text -noout > /tmp/pod-cert-chain-ca.crt.txt
$ diff -s /tmp/ca-cert.crt.txt /tmp/pod-cert-chain-ca.crt.txt
Files /tmp/ca-cert.crt.txt and /tmp/pod-cert-chain-ca.crt.txt are identical
```

最后，使用如下命令校验根证书的证书链与工作负载的证书链是否一致。

```shell
$ openssl verify -CAfile <(cat certs/cluster1/ca-cert.pem certs/cluster1/root-cert.pem) ./proxy-cert-1.pem
./proxy-cert-1.pem: OK
```

### 4 环境清理

使用如下命令移除证书。

```shell
$ cd /usr/local/istio-1.8.1
$ rm proxy-cert-*.pem
$ rm httpbin-proxy-cert.txt
$ rm -rf certs
```

使用如下命令移除Secret `cacerts`，删除namespace `istio-demo`，`istio-system`。

```shell
$ kubectl delete secret cacerts -n istio-system
$ kubectl delete ns istio-demo istio-system
```

总结本文，介绍了Istio的CA如何签发，然后使用httpbin样例作了测试。


> 参考资料
>
> [1] [Istio Plug in CA Certificates](https://istio.io/latest/docs/tasks/security/cert-management/plugin-ca-cert/)