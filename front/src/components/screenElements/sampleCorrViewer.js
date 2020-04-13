import React from 'react';
import config from './../../config/config.json'
import Gallery from 'react-grid-gallery'

const SampleCorrViewer = (props) => {
  if (props.sidebar.length !== 0 && props.sidebar[0].children !== undefined) {

    const images = props.sidebar.map((v) => {
      return v.children.map((c) => {
        return (
          {
            src: config.backend + '/static/' + config.project_path + c.value,
            thumbnail: config.backend + '/static/' + config.project_path + c.value,
            thumbnailWidth: 700,
            thumbnailHeight: 700,
            tags: [{ value: c.label, title: c.label }],
            caption: v.label + "/" + c.label
          }
        )
      })
    })
    return (
      <div className="d-flex flex-column">
        <div style={{margin:'0px auto'}}>
          <p style={{ marginTop: '0px', marginBottom: '-30px', zIndex: '1' }}>COUNT</p>
          <Gallery images={images[0]} margin={30} />
        </div>
        <div style={{margin:'0px auto'}}>
          <p style={{ marginTop: '-10px', marginBottom: '-30px', zIndex: '1' }}>FPKM</p>
          <Gallery images={images[1]} margin={30} />
        </div>
        <div style={{margin:'0px auto'}}>
          <p style={{ marginTop: '-10px', marginBottom: '-30px', zIndex: '1' }}>TPM</p>
          <Gallery images={images[2]} margin={30} />
        </div >
      </div >
    )
  }
  else return (<div></div>)
}

SampleCorrViewer.defaultProps = { sidebar: [] }

export default SampleCorrViewer