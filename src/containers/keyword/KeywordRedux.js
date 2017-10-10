import { combineReducers } from 'redux'
import keywordList from './components/KeywordListRedux'
import keywordHead from './components/KeywordHeadRedux'
import keywordView from './components/KeywordViewRedux'

export default combineReducers({ keywordList, keywordHead, keywordView });
