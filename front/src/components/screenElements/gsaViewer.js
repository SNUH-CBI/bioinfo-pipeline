import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts'
import Papa from 'papaparse'
import { Spinner } from 'react-bootstrap'
import config from './../../config/config.json'

const GSAviewer = (props) => {
  console.log(props)
  let a = []
  const [data, setData] = useState({})
  useEffect(() => {

    Papa.parse(config.backend + '/static/' + config.project_path + props.clickedElement.value, {
      download: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      delimiter: props.file.type === 'text/plain' ? String.fromCharCode(9) : String.fromCharCode(44),
      complete: handleDataChange
    })
  }, [props.clickedElement]);

  const handleDataChange = file => {
    console.log(file)
    let delimiter = ''
    if (typeof props.clickedElement.value === 'string') {
      if (props.clickedElement.value.includes('KEGG')) delimiter = ':'
      else delimiter = '~'
    }
    if (file.data.length === 0) return 0
    else {
      try {
        const filterNum = [1, 8, 12]
        const role = { role: 'tooltip' }
        a = file.data.map(v => Object.values(v).filter((v, i) => filterNum.includes(i))).slice(0, 20)
        a = a.map(v => {
          const term = v[0].split(delimiter)[0]
          const PValue = -Math.log10(v[1]).toFixed(3)
          const Genes = v[2].split(",").length
          const tooltip = String(v[0] + '\n Genes: ' + Genes + '\n -log10(PValue): ' + PValue)
          return [term, PValue, tooltip, Genes, tooltip, 0.5, '-log10(PValue) = 0.5']
        })
        const b = file.meta.fields.filter((v, i) => filterNum.includes(i))
        b.push(role)
        b.splice(2, 0, role)
        b.splice(1, 1, '-log10(PValue)')
        b.push('')
        b.push(role)
        a.unshift(b)
        setData(a)
      }
      catch (e) {
        return 0
      }
    }
  }

  return (
    <>
      <Chart
        width={'100%'}
        height={'94vh'}
        chartType="ComboChart"
        loader={<Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>}
        data={data}
        options={{
          title: props.clickedElement.value.slice(-8, -4),
          vAxis: {
            textStyle: {
              fontSize: 11
            }
          },
          hAxis: {
            minorGridlines: {
              color: 'white'
            },
            0: {},
            1: {}
          },
          series: {
            0: {
              type: 'bars',
              targetAxisIndex: 0,
              color: 'skyblue',
            },
            1: {
              type: 'line',
              targetAxisIndex: 1,
              color: 'red'
            },
            2: {
              type: 'line',
              targetAxisIndex: 0,
              color: 'black',
              titlePosition: 'none'
            }
          },
          orientation: 'vertical',
        }}
      />
    </>
  )
}

GSAviewer.defaultProps = { file: [], clickedElement: { value: 'aa' } }

export default GSAviewer