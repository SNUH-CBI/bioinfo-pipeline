import React from 'react';
import { Button } from 'react-bootstrap'

export default class DEGviewer extends React.Component {
  render() {
    return (
      <div className='d-flex flex-column'>
        <div className='d-flex flex-row'>
          <div className='d-flex flex-column'>
            <div>Result of DESeq2</div>
            <Button>download all count data</Button>
            <div style={{border: '1px solid black'}}>significant deg box</div>
          </div>
          <img src={'./temp.png'} alt="nothing" />
        </div>
        <div>csv</div>
      </div>
    )
  }
}