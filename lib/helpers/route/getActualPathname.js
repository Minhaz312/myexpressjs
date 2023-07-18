const getActualPathname = (path,method) => {
    const splitedPath = path.substring(1).split("/");
    let params = []
    let props = {}
    splitedPath.map((item,i)=>{
        if(item.indexOf(":")>=0){
            let paramsVal = {}
            paramsVal[item.substring(1,item.length)] = i
            params.push(paramsVal)
        }
    })
    props.splitedPath = splitedPath
    props.params = params
    return props;
}

module.exports = getActualPathname