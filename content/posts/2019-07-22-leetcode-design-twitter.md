---
title: LeetCode 355 设计推特
author: olzhy
type: post
date: 2019-07-22T13:42:26+00:00
url: /posts/leetcode-design-twitter.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
设计一个简单的推特版本。支持用户发推，支持用户关注或取消关注其他用户，且用户可以在动态里看到最近的10条推文。
  
您的设计应支持如下几个方法：
  
a）postTweet(userId, tweetId)：发表新推文；
  
b）getNewsFeed(userId)：在用户动态里展示最近的10条推文id，动态里的每条推文须是用户自己发的或是其关注者发的，推文须按时间由近及远排序；
  
c）follow(followerId, followeeId)：关注；
  
d）unfollow(followerId, followeeId)：取消关注。

例子：

<pre>Twitter twitter = new Twitter();

// User 1 posts a new tweet (id = 5).
twitter.postTweet(1, 5);

// User 1's news feed should return a list with 1 tweet id -> [5].
twitter.getNewsFeed(1);

// User 1 follows user 2.
twitter.follow(1, 2);

// User 2 posts a new tweet (id = 6).
twitter.postTweet(2, 6);

// User 1's news feed should return a list with 2 tweet ids -> [6, 5].
// Tweet id 6 should precede tweet id 5 because it is posted after tweet id 5.
twitter.getNewsFeed(1);

// User 1 unfollows user 2.
twitter.unfollow(1, 2);

// User 1's news feed should return a list with 1 tweet id -> [5],
// since user 1 is no longer following user 2.
twitter.getNewsFeed(1);
</pre>

题目出处：
  
<a href="https://leetcode.com/problems/design-twitter/" target="_blank" rel="noopener">https://leetcode.com/problems/design-twitter/</a>

**2 解决思路**
  
动态的实现一般使用“拉模式”或者“推模式”，即用户可以看到的动态可以采用查询的时候直接计算（拉）也可以在用户的关注者发推的时候直接“推”到用户的动态列表。
  
本文使用“推模式”实现，如下是用到的几个数据结构：
  
a）tweets用来存放用户发表的推文；
  
b）feeds用来存放每个用户可以看到的动态；
  
c）fans用来存放用户的粉丝（关注者）列表。
  
接下来看一下几个方法的实现逻辑：
  
PostTweet：当用户发送一条推文时，tweets存一下该推文的id与时间，feeds把该动态append到末尾；
  
GetNewsFeed：从末尾开始遍历feeds，返回最近的10条推文id；
  
Follow：有用户a关注用户b，则把a放入b的fans列表，且把b的tweets推文并入a的feeds，因合并的两部分均是按时间升序排列的数组，所以避免使用常规排序算法，使用自写的merge函数可以加速合并；
  
Unfollow：用用户a取消关注b，则将a从b的fans列表移除，还要从a的feeds中移除b的tweets。

**3 Golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/355_Design_Twitter/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/355_Design_Twitter/test.go</a>

<pre>type Twitter struct {
    tweets map[int][]tweet
    feeds  map[int][]tweet
    fans   map[int][]int
}

type tweet struct {
    id   int
    time time.Time
}

func Constructor() Twitter {
    tweets := make(map[int][]tweet)
    feeds := make(map[int][]tweet)
    fans := make(map[int][]int)

    return Twitter{tweets, feeds, fans}
}

func (this *Twitter) PostTweet(userId int, tweetId int) {
    time.Sleep(time.Nanosecond)

    now := time.Now()
    newTweet := tweet{tweetId, now}
    this.tweets[userId] = append(this.tweets[userId], newTweet)
    for _, followerId := range this.fans[userId] {
        this.feeds[followerId] = append(this.feeds[followerId], newTweet)
    }
    this.feeds[userId] = append(this.feeds[userId], tweet{tweetId, now})
}

func (this *Twitter) GetNewsFeed(userId int) []int {
    var feedIds []int
    feeds := this.feeds[userId]
    count := 0
    for i := len(feeds) - 1; i >= 0; i-- {
        if count >= 10 {
            break
        }
        feedIds = append(feedIds, feeds[i].id)
        count++
    }
    return feedIds
}

func (this *Twitter) Follow(followerId int, followeeId int) {
    if followerId == followeeId {
        return
    }

    found := false
    for _, item := range this.fans[followeeId] {
        if item == followerId {
            found = true
            break
        }
    }
    if !found {
        this.fans[followeeId] = append(this.fans[followeeId], followerId)
        this.feeds[followerId] = merge(this.feeds[followerId], this.tweets[followeeId])
    }
}

func merge(left, right []tweet) []tweet {
    var r []tweet
    if 0 == len(left) ||
        0 == len(right) {
        return append(left, right...)
    }
    i, j := 0, 0
    for i &lt; len(left) &#038;&#038; j &lt; len(right) {
        for i &lt; len(left) &#038;&#038; left[i].time.Before(right[j].time) {
            r = append(r, left[i])
            i++
        }
        for j &lt; len(right) &#038;&#038; i &lt; len(left) &#038;&#038;
            right[j].time.Before(left[i].time) {
            r = append(r, right[j])
            j++
        }
    }
    for i &lt; len(left) {
        r = append(r, left[i])
        i++
    }
    for j &lt; len(right) {
        r = append(r, right[j])
        j++
    }
    return r
}

func (this *Twitter) Unfollow(followerId int, followeeId int) {
    if followerId == followeeId {
        return
    }

    for i := 0; i &lt; len(this.fans[followeeId]); i++ {
        item := this.fans[followeeId][i]
        if item == followerId {
            this.fans[followeeId] = append(this.fans[followeeId][:i], this.fans[followeeId][i+1:]...)

            for _, tweet := range this.tweets[followeeId] {
                for i, item := range this.feeds[followerId] {
                    if item.id == tweet.id {
                        this.feeds[followerId] = append(this.feeds[followerId][:i], this.feeds[followerId][i+1:]...)
                        break
                    }
                }
            }
            break
        }
    }
}
</pre>