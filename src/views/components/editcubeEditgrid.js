import {connect} from 'react-redux';
import {selectors as editCubeSel,operations} from 'state/ducks/editcube/'
import * as UI from 'state/ducks/ui'
import Editgrid from './editgrid';


const mapStateToPropsXY = (state,ownProps) => {
  return {
    color:ownProps.color,
    width:editCubeSel.getSize(state).x,
    height:editCubeSel.getSize(state).y,
    frameSize:editCubeSel.getSize(state),
    frame:editCubeSel.getCurrentFrame(state).data,
    colormap:editCubeSel.getCurrentColormap(state).data,
    getPos:(h,v)=>[h,v,editCubeSel.getEditIndexZ(state)]
  }
}
const mapStateToPropsXZ = (state,ownProps) => {
  return {
    color:ownProps.color,
    width:editCubeSel.getSize(state).x,
    height:editCubeSel.getSize(state).z,
    frameSize:editCubeSel.getSize(state),
    frame:editCubeSel.getCurrentFrame(state).data,
    colormap:editCubeSel.getCurrentColormap(state).data,
    getPos:(h,v)=>[h,editCubeSel.getEditIndexY(state),v]
  }
}
const mapStateToPropsYZ = (state,ownProps) => {
  return {
    color:ownProps.color,
    width:editCubeSel.getSize(state).y,
    height:editCubeSel.getSize(state).z,
    frameSize:editCubeSel.getSize(state),
    frame:editCubeSel.getCurrentFrame(state).data,
    colormap:editCubeSel.getCurrentColormap(state).data,
    getPos:(h,v)=>[editCubeSel.getEditIndexX(state),v,h]
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onMouseDownCallback: (e,x,y,z) => {
      switch (e.button) {
        case 0: //leftclick
          // console.log("leftclick",x,y,z);
          dispatch(operations.drawWithPrimaryColor(x,y,z))
          break;
        case 1: //middleclick
          // console.log("middleclick",x,y,z);
          break;
        case 2://rightclick
          // console.log("rightclick",x,y,z);
          dispatch(operations.drawWithSecondaryColor(x,y,z))
          break;
        default:
      }
      e.preventDefault()
    }
  }
}

const EditcubeEditgridXY = connect(
  mapStateToPropsXY,
  mapDispatchToProps
)(Editgrid)
const EditcubeEditgridXZ = connect(
  mapStateToPropsXZ,
  mapDispatchToProps
)(Editgrid)
const EditcubeEditgridYZ = connect(
  mapStateToPropsYZ,
  mapDispatchToProps
)(Editgrid)

export {
  EditcubeEditgridXY,
  EditcubeEditgridXZ,
  EditcubeEditgridYZ
};
