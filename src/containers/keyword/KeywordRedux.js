import { combineReducers } from 'redux'
import keywordList from './components/KeywordListRedux'
import keywordView from './components/KeywordViewRedux'

export default combineReducers( { keywordList, keywordView } );
