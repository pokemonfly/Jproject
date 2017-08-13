import React from 'react';
import PropTypes from "prop-types";
import { AutoSizer, Column, Table, WindowScroller } from 'react-virtualized';
import { Checkbox, Affix } from 'antd';
import PubSub from 'pubsub-js';
import { get, omit } from 'lodash'
// import 'react-virtualized/styles.css';
import './Table.less'

/* TODOList
局部滚动 固定
额外固定的行 (定向数据)
排序
checkbox
*/
const DEFAULT_CELL_WIDTH = 100
export default class TableEX extends React.Component {
    static propTypes = {
        columns: PropTypes.array.isRequired,
        dataSource: PropTypes.array.isRequired,
        headHeight: PropTypes.number.isRequired,
        rowHeight: PropTypes.number.isRequired,
        // 内容过滤器
        filters: PropTypes.object,
        // 无内容时的render
        noRowsRenderer: PropTypes.any,
        // 滚动时 额外固定在页头的内容
        extraHead: PropTypes.any,
        extraHeadHeight: PropTypes.number,
        // 分组模式开关
        isGroup: PropTypes.bool,
        // 分组 设置
        groupSetting: PropTypes.array,
        // 分组 显示
        groupVisiable: PropTypes.array,
        // 分组 标题栏 render
        groupTitleRender: PropTypes.func,
        // 控制细分数据显示
        detailVisiable: PropTypes.object,
        // 细分数据 children数据 用 额外的render
        detailRowRender: PropTypes.func,
        //checkbox用
        hasCheckbox: PropTypes.bool,
        selectedRowKeys: PropTypes.array,
        selectionEvent: PropTypes.object
    }
    static defaultProps = {
        dataSource: [],
        headHeight: 40,
        rowHeight: 56,
        noRowsRenderer: ( ) => (
            <span>暂无数据</span>
        )
    }
    constructor( props ) {
        super( props );
        this.state = {
            ...this.calcWidth( props.columns ),
            data: this.formatDataSource( props ),
            extraHeadVisible: false
        }
    }
    componentWillReceiveProps( nextProps ) {
        this.setState({
            ...this.calcWidth( nextProps.columns ),
            data: this.formatDataSource( nextProps )
        })
    }

    setWindowScrollerRef = ( windowScroller ) => {
        this.windowScroller = windowScroller;
        window.table = this;
    }
    setTableRef = ( dom ) => {
        this.table = dom;
    }
    setTableHeadRef = ( dom ) => {
        this.tableHead = dom;
    }
    // 固定表头
    changeHead = ( extraHeadVisible ) => {
        this.setState({ extraHeadVisible })
    }

