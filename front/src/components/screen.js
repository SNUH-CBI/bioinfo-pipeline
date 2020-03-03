import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap'
import { Home, Download, DEGviewer, GSAviewer, SampleCorrViewer } from './screenElements'
import config from './../config/config.json'
import Iframe from 'react-iframe'

const Screen = props => {
  const [frameData, setFrameData] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const elementURL = config.backend + '/static/' + config.project_path + props.clickedElement
    if (props.clickedElement !== '') {
      setLoading(true)
      fetch(elementURL)
        .then((response) => { return response.clone().blob() })
        .then(blob => {
          setFrameData(blob)
          setLoading(false)
        })
    }
    return () => { }
  }, [props.clickedElement])

  try {
    if (loading) return <Spinner animation='border' style={{ margin: '5vh 5vw' }} />
    else {
      switch (props.clickedNav) {
        case 'Home':
          return <Home history={props.history} match={props.match} />
        case 'Raw_fastQC':
        case 'Filtered_fastQC':
        case 'RSEM_UCSC':
        case 'Qualimap_UCSC':
          return <Iframe src={config.backend + '/static/' + config.project_path + props.clickedElement} width="100%" height="100%" />
        case 'Sample_Correlation':
          return <SampleCorrViewer />
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
          return <div>nothing</div>
      }
    }
  }
  catch (e) {
    return <div></div>
  }
}

Screen.defaultProps = { sidebar: [] }

export default Screen