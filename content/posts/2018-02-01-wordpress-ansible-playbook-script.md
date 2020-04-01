---
title: WordPress站点Ansible Playbook自动化部署脚本
author: olzhy
type: post
date: 2018-02-01T14:59:28+00:00
url: /posts/wordpress-ansible-playbook-script.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - 工具使用

---
今日新购了服务器，为方便博客搬家，特编写了ansible playbook部署脚本。
  
本站采用Nginx+PHP+Maridb+Wordpress搭建。需要备份的数据有nginx配置文件（nginx.conf），nginx html（html.zip），数据库脚本（wordpress.sql）。部署的目标机操作系统为CentOS7.2。

**1）该playbook目录结构**

<div class="dp-highlighter">
  <ol start="1" class="dp-xml">
    <li class="alt">
      <span><span>playbook&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&#8212;&nbsp;playbook.yml&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>|&#8212;&nbsp;templates&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;&nbsp;&nbsp;\&#8212;&nbsp;nginx.conf&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>|&#8212;&nbsp;files&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;&nbsp;&nbsp;|&#8212;&nbsp;html.zip&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;&nbsp;&nbsp;\&#8212;&nbsp;wordpress.sql&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>\&#8212;&nbsp;HOSTS&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

**2）tasks细分**

<div class="dp-highlighter">
  <ol start="1" class="dp-xml">
    <li class="alt">
      <span><span>playbook&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&#8212;&nbsp;pre_tasks&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;&nbsp;&nbsp;|&#8212;&nbsp;1)&nbsp;make&nbsp;temp&nbsp;dir&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;&nbsp;&nbsp;|&#8212;&nbsp;2)&nbsp;install&nbsp;nginx&nbsp;mariadb&nbsp;php-fpm&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;&nbsp;&nbsp;\&#8212;&nbsp;3)&nbsp;install&nbsp;ansible&nbsp;mysql_user&nbsp;module&nbsp;dependencies&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>|&#8212;&nbsp;tasks&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;&nbsp;&nbsp;|&#8212;&nbsp;1)&nbsp;unarchive&nbsp;nginx&nbsp;html&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;&nbsp;&nbsp;|&#8212;&nbsp;2)&nbsp;import&nbsp;data&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;&nbsp;&nbsp;\&#8212;&nbsp;3)&nbsp;restart&nbsp;nginx&nbsp;php-fpm&nbsp;mariadb&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>\&#8212;&nbsp;post_tasks&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&#8212;&nbsp;1)&nbsp;remove&nbsp;old&nbsp;filewall&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&#8212;&nbsp;2)&nbsp;install&nbsp;iptables&nbsp;and&nbsp;config&nbsp;access&nbsp;port&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\&#8212;&nbsp;3)&nbsp;clean&nbsp;temp&nbsp;dir&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

