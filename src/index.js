/**
 * @module * @author Bichi Kim [bichi@live.co.kr]
 * @copyright (c) Naree Co.
 * @license MIT
 * @module
 */
import touches from './directive'

/**
 * @type {Object}
 */
export default {
  /**
   *
   * @param {Object}Vue
   * @param {Object}options
   */
  install: function(Vue, options = {}){
    Vue.directive('touch', touches(options))
  },
}
