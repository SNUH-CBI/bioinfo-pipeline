import React from 'react';

export default class Home extends React.Component {

  state = {
    ctrlCase : ''
  }


  ctrlCase = () => {
    fetch('./sampleFiles/case_ctrl_info.txt')
      .then(response => response.text())
      .then(text => text.split(String.fromCharCode('10')))
      .then((text) => this.setState({ctrlCase: text}))
      .catch((error) => console.log(error))
  }

  componentDidMount = () => {
    this.ctrlCase()
  }

  render() {
    return (
      <table className="type06">
        <thead>
          <tr>
            <th scope="row">프로젝트명</th>
            <td>Project 1</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="even">연구자명</th>
            <td className="even">yecnj</td>
          </tr>
          <tr>
            <th scope="row">의뢰날짜</th>
            <td>2020.01.09</td>
          </tr>
          <tr>
            <th scope="row" className='even'>Control case</th>
            <td className="even">Adamatinomatous_CRP/ctrl	Papillary_CRP</td>
          </tr>
        </tbody>
      </table>
    )
  }
}