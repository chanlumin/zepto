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
      // parent不能等于自己
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
   * 把属性一个一个一个从source中复制到target中去
   * deep 为true的话就是深拷贝=> 把数组和对象也复制一份 复制过去
   *
   * 之所以要抽象出这个extend 是因为可能有多个元素要复制 比如(target, source1, source2,source3)
   *
   * @param target
   * @param source
   * @param deep
   */
    function extend(target, source, deep) {
      for(var key in source) {
        // 如果是深拷贝的话 有两种可能 一种是对象  另外一种是数组
        if(deep && (isPlainObject(source[key]) || isArray(source[key]))) {
          // 如果是对象的话
          if(isPlainObject(source[key]), !isPlainObject(target[key]))
            target[key] = {}

          // 如果是数组的话 {a: 'b', b : [a, b]} =>source[b] => target[b] = [] => 递归
          if(isArray(source[key]) && !isArray(target[key]))
            target[key] = []
          extend(target[key], source[key], deep) // => extend([], [a, b], true) => 此时就是浅拷贝了

        // 如果不是深拷贝的话 就直接把source[key]的 value 复制到target[key]中去
        } else if(source[key] !== void 0) target[key] = source[key]

      }
    }

  /**
   *
   * @param target
   */
  $.extend = function (target) {
    var deep,
      args = [].slice.call(arguments, 1)
    if($.type(target) == 'boolean') {
      deep = target
      target = args.shift()
    }

    args.forEach(function (source) {
      extend(target, source, deep)
    })

    return target
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

  /**
   * matches  其实就是在当前的元素找对应的css选择器 获取 :checked之类
   * @param element
   * @param selector
   * @returns {*}
   */
    zepto.matches = function (element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false

    // 浏览器兼容 如果存在则先调用它
    var matchesSelector = element.match
      || element.webkitMatchesSelector
      || element.mozMatchesSelector
      || element.oMatchesSelector

    //
    if(matchesSelector) return matchesSelector.call(element, selector)

    var match , parent = element.parentNode,
      temp = !parent
    if(temp) {
      parent = tempParent
      parent.appendChild(element)
    }

    match = ~zepto.qsa(element, selector).indexOf(element)

    // 如果不存在parent 那么到这里应该把append的element移除掉 以供下次使用
    temp && tempParent.remove(element)

    return match
  }

  /**
   * 获取一个元素节点的子节点
   * @param element
   * @returns {*}
   */
  function children(element) {
    return 'children' in element ?
       slice.call(element.children) : $.map(element.childNodes, function (node) {
        if(node.nodeType === 1) {
          return node
        }
      })
  }

  /**
   * 如果有传入过滤的元素就调用filter
   * @param nodes
   * @param selector
   * @returns {*}
   */
  function filtered(nodes, selector) {
    return selector == null ? $(node) : $(nodes).filter(selector)
  }


  /**
   * 去重的经典算法
   * 利用filter过滤 第一次出现的话数组中的元素 indexOf(item) === index
   * @param array
   */
  var uniq = function (array) {
    return [].filter.call(array, function (el, index) {
      return array.indexOf(el) == index
    })
  }

  var classCache = {}

  /**
   *  'red helo' 匹配传递red 或者helo进去可以直接匹配
   * @param name
   * @returns {RegExp}
   */
  function classRE(name) {
    // if(classCache[name] != void 0) {
    //   return classCache[name]
    // }
    // classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)')
    // return classCache[name];

    return name in classCache ? classCache[name] :
      // 以空开头或者空白开头
      classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|%)')
  }

  /**
   * 获取dom节点的className
   * @param node
   * @param value
   * @returns {*|string}
   */
  function className(node, value) {
    // 如果没有className的话就提供默认值
    var kclass = node.className || '',
      svg = kclass.baseVal !== void 0

    // 2 如果没有提供value值的话 直接返回className
    if(value = void 0) {
      // 如果是svg的话 返回他的baseVal 否则直接返回class
      return svg ? kclass.baseVal : kclass
    }

    // 3 否则的话就需要赋值了
    svg ? (kclass.baseVal = value) : (node.className = value)


  }

  /**
   * 如果arg是函数就在context执行上下文中调用他 否则直接返回
   * @param context
   * @param arg
   * @param idx
   * @param cls
   */
  function funcArg(context, arg, idx, cls) {
    return isFunction(arg) ? arg.call(context, idx, cls) : arg
  }


  // 供matches使用 matches 的思路就是 找到父节点 querySelectorAll('') => 从父节点indexOf找子节点
  var tempParent = document.createElement('div')

  $.fn =  {
    concat : emptyArray.concat,
    hide: function () {
    },
    size : function () {
      return this.length
    },
    get : function (idx) {
      return idx === void 0 ? [].slice.call(this) : this[idx > 0 ? idx : idx + this.length]
    },
    toArray : function () {
      // toArray = [].slice.call(this) ==> 跳到get的第一个判断条件
      return this.get()
    },
    first : function () {
      var el = this[0];
      // 如果不是对象的话直接返回 否则包装成zepto 元素
      return el && !isObject(el) ? el : $(el)
    },
    last: function () {
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    push : [].push,
    sort : [].sort,
    splice: [].splice,
    indexOf: [].indexOf,
    // slice因为返回的是数组所以要包装成zepto对象
    slice: function () {
      return $([].slice.call(this, arguments))
    },
    forEach: [].forEach,
    each: function (callback) {
      return [].every.call(function (el, index) {
        // zepto把callback的顺序给调换了
        return callback.call(el, index, el) !== false
      })
      // 返回当前可以供链式调用
      return this 
    },
    map : function (fn) {
      // $([1,2,3]).map(function (el, index) {
      //
      // })
      // 因为map  已经实现了 而此时的map 需要实现的是
      // this是zepto包裹的这个数组也就是[1,2,3]
      $($.map(this,function (el, index) {
        // zepto回调函数的参数的顺序有改变了
        return fn.call(el, index, el)
      }))
    },
    reduce: [].reduce,
    eq: function (index) {
      // 如果是-1的话 单独拿出来
      // [1,2,3].slice[-2,-1] => 2  如果[1,2,3].slice[-1, 0]=> 空数组 所以-1单独出来
      return index === -1 ? this.slice(index) : this.slice(index, index+1)
    },
    /**
     * 添加元素到zepto对象 如果参数是一个数组 那么这个数组的元素将合并到Zepto对象集中去
     * 因为返回的是一个数组
     */
    concat: function () {
      var i , value,args= []

      // 遍历arguments
      for(i = 0, length = arguments.length; i < length; i++) {
        value = arguments[i]
        // 因为返回的是一个数组 所以如果是Zepto对象也要转为数组
        args[i] = zepto.isZ(value) ? $.toArray(value) : value
      }

      // 如果当前是Zepto就转为数组 因为最后要转为数组的 不是的话直接把this传递进去就行了
      return [].concat.apply(zepto.isZ(this)? this.toArray() : this, args)
    },
    /**
     * pluck采摘  取到某个属性  用map 来实现
     * @param property
     */
    pluck: function (property) {
      // 对map的每一个元素进行遍历 如果有元素有property就返回
      return $.map(this,function (el) {
        return el[property]
      })
    },
    is : function (selector) {
      //  判断第一元素和selector是否相等
      return this.length > 0 && zepto.matches(this[0],selector)
    },
    /**
     * 过滤出不匹配selector的元素集合
     * @param selector
     */
    not : function (selector) {
      var nodes = []
      // 1. 如果selector是函数的话 那么遍历 如果函数条件不成立的话 就把它push进nodes里面去
      if(isFunction(selector) && selector.call !== void 0) {
        this.each(function (index) {
          // 如果 函数条件不成立就是要提取的元素 把它push进this中去
          if(!selector.call(this,index)) {
            nodes.push(this)
          }
        })
      } else {
        // 如果是string类型的话 直接filter=>过滤出去需要exclude的元素 如果是类数组的
        // 下面的 filter 其实是调用了 [].filter.call()
        var excludes = typeof selector === 'string' ? this.filter(selector) :
        likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector)
        this.forEach(function (el) {
          // 不再excludes中的元素的话
          if(excludes.indexOf(el) < 0) {
            nodes.push(this)
          }
        })
      }
      // 返回一个zepto对象的数组
      return $(nodes)

    },
    filter: function (selector) {
      // 如果是函数的话 调用not 两次not 选出需要的元素
      if(isFunction(selector)) this.not(this.not(selector))

      // 2 直接filter 返回zepto对象的数组
      return $([].filter.call(this, function (el) {
        return zepto.matches(el, selector)
      }))
    },
    find : function (selector) {
      var result, $this = this
      // 1 如果没有传入选择器的话就返回给空的Z函数
      if(!selector) {
        result = $()
      } else if(typeof selector === 'object') {
        // 2 如果是一个对象的话 那么遍历object中的每个属性 看看父亲是否包含object中的这些元素
        // filter 返回一个数组 chujanru
        $(selector).filter(function () {
          // this表示当前的node
          var node = this

          //  用some判断true还是false
          return [].some.call($this, function (parent) {

            // 如果包含的话 那么就证明此时selector中的一些 body中的一些dom元素
            return $.contains(parent, node)
          })
        })
      } else if(this.length === 1) {
        // 其中this是父元素而selector是要选择的元素的字符串
        result =  $(zepto.qsa(this[0], selector))
      } else {
        this.map(function (index, el) {
          //  其中 this代表的是每一个map的元素
          return zepto.qsa(this, selector)
        })
      }
    },
    /**
     * 判断当前对象是否有selector这个对象
     * @param selector
     */
    has : function (selector) {
      // filter 返回的是一个数组
      return this.filter(function () {
        // 如果是对象的话 就判断是否当前是否有包含selector  否则通过find找到的元素的size的数值有没有来filter元素
        return isObject(selector) ? this.contains(this, selector) : $(this).find(selector).size()
      })
    },
    children: function () {
      return $(this.map(function () {
        // 遍历当前所有的元素 返回由孩子节点组成的数组
        return children(this)
      }))
    },
    /**
     * 找到当前元素(可能是多个一样的元素)的父亲元素对应selector的指定元素
     * @param selector
     */
    parent: function (selector) {
      // 1 首先获取当前元素的父亲元素  每个基本的dom节点都有parentNode(需要去重 多个节点可能都是一样的父亲多个)
      // 2 然后在这写父亲元素中取出selector指定的元素
       return filtered(uniq(this.pluck(parentNode)),selector)
    },
    closest: function (selector, context) {
      // 1 初始化  如果selector是一个对象或者元素的话 那么就匹配给定的对象或者元素
      var nodes = [], collection = typeof selector === 'object' && $(selector)
      // 2 从当前的节点开始往上找
      this.each(function (_,node) {
        //
        while (node && !(collection ? collection.indexOf(node) < 0 : zepto.matches(node, selector))) {
          // 3 context 限定范围 node还没等于context并且还不是document节点 那么node =  parentNode 也就是父亲节点
          node = node != context && !isDocument(node) && node.parentNode
          if(node && nodes.indexOf(node) < 0) {
            // 往上开始一致保存祖先节点
            nodes.push(node)
          }
        }
      })
      return $(nodes)
    },
    /**
     * $('h1').parents() => [<div#container>, <body>, <html>]
     * 获取当前dom节点的所有的祖先元素
     * 如果你入selector就会再进行过滤
     * @param selector
     */
    parents : function (selector) {
      var ancestor = [], nodes = this

      // 最上面的跟节点的length是0 => Document.length = 0
      while (nodes.length > 0) {
        // 向上遍历map返回数组
        nodes = $.map(nodes, function (node) {
          if((node = node.parentNode) && !isDocument(node) && ancestor.indexOf(node) < 0) {
            ancestor.push(node)
          }
          return node
        })
      }
      // 如果有传入selector的话 那么从祖先元素中进行过滤
      return filtered(ancestor, selector)
    },
    /**
     * 找前一个兄弟 调用了pluck 内部调用了map获取当节点集合的所有兄弟节点
     * @param selector
     * @returns {jQuery|HTMLElement}
     */
    prev: function (selector) {
      return $(this.pluck('previousElementSibling').filtered(selector || '*'))
    },
    /**
     * 找下一个兄弟节点
     * @param selector
     * @returns {jQuery|HTMLElement}
     */
    next: function (selector) {
      return $(this.pluck('nextElementSibling').filtered(selector || '*'))
    },
    /**
     * 找到所有的兄弟节点
     * 利用filter 和children和parentNode 实现
     * @param seclector
     * @returns {*}
     */
    siblings: function (seclector) {
      return filtered(this.map(function (index, el) {
        // 先找到父亲节点 调用children 回调函数 child不等于el本身 就可以找出兄弟节点了
        [].filter.call(children(el.parentNode), function (child) {
          return child !== el
        })
      }),seclector)
    },
    hasClass: function (name) {
      if(!name) return false

      // 遍历node集合 如果node集合里面的 this代表node集合
      emptyArray.some.call(this, function (node) {
        // 先获取node的className再进行正则判断
        // 其中此处回调函数的this是classRE(name) 这是some的参数指定
        return this.test(className(node))
      }, classRE(name))
    },

    
    

  }

  zepto.Z.prototype = Z.prototype = $.fn
  return $
})()
∂
window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)