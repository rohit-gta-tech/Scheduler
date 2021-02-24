import { useEffect, useReducer } from 'react';
import axios from "axios";
import { reducer, SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } from "reducers/application";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  }) 
    const setDay = day => dispatch({type: SET_DAY, value:day});
    
    useEffect(() => {
      //WebSocket disabled for testing purposes
      /*const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
      webSocket.onopen = function() {
      };
      webSocket.onmessage = function(event) {
        const { id, interview } = JSON.parse(event.data);
        dispatch({type: SET_INTERVIEW, value: [id, interview]})
      };*/

        Promise.all([axios.get('/api/days'), axios.get('/api/appointments'), axios.get('/api/interviewers')])
        .then(response => {
          dispatch({type: SET_APPLICATION_DATA, value: response});
        })
    }, [])


  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview }).then(() =>  {
      dispatch({type: SET_INTERVIEW, value: [id, interview]})
    })
  }

  function removeInterview(id) {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      dispatch({type: SET_INTERVIEW, value: [id, null]})
    })
  }

  return { state, setDay, bookInterview, removeInterview }
    
}