import React from 'react';
import { Button } from 'react-bootstrap'
import { CsvViewer } from '../screenElements'
import config from './../../config/config.json'

export default class DEGviewer extends React.Component {
  state = {genes: 0}

  setGenes = (genes) => {
    this.setState({genes: genes})
  }

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
      <div className='d-flex flex-column' style={{ margin: '10px' }}>
        <div className='d-flex flex-row' style={{justifyContent: 'center'}}>
          <h3>Genes: {this.state.genes} (Benjamini-hotchberg &lt; 0.05)</h3>
          <Button onClick={this.download} style={{ width: 'fit-content', height: 'auto'}} variant='link'>download All {label} data</Button>
        </div>
        <div className='d-flex flex-row' style={{ alignItems: 'center' }}>
        </div>
        <img src='./sampleFiles/DESeq2_count_vcPlot.png' alt="nothing" style={{ width: 'auto', height: '700px' }} />
        <CsvViewer file={this.props.file} />

      </div>
    )
  }
}