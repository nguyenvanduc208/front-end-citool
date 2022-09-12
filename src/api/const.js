export const mainApi = process.env.REACT_APP_MAIN_API

export const mainPath = {
  task: 'api/jmeter/task',
  token: 'api/auth/token/',
  login: 'api/auth/login/',
  register: 'api/auth/users/',
  scanTask: 'api/scan/task',
  scanresult: 'api/scan/task/',
  editMemo: 'api/scan/result/',
  scanSchedule: 'api/scan/schedule',
  dastScanTask: 'api/dast/task',
  dastScanReport: 'api/dast/download',
  dastDetail: 'api/dast/result/',
  clocTask: 'api/cloc/task',
  clocResult: 'api/cloc/result/',
  clocReport: 'api/cloc/download/',
  dashboardOverview: 'api/scan/overview',
  recentTaskInfo: 'api/scan/recent',
  monitoringTask: 'api/monitor/task',
  monitoringResult: 'api/monitor/task/',
  monitoringResponse: 'api/monitor/response/',
  autotest: 'api/autotest/task',
  autotestLog: 'api/autotest/logs/' 
}

export const METHODS = {
  get: 'get',
  post: 'post',
  put: 'put',
  del: 'delete',
}

export const STATUS = {
  RUNNING: "RUNNING",
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  ERROR: "ERROR",
}

export const tokenName = "citool_token"
export const userName = "citool_user"
