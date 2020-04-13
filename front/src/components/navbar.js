import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap'

const Navbar = (props) => {
  return (
    <ButtonGroup style={{ height: '35px' }}>
      {mainButtonList.map((v, i) => {
        return (
          <Button
            variant={(props.clickedNav !== v ? "outline-info" : 'primary')}
            onClick={() => props.setClickedNav(v)}
            key={i}>
            {v}
          </Button>)
      })}
    </ButtonGroup>
  )
}

const mainButtonList = ["Home", "Raw_fastQC", "Filtered_fastQC", "RSEM_UCSC", "Qualimap_UCSC", "Sample_Correlation", "DEG", "GSA", "Download"]

export default Navbar