const request = require('request')
const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const cors = require('cors')

var https = require('https')

var bloggerApiPath = 'https://www.googleapis.com/blogger/v3/blogs'
var storedBlogs = []

var stats = {
  requested: 0,
  proccessed: 0
}

app.use(cors())

app.get('/stats', (req, res) => {
  console.log('serving stats')
  res.send(
    '<!doctype html><body>' +
      '<dl>' +
      '<div><span>requested: </span><strong>' +
      stats.requested +
      '</strong></div>' +
      '<div><span>proccessed: </span><strong>' +
      stats.proccessed +
      '</strong></div>' +
      '<div><span>saved requests[%]: </span><strong>' +
      (stats.requested ? 100 - stats.proccessed / stats.requested * 100 : '-') +
      '</strong></div>' +
      '</dl>' +
      '<div>stored urls: </div>' +
      storedBlogs
        .map(blog => {
          return '<p>' + blog.url + '</p>'
        })
        .join('') +
      '</html>'
  )
})

app.get('/:id/*', (req, res) => {
  stats.requested += 1
  const url = req.url
  console.log('!!getting a request', url)

  const now = new Date()

  const stored = storedBlogs.find(b => b.url === url)

  const requestUrl = bloggerApiPath + url + '&maxResults=100'

  if (stored) {
    console.log('stored before')
    res.send(stored.response)
  } else {
    console.log('requesting: ', requestUrl)
    stats.proccessed += 1
    console.log('not stored before, have to be loaded')
    request({ url: requestUrl }, (err, response, body) => {
      // console.log('response', response)
      console.log('loaded, sending back')
      if (!err) {
        const blog = {
          url: url,
          response: JSON.parse(body),
          time: now.valueOf()
        }
        storedBlogs.push(blog)

        res.send(JSON.parse(body))
      } else {
        console.log('error while loading', err)
        res.send(false)
      }
    })
  }
})

const cleaningInterval = 1000 * 60 * 5

// clean the old requests
setInterval(() => {
  const now = new Date()
  const nowMs = now.valueOf()
  console.log('cleaning')
  console.log('stored items before: ', storedBlogs.length)
  storedBlogs = storedBlogs.filter(blog => {
    return blog.time + cleaningInterval > nowMs
  })
  console.log('stored items after: ', storedBlogs.length)
}, cleaningInterval)

var server = app.listen(port, () => {
  var host = server.address().address
  var port = server.address().port
  console.log('running at http://' + host + ':' + port)
})
