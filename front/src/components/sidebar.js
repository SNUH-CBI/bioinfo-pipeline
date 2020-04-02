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
        onClick={decoratedOnClick}
        variant='link'
        value={index.value}
        style={eventKey === activeKey ? { color: 'blue' } : { color: 'black' }}
      >
        {index.label}
      </Button>
    )
  }
  
  if (noSidebarNav.includes(props.clickedNav)) {
    return (<div></div>)
  }
  else return (
    <div className="sidebar" >
      <Accordion style={{ textAlign: 'center' }} defaultActiveKey={0} activeKey={activeKey} >
        {props.clickedNav.includes('fastQC') && <Button variant='link' style={{color: 'green'}}>Summary</Button>}
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
              onClick={(e) => {props.setClickedElement(index)}}
              key={key}
              variant='link'
              style={props.clickedElement === index ? { color: 'blue' } : { color: 'black' }}
              value={index} >
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
                      onClick={e => props.setClickedElement(index)}
                      key={key}
                      variant='link'
                      style={props.clickedElement === index ? { color: 'blue' } : { color: 'black' }}
                      value={index}>
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

const noSidebarNav = ['Home', 'Download', 'Sample_Correlation']

Sidebar.defaultProps = { clickedNav: 'Home' }

export default Sidebar