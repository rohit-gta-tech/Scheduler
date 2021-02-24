export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export function reducer(state, action) {
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
  