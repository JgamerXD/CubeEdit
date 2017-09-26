import React from 'react';
import {connect} from 'react-redux';
import * as cube from 'state/ducks/editcube/'
import GL3DView from './3dview';

import Palette from './palette'
import ColorPicker from './colorPicker'


const ColorMangerComponent = props => {
  return <div className="container bordered">
    <ColorPicker colors={props.colors} primary={props.primary} secondary={props.secondary} setColormapColor={props.setColormapColor} />
    <Palette colors={props.colors} selectColor={props.selectColor} />
  </div>
}

const mapStateToProps = state => {
  // console.log(state.editcube,Cube.getCurrentFrame(state.editcube),Cube.getCurrentColormap(state.editcube));
  return {
    colors:cube.selectors.getCurrentColormap(state).data,
    primary:cube.selectors.getPrimaryEditColor(state),
    secondary:cube.selectors.getSecondaryEditColor(state)
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    selectColor: (secondary,index) => {
      if(secondary) {
        dispatch(cube.operations.setSecondaryColor(index));
        return;
      }
      else {
        dispatch(cube.operations.setPrimaryColor(index));
        return;
      }
    },
    setColormapColor: (index,color) => {
      dispatch(cube.operations.setCurrentColormapColor(index,color));
    }
  }
}

const ColorManager = connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorMangerComponent)

export default ColorManager;
