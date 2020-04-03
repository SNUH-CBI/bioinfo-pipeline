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
    let label = ''
    if (typeof this.props.elemData.label === 'string')
      label = (this.props.elemData.label.split(" ")[0])
    return (
      <div className='d-flex flex-row' style={{ margin: '10px' }}>
        <div className='d-flex flex-column' style={{ alignItems: 'center' }}>
          <h2>00 out of 00 s.t. cutoff Benjamini &lt; 0.05</h2>
          <CsvViewer file={this.props.file} />
        </div>

        <div className='d-flex flex-column' style={{ margin: '10px', alignItems: 'center' }}>
          <div className='d-flex flex-row' style={{ alignItems: 'center' }}>
            <Button onClick={this.download} style={{ width: '150px', height: 'fit-content', padding: '10px' }}>download<br />All {label} data</Button>
          </div>
          <img src='DESeq2_count_vcPlot.png' alt="nothing" style={{ width: 'auto', height: '50vh' }} />
        </div>
      </div>
    )
  }
}