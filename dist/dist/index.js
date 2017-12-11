'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _objectWithoutProperties(obj, keys) {
  var target = {};for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
  }return target;
} /**
   * @author Bichi Kim <bichi@live.co.kr>
   * @copyright Naree Co.
   * @license MIT
   * @module
   */

/**
 * @type {Object}
 */
exports.default = {
  /**
   *
   * @param {Object}Vue
   * @param {Object}options
   */
  install: function install(Vue) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref$name = _ref.name,
        name = _ref$name === undefined ? 'touch' : _ref$name,
        others = _objectWithoutProperties(_ref, ['name']);

    Vue.directive(name, (0, _directive2.default)(others));
  }
};
//# sourceMappingURL=index.js.map