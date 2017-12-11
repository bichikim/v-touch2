/**
 * @author Bichi Kim <bichi@live.co.kr>
 * @copyright Naree Co.
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
  install(Vue, {name = 'touch', ...others} = {}){
    Vue.directive(name, touches(others))
  },
}
