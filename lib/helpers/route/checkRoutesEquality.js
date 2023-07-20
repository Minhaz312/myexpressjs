const checkRoutesEquality = (route1,route2) => {
    const route1Splited = route1.split("/")
    const route2Splited = route2.split("/")
    let equal;
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
    return equal;
}

module.exports = checkRoutesEquality;