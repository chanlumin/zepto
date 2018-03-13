var Zepto = (function () {
  var $ = function (selector, context) {
    return new zepto.init(selector, context)
  }

  var zepto = {
    init :  function (selector, context) {

    }
  }
  return $
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)