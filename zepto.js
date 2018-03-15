var Zepto = (function () {

  var emptyArray =  [],
    slice = emptyArray.slice,
    concat = emptyArray.concat
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


  var simpleSelectorRe = /^[\w-]*$/
  /**
   * element 其实就是执行环境上下文也就是context而selector就是
   * @param element
   * @param selector
   */
  // 下面是下下面的展开版本
  // zepto.qsa = function (element, selector) {
  //   var bound,
  //     maybeId  = selector[0] == '#',
  //     maybeClass = !maybeId && selector[0] == '.',
  //     // 取出#app => app .app => app  app => app
  //     nameOnly = maybeId || maybeClass ? selector.slice(1) : selector,
  //     isSimple = simpleSelectorRe.test(selector)
  //   if(isDocument(element) && isSimple && maybeId) {
  //     var found =  element.getElementById(nameOnly)
  //     return found ? [found] : []
  //   } else if(element.nodeType != 1 || element.nodeType != 9) {
  //     return []
  // } else if(isSimple && !maybeId && maybeClass) {
  //     return slice.call(element.getElementsByClassName(nameOnly))
  //   } else {
  //     return slice.call(element.getElementsByTagName(nameOnly))
  //   }
  //   return element.querySelectorAll(nameOnly)
  // }

  zepto.qsa = function(element, selector){
    var found,
      maybeID = selector[0] == '#',
      maybeClass = !maybeID && selector[0] == '.',
      nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
      isSimple = simpleSelectorRE.test(nameOnly)
    return (isDocument(element) && isSimple && maybeID) ?
      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
        slice.call(
          isSimple && !maybeID ?
            maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
              element.getElementsByTagName(selector) : // Or a tag
            element.querySelectorAll(selector) // Or it's not simple, and we need to query all
        )
  }


  /**
   * 获取 默认的显示的属性
   * @type {{}}
   */
  // 缓存默认的元素的属性
  var elementDisplay = {}
  var getDefaultDisplay = function (nodeName) {
    // 1 不存在的话 创建 并且把它append到页面当中去
    if(!elementDisplay[nodeName]) {
      var element = document.createElement(nodeName)
      document.querySelector('body').appendChild(element)

      // 2 获取display的默认的值
      var display = getComputedStyle(element, '').getPropertyValue('display')

      // 用完就删除
      element.parentNode.removeChild(element)

      // 3 可能会设置全局的css 采取的措施是如果全局的css是none的话 那么就设置他为block
      display == 'none' && (display = 'block')

      // 4 缓存下来
      elementDisplay[nodeName] = display
    }
    return element[nodeName]
  }

  var class2type = {}
  var toString = class2type.toString
  "Boolean RegExp Function Object Number String Array Date Error".split(" ").forEach(function(name) {
    // 1 对object执行toString之后的字符串作为键值对的键
    class2type['[object ' + name + ']'] = name.toLowerCase()
  })
  
  function type(obj) {
    // 1 如果是空的话 用String包装obj 取出class2type的值 默认是object
    return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object'
  }
  $.type = type
  
  function isFunction(obj) {
    return type(obj) == 'function'
  }
  $.isFunction = isFunction

  /**
   * 先调用现代浏览器默认的isArray 没有再通过instanceof来判断
   * @type {*|Function}
   */
  var isArray = Array.isArray || function (object) {
    return object instanceof Array
  }
  $.isArray = isArray
  
  function isWindow(obj) {
    // 判断是否是window的话即使 obj.window == obj
    return obj != null && obj == obj.window
  }
  $.isWindow = isWindow
  
  function isDocument(obj) {
    // 判断Document主要是通过DOCUMENT_NODE来判断的
    return obj != null && obj.nodeType == obj.DOCUMENT_NODE
  }
  $.isDocument = isDocument
  
  function isObject(obj) {
    type(obj) == 'object'
  }
  $.isObject = isObject


  /**
   * 判断对象是否是对象常量{} 获取是通过new Object产生的 如果是 new Date
   * 之类的对象就不是plainObject
   * @param obj
   * obj的原型一定要是Object.prototype的原型
   * 返回Object
   */
  function isPlainObject(obj) {
    // 首先他是一个对象 不是window对象 并且对象的原型和Object的对象的原型一样
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }
  
  
  $.isPlainObject = isPlainObject


  /**
   * 判断是否是空对象
   * @param obj
   * @returns {boolean}
   *
   *  空对象只的是 没有任何属性包括继承过来的
   *  换另外一种说法就是没有任何的属性可以枚举
   */
  $.isEmptyObject = function (obj) {
    for(var name in obj) return false
    return true
  }

  /**
   * 判断是否是数字
   * @param val
   * @returns {boolean}
   */
  $.isNumeric = function (val) {
    var num = Number(val),
      type =  typeof val


    return val != null &&
      type != 'boolean' &&
      // 不是String 类型的如果是String的话 那么最好要是val.length
      // $.isNumeric('2')=>true $.isNumeric('')=>false
      (type != 'string' || val.length) &&
      !isNaN(num) &&
      isFinite(num) ||
      false
  }

  /**
   * 判断指定元素在数组中的索引位置
   * @param el 指定元素
   * @param array 传入的数组
   * @param index 从index位置开始的索引
   */
  $.inArray = function (el, array, index) {
    return [].indexOf.call(array, el, index)
  }

  /**
   *  对字符串进行驼峰化 --home-hello => HomeHello
   *  hello-world => HelloWorld
   * @param str
   * @returns {string|XML|void|*}
   */
  var camelize = function (str) {
    return str.replace(/-+(.)?/g, function (match, chr) {
      //  备注: chr其实就是补获对字符串
      return chr ? chr.toUpperCase() : ''
    })
  }

  $.camelize = camelize


  /**
   * 处理字符串的两边空白
   * @param str
   * @returns {string}
   */
  $.trim = function (str) {
    return str == null ? '' : String.prototype.trim.call(str)
  }


  /**
   * 空函数
   */
  $.noop = function () {}


  /**
   * 将数组进行展平
   * @param array
   * @returns {*}
   */
  flatten = function (array) {
    // 如果数组的长度大于0的话 才需要展平
    return array.length > 0 ? $.fn.concat.apply([], array) : array
  }
  
  $.map = function (elements, callback) {
    var value, values = [],index, key
    
    if(likeArray(elements)) {
      for(index = 0,  length = elements.length; index < length; index++) {
        value = callback(elements[index], index) 
        if(value != null) {
          values.push(value)
        }
      }
    } else {
      for(var key in elements) {
        value = callback(elements[key], key)
        if(value != null) {
          value.push(value)
        }
      }
    }
    return flatten(values)
  }

  /**
   * 数组的过滤 返回过滤后的元素
   * @param elements
   * @param callback
   * @returns {*}
   */
  $.grep = function (elements, callback) {
    return [].filter.call(elements, callback)
  }

  /**
   * 解析JSON
   */
  $.parseJSON = function () {
    if(window.JSON) $.parseJSON = JSON.parse
  }


  /**
   * 判断一个节点是否是另一个节点的祖先节点
   * @param obj
   * @returns {boolean}
   */
  $.contains = document.documentElement.contains ?
    // 如果存在contains的话直接调用浏览器的api
    function (parent, node) {
      return parent !=node && parent.contains(node)
    } :
    // 如果不存在的话就向上遍历
    function (parent, node) {
      while (node && (node = node.parent)) {
        if(node === parent) {
          return true
        }
      }
      return false
    }


  /**
   * 判断obj是否是类数组
   *
   *
   * function 和 window也有length 属性 一般不把它归类为类数组
   * @param obj
   * @returns {boolean}
   */
  function likeArray(obj) {
    // 1 获取 length obj存在 且有length属性 获取length
    var length = !!obj && 'length' in obj && obj.length
    var type = $.type(obj)
    return 'function' != type &&
           !isWindow(obj) &&
           ('array' == type || length === 0 || (typeof length == 'number' && length > 0 && (length-1) in obj))
  }

  $.each = function (elements, callback) {
    var i, key
    if(likeArray(elements)) {
      for(i = 0, length = elements.length ; i < length; i++) {
        if(callback.call(elements[i], i, elements[i])  === false) {
          return elements
        }
      }
    } else {
      for(key in elements)
        // 有可能elements[key] 是一个objec所以就会邦迪你
        if(callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }


  





  $.fn =  {
    concat : emptyArray.concat,
    each : function () {},
    map : function () {},
    hide: function () {
    }
  }

  zepto.Z.prototype = Z.prototype = $.fn
  return $
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)