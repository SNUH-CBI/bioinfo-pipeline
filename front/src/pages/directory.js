import React from 'react';
import axios from 'axios';
import { Navbar, Sidebar, Home, Download, Screen } from './../components'
import config from './../config/config.json'

export default class Directory extends React.Component {
  state = {
    clickedNav: 'Home',
    frameData: '',
    frameDataURL: '',
    frameAddress: '',
    infoData: {},
    loading: false
  }

  componentDidMount = () => {
    axios.defaults.withCredentials = true
    axios({
      method: 'GET',
      url: config.backend + '/info',
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
    this.setState({ loading: true })
    fetch(address)
      .then((response) => response.clone().blob())
      .then(blob => {
        this.setState({
          frameAddress: address,
          frameData: blob,
          frameDataURL: URL.createObjectURL(blob),
          loading: false
        })
      })
      .catch((error) => { console.log(error) })
  }

  handleNavbarClick = (e) => {
    this.setState({ clickedNav: e })
  }

  render() {
    const others = (
      <div className="mainwindow" >
        <div style={{ overflowY: 'auto', maxHeight: '95vh', height: '95vh' }}>
          <Sidebar clickedNav={this.state.clickedNav} getStaticFile={this.getStaticFile} />
        </div>
        <div className="fileView" >
          <div className="fileViewDetail" >
            <Screen
              frameAddress={this.state.frameAddress}
              frameData={this.state.frameData}
              frameDataURL={this.state.frameDataURL}
              loading={this.state.loading} />
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