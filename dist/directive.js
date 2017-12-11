'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @author Bichi Kim <bichi@live.co.kr>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @copyright Naree Co.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @license MIT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @module
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


var _hammerjs = require('hammerjs');

var _hammerjs2 = _interopRequireDefault(_hammerjs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/**
 * data of gestures
 * @type {Array}
 * @private
 */
var _gestures = ['tap', 'pan', 'pinch', 'press', 'rotate', 'swipe'];
/**
 * data of directions
 * @type {Object}
 * @private
 */
var _directions = {
  tap: [],
  swipe: ['left', 'right', 'up', 'down'],
  pan: ['start', 'move', 'end', 'cancel', 'left', 'right', 'up', 'down'],
  pinch: ['start', 'move', 'end', 'cancel', 'in', 'out'],
  press: ['up'],
  rotate: ['start', 'move', 'end', 'cancel']
  /**
   * is name of gesture?
   * @param {String}name
   * @return {boolean}
   */
};var isGesture = function isGesture(name) {
  if (!name) {
    return false;
  }
  var gestureName = name.toLowerCase();
  return _lodash2.default.findIndex(_gestures, function (item) {
    return item === gestureName;
  }) >= 0;
};
/**
 * is name of direction?
 * @param {String}gesture
 * @param {String}direction
 * @return {boolean}
 */
var isDirection = function isDirection(gesture, direction) {
  return _lodash2.default.findIndex(_directions[gesture], function (item) {
    return item === direction;
  }) >= 0;
};
/**
 * get gesture and event in string gesture-direction
 * @param {String}name
 * @return {{gesture, event}}
 */
var getGestureWithDirection = function getGestureWithDirection(name) {
  if (!name) {
    return {};
  }

  var _name$split = name.split('-'),
      _name$split2 = _slicedToArray(_name$split, 2),
      gesture = _name$split2[0],
      direction = _name$split2[1];

  if (!direction || !isGesture(gesture) || !isDirection(gesture, direction)) {
    return {};
  }
  return { gesture: gesture, event: '' + gesture + direction };
};
/**
 * get gesture and event
 * @param {Object}binding
 * @return {{gesture, event}}
 */
var readBinding = function readBinding(binding) {
  var gesture = void 0,
      event = void 0;
  if (isGesture(binding.arg)) {
    gesture = binding.arg;
    event = binding.arg;
  } else {
    var result = getGestureWithDirection(binding.arg);
    gesture = result.gesture;
    event = result.event;
  }
  if (_lodash2.default.isString(gesture)) {
    gesture.toLowerCase();
  }
  return { gesture: gesture, event: event };
};
/**
 * get Handler in binding value
 * @param {Object}binding
 * @return {Function|undefined}
 */
var getHandler = function getHandler(binding) {
  var value = binding.value;

  var handler = void 0;
  if (_lodash2.default.isFunction(value)) {
    handler = value;
  } else if (_lodash2.default.isObject(value) && _lodash2.default.isFunction(value.handler)) {
    handler = function handler() {
      value.handler(binding.value.parameter);
    };
  } else if (_lodash2.default.isArray(value)) {
    var _value = _toArray(value),
        func = _value[0],
        funcArguments = _value.slice(1);

    handler = function handler() {
      func.apply(undefined, _toConsumableArray(funcArguments));
    };
  } else {
    return;
  }
  return handler;
};

/**
 * directive logic
 * @param {Object}options
 * @return {{update, bind, unbind}}
 */

exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var myOption = Object.assign({
    tap: { threshold: 50, time: 600, posThreshold: 50 }
  }, options);
  return {
    // todo this is not working in Vue2
    // see https://github.com/vuejs/vue/issues/3309 to support it
    // acceptStatement: true,
    update: function update(el, binding) {
      var hammer = el.__hammer__;
      if (!hammer) {
        throw new Error('[v-touch2] no hammer. hammer: ' + hammer);
      }

      var _readBinding = readBinding(binding),
          gesture = _readBinding.gesture,
          event = _readBinding.event;

      if (!gesture || !event) {
        return;
      }
      var isActive = el['__' + gesture + '__'];
      if (!isActive) {
        return;
      }
      hammer.off(event);
      var handler = getHandler(binding);
      if (!handler) {
        return;
      }
      hammer.on(event, handler);
    },
    bind: function bind(el, binding, vNode) {
      var _readBinding2 = readBinding(binding),
          gesture = _readBinding2.gesture,
          event = _readBinding2.event;

      if (!gesture || !event) {
        return;
      }
      // hammer
      if (!el.__hammer__) {
        el.__hammer__ = new _hammerjs2.default.Manager(el);
        // Owing to a Hammer bug I add this.
        // In the Hammer without swipe environment, tap options is not working
        el.__hammer__.add(new _hammerjs2.default.Swipe());
      }
      var hammer = el.__hammer__;
      // handler
      var handler = getHandler(binding);
      if (!handler) {
        return;
      }
      var _vNode$data$attrs = vNode.data.attrs,
          attrs = _vNode$data$attrs === undefined ? {} : _vNode$data$attrs;

      var option = attrs[gesture + '-options'] || {};
      var defaultOption = myOption[gesture] || {};
      Object.assign(option, defaultOption);
      // init Hammer
      el['__' + gesture + '__'] = true;
      hammer.add(new _hammerjs2.default[_lodash2.default.capitalize(gesture)](option));
      hammer.on(event, handler);
    },
    unbind: function unbind(el) {
      if (el.__hammer__) {
        el.__hammer__.destroy();
        el.__hammer__ = null;
      }
    }
  };
};