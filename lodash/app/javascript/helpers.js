// Initialize underscore template variables
  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

// For IE
var contentType ="application/x-www-form-urlencoded; charset=utf-8";
if(window.XDomainRequest) 
  contentType = "text/plain";


function getJSONP(url, data) {
  return $.ajax(url, {
    dataType: 'json',
    data: data
  });
}
