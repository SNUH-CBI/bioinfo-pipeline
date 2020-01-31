import React from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import config from './../config/config.json'

export default class Authorization extends React.Component {

  state = { success: false, password: '' }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ password: e.target.value })
  }

  handleClick = (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true
    axios({
      method: 'post',
      url: config.backend + '/auth',
      params: {
        project: 'pipeline-test/pipeline'
      },
      data: {
        password: this.state.password
      }
    })
      .then((response) => {
        if (response.data.success) {
          alert("session created");
          this.setState({ success: true })
          this.props.history.push("/" + this.props.match.params.path)
        }
        else {
          alert("wrong password");
          this.setState({password: ''})
        }
      })
      .catch((error) => {
        console.log(error);
        alert("error");
        this.setState({password: ''})
      })
  }



  render() {
    return (
      <div className="authDiv">
        <Form className="AUTHORIZATION">
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Authorization<br/>Go to {this.props.match.params.path}</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={this.handleChange}
              value={this.state.password} />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={this.handleClick}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}