---
title: Golang 使用 Selenium 实现自动化测试初探
author: leileiluoluo
type: post
date: 2020-03-14T00:00:16+00:00
url: /posts/golang-selenium.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 自动化测试
  - Selenium
---

Selenium 整合了一揽子工具与依赖库，支持 Web 浏览器自动化，提供一组扩展来模拟人与浏览器交互。我们基于其满足 W3C 标准的 WebDriver 来编写的自动化代码可在各种主流浏览器复用。

所以这里关键的一个组件即是 WebDriver，其负责与浏览器厂商提供的 API 来与浏览器交互。

使用其即可做出模拟终端用户的操作，如：文本框输入，下拉框选择，链接点击等。此外还提供鼠标移动，JavaScript 脚本执行等能力。

### 1 环境准备

Selenium 提供多种执行方式：如在本机安装 WebDriver 二进制可执行文件，或安装单独的服务，或使用远程 WebDriver 服务，甚至支持多种浏览器多种版本的 Grid 集群方式。

下面我们使用 docker 方式启动一个拥有 Chrome 环境的单独服务。

```shell
docker run -d -p 4444:4444 -v /dev/shm:/dev/shm selenium/standalone-chrome:3.141.59-zirconium
```

查看页面`http://localhost:4444/`发现已启动成功。

下面我们用 Golang 写个测试用例试试吧。

### 2 Golang Selenium 测试代码

测试场景就选我的博客吧：打开博客首页`leileiluoluo.com`，点击搜索按钮，搜索框输入`istio`关键字后回车，应至少有一条结果，此外将搜索结果截图保存。

本文选择 Golang 的 selenium 包`github.com/tebeka/selenium`。

如下为代码说明：

- setup 函数初始化 driver 对象；
- TestSearch 即为测试搜索功能的函数：打开搜索页，输入关键字，点击搜索按钮，验证搜索结果，保存结果截图；
- teardown 函数负责 driver 对象的资源释放。

