import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'

const Table = styled.table`
  margin: 0px auto;
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

const Tooltip = styled.p`
  margin-left: 487px;
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
            {tableData[0].map(v => <th key={v}>{v}</th>)}
          </tr>
        </thead>
        <tbody>
          {tableData
            .slice(1, tableData.lentgh)
            .filter(arr => arr.length !== 1)
            .map((arr, i) =>
              <tr key={i}>
                {arr.map((v, i) => <td key={i}>{i === 1 || i === 2 ? numberWithCommas(v) : v}</td>)}
              </tr>)}
        </tbody>
      </Table>
      <br />
      <Tooltip>* Total read bases = Total reads * Read length 로 계산됨</Tooltip>
      <Tooltip>* Total read bases: 전체 시퀀싱 된 염기의 수</Tooltip>
      <Tooltip>* Total reads: 전체 read의 수</Tooltip>
      <Tooltip>* GC(%): GC함량</Tooltip>
      <Tooltip>* Q20(%): Phred quality score 20 이상의 품질을 갖는 염기의 비율</Tooltip>
      <Tooltip>* Q30(%): Phred quality score 30 이상의 품질을 갖는 염기의 비율</Tooltip>
    </Div>
  )
}

export default Raw_fastQC_summary