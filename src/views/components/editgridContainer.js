import React from 'react';

import '../css/style.css'

import EditIndex from './editIndex'
import {EditcubeEditgridXY,EditcubeEditgridXZ,EditcubeEditgridYZ} from './editcubeEditgrid'

export default (props) => {
  return <div style={props.style}><div className="editgridContainer">
      <EditIndex />
      <EditcubeEditgridXY color="blue" />
      <EditcubeEditgridXZ color="green" />
      <EditcubeEditgridYZ color="red" />
  </div></div>

}
