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
    address: '',
    permissionOK: false
  }

  checkPermission = () => {
    axios.defaults.withCredentials = true
    axios({
      method: 'post',
      url: 'http://210.117.211.208:36002/path/' + this.props.match.params.path
    })
      .then((response) => {
        if (response.data.success) {
          this.setState({ permissionOK: true })
        }
        else {
          alert("wrong password");
          this.props.history.push(this.props.match.params.path + '/auth')
        }
      })
      .catch((error) => {
        console.log(error)
        alert("error occured. check console log");
      })
  }

  getStaticFile = (address) => {
    fetch(address)
      .then((response) => response.clone().blob())
      .then(blob => {
        this.setState({
          address: address,
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

    if (frameDataType === 'text/csv' || frameDataType === 'text/plain') {
      return <CsvViewer file={frameData} delimiter={ frameDataType === 'text/plain' ? String.fromCharCode(9) : String.fromCharCode(44) } />
    }
    if (frameDataType === 'text/html') {
      return <Iframe src={this.state.address} width="100%" height="100%" />
    }
    if (frameDataType === 'image/png') {
      return (
        <div width="100%" height="100%">
          <img src={frameDataURL} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
      )
    }
    return <Iframe src={frameDataURL} width="100%" height="100%" />
  }

  render() {
    const home_etc = (
      <div style={{marginTop: '5vh'}}>
        {this.state.clickedNav === 'Home' ? <Home  className='homeCover' /> : <Download /> }
      </div>)

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
        {(this.state.clickedNav === 'Home' || this.state.clickedNav === 'etc') ? home_etc : others}
      </div>
    );
  }
}