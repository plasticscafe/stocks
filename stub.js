/*
 * Stocks
 *
 * Stub & Mock Support Tools 
 *
 * Author: plasticscafe <plasticscafe@gmail.com>
 */
/*** include ***/
var http = require('http'),
  url = require('url'),
  util = require('util'),
  qs = require('querystring')
/*** apps ***/ 
var apps = []
// setting route
var routes = {}
var route = function(path, func){
  var rePath = path.replace(/(:[^\/]+)/g, '([^\\/]+)')
  var args = [] 
  var items = path.match(new RegExp(rePath))
  items.shift()
  for(item in items){
    if(item == 'index') break
    args.push(items[item].replace(/^:/, ''))
  }
  routes[rePath] = {'func':func, 'args':args}
} 
// before process
var befores = []
var before = function(func){
  befores.push(func)
} 
// after process
var afters = []
var after = function(func){
  afters.push(func)
} 
var server = http.createServer()
// debug setting
var debug = false
// render
var execute = function(apps){
  return function(req, res){
    // get params
    var url_parts = url.parse(req.url, true)
    var url_path = url_parts.pathname
    if(req.method=='POST'){
        var body=''
        req.on('data', function(data){ body +=data })
        req.on('end',function(){ 
          var posts = qs.parse(body)
          for(key in posts) c.params[key] = posts[key] 
        })
    }else if(req.method=='GET'){
      var gets = url_parts.query
      for(key in gets) c.params[key] = gets[key] 
    }
    // setting routes
    check = false
    for(route in routes){
      var re = new RegExp('^' + route + '$')
      var pathname = url.parse(req.url).pathname 
      if(re.test(pathname)){
        check = true
        args = url_path.match(re)
        args.shift()
        c.args = []; 
        for(arg in args){
          if(arg == 'input') break
          c.args[routes[route]['args'][arg]] = args[arg]
        }
        break
      }
    }
    if(!check){
      res.writeHead(404)
      res.end('Sorry, no defined routes')
      return
    }
    c.req = req
    // before methods
    for(before in befores) befores[before](c)
    // execute
    var r = routes[route]['func'](c)
    /* render */
    res.writeHead(r['code'], {'Content-Type': r['type'] })
    res.end(r['res'])
    // after methods
    for(after in afters) afters[after](c)
  }
}
var run = function(port){
  server.on('request', execute(apps))
  if(port == undefined) port = 5000 
  server.listen(port)
}
// define c
var c = function(){}
c.render = function(res, code, type){
  if(res == undefined) res = '' 
  if(code == undefined) code = 200 
  if(type == undefined) type = 'text/plain' 
  return {'res':res, 'code':code, 'type':type} 
}
c.params = []
// logger
var log = function(mes, level){
  if(level == undefined) level = 3 
  if(log.level <= level) console.log(mes) 
}
log.level = 3 // default debug level 
// ------------- setting route -------------------
var json = require('./datas/res.json');
for(i in json.routes){
  (function(){
    var r = json.routes[i];
    route(r.path, function(c){
      log(r.desc)
      var cands = [];
      for( j in r.data){
        var args = r.data[j].args
        var params = r.data[j].params
        var res = r.data[j].res
        var check = true; 
        if(typeof(args) === 'object' && Object.keys(args).length > 0){
          for(m in args){
            if(c.args[m] != args[m]) check = false;
          }
        }
        if(typeof(params) === 'object' && Object.keys(params).length > 0){
          for(m in params){
            if(c.params[m] != params[m]) check = false;
          }
        }
        if(check === true){
          var response = (typeof(res) === 'object') ? JSON.stringify(res) : res;
          console.log(response)
          return c.render(response);
        }
      }
      return c.render("Ooops! no defined Conditions")
    })
  })();
}
// ------------- run -------------------
run();

