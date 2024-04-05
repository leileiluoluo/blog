---
title: WordPress站点Ansible Playbook自动化部署脚本
author: leileiluoluo
type: post
date: 2018-02-01T14:59:28+00:00
url: /posts/wordpress-ansible-playbook-script.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Ansible
---

今日新购了服务器，为方便博客搬家，特编写了 ansible playbook 部署脚本。

本站采用 Nginx+PHP+Maridb+Wordpress 搭建。需要备份的数据有 nginx 配置文件（nginx.conf），nginx html（html.zip），数据库脚本（wordpress.sql）。部署的目标机操作系统为 CentOS7.2。

**1）该 playbook 目录结构**

```
playbook
|--- playbook.yml
|--- templates
|    \--- nginx.conf
|--- files
|    |--- html.zip
|    \--- wordpress.sql
\--- HOSTS
```

**2）tasks 细分**

```
playbook
|--- pre_tasks
|    |--- 1) make temp dir
|    |--- 2) install nginx mariadb php-fpm
|    \--- 3) install ansible mysql_user module dependencies
|--- tasks
|    |--- 1) unarchive nginx html
|    |--- 2) import data
|    \--- 3) restart nginx php-fpm mariadb
\--- post_tasks
     |--- 1) remove old filewall
     |--- 2) install iptables and config access port
     \--- 3) clean temp dir
```

**3）playbook.yml 脚本**

```
---
- hosts: wordpress
  remote_user: x
  vars:
    mysql_root_passwd: x
    mysql_wordpress_passwd: x

  pre_tasks:
    # 1) make temp dir
    - name: make temp workspace
      file: path=/tmp/wordpress state=directory

    # 2) install nginx mariadb php-fpm
    - name: install nginx
      yum: name=nginx state=latest
    - name: install mariadb
      yum: name={{item}} state=latest
      with_items:
      - mariadb
      - mariadb-server
    - name: install php-fpm
      yum: name={{item}} state=latest
      with_items:
      - php
      - php-fpm
      - php-mysql
      - php-gd
      - libjpeg*
      - php-imap
      - php-ldap
      - php-pear
      - php-xml
      - php-xmlrpc
      - php-mbstring
      - php-mcrypt
      - php-bcmath
      - php-mhash
      - libmcrypt
      - libmcrypt-devel
      - php-pdo

    # 3) install ansible mysql_user module dependencies
    - name: get pip
      get_url: url=https://bootstrap.pypa.io/get-pip.py dest=/tmp/wordpress
    - name: install pip
      shell: chdir=/tmp/wordpress python get-pip.py
    - name: install dependencies
      yum: name={{item}} state=latest
      with_items:
      - gcc
      - mysql-devel
      - python-devel
    - name: pip install MySQL-python
      shell: pip install MySQL-python

  tasks:
    # 1) unarchive nginx html
    - name: cp html.zip
      copy: src=html.zip dest=/tmp/wordpress
    - name: remove old nginx html
      file: path=/usr/share/nginx/html state=absent
    - name: unarchive html.zip
      unarchive: src=/tmp/wordpress/html.zip dest=/usr/share/nginx remote_src=yes
    - name: chown html
      file: path=/usr/share/nginx/html mode=0755 owner=nginx group=nginx recurse=yes
    - name: cp nginx.conf
      template: src=nginx.conf dest=/etc/nginx/nginx.conf
    - name: nginx restart
      service: name=nginx state=restarted

    # 2) import data
    - name: mariadb start
      service: name=mariadb state=started
    - name: cp wordpress.sql
      copy: src=wordpress.sql dest=/tmp/wordpress
    - name: create db wordpress
      mysql_db: name=wordpress state=present encoding=utf8 collation=utf8_general_ci
    - name: modify root password
      mysql_user: name=root password={{mysql_root_passwd}} check_implicit_admin=yes state=present
    - name: add mysql user wordpress
      mysql_user: name=wordpress password={{mysql_wordpress_passwd}} host=localhost priv='wordpress.*:ALL' login_user=root login_password={{mysql_root_passwd}} state=present
    - name: import data
      mysql_db: name=wordpress state=import login_user=root login_password={{mysql_root_passwd}} target=/tmp/wordpress/wordpress.sql

    # 3) restart nginx php-fpm mariadb
    - name: restart mariadb php-fpm nginx
      service: name={{item}} state=restarted
      with_items:
      - mariadb
      - php-fpm
      - nginx

  post_tasks:
    # 1) remove old filewall
    - name: remove old filewall
      shell: systemctl stop firewalld && systemctl mask firewalld

    # 2) install iptables and config access port
    - name: install iptables
      yum: name={{item}} state=latest
      with_items:
      - iptables-services
      - iptables-devel
    - name: systemctl enable
      shell: systemctl enable {{item}}
      with_items:
      - nginx
      - mariadb
      - php-fpm
      - iptables
    - name: config iptables
      shell: iptables -A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT && iptables -A INPUT -p tcp -m state --state NEW -m tcp --dport 443 -j ACCEPT && service iptables save
    - name: restart iptables
      service: name=iptables state=restarted

    # 3) clean temp dir
    - name: clean temp workspace
      file: path=/tmp/wordpress state=absent
```

**4）执行 playbook**

```
ansible-playbook -i HOSTS playbook.yml
```

> **参考资料**
>
> [1] <a href="https://docs.ansible.com/ansible/latest/copy_module.html" target="_blank">https://docs.ansible.com/ansible/latest/copy_module.html</a>
>
> [2] <a href="https://docs.ansible.com/ansible/latest/file_module.html" target="_blank">https://docs.ansible.com/ansible/latest/file_module.html</a>
>
> [3] <a href="https://docs.ansible.com/ansible/latest/playbooks_intro.html#playbook-language-example" target="_blank">https://docs.ansible.com/ansible/latest/playbooks_intro.html#playbook-language-example</a>
>
> [4] <a href="https://docs.ansible.com/ansible/latest/mysql_db_module.html" target="_blank">https://docs.ansible.com/ansible/latest/mysql_db_module.html</a>
>
> [5] <a href="https://docs.ansible.com/ansible/latest/mysql_user_module.html" target="_blank">https://docs.ansible.com/ansible/latest/mysql_user_module.html</a>
