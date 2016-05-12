// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
var url;
var blockNext = true; 
var list = [];

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
    '?v=1.0&q=' + encodeURIComponent(searchTerm);
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || !response.responseData || !response.responseData.results ||
        response.responseData.results.length === 0) {
      errorCallback('No response from Google Image search!');
      return;
    }
    var firstResult = response.responseData.results[0];
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult.tbUrl;
    var width = parseInt(firstResult.tbWidth);
    var height = parseInt(firstResult.tbHeight);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected response from the Google Image Search API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function renderStatus(statusText) {
  // document.getElementById('status').textContent = statusText;
}

function checkUrl(addr) {
  // var addr = extractAddr(url);
  var array = [];
  var len = addr.length;
  var i;
  for(i = 0; i < len; i++){
    var regex0 = "^" + addr.slice(0,i) + addr.slice(i+1,len) + "$"; // checks to see if this url has one more character than a real address
    array.push(regex0);
    var regex1 = "^" + addr.slice(0,i) + "[^" + addr.charAt(i) + "]" + addr.slice(i+1,len) + "$";  // checks for characters that are swapped with other characters
    array.push(regex1);
    var regex2 = "^" + addr.slice(0,i) + "\." + addr.slice(i,len) + "$"; // checks to see if this url has less characters than the a real address
    array.push(regex2);
    if(addr == "youtube"){
      // alert(regex2);
      var regtmp = new RegExp(regex2);
      // alert(regtmp.test("yourtube"));
    }

  }
  var regex3 = "^" + addr.slice(0,i) + "\." + "$";
  array.push(regex3);
  // if(addr == "youtube") alert(array.length);
  return cmpWithList(array);
}

function extractAddr(url) { // goes from "https://www.google.com" to "google"
  var idx = url.indexOf("www.");
  var tmp = url;
  if(idx != -1) tmp = url.slice(idx + 4);
  idx = tmp.indexOf(".");
  tmp = tmp.slice(0,idx);

  // tmp = "googleuserconten";
  // if(url.indexOf("youtube") != -1) confirm(tmp);
  return tmp;
}

function cmpWithList(array) {
  // var regex = new RegExp(addr);
    // var regexArray = [];
    // for(var i = 0; i < array.length; i++){
    //   var regex = new RegExp(array[i]);
    //   regexArray.push(regex);
    // }
    var found = false;
    var match = "";
    // return "blah";
    if(list.length == 0) return "empty list";
    for(var j = 0; j < list.length; j++){
      // if(j==5856) alert(list[j] + list[j].length);
      for(var i = 0; i < array.length; i++){
        var regex = new RegExp(array[i]);
        if(regex.test(list[j].trim())){
          found = true;
          match = list[j];
          break;
        }
      }
      if(found) break;
    }
    if(found) return match;
    return "";
}

function checkWhiteList(url) {
  for(var i = 0; i < list.length; i++){
    if(list[i] == url) return true;
  }
  return false;
}

function writeToList(url){
//   var fReader = XMLHttpRequest();
// //var params = "MODE=GET&File=Data.txt";//To read
//   var params = "MODE=POST&File=list.txt&Message=" + url;//To write

//   fReader.onreadystatechange=function() {
//       if(fReader.readyState==4 && fReader.status==200) {
//           //Not really any response text if writing...
//           // parseText(JSON.parse(fReader.responseText).GET);
//       }
//   }

//   fReader.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//   fReader.setRequestHeader("Content-length", params.length);
//   fReader.setRequestHeader("Connection", "close");

//   fReader.send(params);
}


var xhr = new XMLHttpRequest();
xhr.open('GET', chrome.extension.getURL('list.txt'), true);
xhr.onreadystatechange = function()
{
  if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) //... The content has been read in xhr.responseText
  {
    list = xhr.responseText.split("\n");
  }
};
xhr.send();


chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var fullUrl = details.url;
    var currentUrl = extractAddr(fullUrl);
    if(checkWhiteList(currentUrl)){
      writeToList(currentUrl);
      return {cancel: false};
    }
    // if(fullUrl.indexOf("youtube") != -1) confirm(currentUrl + "\n" + fullUrl);
    var match = checkUrl(currentUrl);
    var msg = "";
    if(match == "empty list") message = "Proceed?";
    if(match == "") {
      list.push(currentUrl);
      return {cancel: false};
    }
    message = "You were about to go to " + currentUrl + "\nIf you meant " + match + " then click CANCEL and then type it correctly";

    if(window.confirm(message)) {
      list.push(currentUrl);
      return {cancel: false};
    }
    else return {cancel: true};

  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

