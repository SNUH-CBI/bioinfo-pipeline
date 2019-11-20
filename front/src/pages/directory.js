import React from 'react';
import { Redirect } from 'react-router-dom';

export default class Directory extends React.Component {
  isCookie = () => {
    if (this.props.cookie.biopipe !== 'pw') {
      alert("wrong pw for this page")
      return <Redirect to={this.props.match.params.path + '/auth'} />
    }
    else return <h2>Directory Listing Here</h2>
  }
  render() {
    console.log(this.props)
    return (
      <div>
        <this.isCookie />
      </div>
    );
  }
}