import React from 'react';
import axios from 'axios';
import { Button, Accordion, Card } from 'react-bootstrap'
import config from './../config/config.json'

export default class Sidebar extends React.Component {
  state = {
    response: [],
    clickedValue: ''
  }

  static defaultProps = {
    clickedNav: 'Home'
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.clickedNav !== this.props.clickedNav) {
      if (this.props.clickedNav === 'Home' || this.props.clickedNav === 'Download') {
        this.setState({ response: [] })
        return 0;
      }
      else {
        axios.defaults.withCredentials = true
        axios({
          method: 'get',
          url: config.backend + '/directory',
          params: {
            project: config.project_path,
            menu: this.props.clickedNav
          }
        })
          .then((response) => {
            this.setState({ response: response.data })
          }
          )
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
    }
  }

  handleOnClick = (e) => {
    const clickedValue = config.backend + '/static/' + config.project_path + e.target.value
    this.setState({ clickedValue: e.target.value })
    this.props.handleSidebarClick(clickedValue)
  }

  render() {
    if (this.props.clickedNav === 'Home' || this.props.clickedNav === 'etc') {
      return (<div></div>)
    }
    else return (
      <div className="sidebar" >
        <Accordion style={{ textAlign: 'center' }}>
          {this.state.response.map((index, key) => {
            if (index.type === 'category')
              return <Button
                key={key}
                variant="Light">
                {index.label}
              </Button>
            else if (index.type === 'file')
              return <Button
                onClick={this.handleOnClick}
                key={key}
                variant='link'
                disabled={this.state.clickedValue === index.value}
                value={index.value} >
                {index.label}
              </Button>
            else return (
              <Card key={key}>
                <Card.Header style={{ padding: '0' }}>
                  <Accordion.Toggle
                    as={Button}
                    eventKey={key}
                    variant='link'
                    disabled={!index.children.length}>
                    {index.label}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={key} >
                  <Card.Body style={{ padding: '0' }}>
                    {index.children.map((index, key) => {
                      return <Button
                        onClick={this.handleOnClick}
                        key={key}
                        variant='link'
                        disabled={this.state.clickedValue === index.value}
                        value={index.value}>
                        {index.label}
                      </Button>
                    })}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            )
          })}
        </Accordion>
      </div>
    )
  }
}