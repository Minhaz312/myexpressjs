const has = (data,key) => {
    if(data[key]!==undefined && data[key]!==null && data[key]!==""){
        return true
    }else{
        return false;
    }
}

module.exports = has;