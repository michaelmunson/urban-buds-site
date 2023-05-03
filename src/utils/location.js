
export function isLocalhost(){
    const {href} = window.location;
    return href.includes("localhost");
}

export function httpsRedirect(){
    const {href,protocol} = window.location;
    if (protocol === "http:" && !href.includes("localhost")){
        window.location.href = href.replace("http:","https:");
    }
}