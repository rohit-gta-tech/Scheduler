export function getAppointmentsForDay(state, day) {
   const filteredDay = state.days.filter(eachDay => eachDay.name === day)
   if (!filteredDay.length) return [];
   const aptsForFilteredDay = filteredDay[0].appointments.map(apId => {
       return {...{...state.appointments}[apId]}
   })
   return aptsForFilteredDay;
}