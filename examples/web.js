/*** apps ***/
var festa = require('../festa')
var log = festa.log 
festa.debug = true
/*** apps ***/
festa.route('/', function(c){
    log(c.req.url + ' "' + c.req.headers['user-agent'] + '"')
    return c.render('Hello Node')
})
festa.route('/hoge/:val1/', function(c){
    log('call hoge :args ' + c.args['val1'])
    return c.render('Hello Node hoge! val1:' + c.args['val1'])
})
festa.route('/hoge/:val1/huga/:val2', function(c){
    log('call huga :args ' + c.args['val1'] + ' & ' + c.args['val2'])
    log('get params: ' + c.params['key'])
    return c.render('Hello Node huga! val1:' + c.args['val1'] + ' val2:' + c.args['val2'])
})
/*** before ***/
festa.before(function(c){
    log('before1 call')
})
festa.before(function(c){
    log('before2 call')
})
/*** after ***/
festa.after(function(c){
    log('after1 call')
})
festa.after(function(c){
    log('after2 call')
})
/*** run ***/
festa.run()
