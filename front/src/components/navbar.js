import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap'


export default class Navbar extends React.Component {
  
  state = { clicked: 'Home' }
  
  handleOnClick = (e, v) => {
    e.preventDefault()
    this.setState({ clicked: v })
    this.props.handleOnClick(v)
  }

  render() {
    return (
      <ButtonGroup style={{ height: '5vh' }}>
        {mainButtonList.map((v, i) => {
          return (
            <Button
              variant={(this.state.clicked !== v ? "outline-info" : 'primary')}
              onClick={e => this.handleOnClick(e, v)}
              key={i}>
              {v}
            </Button>)
        })}
      </ButtonGroup>
    )
  }
}

const mainButtonList = ["Home", "Raw_fastQC", "Filtered_fastQC", "RSEM_UCSC", "Qualimap_UCSC", "Sample_Correlation", "DEG", "GSA", "Download"]