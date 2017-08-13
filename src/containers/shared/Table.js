import React from 'react';
import PropTypes from "prop-types";
import { AutoSizer, Column, Table, WindowScroller } from 'react-virtualized';
import { Checkbox } from 'antd';
import 'react-virtualized/styles.css';
import './Table.less'

/* cellRenderer:
columnIndex, // Horizontal (column) index of cell
isScrolling, // The Grid is currently being scrolled
isVisible,   // This cell is visible within the grid (eg it is not an overscanned cell)
key,         // Unique key within array of cells
parent,      // Reference to the parent Grid (instance)
rowIndex,    // Vertical (row) index of cell
style        // Style object to be applied to cell (to position it);
             // This must be passed through to the rendered cell element.
*/

export default class TableEX extends React.Component {
    getCellRenderer({ columnIndex, key, rowIndex, style }) {
        const { columns, dataSource } = this.props
        const row = dataSource[rowIndex];
        const col = columns[columnIndex];
        return (
            <div key={key} style={style}>
                {row.render
                    ? row.render( )
                    : row[col.dataIndex]}
            </div>
        )

    }
    cellRenderer({ cellData, columnData, rowData }) {
        if ( columnData && columnData.render ) {
            return columnData.render( rowData )
        } else {
            return String( cellData );
        }
    }
    render( ) {
        const { columns, dataSource } = this.props
        return (
            <WindowScroller >
                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                    <AutoSizer disableHeight>
                        {({ width }) => (
                            <Table
                                autoHeight={true}
                                isScrolling={isScrolling}
                                onScroll={onChildScroll}
                                scrollTop={scrollTop}
                                height={height}
                                width={width}
                                noRowsRenderer={( ) => (
                                <span>暂无数据</span>
                            )}
                                headerHeight={20}
                                rowHeight={30}
                                rowCount={dataSource.length}
                                rowGetter={({ index }) => dataSource[index]}>
                                {columns.map(obj => {
                                    return <Column
                                        label={obj.title}
                                        key={obj.key}
                                        columnData={obj}
                                        cellRenderer={this.cellRenderer}
                                        dataKey={obj.dataIndex || obj.key}
                                        width={obj.width || 100}/>
                                })}
                            </Table>
                        )}
                    </AutoSizer>
                )}
            </WindowScroller>
        )
    }
}
