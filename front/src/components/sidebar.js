import React from 'react';
import { Button, Accordion, Card } from 'react-bootstrap'

const Sidebar = (props) => {

  if (props.clickedNav === 'Home' || props.clickedNav === 'Download') {
    return (<div></div>)
  }
  else return (
    <div className="sidebar" >
      <Accordion style={{ textAlign: 'center' }} defaultActiveKey={0} >
        {props.sidebar.map((index, key) => {
          if (index.type === 'category')
            return <Button
              key={key}
              variant="Light">
              {index.label}
            </Button>
          else if (index.type === 'file')
            return <Button
              onClick={(e) => props.setClickedElement(e.target.value)}
              key={key}
              variant='link'
              disabled={props.clickedElement === index.value}
              value={index.value} >
              {index.label}
            </Button>
          else return (
            <Card key={key} >
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
                  {index.children.filter((v)=>!v.label.includes('Download')).map((index, key) => {
                    return <Button
                      onClick={e => props.setClickedElement(e.target.value)}
                      key={key}
                      variant='link'
                      disabled={props.clickedElement === index.value}
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

Sidebar.defaultProps = { clickedNav: 'Home' }

export default Sidebar