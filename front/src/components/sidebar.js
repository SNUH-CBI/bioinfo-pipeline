import React from 'react';
import axios from 'axios';
import { Button, Accordion, Card } from 'react-bootstrap'


export default class Sidebar extends React.Component {
  state = {
    response: []
  }

  static defaultProps = {
    clickedNav: 'Home'
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.clickedNav !== this.props.clickedNav) {
      if (this.props.clickedNav === 'Home') {
        this.setState({ response: [] })
        return 0;
      }
      axios.defaults.withCredentials = true
      axios({
        method: 'get',
        url: 'http://210.117.211.208:36002/directory',
        params: {
          project: 'pipeline-test/pipeline',
          menu: this.props.clickedNav
        }
      })
        .then((response) => {
          this.setState({ response: response.data })
        }
        )
        .catch((error) => {
          console.log(error)
          alert("error occured. check console log");
        })
    }
  }

  componentDidMount = () => {
    axios.defaults.withCredentials = true
    axios({
      method: 'get',
      url: 'http://210.117.211.208:36002/directory',
      params: {
        project: 'pipeline-test/pipeline',
        menu: this.props.clickedNav
      }
    })
      .then((response) => {
        this.setState({ response: response.data })
      }
      )
      .catch((error) => {
        console.log(error)
        alert("error occured. check console log");
      })
  }


  handleOnClick = (e) => {
    let clicked = 'http://210.117.211.208:36002/static' + '/pipeline-test/pipeline' + e.target.value
    if (e.target.value === "tempPath") clicked = './sampleFiles/logo512.png'
    this.props.getStaticFile(clicked)
  }

  render() {
    return (
      <div className="d-flex flex-column" >
        <Accordion style={{ width: '200px', textAlign: 'center' }}>
          {this.state.response.map((index, key) => {
            if (index.type === 'category')
              return <Button
                style={{ width: '200px' }}
                key={key}
                variant="Light">
                {index.label}
              </Button>
            if (index.type === 'file')
              return <Button
                onClick={this.handleOnClick}
                style={{ width: '200px' }}
                key={key}
                variant='link'
                value={index.value} >
                {index.label}
              </Button>
            return (
              <Card key={key}>
                <Card.Header>
                  <Accordion.Toggle
                    style={{ textAlign: 'center' }}
                    as={Button}
                    eventKey={key}
                    variant='link'
                    disabled={!index.children.length}>
                    {index.label}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={key}>
                  <Card.Body className='d-flex flex-column'>
                    {index.children.map((index, key) => {
                      return <Button
                        onClick={this.handleOnClick}
                        style={{ width: '140px', textAlign: 'center' }}
                        key={key}
                        variant='link'
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