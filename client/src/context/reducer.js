import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  EDIT_JOB,
  DELETE_JOB_BEGIN,
  UPDATE_JOB_BEGIN,
  UPDATE_JOB_SUCCESS,
  UPDATE_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  HANDLE_SEARCH,
  CHANGE_PAGE,
} from "./actions";

const reducer = (state, action) => {
  switch (action.type) {
    case DISPLAY_ALERT:
      return {
        ...state,
        showAlert: true,
        alertType: "danger",
        alertText: "Please provide all values",
      };
    case CLEAR_ALERT:
      return {
        ...state,
        showAlert: false,
        alertType: "",
        alertText: "",
      };
    case HANDLE_CHANGE:
      return {
        ...state,
        job:{
          ...state.job,
          [action.payload.name]: action.payload.value
        }
      };
    case HANDLE_SEARCH:
      return {
        ...state,
        currentPage: 1,
        search: {
          ...state.search,
          [action.payload.name]: action.payload.value
        }
      }
    case CLEAR_VALUES:
      const initialState = {
        isEditing: false,
        job: {
          editJobId: '',
          position: '',
          company: '',
          location: state.userLocation,
          type: 'full-time',
          typeOptions: ["full-time", "part-time", "remote", "internship"],
          status: 'pending',
          statusOptions: ["pending", "interview", "declined"],
        }
      };
      return {...state, ...initialState};
    case CLEAR_FILTERS:
      return {
        ...state,
        search: {
          text: '',
          status: 'all',
          type: 'all',
          sort: 'latest',
          sortOptions: ['latest', 'oldest', 'A-Z', 'Z-A']
        }
      };
    case CHANGE_PAGE:
      return {...state, currentPage: action.payload.page}
    case REGISTER_USER_BEGIN:
    case LOGIN_USER_BEGIN:
    case SETUP_USER_BEGIN:
    case UPDATE_USER_BEGIN:
    case CREATE_JOB_BEGIN:
    case UPDATE_JOB_BEGIN:
    case DELETE_JOB_BEGIN:
    case SHOW_STATS_BEGIN:
      return { ...state, isLoading: true, showAlert: false };
    case REGISTER_USER_SUCCESS:
    case LOGIN_USER_SUCCESS:
    case SETUP_USER_SUCCESS:
    case UPDATE_USER_SUCCESS:
      console.log(action);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        userLocation: action.payload.location,
        jobLocation: action.payload.location,
        isLoading: false,
        showAlert: true,
        alertType: "success",
        alertText: action.payload.alertText,
      };
    case CREATE_JOB_SUCCESS:
    case UPDATE_JOB_SUCCESS:
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertType: 'success',
        alertText: 'Job saved',
      }
    case REGISTER_USER_ERROR:
    case LOGIN_USER_ERROR:
    case SETUP_USER_ERROR:
    case UPDATE_USER_ERROR:
    case CREATE_JOB_ERROR:
    case UPDATE_JOB_ERROR:
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertType: "danger",
        alertText: action.payload.msg,
      };
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        showSidebar: !state.showSidebar
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: null,
        token: null,
        userLocation: '',
        jobLocation: ''
      };
    case GET_JOBS_BEGIN:
      return {...state, isLoading: true, showAlert: false};
    case GET_JOBS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        jobList: action.payload.jobList,
        totalJobs: action.payload.totalJobs,
        totalPages: action.payload.totalPages,
      };
    case EDIT_JOB:
      const job = state.jobList.find((job) => job._id === action.payload.id);
      const {_id, position, company, location, type, status} = job;

      return {
        ...state,
        isEditing: true,
        job: {
          ...state.job,
          id: _id,
          position,
          company,
          location,
          type,
          status
        }
      };
    
    case SHOW_STATS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        stats: action.payload.stats,
        monthlyApplications: action.payload.monthlyApplications
      };

    default:
      throw new Error(`no such action: ${action.type}`);
  }
};

export default reducer;