**3）playbook.yml脚本**

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-xml">
    <li class="alt">
      <span><span>&#8212;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&#8211;&nbsp;hosts:&nbsp;wordpress&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;remote_user:&nbsp;x&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;vars:&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;mysql_root_passwd:&nbsp;x&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;mysql_wordpress_passwd:&nbsp;x&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;pre_tasks:&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;1)&nbsp;make&nbsp;temp&nbsp;dir&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;make&nbsp;temp&nbsp;workspace&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;file:&nbsp;<span class="attribute">path</span><span>=/tmp/wordpress&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">directory</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;2)&nbsp;install&nbsp;nginx&nbsp;mariadb&nbsp;php-fpm&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;install&nbsp;nginx&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yum:&nbsp;<span class="attribute">name</span><span>=</span><span class="attribute-value">nginx</span><span>&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">latest</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;install&nbsp;mariadb&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yum:&nbsp;<span class="attribute">name</span><span>={{item}}&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">latest</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;with_items:&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;mariadb&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;mariadb-server&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;install&nbsp;php-fpm&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yum:&nbsp;<span class="attribute">name</span><span>={{item}}&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">latest</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;with_items:&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-fpm&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-mysql&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-gd&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;libjpeg*&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-imap&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-ldap&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-pear&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-xml&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-xmlrpc&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-mbstring&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-mcrypt&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-bcmath&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-mhash&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;libmcrypt&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;libmcrypt-devel&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-pdo&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;3)&nbsp;install&nbsp;ansible&nbsp;mysql_user&nbsp;module&nbsp;dependencies&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;get&nbsp;pip&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;get_url:&nbsp;<span class="attribute">url</span><span>=</span><span class="attribute-value">https</span><span>://bootstrap.pypa.io/get-pip.py&nbsp;</span><span class="attribute">dest</span><span>=/tmp/wordpress&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;install&nbsp;pip&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shell:&nbsp;<span class="attribute">chdir</span><span>=/tmp/wordpress&nbsp;python&nbsp;get-pip.py&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;install&nbsp;dependencies&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yum:&nbsp;<span class="attribute">name</span><span>={{item}}&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">latest</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;with_items:&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;gcc&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;mysql-devel&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;python-devel&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;pip&nbsp;install&nbsp;MySQL-python&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shell:&nbsp;pip&nbsp;install&nbsp;MySQL-python&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;tasks:&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;1)&nbsp;unarchive&nbsp;nginx&nbsp;html&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;cp&nbsp;html.zip&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;copy:&nbsp;<span class="attribute">src</span><span>=</span><span class="attribute-value">html</span><span>.zip&nbsp;</span><span class="attribute">dest</span><span>=/tmp/wordpress&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;remove&nbsp;old&nbsp;nginx&nbsp;html&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;file:&nbsp;<span class="attribute">path</span><span>=/usr/share/nginx/html&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">absent</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;unarchive&nbsp;html.zip&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unarchive:&nbsp;<span class="attribute">src</span><span>=/tmp/wordpress/html.zip&nbsp;</span><span class="attribute">dest</span><span>=/usr/share/nginx&nbsp;</span><span class="attribute">remote_src</span><span>=</span><span class="attribute-value">yes</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;chown&nbsp;html&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;file:&nbsp;<span class="attribute">path</span><span>=/usr/share/nginx/html&nbsp;</span><span class="attribute">mode</span><span>=</span><span class="attribute-value">0755</span><span>&nbsp;</span><span class="attribute">owner</span><span>=</span><span class="attribute-value">nginx</span><span>&nbsp;</span><span class="attribute">group</span><span>=</span><span class="attribute-value">nginx</span><span>&nbsp;</span><span class="attribute">recurse</span><span>=</span><span class="attribute-value">yes</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;cp&nbsp;nginx.conf&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;template:&nbsp;<span class="attribute">src</span><span>=</span><span class="attribute-value">nginx</span><span>.conf&nbsp;</span><span class="attribute">dest</span><span>=/etc/nginx/nginx.conf&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;nginx&nbsp;restart&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;service:&nbsp;<span class="attribute">name</span><span>=</span><span class="attribute-value">nginx</span><span>&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">restarted</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;2)&nbsp;import&nbsp;data&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;mariadb&nbsp;start&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;service:&nbsp;<span class="attribute">name</span><span>=</span><span class="attribute-value">mariadb</span><span>&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">started</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;cp&nbsp;wordpress.sql&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;copy:&nbsp;<span class="attribute">src</span><span>=</span><span class="attribute-value">wordpress</span><span>.sql&nbsp;</span><span class="attribute">dest</span><span>=/tmp/wordpress&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;create&nbsp;db&nbsp;wordpress&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mysql_db:&nbsp;<span class="attribute">name</span><span>=</span><span class="attribute-value">wordpress</span><span>&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">present</span><span>&nbsp;</span><span class="attribute">encoding</span><span>=</span><span class="attribute-value">utf8</span><span>&nbsp;</span><span class="attribute">collation</span><span>=</span><span class="attribute-value">utf8_general_ci</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;modify&nbsp;root&nbsp;password&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mysql_user:&nbsp;<span class="attribute">name</span><span>=</span><span class="attribute-value">root</span><span>&nbsp;</span><span class="attribute">password</span><span>={{mysql_root_passwd}}&nbsp;</span><span class="attribute">check_implicit_admin</span><span>=</span><span class="attribute-value">yes</span><span>&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">present</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;add&nbsp;mysql&nbsp;user&nbsp;wordpress&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mysql_user:&nbsp;<span class="attribute">name</span><span>=</span><span class="attribute-value">wordpress</span><span>&nbsp;</span><span class="attribute">password</span><span>={{mysql_wordpress_passwd}}&nbsp;</span><span class="attribute">host</span><span>=</span><span class="attribute-value">localhost</span><span>&nbsp;</span><span class="attribute">priv</span><span>=</span><span class="attribute-value">&#8216;wordpress.*:ALL&#8217;</span><span>&nbsp;</span><span class="attribute">login_user</span><span>=</span><span class="attribute-value">root</span><span>&nbsp;</span><span class="attribute">login_password</span><span>={{mysql_root_passwd}}&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">present</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;import&nbsp;data&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mysql_db:&nbsp;<span class="attribute">name</span><span>=</span><span class="attribute-value">wordpress</span><span>&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">import</span><span>&nbsp;</span><span class="attribute">login_user</span><span>=</span><span class="attribute-value">root</span><span>&nbsp;</span><span class="attribute">login_password</span><span>={{mysql_root_passwd}}&nbsp;</span><span class="attribute">target</span><span>=/tmp/wordpress/wordpress.sql&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;3)&nbsp;restart&nbsp;nginx&nbsp;php-fpm&nbsp;mariadb&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;restart&nbsp;mariadb&nbsp;php-fpm&nbsp;nginx&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;service:&nbsp;<span class="attribute">name</span><span>={{item}}&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">restarted</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;with_items:&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;mariadb&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-fpm&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;nginx&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;post_tasks:&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;1)&nbsp;remove&nbsp;old&nbsp;filewall&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;remove&nbsp;old&nbsp;filewall&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shell:&nbsp;systemctl&nbsp;stop&nbsp;firewalld&nbsp;&&&nbsp;systemctl&nbsp;mask&nbsp;firewalld&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;2)&nbsp;install&nbsp;iptables&nbsp;and&nbsp;config&nbsp;access&nbsp;port&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;install&nbsp;iptables&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yum:&nbsp;<span class="attribute">name</span><span>={{item}}&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">latest</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;with_items:&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;iptables-services&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;iptables-devel&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;systemctl&nbsp;enable&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shell:&nbsp;systemctl&nbsp;enable&nbsp;{{item}}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;with_items:&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;nginx&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;mariadb&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;php-fpm&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;iptables&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;config&nbsp;iptables&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shell:&nbsp;iptables&nbsp;-A&nbsp;INPUT&nbsp;-p&nbsp;tcp&nbsp;-m&nbsp;state&nbsp;&#8211;state&nbsp;NEW&nbsp;-m&nbsp;tcp&nbsp;&#8211;dport&nbsp;80&nbsp;-j&nbsp;ACCEPT&nbsp;&&&nbsp;iptables&nbsp;-A&nbsp;INPUT&nbsp;-p&nbsp;tcp&nbsp;-m&nbsp;state&nbsp;&#8211;state&nbsp;NEW&nbsp;-m&nbsp;tcp&nbsp;&#8211;dport&nbsp;443&nbsp;-j&nbsp;ACCEPT&nbsp;&&&nbsp;service&nbsp;iptables&nbsp;save&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;restart&nbsp;iptables&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;service:&nbsp;<span class="attribute">name</span><span>=</span><span class="attribute-value">iptables</span><span>&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">restarted</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;#&nbsp;3)&nbsp;clean&nbsp;temp&nbsp;dir&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8211;&nbsp;name:&nbsp;clean&nbsp;temp&nbsp;workspace&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;file:&nbsp;<span class="attribute">path</span><span>=/tmp/wordpress&nbsp;</span><span class="attribute">state</span><span>=</span><span class="attribute-value">absent</span><span>&nbsp;&nbsp;</span></span>
    </li>
  </ol>
