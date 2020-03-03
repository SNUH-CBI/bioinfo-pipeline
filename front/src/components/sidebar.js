import React, { useState, useEffect } from 'react';
import { Button, Accordion, Card, useAccordionToggle } from 'react-bootstrap'

const Sidebar = (props) => {

  const [activeKey, setActiveKey] = useState(0)

  useEffect(() => {
    setActiveKey(0)
    return ()=>{}
  }, [props.clickedNav]);

  const CustomToggle = ({ eventKey, index }) => {
    const decoratedOnClick = useAccordionToggle(eventKey, () => {
      setActiveKey(eventKey)
    })
    return (
      <Button
        //onClick={(e) => props.setClickedElement(e.target.value)}
        onClick={decoratedOnClick}
        variant='link'
        value={index.value}
        style={eventKey === activeKey ? { color: 'blue' } : { color: 'black' }}
      >
        {index.label}
      </Button>
    )
  }

  if (props.clickedNav === 'Home' || props.clickedNav === 'Download') {
    return (<div></div>)
  }
  else return (
    <div className="sidebar" >
      <Accordion style={{ textAlign: 'center' }} defaultActiveKey={0} activeKey={activeKey} >
        {props.sidebar.map((index, key) => {
          if (index.type === 'category')
            return <Button
              key={key}
              style={{color: 'grey'}}
              variant="Light">
              {index.label}
            </Button>
          else if (index.type === 'file')
            return <Button
              onClick={(e) => props.setClickedElement(e.target.value)}
              key={key}
              variant='link'
              style={props.clickedElement === index.value ? { color: 'blue' } : { color: 'black' }}
              value={index.value} >
              {index.label}
            </Button>
          else return (
            <Card key={key} >
              <Card.Header style={{ padding: '0' }}>
                <CustomToggle index={index} eventKey={key} />
              </Card.Header>
              <Accordion.Collapse eventKey={key} >
                <Card.Body style={{ padding: '0' }}>
                  {index.children.filter((v) => !v.label.includes('Download')).map((index, key) => {
                    return <Button
                      onClick={e => props.setClickedElement(e.target.value)}
                      key={key}
                      variant='link'
                      style={props.clickedElement === index.value ? { color: 'blue' } : { color: 'black' }}
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