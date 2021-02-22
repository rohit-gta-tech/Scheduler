import { useEffect, useReducer } from 'react';
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  }) 

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value }
      case SET_APPLICATION_DATA:
        return { ...state, days: action.value[0].data, appointments: action.value[1].data, interviewers: action.value[2].data }
      case SET_INTERVIEW: {
        const [ id, interview ] = action.value;
        const appointment = {
          ...state.appointments[id],
          interview: interview ? { ...interview } : null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        const days = [...state.days].map(eachDay => {
          if(eachDay.appointments.includes(id)) {
            let spots = {...eachDay}.spots;
            if ({...state}.appointments[id].interview && !interview) {
              spots++;
            } else if ({...state}.appointments[id].interview === null && interview){
              spots--;
            }
              return {...eachDay, spots: spots}
          } else {
              return {...eachDay}
          }
       })
        return { ...state, appointments, days }
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  
    const setDay = day => dispatch({type: SET_DAY, value:day});
    
    useEffect(() => {
      const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
      webSocket.onopen = function() {
      };
      webSocket.onmessage = function(event) {
        const { id, interview } = JSON.parse(event.data);
        dispatch({type: SET_INTERVIEW, value: [id, interview]})
      };

        Promise.all([axios.get('/api/days'), axios.get('/api/appointments'), axios.get('/api/interviewers')])
        .then(response => {
          dispatch({type: SET_APPLICATION_DATA, value: response});
        })
    }, [])


  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview }).then(() =>  {
      return
    })
  }

  function removeInterview(id) {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      return
    })
  }

  return { state, setDay, bookInterview, removeInterview }
    
}