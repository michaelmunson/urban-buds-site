import date from "date-and-time";
import { isInCurrentWeek, isToday } from "./date";


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

export function addViewStat(){
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
            month : {},
            year : {},
        },
        orders : {
            day : [],
            week : [],
            month : [],
            year : [],
        },
        setDayViews(){
            for (let i = 0; i <= 24; i += 3){
                const allViewsArr = allViews
                    .filter(view => isToday(new Date(view.timestamp)))
                    .filter(view => {
                    const HH = parseInt(date.format(new Date(view.timestamp),"HH"));
                    return (HH >= i && HH < i+3)
                });
                const uniqueViewsArr = uniqueViews
                    .filter(view => isToday(new Date(view.timestamp)))
                    .filter(view => {
                    const HH = parseInt(date.format(new Date(view.timestamp),"HH"));
                    return (HH >= i && HH < i+3)
                });
                this.views.day.datasets[0].data.push(uniqueViewsArr.length);
                this.views.day.datasets[1].data.push(allViewsArr.length);
            }
        },
        setWeekViews(){
            for (let i = 0; i < 7; i += 1){
                const allViewsArr = allViews
                    .filter(view => isInCurrentWeek(new Date(view.timestamp)))
                    .filter(view => new Date(view.timestamp).getDay() === i);
                const uniqueViewsArr = uniqueViews
                    .filter(view => isInCurrentWeek(new Date(view.timestamp)))
                    .filter(view => new Date(view.timestamp).getDay() === i);
                this.views.week.datasets[0].data.push(uniqueViewsArr.length);
                this.views.week.datasets[1].data.push(allViewsArr.length);
            }
            console.log(this.views);
        }
    }
    data.setDayViews();
    data.setWeekViews();
    return {views:data.views, orders:data.orders};
}