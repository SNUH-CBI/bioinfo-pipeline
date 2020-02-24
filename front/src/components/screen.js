import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap'
import { Home, Download, DEGviewer, GSAviewer } from './screenElements'
import config from './../config/config.json'
import Iframe from 'react-iframe'

const Screen = props => {
  const [frameData, setFrameData] = useState('')
  const [frameDataURL, setFrameDataURL] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (props.clickedElement !== '') {
      setLoading(true)
      fetch(config.backend + '/static/' + config.project_path + props.clickedElement)
        .then((response) => {return response.clone().blob()})
        .then(blob => {
          setFrameData(blob)
          setFrameDataURL(URL.createObjectURL(blob))
          setLoading(false)
        })
    }
    return () => { }
  }, [props.clickedElement])

  const frameDataType = frameData.type

  if (loading) return <Spinner animation='border' style={{ margin: '5vh 5vw' }} />
  else if (props.clickedNav === 'Home')
    return <Home
      history={props.history}
      match={props.match} />
  else if (props.clickedNav === 'Download')
    return <Download />
  else if (frameDataType === 'text/html') {
    return <Iframe src={config.backend + '/static/' + config.project_path + props.clickedElement} width="100%" height="100%" />
  }
  else if (frameDataType === 'image/png') {
    return (
      <div width="100%" height="100%">
        <img src={frameDataURL} style={{ height: '95vh' }} alt="nothing" />
      </div>
    )
  }
  else if (frameDataType === 'text/csv' || frameDataType === 'text/plain' || frameDataType === 'application/octet-stream') {
    return <DEGviewer file={frameData} />
  }
  else return <Iframe src={frameDataURL} width="100%" height="100%" />
  // return <CsvViewer file={frameData} delimiter={frameDataType === 'text/plain' ? String.fromCharCode(9) : String.fromCharCode(44)} />
}

export default Screen