import React from 'react';
import { Spinner } from 'react-bootstrap'
import CsvViewer from './screenElements/csvViewer'
import Iframe from 'react-iframe'

export default class Screen extends React.Component {
  render() {
    if (this.props.loading) return <Spinner animation='border' style={{ margin: '5vh 5vw' }} />
    const frameData = this.props.frameData
    const frameDataType = frameData.type
    const frameDataURL = this.props.frameDataURL

    if (frameDataType === 'text/csv' || frameDataType === 'text/plain' || frameDataType === 'application/octet-stream') {
      return <CsvViewer file={frameData} delimiter={frameDataType === 'text/plain' ? String.fromCharCode(9) : String.fromCharCode(44)} />
    }
    if (frameDataType === 'text/html') {
      return <Iframe src={this.props.frameAddress} width="100%" height="100%" />
    }
    if (frameDataType === 'image/png') {
      return (
        <div width="100%" height="100%">
          <img src={frameDataURL} style={{ height: '95vh' }} alt="nothing" />
        </div>
      )
    }
    return <Iframe src={frameDataURL} width="100%" height="100%" />
  }
}