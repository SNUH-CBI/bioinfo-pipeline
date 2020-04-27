import React from 'react';
import axios from 'axios';
import config from './../../config/config.json'

export default class Home extends React.Component {

  state = {
    infoData: {
      project: '',
      manager: '',
      date: '',
      info: {}
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
            <th scope="row">Project</th>
            <td>{infoData.project}</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="even">Manager</th>
            <td className="even">{infoData.manager}</td>
          </tr>
          <tr>
            <th scope="row">Date</th>
            <td>{infoData.date}</td>
          </tr>
          <tr>
            <th scope="row" className='even' rowSpan="4">Control / Case</th>
            <td>
              {Object.keys(infoData.info).length !== 0 &&
                <table>
                  <thead>
                    <tr>
                      <th>{Object.keys(infoData.info)[0]}</th>
                      <th>{Object.keys(infoData.info)[1]}</th>
                    </tr>
                    <tr>
                      <td style={{ whiteSpace: 'pre' }}>{Object.values(infoData.info)[0].map((v) => {
                        return v + '\n'
                      })}</td>
                      <td style={{ whiteSpace: 'pre' }}>{Object.values(infoData.info)[1].map((v) => {
                        return v + '\n'
                      })}</td>
                    </tr>
                  </thead>
                </table>}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}