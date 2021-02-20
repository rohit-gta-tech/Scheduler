import { useState, useEffect } from 'react';
import axios from "axios";

export default function useApplicationData() {
    const [state, setState] = useState({
        day: "Monday",
        days: [],
        appointments: {},
        interviewers: {}
      })
    
    const setDay = day => setState({ ...state, day });
    
    useEffect(() => {
        Promise.all([axios.get('/api/days'), axios.get('/api/appointments'), axios.get('/api/interviewers')])
        .then(responses => {
          setState(prev => ({...prev, days: responses[0].data, appointments: responses[1].data, interviewers: responses[2].data}));
        })
    }, [])


  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = [...state.days].map(eachDay => {
        if(eachDay.appointments.includes(id)) {
            return {...eachDay, spots: {...eachDay}.spots - 1}
        } else {
            return {...eachDay}
        }
    })
    
    return axios.put(`/api/appointments/${id}`, { interview }).then(() =>  {
      setState((prev) => {
        return { ...prev, appointments, days}
      })
    })
  }

  function removeInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = [...state.days].map(eachDay => {
        if(eachDay.appointments.includes(id)) {
            return {...eachDay, spots: {...eachDay}.spots + 1}
        } else {
            return {...eachDay}
        }
    })

    return axios.delete(`/api/appointments/${id}`).then(() => {
      setState((prev) => {
        return { ...prev, appointments, days}
      })
    })
  }

  return { state, setDay, bookInterview, removeInterview }
    
}