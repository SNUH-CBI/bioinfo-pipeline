import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'

const Table = styled.table`
  border-top: 2px solid skyblue;
  border-bottom: 2px solid skyblue;
  border-collapse: collapse;
  th, td {
    padding: 2px 10px;
  }
  td {
    text-align: right;
  }
  thead {
    border-bottom: 1px solid #6495ED;
  }
`

const Div = styled.div`
  margin: 30px auto;
`

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Raw_fastQC_summary = (props) => {
  const [tableData, setTableData] = useState([[''], ['']])
  useEffect(() => {
    axios.get('./sampleFiles/fastqc_summaryTable.txt')
      .then(response => response.data.split(String.fromCharCode(10)))
      .then(data => data.map(row => row.split(' ')))
      .then(data => setTableData(data))
  }, []);

  return (
    <Div>
      <Table>
        <thead>
          <tr>
            {tableData[0].map(v => <th>{v}</th>)}
          </tr>
        </thead>
        <tbody>
          {tableData
            .slice(1, tableData.lentgh)
            .filter(arr => arr.length !== 1)
            .map(arr =>
              <tr>
                {arr.map((v, i) => <td>{i == 1 || i == 2 ? numberWithCommas(v) : v}</td>)}
              </tr>)}
        </tbody>
      </Table>
    </Div>
  )
}

export default Raw_fastQC_summary