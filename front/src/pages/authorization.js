import React from 'react';
import Password from '../component/password';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

export default class Authorization extends React.Component {
  handleCreate = (data) => {
    axios({
      method: 'post',
      url: 'http://210.117.211.208:36002/auth/asdf',
      data: {
        password: data.password
      }
    })
    .then((response) => {
      if(response.success) {  
      console.log(response);
      alert("session created");
      return <Redirect to='/asdf'/>
      }
      else {
        console.log(response)
        alert("wrong password");
      }
    })
    .catch((error) => {
      console.log(error);
      alert("error");
    })
  }

  render(){
    return (
      <div>
        <h2>AUTHORIZATION</h2>
        <Password onCreate={this.handleCreate} />
        <Link to="/asd">go /asd</Link>
      </div>
    );
  }
}