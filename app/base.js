var Base = {
  makeUrl (baseUrl, params = {}) {
    return (
      baseUrl +
      (Object.keys(params).length > 0
        ? '?' +
            Object.keys(params)
              .map(k => {
                return k + '=' + encodeURIComponent(params[k])
              })
              .join('&')
        : '')
    )
  },

  doRequest (url, type = 'json') {
    return new Promise(function (resolve, reject) {
      console.log('request: ' + url)
      let xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if (xhr.status == 200) {
            resolve(xhr.responseText)
          } else {
            reject(xhr.statusText, xhr.status)
          }
        }
      }
      xhr.open('GET', url, true)

      // set content type
      switch (type) {
        case 'json':
          xhr.setRequestHeader(
            'Accept',
            'application/json,application/vnd.application+json,application/vnd.api+json'
          )
          break

        default:
          break
      }
      xhr.send(null)
    })
  },

  doPost (url, payload, type = 'json') {
    return new Promise(function (resolve, reject) {
      console.log('post: ' + url + ' ' + JSON.stringify(payload))
      let xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if (xhr.status == 200) {
            resolve(xhr.responseText)
          } else {
            reject(xhr.statusText, xhr.status)
          }
        }
      }
      xhr.open('POST', url, true)

      // set content type
      switch (type) {
        case 'json':
          xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
          xhr.setRequestHeader(
            'Accept',
            'application/json,application/vnd.application+json,application/vnd.api+json'
          )
          break

        default:
          break
      }
      xhr.send(JSON.stringify(payload))
    })
  },

  cleanCache (fileName) {
    if (window.caches) {
      window.caches.delete(fileName)
    }
  },

  checkBlendingSupport () {
    const bodyEl = document.getElementsByTagName('body')[0]
    const bodyElStyle = window.getComputedStyle(bodyEl)
    const blendMode = bodyElStyle.getPropertyValue('mix-blend-mode')
    return !!blendMode
  }
}

module.exports = Base
