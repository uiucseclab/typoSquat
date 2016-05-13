
var url;
var blockNext = true; 
var list = [];
var whiteList = [];



function checkUrl(addr) {
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

  }
  var regex3 = "^" + addr.slice(0,i) + "\." + "$";
  array.push(regex3);
  return cmpWithList(array);
}

function extractAddr(url) { // goes from "https://www.google.com" to "google"
  var idx = url.indexOf("www.");
  var tmp = url;
  if(idx != -1) tmp = url.slice(idx + 4);
  idx = tmp.indexOf("https:"); // https://
  if(idx != -1) tmp = tmp.slice(idx + 8);
  idx = tmp.indexOf("http:");
  if(idx != -1) tmp = tmp.slice(idx + 7);
  idx = tmp.indexOf(".");
  tmp = tmp.slice(0,idx);
  return tmp;
}

function cmpWithList(array) {
    var found = false;
    var match = "";
    if(list.length == 0) return "empty list";
    for(var j = 0; j < list.length; j++){
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
  for(var i = 0; i < whiteList.length; i++){
    if(whiteList[i] == url) return true;
  }
  for(var i = 0; i < list.length; i++){
    if(list[i] == url) return true;
  }
  return false;
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
      return {cancel: false};
    }
    var match = checkUrl(currentUrl);
    var msg = "";
    if(match == "empty list") message = "Proceed?";
    if(match == "") {
      whiteList.push(currentUrl);
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

