/*
 * Festa-node
 *
 * web framework for node
 *
 * Copyright(c) 2011 plasticscafe <plasticscafe@gmail.com>
 */
/*** includet ***/
var http = require('http'),
    url = require('url'),
    util = require('util')
/*** festa ***/ 
exports.apps = []
// setting route
exports.routes = {}
exports.route = function(path, func){
    var re_path = path.replace(/(:[^\/]+)/g, '([^\\/]+)')
    var args = [] 
    var items = path.match(new RegExp(re_path))
    items.shift()
    for(item in items){
        if(item == 'index') break
        args.push(items[item].replace(/^:/, ''))
    }
    exports.routes[re_path] = {'func':func, 'args':args}
} 
exports.before = function(){
 // ルーティングを追加
} 

exports.after = function(){
 // ルーティングを追加
} 
exports.server = http.createServer()
// debug setting
exports.debug = false
// render
exports.execute = function(apps){
    return function(req, res){
        check = false
        for(route in exports.routes){
            var re = new RegExp('^' + route + '$')
            if(re.test(req.url)){
                check = true
                args = req.url.match(re)
                args.shift()
                exports.c.args = []; 
                for(arg in args){
                    if(arg == 'input') break
                    exports.c.args[exports.routes[route]['args'][arg]] = args[arg]
                }
                break
            }
        }
        if(!check) return
        exports.c.req = req
        // execute
        var r = exports.routes[route]['func'](exports.c)
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
