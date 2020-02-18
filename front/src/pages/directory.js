import React, { useState } from 'react';
import { Navbar, Sidebar, Screen } from './../components'

const Directory = (props) => {
  const [clickedNav, setClickedNav] = useState('Home')
  const [clickedValue, setClickedValue] = useState('')
  const handleNavbarClick = (v) => {
    setClickedNav(v)
  }
  const handleSidebarClick = (v) => {
    setClickedValue(v)
  }
  return (
    <div className="directory">
      <Navbar handleOnClick={handleNavbarClick} />
      <div className="mainwindow" >
        <Sidebar
          clickedNav={clickedNav}
          handleSidebarClick={handleSidebarClick}
          //use for redirecting auth page
          history={props.history}
          match={props.match}
        />
        <div className="fileView" >
          <div className='fileViewDetail'>
            <Screen
              clickedNav={clickedNav}
              clickedValue={clickedValue}
              //use for redirecting auth page
              history={props.history}
              match={props.match}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Directory