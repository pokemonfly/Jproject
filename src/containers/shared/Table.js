import React from 'react';
import PropTypes from "prop-types";
import { AutoSizer, Column, Table, WindowScroller } from 'react-virtualized';
import { Checkbox, Affix } from 'antd';
import PubSub from 'pubsub-js';
import { get } from 'lodash'
import 'react-virtualized/styles.css';
import './Table.less'

const DEFAULT_CELL_WIDTH = 100
export default class TableEX extends React.Component {
    static propTypes = {
        columns: PropTypes.array.isRequired,
        dataSource: PropTypes.array,
        noRowsRenderer: PropTypes.any,
        headHeight: PropTypes.number.isRequired,
        rowHeight: PropTypes.number.isRequired,
        extraHead: PropTypes.any,
        extraHeadHeight: PropTypes.number
    }
    static defaultProps = {
        dataSource: [],
        headHeight: 30,
        rowHeight: 30,
        extraHead: null,
        extraHeadHeight: 0,
        noRowsRenderer: ( ) => (
            <span>暂无数据</span>
        )
    }
    _setWindowScrollerRef = ( windowScroller ) => {
        this._windowScroller = windowScroller;
    }
    _setTableRef = ( dom ) => {
        this._table = dom;
    }
    _setTableHeadRef = ( dom ) => {
        this._tableHead = dom;
    }
    _changeHead = ( extraHeadVisible ) => {
        this.setState({ extraHeadVisible })
    }
    constructor( props ) {
        super( props );
        this.state = {
            ...this._calcWidth( props.columns ),
            extraHeadVisible: false
        }
    }
    componentWillReceiveProps( nextProps ) {
        this.setState(this._calcWidth( nextProps.columns ))
    }
    _calcWidth( columns ) {
        let contentWidth = 0,
            fixedLeftWidth = 0,
            fixedRightWidth = 0,
            columnsLeft = [],
            columnsCenter = [],
            columnsRight = [ ];
        columns.forEach(i => {
            let w = i.width || DEFAULT_CELL_WIDTH
            switch ( i.fixed ) {
                case 'left':
                    fixedLeftWidth += w
                    columnsLeft.push( i );
                    break
                case 'right':
                    fixedRightWidth += w
                    columnsRight.push( i );
                    break
                default:
                    contentWidth += w
                    columnsCenter.push( i )
            }
        })
        return {
            contentWidth,
            fixedLeftWidth,
            fixedRightWidth,
            columnsLeft,
            columnsCenter,
            columnsRight,
            fixedLeft: !!fixedLeftWidth,
            fixedRight: !!fixedRightWidth
        }
    }
    cellDataGetter({ dataKey, rowData }) {
        if ( typeof rowData.get === "function" ) {
            return rowData.get( dataKey );
        } else {
            return get( rowData, dataKey );
        }
    }
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
    cellRenderer({ cellData, columnData, rowData }) {
        if ( columnData && columnData.render ) {
            return columnData.render( cellData, rowData )
        } else {
            return String( cellData );
        }
    }
    componentDidUpdate( ) {
        PubSub.subscribe('table.resize', ( ) => {
            this._windowScroller.updatePosition( );
        })
    }
    componentWillUnmount( ) {
        PubSub.unsubscribe( 'table.resize' );
        this._scrollBar.removeEventListener( "scroll", this.onBarScroll )
    }
    onBarScroll = ( e ) => {
        this._table.scrollLeft = this._tableHead.scrollLeft = e.target.scrollLeft
    }
    bindScrollEvent = ( dom ) => {
        this._scrollBar = dom
        this._scrollBar && this._scrollBar.addEventListener("scroll", this.onBarScroll.bind( this ))
    }
    _renderExtraColumns( columns ) {
        return columns.map(( obj, index ) => {
            return <Column
                label={obj.title}
                key={obj.key || obj.dataIndex || index}
                columnData={obj}
                cellDataGetter={this.cellDataGetter}
                cellRenderer={this.cellRenderer}
                dataKey={obj.dataIndex || obj.key}
                width={obj.width || 100}/>
        })
    }
    _tableHeadRender({ width, columns }) {
        const { dataSource, noRowsRenderer, headHeight, rowHeight } = this.props
        return (
            <Table
                autoHeight={true}
                height={headHeight}
                width={width}
                headerHeight={headHeight}
                rowHeight={rowHeight}
                rowCount={0}
                rowGetter={( ) => null}>
                {this._renderExtraColumns( columns )}
            </Table>
        )
    }
    _tableRender({
        height,
        isScrolling,
        onChildScroll,
        scrollTop,
        width,
        columns
    }) {
        const { dataSource, noRowsRenderer } = this.props
        return (
            <Table
                autoHeight={true}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                scrollTop={scrollTop}
                height={height}
                width={width}
                noRowsRenderer={noRowsRenderer}
                headerHeight={0}
                disableHeader={true}
                rowHeight={30}
                rowCount={dataSource.length}
                rowGetter={({ index }) => dataSource[index]}>
                {this._renderExtraColumns( columns )}
            </Table>
        )
    }
    _renderTableHead( ) {
        const { extraHead, extraHeadHeight, headHeight } = this.props
        const {
            extraHeadVisible,
            fixedLeft,
            fixedRight,
            contentWidth,
            fixedLeftWidth,
            fixedRightWidth,
            columnsLeft,
            columnsCenter,
            columnsRight
        } = this.state
        return (
            <AutoSizer disableHeight={true}>
                {({ width }) => (
                    <Affix offsetTop={extraHeadHeight} onChange={this._changeHead} style={{
                        width
                    }}>
                        {extraHeadVisible && extraHead}
                        <div className="table-grid">
                            {fixedLeft && (
                                <div className="fixed-part-left" style={{
                                    width: fixedLeftWidth
                                }}>
                                    {this._tableHeadRender({ width: fixedLeftWidth, columns: columnsLeft })}
                                </div>
                            )}
                            <div className="scroll-part" ref={this._setTableHeadRef}>
                                <AutoSizer disableHeight={true}>
                                    {({ width }) => (
                                        <div style={{
                                            width
                                        }}>
                                            {this._tableHeadRender({ width: contentWidth, columns: columnsCenter })}
                                        </div>
                                    )}
                                </AutoSizer>
                            </div>
                            {fixedRight && (
                                <div className="fixed-part-right" style={{
                                    width: fixedRightWidth
                                }}>
                                    {this._tableHeadRender({ width: fixedRightWidth, columns: columnsRight })}
                                </div>
                            )}
                        </div>
                    </Affix>
                )}
            </AutoSizer>
        )
    }
    _renderTable( obj ) {
        const { headHeight } = this.props
        const {
            fixedLeft,
            fixedRight,
            contentWidth,
            fixedLeftWidth,
            fixedRightWidth,
            columnsLeft,
            columnsCenter,
            columnsRight,
            extraHeadVisible
        } = this.state
        const paddingTop = extraHeadVisible
            ? headHeight
            : 0
        if ( !fixedLeft && !fixedRight ) {
            return (
                <AutoSizer disableHeight={true}>
                    {({ width }) => (
                        <div style={{
                            paddingTop
                        }}>
                            {this._tableRender({
                                ...obj,
                                width,
                                columns: this.props.columns
                            })}
                        </div>
                    )}
                </AutoSizer>
            )
        } else {
            return (
                <AutoSizer disableHeight={true}>
                    {({ width }) => (
                        <div style={{
                            width,
                            paddingTop
                        }}>
                            <div className="table-grid">
                                {fixedLeft && (
                                    <div
                                        className="fixed-part-left"
                                        style={{
                                        width: fixedLeftWidth
                                    }}>
                                        {this._tableRender({
                                            ...obj,
                                            width: fixedLeftWidth,
                                            columns: columnsLeft
                                        })}
                                    </div>
                                )}
                                <div className="scroll-part" ref={this._setTableRef}>
                                    <AutoSizer disableHeight={true}>
                                        {({ width }) => (
                                            <div style={{
                                                width
                                            }}>
                                                {this._tableRender({
                                                    ...obj,
                                                    width: contentWidth,
                                                    columns: columnsCenter
                                                })}
                                            </div>
                                        )}
                                    </AutoSizer>
                                </div>
                                {fixedRight && (
                                    <div
                                        className="fixed-part-right"
                                        style={{
                                        width: fixedRightWidth
                                    }}>
                                        {this._tableRender({
                                            ...obj,
                                            width: fixedRightWidth,
                                            columns: columnsRight
                                        })}
                                    </div>
                                )}
                            </div>
                            <Affix
                                offsetBottom={0}
                                style={{
                                marginLeft: fixedLeftWidth,
                                marginRight: fixedRightWidth,
                                width: width - fixedLeftWidth - fixedRightWidth
                            }}>
                                <AutoSizer disableHeight={true}>
                                    {({ width }) => (
                                        <div
                                            className="scroll-bar"
                                            ref={this.bindScrollEvent}
                                            style={{
                                            width
                                        }}>
                                            <div
                                                className="scroll-bar-content"
                                                style={{
                                                width: contentWidth
                                            }}></div>
                                        </div>
                                    )}
                                </AutoSizer>
                            </Affix>
                        </div>
                    )}
                </AutoSizer>
            )
        }
    }
    render( ) {
        return (
            <div>
                {this._renderTableHead( )}
                <WindowScroller ref={this._setWindowScrollerRef}>
                    {( obj ) => this._renderTable( obj )}
                </WindowScroller>
            </div>
        )
    }
}
