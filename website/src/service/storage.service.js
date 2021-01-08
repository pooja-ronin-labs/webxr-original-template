const storageService = {
    getCookie(cname){
        let nameEQI = cname + "=";
        let ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQI) == 0) return c.substring(nameEQI.length,c.length);
        }
        return null;
    },
    setCookie(cname,value){
        document.cookie = cname + "=" + (value || "")  + "; Path=/;";
    },
    deleteCookie(cname) {   
        document.cookie = cname +'=; Path=/;';
    }
}

export default storageService;