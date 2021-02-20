export function getAppointmentsForDay(state, day) {
   const filteredDay = state.days.filter(eachDay => eachDay.name === day)
   if (!filteredDay.length) return [];
   const aptsForFilteredDay = filteredDay[0].appointments.map(apId => {
       return {...{...state.appointments}[apId]}
   })
   return aptsForFilteredDay;
}

export function getInterview(state, interview) {
    return interview && {...interview, interviewer: {...{...state.interviewers}[interview.interviewer]}}
}

export function getInterviewersForDay(state, day) {
    const filteredDay = state.days.filter(eachDay => eachDay.name === day)
   if (!filteredDay.length) return [];
   const interviewersForFilteredDay = filteredDay[0].interviewers.map(intId => {
       return {...{...state.interviewers}[intId]}
   })
   return interviewersForFilteredDay;
}