import React from 'react';
import axios from 'axios';
import Iframe from 'react-iframe'
import { CsvViewer, Navbar, Sidebar, Home, Download } from './../components'

export default class Directory extends React.Component {
  state = {
    clickedNav: 'Home',
    frameData: '',
    frameDataType: '',
    frameDataURL: '',
    frameAddress: '',
    permissionOK: true,
    infoData: {}
  }

  componentDidMount = () => {
    axios.defaults.withCredentials = true
    axios({
      method: 'GET',
      url: 'http://210.117.211.208:36002/info',
      params: {
        project: 'pipeline-test/pipeline'
      }
    })
      .then((response) => {
        this.setState({ infoData: response.data })
      })
      .catch((error) => {
        if(error.response.status === 401) {
          alert('No session. Redirect to auth page(401)')
          this.props.history.push(this.props.match.params.path + '/auth')
        }
        else if(error.response.status === 400) {
          alert('Wrong project name. Redirect to auth page(400)')
          this.props.history.push(this.props.match.params.path + '/auth')
        }
      })
  }

  getStaticFile = (address) => {
    fetch(address)
      .then((response) => response.clone().blob())
      .then(blob => {
        this.setState({
          frameAddress: address,
          frameDataType: blob.type,
          frameData: blob,
          frameDataURL: URL.createObjectURL(blob)
        })
      })
      .catch((error) => { console.log(error) })
  }

  handleNavbarClick = (e) => {
    this.setState({ clickedNav: e })
  }

  screen = () => {
    const frameData = this.state.frameData
    const frameDataType = this.state.frameDataType
    const frameDataURL = this.state.frameDataURL

    if (frameDataType === 'text/csv' || frameDataType === 'text/plain' || frameDataType === 'application/octet-stream') {
      return <CsvViewer file={frameData} delimiter={frameDataType === 'text/plain' ? String.fromCharCode(9) : String.fromCharCode(44)} />
    }
    if (frameDataType === 'text/html') {
      return <Iframe src={this.state.frameAddress} width="100%" height="100%" />
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

  render() {
    const others = (
      <div className="mainwindow" >
        <div style={{ overflowY: 'auto', maxHeight: '95vh', height: '95vh' }}>
          <Sidebar clickedNav={this.state.clickedNav} getStaticFile={this.getStaticFile} />
        </div>
        <div className="fileView" >
          <div className="fileViewDetail" >
            <this.screen />
          </div>
        </div>
      </div>
    )
    
    return (
      <div className="directory">
        <Navbar handleOnClick={this.handleNavbarClick} />
        {(this.state.clickedNav === 'Home' || this.state.clickedNav === 'etc') ?
          (this.state.clickedNav === 'Home' ?
            <div><Home infoData={this.state.infoData}/></div> :
            <Download />) :
          others}
      </div>
    );
  }
}