import React from 'react';
import {getHtmlColor,fromHtmlColor,debounce} from 'utils'

export default class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.setPrimaryColor = debounce(val => {;
        this.props.setColormapColor(this.props.primary,fromHtmlColor(val))
      },100);
    this.setSecondaryColor = debounce(val => {
        this.props.setColormapColor(this.props.secondary,fromHtmlColor(val))
      },100);
  }
  render() {
    const pc = getHtmlColor(this.props.colors[this.props.primary])
    const sc = getHtmlColor(this.props.colors[this.props.secondary])
    return <div className="container" style={{widht:"100%",height:"50px"}}>
      <input type="color" value={pc} onChange={e => this.setPrimaryColor(e.target.value)} style={{position:"absolute",top:"5px",left:"5px", zIndex:1, width:"60%", height:"35px", padding:0}} />
      <input type="color" value={sc} onChange={e => this.setSecondaryColor(e.target.value)} style={{position:"absolute",bottom:"5px",right:"5px", zIndex:0, width:"60%", height:"35px", padding:0}} />
    </div>
  }


}
