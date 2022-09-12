import { getAllTask, createTask, deleteTask } from 'api'
import { takeEvery, call, put } from 'redux-saga/effects'
import { tokenName } from 'api/const'
import TYPE from 'actions'

function* getTaskFlow() {
  try { 
    const token = localStorage.getItem(tokenName)
    const response = yield call(getAllTask, token)
    yield put({type: TYPE.GET_TASK_SUCCESS, data: response.data,  code: response.status, error: null})
  }
  catch ({ response }) {
    if (response) {
      yield put({type: TYPE.GET_TASK_FAIL, error: response.data.detail, code: response.status})
    } else {
      yield put({type: TYPE.GET_TASK_FAIL, error: "Cannot connect to server"})
    }
  }
}

function* createTaskFlow(action) {
  try {
    const token = localStorage.getItem(tokenName)
    yield call(createTask, token, action.task)
    yield put({type: TYPE.GET_TASK_REQUESTING})
  }
  catch ({ response }) {
    if (response) {
      yield put({type: TYPE.CREATE_TASK_FAIL, error: "An error occurred", code: response.status})
    } else {
      yield put({type: TYPE.CREATE_TASK_FAIL, error: "Cannot connect to server"})
    }
  }
}

function* delTaskFlow(action) {
  try {
    const token = localStorage.getItem(tokenName)
    yield call(deleteTask, token, action.taskID)
    yield put({ type: TYPE.GET_TASK_REQUESTING})
  }
  catch ({ response }) {
    if (response) {
      yield put({type: TYPE.DELETE_TASK_FAIL, error: "An error occurred", code: response.status})
    } else {
      yield put({type: TYPE.DELETE_TASK_FAIL, error: "Cannot connect to server"})
    }
  }
}
  
function* TaskWatcher() {
  yield takeEvery(TYPE.GET_TASK_REQUESTING, getTaskFlow)
  yield takeEvery(TYPE.CREATE_TASK_REQUESTING, createTaskFlow)
  yield takeEvery(TYPE.DELETE_TASK_REQUESTING, delTaskFlow)
}

export default TaskWatcher