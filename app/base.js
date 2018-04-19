var Base = {
  doRequest(url) {
	return new Promise(function(resolve, reject) {
	    console.log('request: ' + url)
	    let xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function() {
	      if(xhr.readyState == XMLHttpRequest.DONE) {
	        resolve(xhr.responseText)
	      }
	    }
	    // TODO: fix accept header
	    //xhr.setRequestHeader('Accept', 'application/json,application/vnd.application+json,application/vnd.api+json');
	    xhr.open('GET', url, true)
	    xhr.send(null);
	});
  }
}

module.exports = Base