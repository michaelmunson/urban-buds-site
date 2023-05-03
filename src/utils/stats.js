import date from "date-and-time";
import { isInCurrentMonth, isInCurrentWeek, isInCurrentYear, isToday } from "./date";
import { isLocalhost } from "./location";


function handleViewStats(isUnique){
    fetch("/api/stats/addview", {
        method: 'POST',
        body: JSON.stringify({
            isUnique,
            timestamp : Date.now()
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
    })
    .then(async res => {
        const result = await res.json();
    })
    .catch(err=>console.log(err));
}

export function addViewStat(options = {localhost:false}){
    if (!options.localhost && isLocalhost()) return;

    if (localStorage.getItem("hasVisited")){
        handleViewStats(false);
    }
    else {
        localStorage.setItem("hasVisited","true");
        handleViewStats(true);
    }
    
}

export async function getViewStats(){
    const res = await fetch("/api/get/views");
    const resjson = await res.json();
    const views = resjson.views.sort(function(x,y){
        return x.timestamp - y.timestamp;
    });

    return {
        allViews : views,
        uniqueViews : views.filter(view => view.isUnique)
    };
}

export async function getOrderStats(){
    const res = await fetch("/api/get/orders");
    const {orders} = await res.json();
    return orders;
}

export async function getStats(){
    const orders = await getOrderStats();
    const views = await getViewStats();
    return {orders,views}
}

export async function formatStats(){
    const {orders,views} = await getStats();
    const {allViews,uniqueViews} = views;
    const data = {
        views : {
            day : {
                labels : ["0:00","3:00","6:00","9:00","12:00","15:00","18:00","21:00","23:59"],
                datasets : [
                    {
                        label : "Unique Views",
                        data : [],
                        borderColor : "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.5)"
                    },
                    {
                        label : "Total Views",
                        data : [],
                        borderColor : "rgb(53, 162, 235)",
                        backgroundColor: "rgba(53, 162, 235, 0.5)"
                    }
                ]
            },
            week : {
                labels : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                datasets : [
                    {
                        label : "Unique Views",
                        data : [],
                        borderColor : "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.5)"
                    },
                    {
                        label : "Total Views",
                        data : [],
                        borderColor : "rgb(53, 162, 235)",
                        backgroundColor: "rgba(53, 162, 235, 0.5)"
                    }
                ]
            },
            month : {
                labels : ["Week 1","Week 2","Week 3","Week 4","Week 5"],
                datasets : [
                    {
                        label : "Unique Views",
                        data : [],
                        borderColor : "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.5)"
                    },
                    {
                        label : "Total Views",
                        data : [],
                        borderColor : "rgb(53, 162, 235)",
                        backgroundColor: "rgba(53, 162, 235, 0.5)"
                    }
                ]
            },
            year : {
                labels : ["January","February","March","April","May","June","July","August","September","October","November","December"],
                datasets : [
                    {
                        label : "Unique Views",
                        data : [],
                        borderColor : "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.5)"
                    },
                    {
                        label : "Total Views",
                        data : [],
                        borderColor : "rgb(53, 162, 235)",
                        backgroundColor: "rgba(53, 162, 235, 0.5)"
                    }
                ]
            },
        },
        orders : {
            day : {
                labels : ["0:00","3:00","6:00","9:00","12:00","15:00","18:00","21:00","23:59"],
                datasets : [
                    {
                        label : "Orders",
                        data : [],
                        borderColor : "green",
                        backgroundColor: "green"
                    }
                ]
            },
            week : {
                labels : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                datasets : [
                    {
                        label : "Orders",
                        data : [],
                        borderColor : "green",
                        backgroundColor: "rgba(0,128,1,.5)"
                    }
                ]
            },
            month : {
                labels : ["Week 1","Week 2","Week 3","Week 4","Week 5"],
                datasets : [
                    {
                        label : "Orders",
                        data : [],
                        borderColor : "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.5)"
                    }
                ]
            },
            year : {
                labels : ["January","February","March","April","May","June","July","August","September","October","November","December"],
                datasets : [
                    {
                        label : "Orders",
                        data : [],
                        borderColor : "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.5)"
                    }
                ]
            },
        },
        /* VIEWS */
        setDayViews(){
            for (let i = 0; i <= 24; i += 3){
                const allViewsArr = allViews
                    .filter(view => isToday(new Date(view.timestamp)))
                    .filter(view => {
                        const hour = new Date(view.timestamp).getHours();
                        return (hour >= i && hour < i+3)
                });
                const uniqueViewsArr = uniqueViews
                    .filter(view => isToday(new Date(view.timestamp)))
                    .filter(view => {
                        const hour = new Date(view.timestamp).getHours();
                        return (hour >= i && hour < i+3)
                });
                this.views.day.datasets[0].data.push(uniqueViewsArr.length);
                this.views.day.datasets[1].data.push(allViewsArr.length);
            }
        },
        setWeekViews(){
            for (let i = 0; i < 7; i ++){
                const allViewsArr = allViews
                    .filter(view => isInCurrentWeek(new Date(view.timestamp)))
                    .filter(view => new Date(view.timestamp).getDay() === i);
                const uniqueViewsArr = uniqueViews
                    .filter(view => isInCurrentWeek(new Date(view.timestamp)))
                    .filter(view => new Date(view.timestamp).getDay() === i);
                this.views.week.datasets[0].data.push(uniqueViewsArr.length);
                this.views.week.datasets[1].data.push(allViewsArr.length);
            }
        },
        setMonthViews(){
            for (let i = 1; i <= 31; i+=7){
                const allViewsArr = allViews
                    .filter(view => isInCurrentMonth(new Date(view.timestamp)))
                    .filter(view => {
                        return (
                            new Date(view.timestamp).getDay() >= i 
                            && new Date(view.timestamp).getDay() <= i+6
                        )
                    });
                const uniqueViewsArr = uniqueViews
                    .filter(view => isInCurrentMonth(new Date(view.timestamp)))
                    .filter(view => {
                        return (
                            new Date(view.timestamp).getDay() >= i 
                            && new Date(view.timestamp).getDay() <= i+6
                        )
                    });
                this.views.month.datasets[0].data.push(uniqueViewsArr.length);
                this.views.month.datasets[1].data.push(allViewsArr.length);
            }
        },
        setYearViews(){
            for (let i = 0; i < 12; i++){
                const allViewsArr = allViews
                    .filter(view => isInCurrentYear(new Date(view.timestamp)))
                    .filter(view => new Date(view.timestamp).getMonth() === i);
                const uniqueViewsArr = uniqueViews
                    .filter(view => isInCurrentYear(new Date(view.timestamp)))
                    .filter(view => new Date(view.timestamp).getMonth() === i);
                this.views.year.datasets[0].data.push(uniqueViewsArr.length);
                this.views.year.datasets[1].data.push(allViewsArr.length);
            }
        },
        /* ORDERS */
        setDayOrders(){
            for (let i = 0; i <= 24; i += 3){
                const ordersArr = orders
                    .filter(ord => isToday(new Date(ord.timestamp)))
                    .filter(ord => {
                        const hour = new Date(ord.timestamp).getHours();
                        return (hour >= i && hour < i+3)
                });
                this.orders.day.datasets[0].data.push(ordersArr.length);
            }
        },
        setWeekOrders(){
            for (let i = 0; i < 7; i ++){
                const ordersArr = orders
                    .filter(ord => isInCurrentWeek(new Date(ord.timestamp)))
                    .filter(ord => new Date(ord.timestamp).getDay() === i);
                this.orders.week.datasets[0].data.push(ordersArr.length);
            }
        },
        setMonthOrders(){
            for (let i = 1; i <= 31; i+=7){
                const ordersArr = orders
                    .filter(ord => isInCurrentMonth(new Date(ord.timestamp)))
                    .filter(ord => {
                        return (
                            new Date(ord.timestamp).getDay() >= i 
                            && new Date(ord.timestamp).getDay() <= i+6
                        )
                    });
                this.orders.month.datasets[0].data.push(ordersArr.length);
            }
        },
        setYearOrders(){
            for (let i = 0; i < 12; i++){
                const ordersArr = orders
                    .filter(ord => isInCurrentYear(new Date(ord.timestamp)))
                    .filter(ord => new Date(ord.timestamp).getMonth() === i);
                this.orders.year.datasets[0].data.push(ordersArr.length);
            }
        },
        
    }
    data.setDayViews();
    data.setWeekViews();
    data.setMonthViews();
    data.setYearViews();

    data.setDayOrders();
    data.setWeekOrders();
    data.setMonthOrders();
    data.setYearOrders();
    return {views:data.views, orders:data.orders};
}