    formatDataSource({
        filters,
        isGroup,
        groupSetting,
        dataSource,
        detailVisiable,
        groupVisiable
    }) {
        let data = [ ];
        let arr = dataSource;
        // 过滤
        if ( filters ) {
            for ( let f in filters ) {
                let o = filters[f];
                arr = arr.filter(o.fn.bind( null, o.type, o.key ))
            }
        }
        // 分组
        if ( isGroup && groupSetting.length ) {
            let tempArr = [ ]
            groupSetting.forEach(( obj, index ) => {
                let t = arr.filter( obj.filter )
                tempArr.push({
                    ...omit( obj, 'filter' ),
                    _isGroupTitle: true,
                    count: t.length,
                    index
                })
                if (groupVisiable[index]) {
                    tempArr = tempArr.concat( t );
                }
            })
            arr = tempArr
        }
        // 细分数据
        arr.forEach(i => {
            data.push( i );
            if ( i.children ) {
                i.children.forEach(j => {
                    if (typeof j.visible === "function" && j.visible( detailVisiable, j )) {
                        data.push({
                            ...j,
                            _isChildren: true
                        })
                    }
                })
            }
        })
        return data;
    }
    calcWidth( columns ) {
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
    cellRenderer = ({ cellData, columnData, rowData, dataKey, columnIndex }) => {
        const { detailRowRender } = this.props
        if ( rowData._isGroupTitle ) {
            return '';
        }
        if ( rowData._isChildren ) {
            let r = detailRowRender({ columnIndex, dataKey, rowData })
            if ( r ) {
                return r;
            }
        }
        if ( columnData && columnData.render ) {
            return columnData.render( cellData, rowData )
        } else {
            return String( cellData );
        }
    }
    rowRenderer(position, {
        className,
        columns,
        index,
        key,
        onRowClick,
        onRowDoubleClick,
        onRowMouseOut,
        onRowMouseOver,
        onRowRightClick,
        rowData,
        style
    }) {
        const { groupTitleRender } = this.props
        const a11yProps = {};

        if ( onRowClick || onRowDoubleClick || onRowMouseOut || onRowMouseOver || onRowRightClick ) {
            a11yProps["aria-label"] = "row";
            a11yProps.tabIndex = 0;

            if ( onRowClick ) {
                a11yProps.onClick = event => onRowClick({ event, index, rowData });
            }
            if ( onRowDoubleClick ) {
                a11yProps.onDoubleClick = event => onRowDoubleClick({ event, index, rowData });
            }
            if ( onRowMouseOut ) {
                a11yProps.onMouseOut = event => onRowMouseOut({ event, index, rowData });
            }
            if ( onRowMouseOver ) {
                a11yProps.onMouseOver = event => onRowMouseOver({ event, index, rowData });
            }
            if ( onRowRightClick ) {
                a11yProps.onContextMenu = event => onRowRightClick({ event, index, rowData });
            }
        }

        // 这里禁用掉overflow 是为了显示绝对定位的自定义内容 分组的支持
        if ( rowData._isChildren || rowData._isGroupTitle ) {
            delete style.overflow
        }
        if ( rowData._isGroupTitle ) {
            return groupTitleRender({ rowData, key, className, style, position })
        }
        return (
            <div role="row" {...a11yProps} key={key} className={className} style={style}>
                {columns}
            </div>
        );
    }
    componentDidUpdate( ) {
        PubSub.subscribe('table.resize', ( ) => {
            this.windowScroller.updatePosition( );
        })
    }
    componentWillUnmount( ) {
        PubSub.unsubscribe( 'table.resize' );
        this.scrollBar.removeEventListener( "scroll", this.onBarScroll )
    }
    onBarScroll = ( e ) => {
        this.table.scrollLeft = this.tableHead.scrollLeft = e.target.scrollLeft
    }
    bindScrollEvent = ( dom ) => {
        this.scrollBar = dom
        this.scrollBar && this.scrollBar.addEventListener("scroll", this.onBarScroll.bind( this ))
    }
    renderExtraColumns( columns ) {
        const { hasCheckbox } = this.props

        let r = columns.map(( obj, index ) => {
            return <Column
                label={obj.title}
                key={obj.key || obj.dataIndex || index}
                columnData={obj}
                cellDataGetter={this.cellDataGetter}
                cellRenderer={this.cellRenderer}
                dataKey={obj.dataIndex || obj.key}
                width={obj.width || 100}/>
        })
        if ( hasCheckbox ) {}
        return r;
    }
    tableHeadRender({ width, columns }) {
        const { headHeight } = this.props
        return (
            <Table autoHeight={true} height={headHeight} width={width} headerHeight={headHeight} rowHeight={0} rowCount={0} rowGetter={( ) => null}>
                {this.renderExtraColumns( columns )}
            </Table>
        )
    }
    tableRender({
        height,
        isScrolling,
        onChildScroll,
        scrollTop,
        width,
        columns,
        position
    }) {
        const { noRowsRenderer, rowHeight } = this.props
        const { data } = this.state
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
                rowHeight={rowHeight}
                rowRenderer={this.rowRenderer.bind( this, position )}
                rowCount={data.length}
                rowGetter={({ index }) => data[index]}>
                {this.renderExtraColumns( columns )}
            </Table>
        )
    }
    renderTableHead( ) {
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
                    <Affix offsetTop={extraHeadHeight} onChange={this.changeHead} style={{
                        width
                    }}>
                        {extraHeadVisible && extraHead}
                        <div className="table-grid">
                            {fixedLeft && (
                                <div className="fixed-part-left" style={{
                                    width: fixedLeftWidth
                                }}>
                                    {this.tableHeadRender({ width: fixedLeftWidth, columns: columnsLeft })}
                                </div>
                            )}
                            <div className="scroll-part" ref={this.setTableHeadRef}>
                                <AutoSizer disableHeight={true}>
                                    {({ width }) => (
                                        <div style={{
                                            width
                                        }}>
                                            {this.tableHeadRender({ width: contentWidth, columns: columnsCenter })}
                                        </div>
                                    )}
                                </AutoSizer>
                            </div>
                            {fixedRight && (
                                <div className="fixed-part-right" style={{
                                    width: fixedRightWidth
                                }}>
                                    {this.tableHeadRender({ width: fixedRightWidth, columns: columnsRight })}
                                </div>
                            )}
                        </div>
                    </Affix>
                )}
            </AutoSizer>
        )
    }
    renderTable( obj ) {
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
                            {this.tableRender({
                                ...obj,
                                width,
                                columns: this.props.columns,
                                position: 'left'
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
                                        {this.tableRender({
                                            ...obj,
                                            width: fixedLeftWidth,
                                            columns: columnsLeft,
                                            position: 'left'
                                        })}
                                    </div>
                                )}
                                <div className="scroll-part" ref={this.setTableRef}>
                                    <AutoSizer disableHeight={true}>
                                        {({ width }) => (
                                            <div style={{
                                                width
                                            }}>
                                                {this.tableRender({
                                                    ...obj,
                                                    width: contentWidth,
                                                    columns: columnsCenter,
                                                    position: 'center'
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
                                        {this.tableRender({
                                            ...obj,
                                            width: fixedRightWidth,
                                            columns: columnsRight,
                                            position: 'right'
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
                {this.renderTableHead( )}
                <WindowScroller ref={this.setWindowScrollerRef}>
                    {( obj ) => this.renderTable( obj )}
                </WindowScroller>
            </div>
        )
    }
}
