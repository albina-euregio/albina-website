require('url-search-params-polyfill')

var Base = {
  makeUrl(baseUrl, params = {}) {
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

  doRequest(url, type = 'json') {
    return new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function() {
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

  doPost(url, payload, type = 'json') {
    return new Promise(function(resolve, reject) {
      console.log('post: ' + url + ' ' + JSON.stringify(payload))
      let xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function() {
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
          xhr.setRequestHeader(
            'Content-Type',
            'application/json;charset=UTF-8'
          )
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

  cleanCache(fileName) {
    if (window.caches) {
      window.caches.delete(fileName)
    }
  },

  checkBlendingSupport() {
    const bodyEl = document.getElementsByTagName('body')[0]
    const bodyElStyle = window.getComputedStyle(bodyEl)
    const blendMode = bodyElStyle.getPropertyValue('mix-blend-mode')
    return !!blendMode
  },

  searchGet(variable) {
    const search = new URLSearchParams(
      document.location.search.substring(1)
    )
    return search.get(variable)
  },

  searchChange(history, variable, value, replace = false) {
    let search = new URLSearchParams(
      document.location.search.substring(1)
    )
    const actualValue = this.searchGet(variable)

    if (actualValue !== false) {
      if (actualValue !== value) {
        search.set(variable, value)
      } else {
        search = false
      }
    } else {
      search.append(variable, value)
    }
    if (search && history) {
      if (replace) {
        history.replace({ search: search.toString() })
      } else {
        history.push({ search: search.toString() })
      }
      console.log('changing history', search.toString())
    }
  }
}

module.exports = Base
