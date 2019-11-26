import React from 'react';
import Password from '../component/password';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

export default class Authorization extends React.Component {
  state = { success: false }
  handleCreate = (data) => {
    axios.defaults.withCredentials = true
    axios({
      method: 'post',
      url: 'http://localhost:4000/auth/' + this.props.match.params.path,
      data: {
        password: data.password
      }
    })
      .then((response) => {
        if (response.data.success) {
          console.log(response);
          alert("session created");
          this.setState({success:true})
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

  isSuccess = () => {
    if (this.state.success) {
      alert("go to " + this.props.match.params.path)
      return <Redirect to={"../" + this.props.match.params.path} />
    }
    else return <br />;
  }

  render() {
    return (
      <div>
        <h2>AUTHORIZATION</h2>
        <this.isSuccess />
        <Password onCreate={this.handleCreate} />
        <Link to="/asd">go /asd</Link>
      </div>
    );
  }
}