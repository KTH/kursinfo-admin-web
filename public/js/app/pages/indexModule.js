/**
 * Code that is used in a view. This is the single point of javascript
 * code being run in the html-page. Once in the HTML there is no possibility
 * to call code in the javascript modules.
 */

var $ = require('jquery')

$(function () {
  $('h1').text(' ♫ ♬ ♪ ♩ ♪ node-web updated from JS  ♫ ♬ ♪ ♩ ♪ ')
})
