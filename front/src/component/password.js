import React from 'react';

export default class Password extends React.Component {
  state = {
    password: ''
  }
  handleChange = (e) => {
    this.setState({password: e.target.value})
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onCreate(this.state);
    this.setState({password: ''})
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          placeholder = 'password'
          value = {this.state.password}
          onChange = {this.handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    )
  }
}