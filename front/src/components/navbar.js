import React, { useState } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap'

const Navbar = (props) => {
  const mainButtonList = ["Home", "Raw_fastQC", "Filtered_fastQC", "RSEM_UCSC", "Qualimap_UCSC", "Sample_Correlation", "DEG", "GSA", "Download"]
  const [clicked, setClicked] = useState('Home')

  const handleOnClick = (e, v) => {
    e.preventDefault()
    setClicked(v)
    props.handleOnClick(v)
  }

  return (
    <ButtonGroup style={{ height: '5vh', minHeight: '35px' }}>
      {mainButtonList.map((v, i) => {
        return (
          <Button
            variant={(clicked !== v ? "outline-info" : 'primary')}
            onClick={e => handleOnClick(e, v)}
            key={i}>
            {v}
          </Button>)
      })}
    </ButtonGroup>
  )
}

export default Navbar