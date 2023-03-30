

export function isAdminAuth(){
    if (localStorage.getItem("user")){
        return true;
    }
    return false;
}


