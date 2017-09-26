import React from 'react';
import {connect} from 'react-redux';
import * as editCube from 'state/ducks/editcube/'
import {ButtonSlider} from './gui'

const component = (props) => {
  return <div>
    <ButtonSlider name="X" color="red" min="0" value={props.x} max={props.size.x-1} onValueChange={props.onXChange} />
    <ButtonSlider name="Y" color="green" min="0" value={props.y} max={props.size.y-1} onValueChange={props.onYChange} />
    <ButtonSlider name="Z" color="blue" min="0" value={props.z} max={props.size.z-1} onValueChange={props.onZChange} />
  </div>
}

const mapStateToProps = state => {
  // console.log(state.editcube,Cube.getCurrentFrame(state.editcube),Cube.getCurrentColormap(state.editcube));
  return {
    x:editCube.selectors.getEditIndexX(state),
    y:editCube.selectors.getEditIndexY(state),
    z:editCube.selectors.getEditIndexZ(state),
    size:editCube.selectors.getSize(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onXChange: newX => {
      // console.log(e.target.value);
      dispatch(editCube.operations.setEditIndexX(newX))
    },
    onYChange: newY => {
      dispatch(editCube.operations.setEditIndexY(newY))
    },
    onZChange: newZ => {
      dispatch(editCube.operations.setEditIndexZ(newZ))
    },
  }
}

const Editcube3DView = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Editcube3DView;
