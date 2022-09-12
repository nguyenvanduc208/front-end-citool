import TYPE from 'actions';

const initialState = {tasks:[], dataRequesting: false, error: null, code: null}

const TaskManage = (state = initialState, action) => {
  switch (action.type) {
    // Get Task
    case TYPE.GET_TASK_REQUESTING:
      return {
        ...state,
        dataRequesting: true
      };
    case TYPE.GET_TASK_SUCCESS:
      return {
        ...state,
        dataRequesting: false,
        tasks: action.data,
        code: action.code,
        error: null,
      };
    case TYPE.GET_TASK_FAIL:
      return {
        ...state,
        dataRequesting: false,
        tasks: initialState.tasks,
        error: action.error,
        code: action.code,
      };
    
    case TYPE.CREATE_TASK_FAIL:
    return {
      ...state,
      dataRequesting: false,
      tasks: initialState.tasks,
      error: action.error,
      code: action.code,
    };

    default: 
      return state
  }
};

export default TaskManage;