import * as types from './types.js'

export function setBackgroundCubemap(left,right,top,bottom,front,back) {
  return {
    type:types.UI_SET_BACKROUND_CUBEMAP,
    payload:{
      left:left,right:right,top:top,bottom:bottom,front:front,back:back
    }
  }
}
