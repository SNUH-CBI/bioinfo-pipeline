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
        url: './sampleResponses/' + this.props.clickedNav + '.json'
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
        url: './sampleResponses/' + this.props.clickedNav + '.json'
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
    const clicked = e.target.innerHTML

    if(clicked === 'GO_BP') this.props.getStaticFile('./sample.pdf')
    if(clicked === 'GO_CC') this.props.getStaticFile('./a.csv')
    if(clicked === 'GO_MF') this.props.getStaticFile('./logo512.png')
    if(clicked === 'KEGG') this.props.getStaticFile('./sample.html')
    if(clicked === 'Reactome') this.props.getStaticFile('./sample.txt')
  }

  render() {
    

    return (
      <div className="d-flex flex-column" >
        <Accordion style={{width: '200px', textAlign: 'center'}}>
        {this.state.response.map((index, key) => {
          if (index.type === 'category')
            return <Button
              style={{ width: '200px' }}
              key={key}
              variant="Light">
              {index.label}
            </Button>
          if (index.type === 'button')
            return <Button
              style={{ width: '200px' }}
              key={key}
              variant='light' >
              {index.label}
            </Button>
          else return (
            <Card key={key}>
              <Card.Header>
                <Accordion.Toggle style={{textAlign: 'center'}} as={Button} eventKey={key} variant='link' disabled={!index.children.length}>
                  {index.label}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey={key}>
                <Card.Body className='d-flex flex-column'>
                  {index.children.map((index, key) => {
                    return <Button
                      onClick={this.handleOnClick}
                      style={{ width: '140px', textAlign: 'center'}}
                      key={key}
                      variant='link'>
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

/**
 * 
 * 
 * const AccordionHeader = (
      <Accordion.Toggle style={{textAlign: 'center'}} as={Card.Header} eventKey={key}>
      sample {key}
    </Accordion.Toggle>
    )
    const AccordionHeaderDisabled = (
      <Accordion.Toggle style={{textAlign: 'center'}} as={Card.Header} eventKey={key} disabled>
      sample {key}
    </Accordion.Toggle>
    )
 * 
 */