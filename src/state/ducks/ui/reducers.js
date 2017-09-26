import * as types from './types';




const initialState = {

}


export default function reducer(state = initialState,action) {
  switch(action.type) {
    case(types.UI_SET_BACKROUND_CUBEMAP):
      return {...state,backgroundCubemap:action.payload}
    default:
      return state;
  }
}
