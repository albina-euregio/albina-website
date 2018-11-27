const request = require("request");
const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
const cors = require("cors");

var https = require("https");

var bloggerApiPath = "https://www.googleapis.com/blogger/v3/blogs";
var storedBlogs = [];

var stats = {
  requested: 0,
  proccessed: 0
};

var startingTime = new Date().valueOf();

app.use(cors());

var parseTime = (now, ms) => {
  const sDiff = (now - ms) / 1000;
  return Math.floor(sDiff / 60) + "m " + Math.floor(sDiff % 60) + "s";
};

app.get("/stats", (req, res) => {
  console.log("serving stats");
  const now = new Date().valueOf();
  const runningTimeM = (now - startingTime) / 60000;
  const runningText =
    "<strong>" +
    Math.floor(runningTimeM / 60) +
    " hours </strong> and <strong>" +
    Math.floor(runningTimeM % 60) +
    " minutes</strong>.";
  res.send(
    "<!doctype html><body>" +
      "<p>server running for " +
      runningText +
      "</p>" +
      "<table><tbody>" +
      "<tr><td>total requests received: </td><td><strong>" +
      stats.requested +
      "</strong></td></tr>" +
      "<tr><td>requests passed to blogger: </td><td><strong>" +
      stats.proccessed +
      "</strong></td></tr>" +
      "<tr><td>saved blogger requests[%]: </td><td><strong>" +
      (stats.requested
        ? 100 - Math.ceil((stats.proccessed / stats.requested) * 100)
        : "-") +
      "</strong></td></tr>" +
      "</tbody></table></br >" +
      "<div>stored urls: </div><ul>" +
      storedBlogs
        .map(blog => {
          return (
            "<li>" +
            "<b>" +
            parseTime(now, blog.time) +
            "</b> - " +
            "<i>" +
            blog.url +
            "</i>" +
            "</li>"
          );
        })
        .join("") +
      "</ul></html>"
  );
});

app.get("/:id/*", (req, res) => {
  stats.requested += 1;
  const url = req.url;
  console.log("request", url);

  const now = new Date();

  const stored = storedBlogs.find(b => b.url === url);

  const requestUrl =
    bloggerApiPath +
    url +
    "&maxResults=500&fetchBodies=false&fetchImages=true&status=live";

  if (stored) {
    console.log("stored before");
    res.send(stored.response);
  } else {
    console.log("requesting: ", requestUrl);
    stats.proccessed += 1;

    console.log("not stored before, have to be loaded");
    request({ url: requestUrl }, (err, response, body) => {
      // console.log('response', response)
      console.log("loaded, sending back");

      if (!err) {
        try {
          const jsonResponse = JSON.parse(body);
          const blog = {
            url: url,
            response: jsonResponse,
            time: now.valueOf()
          };
          storedBlogs.push(blog);

          res.send(jsonResponse);
        } catch (error) {
          console.log("!!!   problem parsing");
          res.send(false);
        }
      } else {
        console.log("!!!   error while loading", err);
        res.send(false);
      }
    });
  }
});

const cleaningInterval = 1000 * 60 * 1;
const maxStoredInterval = 1000 * 60 * 5;

// clean the old requests
setInterval(() => {
  const now = new Date();
  const nowMs = now.valueOf();
  console.log("cleaning");
  console.log("stored items before: ", storedBlogs.length);
  storedBlogs = storedBlogs.filter(blog => {
    return blog.time + maxStoredInterval > nowMs;
  });
  console.log("stored items after: ", storedBlogs.length);
}, cleaningInterval);

var server = app.listen(port, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log("running at http://" + host + ":" + port);
});
