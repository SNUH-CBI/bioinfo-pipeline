import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts'
import Papa from 'papaparse'
import { Spinner } from 'react-bootstrap'

const GSAviewer = (props) => {
  console.log(props)
  let a = []
  const [data, setData] = useState({})
  useEffect(() => {
    Papa.parse(props.file, {
      download: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      delimiter: props.file.type === 'text/plain' ? String.fromCharCode(9) : String.fromCharCode(44),
      complete: handleDataChange
    })
  }, [props.file]);

  const handleDataChange = file => {
    console.log(file)
    let delimiter = ''
    if (typeof props.clickedElement === 'string') {
      if (props.clickedElement.includes('KEGG')) delimiter = ':'
      else delimiter = '~'
    }
    //file.data.slice(0, 30).map(v => -Math.log10(v.PValue).toFixed(3))
    //file.data.slice(0, 30).map(v => v.Genes.split(",").length)
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
          const tooltip = String(v[0] + '\n Genes: ' + Genes + '\n PValue(-log10): ' + PValue)
          return [term, PValue, tooltip, Genes, tooltip]
        })
        const b = file.meta.fields.filter((v, i) => filterNum.includes(i))
        b.push(role)
        b.splice(2, 0, role)
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
          title: props.clickedElement.slice(-8, -4),
          vAxis: {
            textStyle: {
              fontSize: 11
            }
          },
          hAxis: {
            0: { title: 'cups' },
            1: { title: 'aa' },
          },
          series: { 0: { type: 'bars', targetAxisIndex: 0, color: 'skyblue' }, 1: { type: 'line', targetAxisIndex: 1 } },
          orientation: 'vertical',
        }}
      />
    </>
  )
}

GSAviewer.defaultProps = { file: [], clickedElement: 'aa' }

export default GSAviewer