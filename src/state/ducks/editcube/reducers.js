import * as Cube from './cube'
import * as draw from './draw'
import * as types from './types';
import * as selectors from './selectors';


const initialState = Cube.newCube(4,4,4,16)


export default function reducer(state = initialState,action) {
  let payload = action.payload
  switch(action.type) {
    case types.EDITCUBE_NEW_CUBE:
      return action.payload;
    case types.EDITCUBE_LOAD_CUBE:
      break;
    case types.EDITCUBE_NEW_FRAME:
      return Cube.insertNewFrame(state,payload);
    case types.EDITCUBE_SET_FRAME:
      return Cube.setFrame(state,payload.id,payload.frame);
    case types.EDITCUBE_CUT_FRAME:
      return Cube.cutFrame(state,payload);
    case types.EDITCUBE_MOVE_FRAME:
      //TODO:implement
      return Cube.moveFrame(state,payload.frameId,payload.toIndex);
    case types.EDITCUBE_DUPLICATE_FRAME:
      return Cube.duplicateFrame(state,payload);
    case types.EDITCUBE_CLEAR_FRAME:
      return Cube.clearFrame(state,payload);
    case types.EDITCUBE_NEW_COLORMAP:
      return Cube.insertNewColormap(state,payload)
    case types.EDITCUBE_SET_COLORMAP:
      return Cube.setColormap(state,action.payload.id,action.payload.colormap)
    case types.EDITCUBE_CUT_COLORMAP:
      return Cube.cutColormap(state,payload);
    case types.EDITCUBE_MOVE_COLORMAP:
      return Cube.moveColormap(state,payload.frameId,payload.toIndex);
    case types.EDITCUBE_DUPLICATE_COLORMAP:
      return Cube.duplicateColormap(state,payload);
    case types.EDITCUBE_CLEAR_COLORMAP:
      return Cube.clearColormap(state,payload);


    case types.EDITCUBE_DRAW: {
      let fr = Cube.getCurrentFrame(state)
      let data = fr.data.slice();
      draw.draw(state.size,data,[payload.x,payload.y,payload.z],payload.color)
      return Cube.setFrame(state,fr.id,data);
    }
    case types.EDITCUBE_DRAW_SHAPE: {
      let fr = Cube.getCurrentFrame(state)
      let data = fr.data.slice();
      draw.draw(state.size,data,payload.shape,payload.args)
      return Cube.setFrame(state,fr.id,data);
    }


    case types.EDITCUBE_SET_INDEX_X:
      return Cube.setEditIndexX(state,payload);
    case types.EDITCUBE_SET_INDEX_Y:
      return Cube.setEditIndexY(state,payload);
    case types.EDITCUBE_SET_INDEX_Z:
      return Cube.setEditIndexZ(state,payload);
    case types.EDITCUBE_SET_PRIMARY_COLOR:
      return Cube.setPrimaryColor(state,payload);
    case types.EDITCUBE_SET_SECONDARY_COLOR:
      return Cube.setSecondaryColor(state,payload);
    case types.EDITCUBE_SET_FRAME_INDEX:
      return Cube.setFrameIndex(state,payload);
    case types.EDITCUBE_SET_COLORMAP_INDEX:
      return Cube.setColormapIndex(state,payload);
    default:
      return state;
  }
}
