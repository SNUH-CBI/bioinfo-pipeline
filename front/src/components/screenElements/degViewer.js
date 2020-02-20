import React from 'react';
import { Button } from 'react-bootstrap'
import { CsvViewer } from '../screenElements'

export default class DEGviewer extends React.Component {
  static defaultProps = { frameData: '' }

  render() {
    return (
      <div className='d-flex flex-column' style={{margin: '20px 20px'}}>
        <div className='d-flex flex-row'>
          <div className='d-flex flex-column'>
            <h1>Result of DESeq2</h1>
            <br />
            <Button >download<br/>all count data</Button>
            <br />
            <div style={{ border: '1px solid black', whiteSpace: 'nowrap', margin: '10px 10px', padding: '10px 10px' }}>
              <h5>significant deg box</h5>
              <h2>00 out of 00</h2>
              <h3>satisfied cutoff Benjamini &lt; 0.05</h3>
            </div>
            <br/>
          <img src='DESeq2_count_vcPlot.png' alt="nothing" style={{ width: 'auto', height: '50vh' }}/>
          </div>
            <CsvViewer file={this.props.file} />
        </div>
      </div>
    )
  }
}