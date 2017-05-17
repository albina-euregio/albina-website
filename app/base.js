var Base = {
  doRequest (url, next) {
    console.log('request: ' + url)
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        next(xhr.responseText)
      }
    }
    xhr.open('GET', url, true)
    xhr.send(null)
  }
}

module.exports = Base