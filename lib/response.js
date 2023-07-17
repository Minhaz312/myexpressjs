const send = (res,status=200,data={}) =>{
    const STATUS = status;
    const DATA = data;
    res.statusCode = status;
    res.write(JSON.stringify(DATA))
    res.end()
}
module.exports = send