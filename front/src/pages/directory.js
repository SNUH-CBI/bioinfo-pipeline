import React from 'react';

export default class Directory extends React.Component {
  render(){
    return (
      <div>
        <h2>
          { this.props.match.params.path }
        </h2>
      </div>
    );
  }
}