/**
 *
 * @author Bichi Kim <bichi@live.co.kr>
 * @copyright Naree Co.
 * @license MIT
 * @module
 */
import Hammer from 'hammerjs'
import _ from 'lodash'

/**
 * data of gestures
 * @type {Array}
 * @private
 */
const _gestures = ['tap', 'pan', 'pinch', 'press', 'rotate', 'swipe']
/**
 * data of directions
 * @type {Object}
 * @private
 */
const _directions = {
  tap: [],
  swipe: ['left', 'right', 'up', 'down'],
  pan: ['start', 'move', 'end', 'cancel', 'left', 'right', 'up', 'down'],
  pinch: ['start', 'move', 'end', 'cancel', 'in', 'out'],
  press: ['up'],
  rotate: ['start', 'move', 'end', 'cancel'],
}
/**
 * is name of gesture?
 * @param {String}name
 * @return {boolean}
 */
const isGesture = (name) => {
  if(!name){
    return false
  }
  const gestureName = name.toLowerCase()
  return _.findIndex(_gestures, (item) => (item === gestureName)) >= 0
}
/**
 * is name of direction?
 * @param {String}gesture
 * @param {String}direction
 * @return {boolean}
 */
const isDirection = (gesture, direction) => {
  return _.findIndex(_directions[gesture], (item) => (item === direction)) >= 0
}
/**
 * get gesture and event in string gesture-direction
 * @param {String}name
 * @return {{gesture, event}}
 */
const getGestureWithDirection = (name) => {
  if(!name){
    return {}
  }
  const [gesture, direction] = name.split('-')
  if(!direction || !isGesture(gesture) || !isDirection(gesture, direction)){
    return {}
  }
  return {gesture, event: `${gesture}${direction}`}
}
/**
 * get gesture and event
 * @param {Object}binding
 * @return {{gesture, event}}
 */
const readBinding = (binding) => {
  let gesture, event
  if(isGesture(binding.arg)){
    gesture = binding.arg
    event = binding.arg
  }else{
    const result = getGestureWithDirection(binding.arg)
    gesture = result.gesture
    event = result.event
  }
  if(_.isString(gesture)){
    gesture.toLowerCase()
  }
  return {gesture, event}
}
/**
 * get Handler in binding value
 * @param {Object}binding
 * @return {Function|undefined}
 */
const getHandler = (binding) => {
  const {value} = binding
  let handler
  if(_.isFunction(value)){
    handler = value
  }else if(_.isObject(value) && _.isFunction(value.handler)){
    handler = (event) => {
      value.handler(binding.value.parameter)
      event.preventDefault()
    }
  }else if(_.isArray(value)){
    const [func, ...funcArguments] = value
    handler = (event) => {
      func(...funcArguments)
      event.preventDefault()
    }
  }else{
    return
  }
  return handler
}

/**
 * directive logic
 * @param {Object}options
 * @return {{update, bind, unbind}}
 */
export default (options = {}) => {
  const myOption = Object.assign({
    tap: {threshold: 50, time: 500, posThreshold: 50},
  }, options)
  return {
    // todo this is not working in Vue2
    // see https://github.com/vuejs/vue/issues/3309 to support it
    // acceptStatement: true,
    update(el, binding){
      const hammer = el.__hammer__
      if(!hammer){
        throw new Error(`[v-touch2] no hammer. hammer: ${hammer}`)
      }
      const {gesture, event} = readBinding(binding)
      if(!gesture || !event){
        return
      }
      const isActive = el[`__${gesture}__`]
      if(!isActive){
        return
      }
      hammer.off(event)
      const handler = getHandler(binding)
      if(!handler){
        return
      }
      hammer.on(event, handler)
    },
    bind(el, binding, vNode){
      const {gesture, event} = readBinding(binding)
      if(!gesture || !event){
        return
      }
      // hammer
      if(!el.__hammer__){
        el.__hammer__ = new Hammer.Manager(el, {touchAction: 'auto'})
        // Owing to a Hammer bug I add this.
        // In the Hammer without swipe environment, tap options is not working
        el.__hammer__.add(new Hammer.Swipe())
      }
      const hammer = el.__hammer__
      // handler
      const handler = getHandler(binding)
      if(!handler){
        return
      }
      const {attrs = {}} = vNode.data
      const option = attrs[`${gesture}-options`] || {}
      const defaultOption = myOption[gesture] || {}
      Object.assign(option, defaultOption)
      // init Hammer
      el[`__${gesture}__`] = true
      hammer.add(new Hammer[_.capitalize(gesture)](option))
      hammer.on(event, handler)
    },
    unbind(el){
      if(el.__hammer__){
        el.__hammer__.destroy()
        el.__hammer__ = null
      }
    },
  }
}

