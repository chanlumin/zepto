# zepto

## zepto的基本结构

 
```javascript
var Zepto = (function () {

  var zepto  =  {}
  var $ = function (selector, context) {
    // 1 实际上班zepto.init new的是一个zepto.Z 函数
    return new zepto.init(selector, context)
  }


  zepto.init = function (selector, context) {
    var dom
    // 1 如果没有selector
    if(!selector) {
      return zepto.Z()
    }
    // 2 接下来有各种情况的判断

    // 3 最后返回
    return zepto.Z(dom, selector)


  }
  zepto.Z = function (dom, selector) {
    return new Z(dom, selector)
  }
  zepto.isZ = function (obj) {
    // 应该为object instanceof Z 否则的话需要把zepto.z的prototype指向Z的原型
    return obj instanceof zepto.Z
  }

  var Z = function (dom, selector) {}

  /**
   * 获取 默认的显示的属性
   * @type {{}}
   */


  $.fn =  {
    each : function () {},
    map : function () {},
    hide: function () {
      return this.css('display',  'none')
    }
  }

  zepto.Z.prototype = Z.prototype = $.fn
  return $
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)

```


## 获取dom元素的各种属性值

> 如果直接通过dom.style.width => 获取到的只能是内联的属性值

> 正确的获取方式是 getComputedStyle(dom, '').getPropertyValue('width')



