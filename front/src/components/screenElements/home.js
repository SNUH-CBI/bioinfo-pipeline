import React from 'react';

export default class Home extends React.Component {

  static defaultProps = {
    infoData: {
      project: '',
      manager: '',
      date: '',
      case: ''
    }
  }

  state = {
    case: []
  }

  getInfoData = () => {
    const acase = this.props.infoData.case
    this.setState({ case: acase.split(String.fromCharCode(10)).filter(index => index !== '') })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.infoData !== this.props.infoData) {
      this.getInfoData()
    }
  }

  componentDidMount = () => {
    if(this.props.infoData.case !== undefined) this.getInfoData()
  }

  render() {
    const infoData = this.props.infoData
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
          {this.state.case.map((index, key) => {
            return <tr key={key}><td className='even'>{index}</td></tr>
          })}
        </tbody>
      </table>
    )
  }
}