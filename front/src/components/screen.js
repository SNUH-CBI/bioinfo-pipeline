import React from 'react';
import { Spinner } from 'react-bootstrap'
import { Home, Download, DEGviewer, GSAviewer } from './screenElements'
import Iframe from 'react-iframe'

export default class Screen extends React.Component {
  static defaultProps = {
    clickedValue: '',
    clickedNav: 'Home',
    loading: false
  }

  state = {
    frameData: '',
    frameDataURL: '',
    loading: false
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.clickedValue !== this.props.clickedValue) {
      this.setState({ loading: true })
      fetch(this.props.clickedValue)
        .then((response) => response.clone().blob())
        .then(blob => {
          this.setState({
            frameData: blob,
            frameDataURL: URL.createObjectURL(blob),
            loading: false
          })
        })
        .catch((error) => {
          alert('error occured in getStaticFile')
          console.log(error)
        })
    }
  }

  screenShow = () => {
    const frameData = this.state.frameData
    console.log(frameData)
    if (this.state.loading) return <Spinner animation='border' style={{ margin: '5vh 5vw' }} />
    else return <DEGviewer file={frameData} delimiter={frameData.type === 'text/plain' ? String.fromCharCode(9) : String.fromCharCode(44)}/>

    const frameDataType = frameData.type
    const frameDataURL = this.state.frameDataURL
    if (this.state.loading) return <Spinner animation='border' style={{ margin: '5vh 5vw' }} />
    else if (this.props.clickedNav === 'Home')
      return <Home
        history={this.props.history}
        match={this.props.match} />
    else if (this.props.clickedNav === 'Download')
      return <Download />
    else if (frameDataType === 'text/html') {
      return <Iframe src={this.props.clickedValue} width="100%" height="100%" />
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
  }



  render() {
    return this.screenShow()




    // gsa, degviewer에서 재사용할수도있음
    // return <CsvViewer file={frameData} delimiter={frameDataType === 'text/plain' ? String.fromCharCode(9) : String.fromCharCode(44)} />
    // const frameData = this.state.frameData

  }
}