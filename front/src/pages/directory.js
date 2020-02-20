import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, Screen } from './../components'
import axios from 'axios'
import config from './../config/config.json'

const Directory = (props) => {
  const [clickedNav, setClickedNav] = useState('Home')
  const [sidebar, setSidebar] = useState([])
  const [clickedElement, setClickedElement] = useState('')

  useEffect(() => {
    if (clickedNav === 'Home' || clickedNav === 'Download') {
      setSidebar([])
    }
    else {
      axios.defaults.withCredentials = true
      axios({
        method: 'get',
        url: config.backend + '/directory',
        params: {
          project: config.project_path,
          menu: clickedNav
        }
      })
        .then((response) => {
          setSidebar(response.data)
        })
        .catch((error) => {
          if (error.response === undefined) {
            alert('No response. Redirect to auth page')
            props.history.push(props.match.params.path + '/auth')
          }
          else if (error.response.status === 401) {
            alert('No session. Redirect to auth page(401)')
            props.history.push(props.match.params.path + '/auth')
          }
          else if (error.response.status === 400) {
            alert('Wrong project name. Redirect to auth page(400)')
            props.history.push(props.match.params.path + '/auth')
          }
        })
    }
    return ()=>{}
  }, [clickedNav]);
  return (
    <div className="directory">
      <Navbar 
      setClickedNav={setClickedNav}
      clickedNav={clickedNav}
       />
      <div className="mainwindow" >
        <Sidebar
          sidebar={sidebar}
          clickedNav={clickedNav}
          setClickedElement={setClickedElement}
          clickedElement={clickedElement}
          //use for redirecting auth page
          history={props.history}
          match={props.match}
        />
        <div className="fileView" >
          <div className='fileViewDetail'>
            <Screen
              clickedNav={clickedNav}
              clickedElement={clickedElement}
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