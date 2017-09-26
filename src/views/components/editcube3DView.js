import {connect} from 'react-redux';
import * as cube from 'state/ducks/editcube/'
// import * as UI from 'state/ducks/ui'
import GL3DView from './3dview';


const mapStateToProps = state => {
  return {
    size:state.editcube.size,
    frame:cube.selectors.getCurrentFrame(state).data,
    colormap:cube.selectors.getCurrentColormap(state).data,
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     onTodoClick: id => {
//       dispatch(toggleTodo(id))
//     }
//   }
// }

const Editcube3DView = connect(
  mapStateToProps
)(GL3DView)

export default Editcube3DView;
