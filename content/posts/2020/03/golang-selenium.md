---
title: Golang使用Selenium实现自动化测试初探
author: olzhy
type: post
date: 2020-03-14T00:00:16+00:00
url: /posts/golang-selenium.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 工具使用

---
Selenium整合了一揽子工具与依赖库，支持Web浏览器自动化，提供一组扩展来模拟人与浏览器交互。我们基于其满足W3C标准的WebDriver来编写的自动化代码可在各种主流浏览器复用。

所以这里关键的一个组件即是WebDriver，其负责与浏览器厂商提供的API来与浏览器交互。
  
使用其即可做出模拟终端用户的操作，如：文本框输入，下拉框选择，链接点击等。此外还提供鼠标移动，JavaScript脚本执行等能力。

**1 环境准备**
  
Selenium提供多种执行方式：如在本机安装WebDriver二进制可执行文件，或安装单独的服务，或使用远程WebDriver服务，甚至支持多种浏览器多种版本的Grid集群方式。

下面我们使用docker方式启动一个拥有Chrome环境的单独服务。

```shell
docker run -d -p 4444:4444 -v /dev/shm:/dev/shm selenium/standalone-chrome:3.141.59-zirconium
```

查看页面`http://localhost:4444/`发现已启动成功。

下面我们用Golang写个测试用例试试吧。

**2 Golang Selenium 测试代码**
  
测试场景就选我的博客吧：打开博客搜索页，搜索框输入`istio`，应有一条博文，此外将搜索结果截图保存。

本文选择Golang的selenium包`github.com/tebeka/selenium`。
  
如下为代码说明：
  
* setup函数初始化driver对象； 
* TestSearch即为测试搜索功能的函数：打开搜索页，输入关键字，点击搜索按钮，验证搜索结果，保存结果截图； 
* teardown函数负责driver对象的资源释放。

