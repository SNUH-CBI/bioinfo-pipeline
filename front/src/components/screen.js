import React from 'react';
import { Spinner } from 'react-bootstrap'
import { Home, Download, DEGviewer, GSAviewer, SampleCorrViewer } from './screenElements'
import config from './../config/config.json'
import Iframe from 'react-iframe'

export default class Screen extends React.Component {
  state = { frameData: '', loading: false }

  shouldComponentUpdate = (                                                                                                                                                                                                                                                                                                           nextProps, nextState) => {
    const clickedElement = this.props.clickedElement.value

    if (clickedElement !== nextProps.clickedElement.value && nextProps.clickedElement.value !== '') {
      const elementURL = config.backend + '/static/' + config.project_path + nextProps.clickedElement.value
      fetch(elementURL)
        .then((response) => response.clone().blob())
        .then(blob => { this.setState({ frameData: blob }) })
    }
    if (this.props.clickedNav === 'Home' || this.props.clickedNav === 'Download') return true
    else if (this.state.frameData === nextState.frameData) return false
    else return true
  }

  getFrameURL = (element) => {
    return config.backend + '/static/' + config.project_path + element
  }

  makeScreen = (props) => {
    const frameData = this.state.frameData
    const frameURL = config.backend + '/static/' + config.project_path + props.clickedElement.value
    switch (props.clickedNav) {
      case 'Home':
        return <Home history={props.history} match={props.match} />
      case 'Raw_fastQC':
      case 'Filtered_fastQC':
      case 'RSEM_UCSC':
      case 'Qualimap_UCSC':
        return <Iframe src={frameURL} width="100%" height="100%" />
      case 'Sample_Correlation':
        return <SampleCorrViewer sidebar={props.sidebar} />
      case 'DEG':
        let allCountDataURL = ''
        props.sidebar.some((category) => {
          category.children.some((v, i) => {
            if (category.children[i - 1] !== undefined && v['value'] === props.clickedElement.value) {
              allCountDataURL = category.children[i - 1]['value']
              return true
            }
          })
          if (allCountDataURL !== '') return true
        })
        return <DEGviewer file={frameData} allCountDataURL={allCountDataURL} elemData={props.clickedElement} />
      case 'GSA':
        // if (props.sidebar[1] !== undefined) console.log(props.sidebar[1].children)
        if (this.state.frameData.type !== 'text/html') {
          return (
            <div className='d-flex flex-column' style={{ marginLeft: '50px' }} >
              {/*
              <div className='d-flex flex-row'>
                <GSAviewer file={frameData} />
                <GSAviewer file={frameData} />
              </div>
              <div className='d-flex flex-row'>
                <GSAviewer file={frameData} />
                <GSAviewer file={frameData} />
              </div>*/}
              <GSAviewer file={frameData} clickedElement={props.clickedElement.value}  />
            </div>
          )
        }
        else {
          return <Iframe src={frameURL} width="100%" height="100%" />
        }
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