---
title: 根据遍历结果反向构建树
author: leileiluoluo
type: post
date: 2017-10-22T13:28:51+00:00
url: /posts/reverse-build-tree.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Ruby
  - 算法

---
业务中也许会遇到反向构建树的情形，如从外部工具获取到依赖关系、行政区划，组织架构等文本数据时，如何去反向构建树。我们以“获取到了树的深度遍历结果，然后将树结构构建出来，最后用JSON格式输出”，来模拟此类树的反向构建过程。本文采用Ruby作为描述语言。

**1） 已获取的树的遍历结果文本**

```
company   
+- org-1   
+- org-2  
|  \- org-2.1   
+- org-3   
+- org-4  
+- org-5  
+- org-6   
+- org-7  
|  +- org-7.1   
|  |  \- org-7.1.1  
|  +- org-7.2  
|  \- org-7.3  
+- org-8  
|  +- org-8.1  
|  \- org-8.2  
+- org-9  
+- org-10  
|  +- org-10.1  
|  \- org-10.2  
+- org-11   
+- org-12  
|  \- org-12.1  
+- org-13   
+- org-14  
|  +- org-14.1   
|  \- org-14.2   
+- org-15   
+- org-16   
|  +- org-16.1  
|  |  +- org-16.1.1  
|  |  |  \- org-16.1.1.1   
|  |  +- org-16.1.2   
|  |  +- org-16.1.3  
|  |  \- org-16.1.4  
|  +- org-16.2  
|  |  \- org-16.2.1  
|  \- org-16.3  
+- org-17  
+- org-18  
|  \- org-18.1  
+- org-19   
+- org-20   
+- org-21   
|  +- org-21.1   
|  \- org-21.2  
+- org-22  
+- org-23  
+- org-24  
|  \- org-24.1  
+- org-25  
+- org-26  
+- org-27  
+- org-28  
|  \- org-28.1  
+- org-29   
|  +- org-29.1   
|  \- org-29.2  
\- org-30
```

**2）Ruby反向构建树代码**

```ruby
#!/usr/bin/ruby    
#-*- coding: UTF-8 -*-    
require 'json'    
  
class Node    
  def initialize(name, parent)    
    @name = name    
    @parent = parent    
    @children = []    
  end    
  def add_child(child)    
    @children.push(child)    
  end    
  def name(name)    
    @name = name    
  end    
  def parent()    
    return @parent    
  end    
  def to_json(*options)    
    if @children.length > 0    
      return {name: @name, children: @children}.to_json(*options)    
    end    
    return {name: @name}.to_json(*options)    
  end    
end    
    
def process(line, last_line)    
  m = $pattern.match(line)    
  if m    
    sign = m[3]    
    depth = m[2].gsub(/\s/, '').length + sign.sub(/[+\\]/, '').length    
    name = m[4].strip    
    if 0 == m[1].length    
      $root.name(name)    
      $depth_last += 1    
    else    
      if depth < $depth_last    
        ($depth_last - depth).times { $parent = $parent.parent(); $depth_last -= 1 }    
      end    
      node = Node.new(name, $parent)    
      $parent.add_child(node)    
      $parent = node    
      $depth_last += 1    
    end    
  end    
end    
  
$root = $parent = Node.new('', nil)    
$pattern = /(([\|\s]*)([+\\]?-?).*?)(\w.*)/    
$depth_last = 0    
    
last_line = ""    
IO.foreach('depart_tree.txt') do |line|    
  process(line, last_line)    
  last_line = line    
end    
puts JSON.pretty_generate($root)
```

**3）构建成功后，树的JSON输出**

```
{  
  "name": "company",  
  "children": [  
    {  
      "name": "org-1"  
    },  
    {  
      "name": "org-2",  
      "children": [  
        {  
          "name": "org-2.1"  
        }  
      ]  
    },  
    {  
      "name": "org-3"  
    },  
    {  
      "name": "org-4"  
    },  
    {  
      "name": "org-5"  
    },  
    {  
      "name": "org-6"  
    },  
    {  
      "name": "org-7",  
      "children": [  
        {  
          "name": "org-7.1",  
          "children": [  
            {  
              "name": "org-7.1.1"  
            }  
          ]  
        },  
        {  
          "name": "org-7.2"  
        },  
        {  
          "name": "org-7.3"  
        }  
      ]  
    },  
    {  
      "name": "org-8",  
      "children": [  
        {  
          "name": "org-8.1"  
        },  
        {  
          "name": "org-8.2"  
        }  
      ]  
    },  
    {  
      "name": "org-9"  
    },  
    {  
      "name": "org-10",  
      "children": [  
        {  
          "name": "org-10.1"  
        },  
        {  
          "name": "org-10.2"  
        }  
      ]  
    },  
    {  
      "name": "org-11"  
    },  
    {  
      "name": "org-12",  
      "children": [  
        {  
          "name": "org-12.1"  
        }  
      ]  
    },  
    {  
      "name": "org-13"  
    },  
    {  
      "name": "org-14",  
      "children": [  
        {  
          "name": "org-14.1"  
        },  
        {  
          "name": "org-14.2"  
        }  
      ]  
    },  
    {  
      "name": "org-15"  
    },  
    {  
      "name": "org-16",  
      "children": [  
        {  
          "name": "org-16.1",  
          "children": [  
            {  
              "name": "org-16.1.1",  
              "children": [  
                {  
                  "name": "org-16.1.1.1"  
                }  
              ]  
            },  
            {  
              "name": "org-16.1.2"  
            },  
            {  
              "name": "org-16.1.3"  
            },  
            {  
              "name": "org-16.1.4"  
            }  
          ]  
        },  
        {  
          "name": "org-16.2",  
          "children": [  
            {  
              "name": "org-16.2.1"  
            }  
          ]  
        },  
        {  
          "name": "org-16.3"  
        }  
      ]  
    },  
    {  
      "name": "org-17"  
    },  
    {  
      "name": "org-18",  
      "children": [  
        {  
          "name": "org-18.1"  
        }  
      ]  
    },  
    {  
      "name": "org-19"  
    },  
    {  
      "name": "org-20"  
    },  
    {  
      "name": "org-21",  
      "children": [  
        {  
          "name": "org-21.1"  
        },  
        {  
          "name": "org-21.2"  
        }  
      ]  
    },  
    {  
      "name": "org-22"  
    },  
    {  
      "name": "org-23"  
    },  
    {  
      "name": "org-24",  
      "children": [  
        {  
          "name": "org-24.1"  
        }  
      ]  
    },  
    {  
      "name": "org-25"  
    },  
    {  
      "name": "org-26"  
    },  
    {  
      "name": "org-27"  
    },  
    {  
      "name": "org-28",  
      "children": [  
        {  
          "name": "org-28.1"  
        }  
      ]  
    },  
    {  
      "name": "org-29",  
      "children": [  
        {  
          "name": "org-29.1"  
        },  
        {  
          "name": "org-29.2"  
        }  
      ]  
    },  
    {  
      "name": "org-30"  
    }  
  ]  
}
```

大连
  
2017.10.22