import React, { useState, useReducer, useContext, useEffect } from "react";
import axios from "axios";
import {
  CLEAR_ALERT,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  DISPLAY_ALERT,
  HANDLE_CHANGE,
  LOGIN_USER_BEGIN,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  REGISTER_USER_BEGIN,
  REGISTER_USER_ERROR,
  REGISTER_USER_SUCCESS,
  SETUP_USER_BEGIN,
  SETUP_USER_ERROR,
  SETUP_USER_SUCCESS,
  TOGGLE_SIDEBAR,
  UPDATE_USER_BEGIN,
  UPDATE_USER_ERROR,
  UPDATE_USER_SUCCESS,
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
import reducer from "./reducer";

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");
const location = localStorage.getItem("location");

export const initialState = {
  user: user ? JSON.parse(user) : null,
  token: token || "",
  userLocation: location || "",
  job: {
    editJobId: "",
    position: "",
    company: "",
    location: "",
    type: "",
    typeOptions: ["full-time", "part-time", "remote", "internship"],
    status: "",
    statusOptions: ["pending", "interview", "declined"],
  },
  jobList: [],
  totalJobs: 0,
  totalPages: 1,
  currentPage: 1,
  stats: {},
  monthlyApplications: [],
  search: {
    text: '',
    status: 'all',
    type: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest', 'A-Z', 'Z-A']
  },
  showSidebar: false,
  isLoading: false,
  isEditing: false,
  showAlert: false,
  alertText: "",
  alertType: "",
};
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const displayAlert = () => dispatch({ type: DISPLAY_ALERT });

  const clearAlert = (time) =>
    setTimeout(() => dispatch({ type: CLEAR_ALERT }), time || 3000);

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const handleSearch = ({ name, value }) => {
    dispatch({ type: HANDLE_SEARCH, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  const clearFilters = () => {
    dispatch({type: CLEAR_FILTERS});
  };

  const changePage = (page) => {
    dispatch({type: CHANGE_PAGE, payload: {page}});
  };

  const authFetch = axios.create({
    baseURL: "/api/v1",
    headers: {
      Authorization: `Bearer ${state.token}`,
    },
  });
  authFetch.interceptors.request.use(
    (config) => {
      config.headers.common["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      console.log(error.response);
      if (error.response.status === 401) console.log("Authentication error");
      return Promise.reject(error);
    }
  );
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error.response);
      if (error.response.status === 401) logoutUser();
      return Promise.reject(error);
    }
  );

  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("location");
  };

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });

    try {
      const response = await axios.post("api/v1/auth/register", currentUser);

      console.log(response);

      const { user, token, location } = response.data;

      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: {
          user,
          token,
          location,
        },
      });

      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      console.log(error);
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: {
          msg: error.response.data.msg,
        },
      });
    }

    clearAlert();
  };

  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });

    try {
      const { data } = await axios.post(`/api/v1/auth/login`, currentUser);
      const { user, token, location } = data;

      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, token, location },
      });

      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const logoutUser = async () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const setupUser = async ({ currentUser, endpoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });

    try {
      const { data } = await axios.post(
        `/api/v1/auth/${endpoint}`,
        currentUser
      );
      const { user, token, location } = data;

      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, token, location, alertText },
      });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });

    try {
      const { data } = await authFetch.patch("/auth/update-user", currentUser);
      const { user, location } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: {
          user,
          location,
          token,
          alertText: "User updated successfully",
        },
      });
      addUserToLocalStorage({ user, location, token: initialState.token });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }

    clearAlert();
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });

    try {
      const { job } = state;
      const { position, company, location, type, status } = job;

      await authFetch.post("/jobs", {
        company,
        position,
        location,
        type,
        status,
      });

      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
      
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({ CREATE_JOB_ERROR, payload: { msg: error.response.data.msg } });
    }

    clearAlert();
  };

  const setEditJob = (id) => {
    dispatch({type: EDIT_JOB, payload: {id}});
  };

  const updateJob = async () => {
    dispatch({type: UPDATE_JOB_BEGIN});

    try {
      const {position, company, location, type, status} = state.job;

      await authFetch.patch(`/jobs/${state.job.id}`, {
        company,
        position,
        location,
        type,
        status
      });

      dispatch({type: UPDATE_JOB_SUCCESS});
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if(error.response.status === 401) return;
      dispatch({type: UPDATE_JOB_ERROR, payload: {msg: error.response.data.msg}});      
    }
    clearAlert();
  }

  const deleteJob = async (id) => {
    dispatch({type: DELETE_JOB_BEGIN});

    try {
      await authFetch.delete(`/jobs/${id}`);
      listJobs();
    } catch (error) {
      logoutUser();
    }
  };

  const listJobs = async () => {
    const {currentPage, search} = state;
    const {text, status, type, sort} = search;

    let url = `/jobs?page=${currentPage}`
    url += `&search=${text}`
    url += `&status=${status}`
    url += `&jobType=${type}`
    url += `&sort=${sort}`

    dispatch({ type: GET_JOBS_BEGIN });

    try {
      const { data } = await authFetch(url);
      const { jobList, totalJobs, totalPages } = data;

      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: { jobList, totalJobs, totalPages }
      });
    } catch (error) {
      console.log(error.response);
      // logoutUser();
    }
    clearAlert();
  };

  const showStats = async () => {
    dispatch({type: SHOW_STATS_BEGIN});
    try {
      const {data} = await authFetch('/jobs/stats')
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.stats,
          monthlyApplications: data.monthlyApplications
        }
      });
    } catch (error) {
      console.log(error);
    }
    clearAlert();
  };


  useEffect(() => {
    listJobs();
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        handleChange,
        handleSearch,
        clearValues,
        clearFilters,
        changePage,
        registerUser,
        loginUser,
        logoutUser,
        setupUser,
        updateUser,
        createJob,
        setEditJob,
        updateJob,
        deleteJob,
        listJobs,
        showStats,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
