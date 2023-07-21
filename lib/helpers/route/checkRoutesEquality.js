const checkRoutesEquality = (route1,route2) => {
    let equal;
    if(route1==="/" && route2==="/"){
        equal = true;
    }else{
        let route1Splited = []
        let route2Splited = []
        if(route1.indexOf("/")<0){
            route1Splited.push(route1);
        }else{
            route1Splited = route1.split("/")
        }
        if(route2.indexOf("/")<0){
            route2Splited.push(route2);
        }else{
            route2Splited = route2.split("/")
        }
        if(route1Splited.length!==route2Splited.length){
            equal = false;
        }else{
            for (let i = 0; i < route2Splited.length; i++) {
                if(route1Splited[i].toString()===[route2Splited[i]].toString()){
                    equal = true;
                }else{
                    equal = false;
                    i=route1Splited.length;
                }
            }
        }
    }
    return equal;
}

module.exports = checkRoutesEquality;