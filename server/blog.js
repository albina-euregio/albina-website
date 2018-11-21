const request = require('request')
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

var bloggerApiPath = 'https://www.googleapis.com/blogger/v3/blogs'
var storedBlogs = []

app.use(cors())

app.get('/:id/*', (req, res) => {
  const url = req.url
  console.log('!!getting a request', bloggerApiPath + url)

  const now = new Date()

  const stored = storedBlogs.find(b => b.url === url)

  if (stored) {
    console.log('stored before')
    res.send(stored.response)
  } else {
    console.log('not stored before, have to be loaded')
    request({ url: bloggerApiPath + url }, (err, response, body) => {
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
        console.log('error', err)
        res.send(false)
      }
    })
  }
})

const cleaningInterval = 5000

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

app.listen(port, () =>
  console.log(`blog middleware server is running on port ${port}!`)
)