代码已托管至 GitHub：[https://github.com/leileiluoluo/go-exercises](https://github.com/leileiluoluo/go-exercises/tree/master/selenium/1.0)

```Golang
package blog_test

import (
	"flag"
	"io/ioutil"
	"log"
	"testing"
	"time"

	"github.com/tebeka/selenium"
)

var (
	browserName                    = flag.String("browser", "chrome", "browser name")
	gridUrl                        = flag.String("grid", "http://localhost:4444/wd/hub", "grid url")
	blogURL                        = "https://leileiluoluo.com/"
	searchButtonIdSelector         = "searchOpen"
	keywordInputIdSelector         = "search-query"
	searchResultLoadingCssSelector = "#search-results #loadingDiv"
	searchResultCssSelector        = "#search-results .border-bottom"

	keyword = "istio"
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
	// open blog
	err := driver.Get(blogURL)
	if nil != err {
		t.Errorf("search page open error, err: %s", err)
	}

	// click search button
	elem, err := driver.FindElement(selenium.ByID, searchButtonIdSelector)
	if nil != err {
		t.Errorf("search button not found, err: %s", err)
	}
	elem.Click()

	// type keyword and enter
	elem, err = driver.FindElement(selenium.ByID, keywordInputIdSelector)
	if nil != err {
		t.Errorf("keyword input element not found, err: %s", err)
	}
	elem.SendKeys(keyword + "\n")

	// wait until search result displayed
	driver.WaitWithTimeout(func(driver selenium.WebDriver) (bool, error) {
		elem, err = driver.FindElement(selenium.ByCSSSelector, searchResultLoadingCssSelector)
		if nil != err {
			return false, nil
		}
		visible, err := elem.IsDisplayed()
		return !visible, err
	}, 30*time.Second)

	// assert
	elems, err := driver.FindElements(selenium.ByCSSSelector, searchResultCssSelector)
	if nil != err || len(elems) < 1 {
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
ok  	github.com/leileiluoluo/test	91.427s
```

至此，我们已可以使用 Selenium 进行自动化测试了。

分析如上代码，代码编排的有一点粗陋，面对实际 Web 应用的复杂性，测试代码如何落地呢？有一点即是测试代码的编排。

### 3 如何编排测试代码

如上测试代码的组织方式在测试逻辑复杂的情况下可能会变得庞杂又混乱。面对一个交互场景稍微复杂些的 Web 应用的时候，我们如何编排测试代码的包结构，或者进而设计一个通用的测试框架呢？

Selenium 给出一个指导原则——[页面对象模型](https://www.selenium.dev/documentation/en/guidelines_and_recommendations/page_object_models/)，简单点说即是摒弃直接从测试者的角度想问题，而应从终端用户的视角出发，一个测试场景应是一组动作结合页面上下文的组合。

所以编写测试用例时重要的是：不要一开始就设想点哪个按钮，选哪个字段，提交哪个表单这么细粒度的问题，而是过一遍真实用户体验。

所以，写测试用例即如编写业务代码一样，需要考虑重用，封装，单一职责，面向对象，设计模式等知识。

基于此，自动化测试领域的编码规范或设计模式即页面对象模型应运而生。其采用面向对象原则，将各个页面的选择器标记及行为封装在各自的页面，通过方法提供该页面的服务，且页面模型内不应有断言。

下面就基于该规范将上边的代码试着改进一下吧。

blog_test.go 为总测试入口，pages 包下为各页面功能，所以搜索页面的定位标记及功能均封装在 search.go，这样，我们在 blog_test.go 写测试函数调用 pages 下的页面的方法即可进行断言。

改进后的代码已托管至 GitHub：[https://github.com/leileiluoluo/go-exercises](https://github.com/leileiluoluo/go-exercises/tree/master/selenium/2.0)

- 代码结构(github.com/leileiluoluo/test)

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

- blog_test.go

```Golang
package blog_test

import (
	"flag"
	"testing"

	"github.com/leileiluoluo/test/pages"
	"github.com/tebeka/selenium"
)

var (
	browserName = flag.String("browser", "chrome", "browser name")
	gridUrl     = flag.String("grid", "http://localhost:4444/wd/hub", "grid url")
	keyword     = "istio"
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
	count, err := sp.Search(keyword)
	if nil != err || count < 1 {
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

- pages/search.go

```Golang
package pages

import (
	"errors"
	"fmt"
	"time"

	"github.com/tebeka/selenium"
)

const (
	blogURL                        = "https://leileiluoluo.com/"
	searchButtonIdSelector         = "searchOpen"
	keywordInputIdSelector         = "search-query"
	searchResultLoadingCssSelector = "#search-results #loadingDiv"
	searchResultCssSelector        = "#search-results .border-bottom"
)

var drv selenium.WebDriver

type SearchPage struct {
}

// initializer
func NewSearchPage(driver selenium.WebDriver) *SearchPage {
	drv = driver
	return &SearchPage{}
}

// open blog and click search button
func (sp *SearchPage) openBlogAndClickSearchButton() error {
	// open blog
	err := drv.Get(blogURL)
	if nil != err {
		return errors.New(fmt.Sprintf("search page open error, err: %s", err))
	}

	// click search button
	elem, err := drv.FindElement(selenium.ByID, searchButtonIdSelector)
	if nil != err {
		return errors.New(fmt.Sprintf("search button not found, err: %s", err))
	}
	return elem.Click()
}

// type keyword and enter
func (sp *SearchPage) typeKeyword(keyword string) error {
	elem, err := drv.FindElement(selenium.ByID, keywordInputIdSelector)
	if nil != err {
		return errors.New(fmt.Sprintf("keyword input element not found, err: %s", err))
	}
	return elem.SendKeys(keyword + "\n")
}

// wait until search result displayed
func (sp *SearchPage) waitUntilResultDisplayed() error {
	return drv.WaitWithTimeout(func(driver selenium.WebDriver) (bool, error) {
		elem, err := driver.FindElement(selenium.ByCSSSelector, searchResultLoadingCssSelector)
		if nil != err {
			return false, nil
		}
		visible, err := elem.IsDisplayed()
		return !visible, err
	}, 30*time.Second)
}

// Search by keyword
// return count of search result
func (sp *SearchPage) Search(keyword string) (int, error) {
	// open blog and click search button
	err := sp.openBlogAndClickSearchButton()
	if nil != err {
		return 0, err
	}

	// type keyword and enter
	err = sp.typeKeyword(keyword)
	if nil != err {
		return 0, err
	}

	// wait until search result displayed
	err = sp.waitUntilResultDisplayed()
	if nil != err {
		return 0, err
	}

	// return
	elems, err := drv.FindElements(selenium.ByCSSSelector, searchResultCssSelector)
	if nil != err {
		return 0, errors.New(fmt.Sprintf("search element error, err: %s", err))
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
