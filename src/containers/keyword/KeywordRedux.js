import { combineReducers } from 'redux'
import keywordList from './components/KeywordListRedux'
import adgroup from './components/AdgroupRedux'
import keywordView from './components/KeywordViewRedux'
import report from './components/ReportRedux'
import oneKey from '@/containers/shared/OneKeyRedux'

export default combineReducers({ keywordList, adgroup, keywordView, report, oneKey });
