

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
var url;
var blockNext = true; 





function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function checkUrl(url) {
  var addr = extractAddr(url);
  renderStatus('addr is ' + addr);
  var array = [];
  var len = addr.length;
  for(var i = 0; i < len; i++){
    var tmp = "^" + addr.slice(0,i) + addr.slice(i+1,len) + "$"; // checks to see if this url has one more character than a real address
    array.push(tmp);
    var regex1 = "^" + addr.slice(0,i) + "[^" + addr.charAt(i) + "]" + addr.slice(i+1,len) + "$";  // checks for characters that are swapped with other characters
    array.push(regex1);
    var regex2 = "^" + addr.slice(0,i) + "." + addr.slice(i,len) + "$"; // checks to see if this url has less characters than the a real address
    array.push(regex2);

  }
  cmpWithList(array);
}

function extractAddr(url) { // goes from "https://www.google.com" to "google"
  var idx = url.indexOf("www.");
  var tmp = url.slice(idx + 4);
  idx = tmp.indexOf(".");
  tmp = tmp.slice(0,idx);

  // tmp = "googleuserconten";

  return tmp;
}

function cmpWithList(array) {
  // var regex = new RegExp(addr);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', chrome.extension.getURL('list.txt'), true);
  xhr.onreadystatechange = function()
  {
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) //... The content has been read in xhr.responseText
    {
      var regexArray = [];
      for(var i = 0; i < array.length; i++){
        var regex = new RegExp(array[i]);
        regexArray.push(regex);
      }
      // renderStatus(xhr.responseText);
      var list = xhr.responseText.split("\n");
      // renderStatus(list[3]);
      var found = false;
      var match = "";
      for(var i = 0; i < regexArray.length; i++){
        for(var j = 0; j < list.length; j++){
          if(regexArray[i].test(list[j])){
            found = true;
            match = list[j];
            break;
          }
        }
        if(found) break;
      }
      if(found) renderStatus("Did you mean " + match + "?");
      else renderStatus("no typosquatting detected");
    }
  };
  xhr.send();

}

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    currentUrl = details.url;

    if(window.confirm(currentUrl)) {
      return {cancel: false};
    }
    else return {cancel: details.url.indexOf("://www.evil.com/") != -1};
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {

    // checkUrl(url);


    // renderStatus('url is ' + url);
  });
});

// document.addEventListener('DOMContentLoaded', function() {
//   getCurrentTabUrl(function(url) {
//     // Put the image URL in Google search.
//     renderStatus('Performing Google Image search for ' + url);

//     getImageUrl(url, function(imageUrl, width, height) {

//       renderStatus('Search term: ' + url + '\n' +
//           'Google image search result: ' + imageUrl);
//       var imageResult = document.getElementById('image-result');
//       // Explicitly set the width/height to minimize the number of reflows. For
//       // a single image, this does not matter, but if you're going to embed
//       // multiple external images in your page, then the absence of width/height
//       // attributes causes the popup to resize multiple times.
//       imageResult.width = width;
//       imageResult.height = height;
//       imageResult.src = imageUrl;
//       imageResult.hidden = false;

//     }, function(errorMessage) {
//       renderStatus('Cannot display image. ' + errorMessage);
//     });
//   });
// });
