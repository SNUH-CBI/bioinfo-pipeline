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
      <div className="d-flex flex-column" style={{marginLeft:'30vw'}}>
        <p>count</p>
        <Gallery images={images[0]} />
        <p>fpkm</p>
        <Gallery images={images[1]} />
        <p>tpm</p>
        <Gallery images={images[2]} />
      </div>
    )
  }
  else return (<div></div>)
}

SampleCorrViewer.defaultProps = { sidebar: [] }

export default SampleCorrViewer