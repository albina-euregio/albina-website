var Base = {
  doRequest(url, type='json') {
    return new Promise(function(resolve, reject) {
      console.log('request: ' + url);
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if(xhr.status == 200) {
            resolve(xhr.responseText);
          } else {
            reject(xhr.statusText);
          }
        }
      };
      xhr.open('GET', url, true);
      
      // set content type
      switch(type) {
      case 'json':
        xhr.setRequestHeader('Accept', 'application/json,application/vnd.application+json,application/vnd.api+json');
        break;

      default:
        break;
      }
      xhr.send(null);
    });
  },

  cleanCache(fileName) {
    if (window.caches) {
      window.caches.delete(fileName);
    }
  }
};

module.exports = Base;