代码已托管至GitHub：[https://github.com/olzhy/go-excercises](https://github.com/olzhy/go-excercises/tree/master/selenium/1.0)

```Golang
package blog_test

import (
	"flag"
	"io/ioutil"
	"log"
	"testing"

	"github.com/tebeka/selenium"
)

var (
	browserName = flag.String("browser", "chrome", "browser name")
	gridUrl     = flag.String("grid", "http://localhost:4444/wd/hub", "grid url")
)

var driver selenium.WebDriver

func setup() func() {
	// new remote driver
	caps := selenium.Capabilities{"browserName": *browserName}
	webDriver, err := selenium.NewRemote(caps, *gridUrl)
	if nil != err {
		panic(err)
	}
	driver = webDriver

	// teardown
	return func() {
		driver.Quit()
	}
}

func screenshot(filename string) {
	bytes, err := driver.Screenshot()
	if nil != err {
		log.Printf("take screenshot error, err: %s", err)
		return
	}

	err = ioutil.WriteFile(filename, bytes, 0666)
	if nil != err {
		log.Printf("save screenshot error, err: %s", err)
	}
}

func TestSearch(t *testing.T) {
	// open search page
	err := driver.Get("https://leileiluoluo.com/")
	if nil != err {
		t.Errorf("search page open error, err: %s", err)
	}

	// type keyword
	elem, err := driver.FindElement(selenium.ByID, "s")
	if nil != err {
		t.Errorf("find element error, err: %s", err)
	}
	err = elem.SendKeys("istio")
	if nil != err {
		t.Errorf("send keys error, err: %s", err)
	}

	// click search
	elem, err = driver.FindElement(selenium.ByID, "searchsubmit")
	if nil != err {
		t.Errorf("find element error, err: %s", err)
	}
	elem.Click()

	// assert
	elems, err := driver.FindElements(selenium.ByCSSSelector, "h3>a")
	if nil != err || len(elems) &lt; 1 {
		t.Errorf("no search result, err: %s", err)
	}

	// save screenshot
	screenshot("search.png")
}

func TestMain(m *testing.M) {
	// parse flags
	flag.Parse()

	// setup / teardown
	teardown := setup()
	defer teardown()

	// run tests
	m.Run()
}
```

执行测试：
```shell
$ go test -v
```

测试结果：
```
=== RUN   TestSearch
--- PASS: TestSearch (46.40s)
PASS
ok  	github.com/olzhy/test	91.427s
```

至此，我们已可以使用Selenium进行自动化测试了。
  
分析如上代码，代码编排的有一点粗陋，面对实际Web应用的复杂性，测试代码如何落地呢？有一点即是测试代码的编排。

**3 如何编排测试代码**
  
如上测试代码的组织方式在测试逻辑复杂的情况下可能会变得庞杂又混乱。面对一个交互场景稍微复杂些的Web应用的时候，我们如何编排测试代码的包结构，或者进而设计一个通用的测试框架呢？

Selenium给出一个指导原则——[页面对象模型](https://www.selenium.dev/documentation/en/guidelines_and_recommendations/page_object_models/)，简单点说即是摒弃直接从测试者的角度想问题，而应从终端用户的视角出发，一个测试场景应是一组动作结合页面上下文的组合。

所以编写测试用例时重要的是：不要一开始就设想点哪个按钮，选哪个字段，提交哪个表单这么细粒度的问题，而是过一遍真实用户体验。
  
所以，写测试用例即如编写业务代码一样，需要考虑重用，封装，单一职责，面向对象，设计模式等知识。

基于此，自动化测试领域的编码规范或设计模式即页面对象模型应用而生。其采用面向对象原则，将各个页面的选择器标记及行为封装在各自的页面，通过方法提供该页面的服务，且页面模型内不应有断言。

下面就基于该规范将上边的代码试着改进一下吧。

blog\_test.go为总测试入口，pages包下为各页面功能，所以搜索页面的定位标记及功能均封装在search.go，这样，我们在blog\_test.go写测试函数调用pages下的页面的方法即可进行断言。

改进后的代码已托管至GitHub：[https://github.com/olzhy/go-excercises](https://github.com/olzhy/go-excercises/tree/master/selenium/2.0)
  
* 代码结构(github.com/olzhy/test)
```shell
$ tree
.
├─ blog_test.go
├─ pages
│   ├─ ...
│   └─ search.go
├─ go.mod
└─ go.sum
```

* blog_test.go
```Golang
package blog_test

import (
	"flag"
	"testing"

	"github.com/olzhy/test/pages"
	"github.com/tebeka/selenium"
)

var (
	browserName = flag.String("browser", "chrome", "browser name")
	gridUrl     = flag.String("grid", "http://localhost:4444/wd/hub", "grid url")
)

var driver selenium.WebDriver

func setup() func() {
	// new remote driver
	caps := selenium.Capabilities{"browserName": *browserName}
	webDriver, err := selenium.NewRemote(caps, *gridUrl)
	if nil != err {
		panic(err)
	}
	driver = webDriver

	// teardown
	return func() {
		driver.Quit()
	}
}

func TestSearch(t *testing.T) {
	sp := pages.NewSearchPage(driver)
	count, err := sp.Search("istio")
	if nil != err || count &lt; 1 {
		t.Errorf("search error, count: %d, err: %s", count, err)
	}
}

func TestMain(m *testing.M) {
	// parse flags
	flag.Parse()

	// setup / teardown
	teardown := setup()
	defer teardown()

	// run tests
	m.Run()
}
```

* pages/search.go
```Golang
package pages

import (
	"errors"
	"fmt"

	"github.com/tebeka/selenium"
)

const (
	typeBy   = "#s"
	clickBy  = "#searchsubmit"
	resultBy = "h3>a"

	searchPage = "https://leileiluoluo.com/"
)

var drv selenium.WebDriver

type SearchPage struct {
}

// initializer
func NewSearchPage(driver selenium.WebDriver) *SearchPage {
	drv = driver
	return &SearchPage{}
}

// open search page
func (sp *SearchPage) openSearchPage() error {
	err := drv.Get(searchPage)
	if nil != err {
		return errors.New(fmt.Sprintf("search page open error, err: %s", err))
	}
	return nil
}

// type keyword
func (sp *SearchPage) typeKeyword(keyword string) error {
	elem, err := drv.FindElement(selenium.ByCSSSelector, typeBy)
	if nil != err {
		return errors.New(fmt.Sprintf("find element error, err: %s", err))
	}

	err = elem.SendKeys(keyword)
	if nil != err {
		return errors.New(fmt.Sprintf("send keys error, err: %s", err))
	}
	return nil
}

// click search
func (sp *SearchPage) clickSearch() error {
	elem, err := drv.FindElement(selenium.ByCSSSelector, clickBy)
	if nil != err {
		return errors.New(fmt.Sprintf("find element error, err: %s", err))
	}
	elem.Click()
	return nil
}

// Search by keyword
// return count of search result
func (sp *SearchPage) Search(keyword string) (int, error) {
	// open search page
	err := sp.openSearchPage()
	if nil != err {
		return 0, err
	}

	// type keyword
	err = sp.typeKeyword(keyword)
	if nil != err {
		return 0, err
	}

	// click search
	err = sp.clickSearch()
	if nil != err {
		return 0, err
	}

	// search result
	elems, err := drv.FindElements(selenium.ByCSSSelector, resultBy)
	if nil != err {
		return 0, errors.New(fmt.Sprintf("find element error, err: %s", err))
	}
	return len(elems), nil
}
```

> 参考资料
>
> [1]&nbsp;<a href="https://www.selenium.dev/" target="blank">https://www.selenium.dev/</a>
>
> [2]&nbsp;<a href="https://github.com/tebeka/selenium" target="blank">https://github.com/tebeka/selenium</a>
>
> [3]&nbsp;<a href="https://github.com/SeleniumHQ/docker-selenium" target="blank">https://github.com/SeleniumHQ/docker-selenium</a>
