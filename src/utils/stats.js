
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
        views,
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