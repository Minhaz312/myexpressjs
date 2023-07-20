const send = (res,status=200,data={}) =>{
    const STATUS = status;
    const DATA = data;
    res.statusCode = status;
    res.write(typeof data === "object"?JSON.stringify(DATA):DATA)
    res.end()
}
module.exports = send