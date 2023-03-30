

function handleViewStats(isUnique){
    fetch("/api/stats/addview", {
        method: 'POST',
        body: JSON.stringify({
            isUnique,
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

export default function addViewStat(){
    if (localStorage.getItem("hasVisited")){
        handleViewStats(false);
    }
    else {
        localStorage.setItem("hasVisited","true");
        handleViewStats(true);
    }
    
}
