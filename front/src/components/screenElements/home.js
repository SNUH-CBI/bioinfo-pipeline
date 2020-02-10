import React from 'react';
import axios from 'axios';
import config from './../../config/config.json'

export default class Home extends React.Component {

  state = {
    infoData: {
      project: '',
      manager: '',
      date: '',
      case: ''
    }
  }

  getInfoData = () => {
    axios.defaults.withCredentials = true
    axios({
      method: 'GET',
      url: config.backend + '/info',
      params: {
        project: 'pipeline-test/pipeline'
      }
    })
      .then((response) => {
        this.setState({ infoData: response.data })
      })
      .catch((error) => {
        if (error.response === undefined) {
          alert('No response. Redirect to auth page')
          this.props.history.push(this.props.match.params.path + '/auth')
        }
        else if (error.response.status === 401) {
          alert('No session. Redirect to auth page(401)')
          this.props.history.push(this.props.match.params.path + '/auth')
        }
        else if (error.response.status === 400) {
          alert('Wrong project name. Redirect to auth page(400)')
          this.props.history.push(this.props.match.params.path + '/auth')
        }
      })
  }

  componentDidMount = () => {
    this.getInfoData()
  }

  render() {
    const infoData = this.state.infoData
    return (
      <table className="type06">
        <thead>
          <tr>
            <th scope="row">project</th>
            <td>{infoData.project}</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="even">manager</th>
            <td className="even">{infoData.manager}</td>
          </tr>
          <tr>
            <th scope="row">date</th>
            <td>{infoData.date}</td>
          </tr>
          <tr>
            <th scope="row" className='even' rowSpan="4">Control case</th>
          </tr>
          {this.state.infoData.case
            .split(String.fromCharCode(10))
            .filter(index => index !== '')
            .map((index, key) => {
              return (
                <tr key={key}>
                  <td className='even'>{index}</td>
                </tr>
              )
            })}
        </tbody>
      </table>
    )
  }
}