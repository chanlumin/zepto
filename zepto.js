var Zepto = (function () {
  var $ = function (selector, context) {
    return new zepto.init(selector, context)
  }

  var zepto = {
    init :  function (selector, context) {

    },
    Z : function (dom, selector) {
      return new Z(dom, selector)
    }
  }

  var Z = function (dom, selector) {

  }
  return $
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)