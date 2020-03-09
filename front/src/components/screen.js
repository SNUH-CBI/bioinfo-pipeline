import React from 'react';
import { Spinner } from 'react-bootstrap'
import { Home, Download, DEGviewer, GSAviewer, SampleCorrViewer } from './screenElements'
import config from './../config/config.json'
import Iframe from 'react-iframe'

export default class Screen extends React.Component {
  state = { frameData: '', loading: false }

  shouldComponentUpdate = (nextProps, nextState) => {
    const clickedElement = this.props.clickedElement
    if (clickedElement !== nextProps.clickedElement && nextProps.clickedElement !== '') {
      const elementURL = config.backend + '/static/' + config.project_path + nextProps.clickedElement
      fetch(elementURL)
        .then((response) => response.clone().blob())
        .then(blob => { this.setState({ frameData: blob }) })
    }
    if (this.props.clickedNav === 'Home' || this.props.clickedNav === 'Download') return true
    else if (this.state.frameData === nextState.frameData) return false
    else return true
  }

  makeScreen = (props) => {
    const frameData = this.state.frameData
    switch (props.clickedNav) {
      case 'Home':
        return <Home history={props.history} match={props.match} />
      case 'Raw_fastQC':
      case 'Filtered_fastQC':
      case 'RSEM_UCSC':
      case 'Qualimap_UCSC':
        return <Iframe src={config.backend + '/static/' + config.project_path + props.clickedElement} width="100%" height="100%" />
      case 'Sample_Correlation':
        return <SampleCorrViewer sidebar={props.sidebar} />
      case 'DEG':
        let allCountDataURL = ''
        props.sidebar.some((category) => {
          category.children.some((v, i) => {
            if (category.children[i - 1] !== undefined && v['value'] === props.clickedElement) {
              allCountDataURL = config.backend + '/static/' + config.project_path + category.children[i - 1]['value']
              return true
            }
          })
          if (allCountDataURL !== '') return true
        })
        return <DEGviewer file={frameData} allCountDataURL={allCountDataURL} />
      case 'GSA':
        return <GSAviewer file={frameData} />
      case 'Download':
        return <Download />
      default:
        return <Spinner animation='border' style={{ margin: '5vh 5vw' }} />
    }
  }

  render() {
    return (this.makeScreen(this.props))
  }
}