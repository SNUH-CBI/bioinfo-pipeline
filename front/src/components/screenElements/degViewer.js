import React from 'react';
import { Button } from 'react-bootstrap'
import { CsvViewer } from '../screenElements'

export default class DEGviewer extends React.Component {
  static defaultProps = {frameData: ''}

  componentDidUpdate = () => {
    console.log('update')
  }
  render() {
    return (
      <div className='d-flex flex-column'>
        <div className='d-flex flex-row'>
          <div className='d-flex flex-column'>
            <div>Result of DESeq2</div>
            <Button>download all count data</Button>
            <div style={{border: '1px solid black'}}><p>significant deg box<br/>00 out of 00<br/>satisfied cutoff Benjamini &lt; 0.05</p></div>
          </div>
          <img src='logo512.png' alt="nothing"/>
          <CsvViewer file={this.props.file}  />
        </div>
        
      </div>
    )
  }
}