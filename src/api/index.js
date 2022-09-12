import axios from 'axios'
import { mainApi , mainPath, METHODS, tokenName } from './const'

const { get, post, put, del } = METHODS

const { login, register, task, scanTask, scanresult, editMemo, scanSchedule,
        dastScanTask, dastScanReport, dastDetail, clocTask, clocResult, clocReport,
        autotest, autotestLog,
        dashboardOverview, recentTaskInfo, monitoringTask, monitoringResult, monitoringResponse } = mainPath

const mainInstance = axios.create({
  baseURL: mainApi,
})

// Authen APIs
const doLogin = data => mainInstance({url: login, method: post, data: data})
const doRegister = data => mainInstance({url: register, method: post, data: data})

// Dashboard APIs
const getOverview = (token, method, data) => mainInstance({url: dashboardOverview, method: method, data: data, headers: { Authorization: "JWT " + token}})
const getRecentTasks = (token, method, data) => mainInstance({url: recentTaskInfo, method: method, data: data, headers: { Authorization: "JWT " + token}})

// Task APIs
const getTask = (token, id) => mainInstance({url: task+'/'+id, method: get, headers: { Authorization: "JWT " + token}})
const getAllTask = (token) => mainInstance({url: task, method: get, headers: { Authorization: "JWT " + token}})
const createTask = (token, data) => mainInstance({url: task, method: post,  data: data, headers: { Authorization: "JWT " + token}})
const updateTask = (token, id,data) => mainInstance({url: task+'/'+id, method: put,  data: data, headers: { Authorization: "JWT " + token}})
const deleteTask = (token, id) => mainInstance({url: task+'/'+id, method: del, headers: { Authorization: "JWT " + token}})

// Task Result
const getTaskResult = (token, id) => mainInstance({url: scanresult+id, method: get, headers: { Authorization: "JWT " + token}})
const getEditMemo = (token, id, data) => mainInstance({url: editMemo+id, method: put, data: data, headers: { Authorization: "JWT " + token}})

// Task schedule
const getSchedule = (token, method, data, id='') => mainInstance({url: scanSchedule+id, method: method, data: data, headers: { Authorization: "JWT " + token}})

// Loc Count
const getLocCount = (token, method, data, id='') => mainInstance({url: clocTask+id, method: method, data: data, headers: { Authorization: "JWT " + token}})
const getLocResult = (token, method, data, id='') => mainInstance({url: clocResult+id, method: method, data: data, headers: { Authorization: "JWT " + token}})
const getLocReport = (token, method, data, id='') => mainInstance({url: clocReport+id, method: method, data: data, headers: { Authorization: "JWT " + token}})

// Dast scan
const getDastTask = (token, method, data, id='') => mainInstance({url: dastScanTask+id, method: method, data: data, headers: { Authorization: "JWT " + token}})
const getDastReport = (token, method, data, id='') => mainInstance({url: dastScanReport+'/'+id, method: method, data: data, headers: { Authorization: "JWT " + token}})
const getDastDetail = (token, method, data, id='') => mainInstance({url: dastDetail+id, method: method, data: data, headers: { Authorization: "JWT " + token}})
const getDastEditMemo = (token, id, data) => mainInstance({url: dastDetail+id, method: put, data: data, headers: { Authorization: "JWT " + token}})

// Autotest
const getAutotestTask = (token, method, data, id='') => mainInstance({url: autotest+id, method: method, data: data, headers: { Authorization: "JWT " + token}})
const getAutotestLog = (token, method, data, id='') => mainInstance({url: autotestLog+id, method: method, data: data, headers: { Authorization: "JWT " + token}})

// Url Monitoring
const getMonitoringList = (token) => mainInstance({url: monitoringTask, method: get, headers: { Authorization: "JWT " + token}})
const createMonitoringTask = (token, method, data) => mainInstance({url: monitoringTask, method: method, data: data, headers: { Authorization: "JWT " + token}})
const getMonitoringTask =  (token,id='' , method, data) => mainInstance({url: monitoringTask+id, method: method, data: data, headers: { Authorization: "JWT " + token}})
const getMonitoringResult =  (token,id='' , method, data) => mainInstance({url: monitoringResult+id, method: method, data: data, headers: { Authorization: "JWT " + token}})
const getMonitoringResponse =  (token,id='' ) => mainInstance({url: monitoringResponse+id, method: get, headers: { Authorization: "JWT " + token}})

export {
  doLogin, doRegister,
  getTask, getAllTask, createTask, updateTask, deleteTask, getTaskResult, getEditMemo, getSchedule, 
  getLocCount, getLocResult, getLocReport,
  getDastTask, getDastReport, getDastDetail, getDastEditMemo,
  getOverview, getRecentTasks, getAutotestTask, getAutotestLog,
  getMonitoringList, createMonitoringTask, getMonitoringTask,getMonitoringResult,getMonitoringResponse
}

export default function callApiScanTask(id, method = 'GET', data) {
  const token = localStorage.getItem(tokenName);
  return axios({
    method: method,
    url: mainApi+scanTask+id,
    data: data,
    headers: {
      Authorization: "JWT " + token
    }
  }).catch(err => {
    if (err.response.status === 401) {
      window.location = '/login';
    }else {
      return Promise.reject(err);
    }
  });
}