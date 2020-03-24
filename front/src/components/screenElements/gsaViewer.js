import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts'
import Papa from 'papaparse'

const GSAviewer = (props) => {
  let a = []
  const [data, setData] = useState({})
  useEffect(() => {
    console.log(props.file)
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
    //file.data.slice(0, 30).map(v => -Math.log10(v.PValue).toFixed(3))
    //file.data.slice(0, 30).map(v => v.Genes.split(",").length)
    if (file.data.length === 0) return 0
    else {
      try {
        const filterNum = [1, 8, 12]
        a = file.data.map(v => Object.values(v).filter((v, i) => filterNum.includes(i))).slice(0, 20)
        a = a.map(v => [/*v[0].split("~")[1]*/v[0], -Math.log10(v[1]).toFixed(3), v[2].split(",").length])
        a.unshift(file.meta.fields.filter((v, i) => filterNum.includes(i)))
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
        width={'500px'}
        height={'300px'}
        chartType="ComboChart"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
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
        rootProps={{ 'data-testid': '1' }}
      />
    </>
  )
}

GSAviewer.defaultProps = { file: [] }

export default GSAviewer

