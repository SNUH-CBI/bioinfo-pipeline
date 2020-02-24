import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap'
import { Home, Download, DEGviewer, GSAviewer, SampleCorrViewer } from './screenElements'
import config from './../config/config.json'
import Iframe from 'react-iframe'

const Screen = props => {
  const elementURL = config.backend + '/static/' + config.project_path + props.clickedElement
  const [frameData, setFrameData] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
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

  if (loading) return <Spinner animation='border' style={{ margin: '5vh 5vw' }} />
  else switch (props.clickedNav) {
    case 'Home':
      return <Home history={props.history} match={props.match} />
    case 'Raw_fastQC':
    case 'Filtered_fastQC':
    case 'RSEM_UCSC':
    case 'Qualimap_UCSC':
      return <Iframe src={elementURL} width="100%" height="100%" />
    case 'Sample_Correlation':
      return <SampleCorrViewer />
    case 'DEG':
      return <DEGviewer file={frameData} />
    case 'GSA':
      return <GSAviewer />
    case 'Download':
      return <Download />
    default:
      return <div>nothing</div>
  }
  // return <CsvViewer file={frameData} delimiter={frameDataType === 'text/plain' ? String.fromCharCode(9) : String.fromCharCode(44)} />
}

export default Screen