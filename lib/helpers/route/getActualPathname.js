const getActualPathname = (path) => {
    // let path is api/v1/user/get/:id
    const splitedPath = path.split("/");
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
    // OUTPUT: {splitedPath:["api","v1","user","get",":id"],params:[{id:4}]} // here params property of OUTPUT OBJECT contains the params name and it's index in the splited path array;
    return props;
}

module.exports = getActualPathname