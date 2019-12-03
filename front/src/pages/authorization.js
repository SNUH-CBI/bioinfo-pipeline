import React from 'react';
import Password from '../component/password';
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
          alert("session created");
          this.setState({success:true})
          this.props.history.push("/"+this.props.match.params.path)
        }
        else {
          alert("wrong password");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("error");
      })
  }

  render() {
    return (
      <div>
        <h2>AUTHORIZATION</h2>
        <Password onCreate={this.handleCreate} />
      </div>
    );
  }
}