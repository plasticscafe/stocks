/*** includet ***/
var http = require('http'),
    url = require('url'),
    util = require('util')
/*** festa ***/ 
exports.apps = new Array
exports.server = http.createServer()
// debug setting
exports.debug = false
// render
exports.execute = function(apps){
    return function(req, res){
        var app = (req.url != '/') ? req.url : 'index'  
        var r = apps[app](req, exports.c)
        /* render */
        res.writeHead(r['code'], {'Content-Type': r['type'] })
        res.end(r['res'])
    }
}
exports.run = function(port){
    exports.server.on('request', exports.execute(exports.apps))
    if(port == undefined) port = 5000 
    exports.server.listen(port)
}
// define c
exports.c = function(){}
exports.c.render = function(res, code, type){
    if(res == undefined) res = '' 
    if(code == undefined) code = 200 
    if(type == undefined) type = 'text/plain' 
    return {'res':res, 'code':code, 'type':type} 
}
// logger
exports.log = function(mes, level){
    if(level == undefined) level = 3 
    if(exports.log.level <= level) console.log(mes) 
}
exports.log.level = 3 // default debug level 
