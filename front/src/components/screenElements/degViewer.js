import React from 'react';
import { Button } from 'react-bootstrap'
import { CsvViewer } from '../screenElements'
import config from './../../config/config.json'

export default class DEGviewer extends React.Component {

  download = () => {
    setTimeout(() => {
      const response = {
        file: config.backend + '/static/' + config.project_path + this.props.allCountDataURL,
      }
      window.open(response.file)
    }, 100)
  }
  
  static defaultProps = { frameData: '', allCountDataURL: '' }

  render() {
    console.log(this.props)
    return (
      <div className='d-flex flex-column' style={{margin: '20px 20px'}}>
        <div className='d-flex flex-row'>
          <div className='d-flex flex-column' style={{alignItems: 'center'}}>
            <h1>Result of DESeq2</h1>
            <br />
            <Button onClick={this.download} style={{width: '300px'}}>download<br/>{this.props.allCountDataURL}</Button>
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