</div>

**4）执行playbook**

<div class="dp-highlighter nogutter">
  <ol start="0" class="dp-xml">
    <li class="alt">
      <span><span>ansible-playbook&nbsp;-i&nbsp;HOSTS&nbsp;playbook.yml&nbsp;&nbsp;</span></span>
    </li>
  </ol>
</div>

> **参考资料**
  
> [1] <a href="https://docs.ansible.com/ansible/latest/copy_module.html" target="_blank">https://docs.ansible.com/ansible/latest/copy_module.html</a>
  
> [2] <a href="https://docs.ansible.com/ansible/latest/file_module.html" target="_blank">https://docs.ansible.com/ansible/latest/file_module.html</a>
  
> [3] <a href="https://docs.ansible.com/ansible/latest/playbooks_intro.html#playbook-language-example" target="_blank">https://docs.ansible.com/ansible/latest/playbooks_intro.html#playbook-language-example</a>
  
> [4] <a href="https://docs.ansible.com/ansible/latest/mysql_db_module.html" target="_blank">https://docs.ansible.com/ansible/latest/mysql_db_module.html</a>
  
> [5] <a href="https://docs.ansible.com/ansible/latest/mysql_user_module.html" target="_blank">https://docs.ansible.com/ansible/latest/mysql_user_module.html</a>