import React from 'react';
import { Navbar, Sidebar, Screen } from './../components'

export default class Directory extends React.Component {
  state = {
    clickedNav: 'Home',
    clickedValue: ''
  }

  handleNavbarClick = (v) => {
    this.setState({ clickedNav: v })
  }

  handleSidebarClick = (v) => {
    this.setState({ clickedValue: v })
  }

  render() {
    return (
      <div className="directory">
        <Navbar handleOnClick={this.handleNavbarClick} />
        <div className="mainwindow" >
          <Sidebar
            clickedNav={this.state.clickedNav}
            handleSidebarClick={this.handleSidebarClick}
            //use for redirecting auth page
            history={this.props.history}
            match={this.props.match}
          />
          <div className="fileView" >
              <div className='fileViewDetail'>
            <Screen
              clickedNav={this.state.clickedNav}
              loading={this.state.loading}
              clickedValue={this.state.clickedValue}
              //use for redirecting auth page
              history={this.props.history}
              match={this.props.match}
            />
            </div>
          </div>
        </div>
      </div>
    );
  }
}