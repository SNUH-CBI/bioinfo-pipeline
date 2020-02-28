import React, { useEffect } from 'react';
import Papa from 'papaparse'

const GSAviewer = (props) => {

  useEffect(() => {
    Papa.parse(props.file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      delimiter: props.file.type === 'text/plain' ? String.fromCharCode(9) : String.fromCharCode(44),
      complete: handleDataChange
    })
  }, [props.file]);

  const handleDataChange = file => {

    if (file.data.length === 0) return 0
    else {
      try {/*
        console.log(file.data[0]['Term'].split('~')[1])
        console.log('data')
        console.log(file.data[0]['Genes'].split(',').length)
        console.log('errors')
        console.log(file.errors)
        console.log('metaFields')
        console.log(file.meta.fields)*/
      }
      catch (e) {
        return 0
      }
    }
    //console.log(file.data.filter((v) => true))}
  }

  return (
    <div>GSAviewer</div>
  )
}

GSAviewer.defaultProps = { file: [] }

export default GSAviewer