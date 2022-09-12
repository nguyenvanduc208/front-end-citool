import { all } from 'redux-saga/effects'
import TaskWatcher from './taskManage'

export default function* rootSaga() {
  yield all([
    TaskWatcher(),
  ])
}