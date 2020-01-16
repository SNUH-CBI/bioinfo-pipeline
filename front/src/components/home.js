import React from 'react';

export default class Home extends React.Component {
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
            <td className='even'>/home2/kwangsookim_lab/heonyi_lee/data2/cas_ctrl_info.txt</td>
          </tr>
        </tbody>
      </table>
    )
  }
}