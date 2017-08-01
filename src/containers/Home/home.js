import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ArticleTable from './components/Table';
import ArticleModal from './components/Modal';
import { tableActions, modalActions } from './actions';
import st from './style.scss';

@connect(state => ({ table: state.articles.table, modal: state.articles.modal }), dispatch => ({
    tableActions: bindActionCreators( tableActions, dispatch ),
    modalActions: bindActionCreators( modalActions, dispatch )
}))

export default class ArticleCRUD extends Component {
    render( ) {
        return (
            <div className="page">
                <button onClick={this.props.modalActions.showModal} className={st.abtn}>新增文章</button>
                <button onClick={this.props.modalActions.showModal} className={st.abtn}>新增文章1</button>
                <ArticleTable {...this.props.table} {...this.props.tableActions}/>
                <ArticleModal {...this.props.modal} {...this.props.modalActions}/>
            </div>
        );
    }
}
