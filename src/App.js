import React, { Component } from 'react';

import {Provider} from 'react-redux'

import {store} from 'state'


import CubeEditLogo from './views/components/cubeeditlogo.js';
import './App.css';
import FrameControl from 'views/components/frameControl';
import Editcube3DView from 'views/components/editcube3DView.js';
import {ColormapControlButtons, ButtonSlider} from 'views/components/gui.js';
import EditgridContainer from 'views/components/editgridContainer';
import ColorManager from 'views/components/colorManager';
// import {approach4x4internal,siren4x4internal} from './js/testcube.js';





// import {get} from './js/getfile.js';



class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="editview">
          <div className="header" style={{gridArea:"h"}}>
            <CubeEditLogo />
            <span>Cube Edit</span>
          </div>
          <Editcube3DView />
          {/* <img src={logo} style={is} alt="icon"></img> */}
          <div className="container" style={{gridArea:"fr"}}>
            <FrameControl />
          </div>
          <EditgridContainer style={{gridArea:"egc"}} />
          <div style={{gridArea:"p"}}>
            <ColorManager />
            <ColormapControlButtons  />
          </div>


        </div>
      </Provider>
    );
  }
  componentDidMount(){
    // get(test)
    // .then((v) => {console.log(v); this.setState({test:v})})
    // .catch(console.error);
  }
}



export default App;
