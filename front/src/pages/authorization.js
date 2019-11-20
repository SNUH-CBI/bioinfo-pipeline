import React from 'react';
import Password from '../component/password';
import { Link } from 'react-router-dom'

export default class Authorization extends React.Component {
  handleCreate = (data) => {
    if(data.password !== 'pw') alert("not correct")
    else {
      alert("cookie created")
      this.props.setCookie('biopipe',data.password, {path: '/'})
    }
  }

  render(){
    return (
      <div>
        <h2>AUTHORIZATION</h2>
        <Password onCreate={this.handleCreate} />
        <Link to="/asd">To /asd</Link>
      </div>
    );
  }
}