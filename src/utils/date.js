

export function isToday(someDate){
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
}

export function isInCurrentWeek(date) {
    const todayObj = new Date();
    const todayDate = todayObj.getDate();
    const todayDay = todayObj.getDay();
  
    // get first date of week
    const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));
  
    // get last date of week
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
  
    // if date is equal or within the first and last dates of the week
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
}

export function isInCurrentMonth(date) {
    const now = new Date();
    return (
        now.getMonth() === date.getMonth()
        && now.getFullYear() === date.getFullYear()
    )
}

export function isInCurrentYear(date) {
    const now = new Date();
    return now.getFullYear() === date.getFullYear();
}

