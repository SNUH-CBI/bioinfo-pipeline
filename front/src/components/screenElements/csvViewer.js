import React from 'react';
import Papa from 'papaparse'
import styled from 'styled-components'
import { useTable, usePagination, useSortBy, useGlobalFilter, useFilters } from 'react-table'
import { Button } from 'react-bootstrap'


class CsvViewer extends React.Component {
  static defaultProps = {
    file: {}
  }

  state = {
    data: [],
    columns: [],
    loading: true
  }

  componentDidMount = () => {
    this.handleFileChange(this.props.file)
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.file !== this.props.file) {
      this.handleFileChange(this.props.file)
    }

    const data = this.state.data
    const columns = this.state.data
    if ((prevState.data.length !== data.length && prevState.columns.length !== columns.length)
      && data.length && columns.length)
      this.setState({ loading: false })
  }

  handleFileChange = file => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: this.handleDataChange
    })
  }

  makeColumns = rawColumns => {
    return rawColumns.map(column => {
      return { Header: column, accessor: column };
    })
  }

  handleDataChange = file => {
    this.props.setGenes(file.data.length)
    this.setState({ data: file.data })
    this.setState({ columns: this.makeColumns(file.meta.fields) })
  }



  Table = ({ columns, data }) => {
    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page, // Instead of using 'rows', we'll use page,
      // which has only the rows for the active page

      // The rest of these things are super handy, too ;)
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      visibleColumns,
      preGlobalFilterdRows,
      setGlobalFilter,
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
        initialState: { sortBy: [{ id: 'genes', inc: true }], pageSize: 20 },
      },
      useGlobalFilter,
      useFilters,
      useSortBy,
      usePagination,
    )

    // Render the UI for your table
    return (
      <Styles>
        <div className="tableWrap">
          <table {...getTableProps()}>
            <thead style={{ backgroundColor: 'rgba(92, 92, 92, 0.247)' }}>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps(), {
                        className: column.collapse ? 'collapse' : '',
                      })}
                    >
                      <span>{column.render('Header')}
                        {/* Add a sort direction indicator */}
                        {column.isSorted ? (column.isSortedDesc ? '🔽' : '🔼') : ''}</span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} >
              {page.map((row, i) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell, k) => {
                      return (
                        <td
                          {...cell.getCellProps({
                            className: cell.column.collapse ? 'collapse' : '',
                          })} style={typeof Object.values(cell.row.original)[k] === 'number' ? { textAlign: 'right' } : { textAlign: 'left' }}
                        >
                          {
                            (typeof Object.values(cell.row.original)[k] === 'number') ?
                              toExponential.includes(Object.keys(cell.row.original)[k]) ?
                                Object.values(cell.row.original)[k].toExponential(3)
                                : Object.values(cell.row.original)[k].toFixed(3)
                              : Object.values(cell.row.original)[k]}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
          {/* 
          Pagination can be built however you'd like. 
          This is just a very basic UI implementation:
        */}
        </div>
        <div className="pagination">
          <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </Button>{' '}
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </Button>{' '}
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </Button>{' '}
          <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </Button>{' '}
          <span style={{ whiteSpace: 'nowrap' }}>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <span style={{ whiteSpace: 'nowrap' }}>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: '100px' }}
            />
          </span>{' '}
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </Styles>
    )
  }

  render() {
    return (
      <div >
        {!this.state.loading && (
          <this.Table columns={this.state.columns} data={this.state.data} />
        )}
      </div>
    );
  }

}

const toExponential = ['PValue', 'pvalue', 'ttest_tpm', 'padj', 'ttest_fpkm']

const Styles = styled.div`
  width: 1080px;
  margin: 0 auto;
  /* This is required to make the table full-width */
  display: block;
  max-width: 100%;

  /* This will make the table scrollable when it gets too small */
  .tableWrap {
    display: block;
    max-width: 100%;
    border-bottom: 1px solid black;
    border-collapse: collapse;
  }

  table {
    /* Make sure the inner table is always as wide as needed */
    width: 100%;
    border-spacing: 0;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      white-space: nowrap;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      /* The secret sauce */
      /* Each cell should grow equally */
      width: 1%;
      /* But "collapsed" cells should be as small as possible */
      &.collapse {
        width: 0.0000000001%;
      }

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`



export default CsvViewer