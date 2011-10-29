/*** apps ***/
var festa = require('../festa')
var app = festa.apps, log = festa.log
festa.debug = true
app.index = function(req, c){
    log(req.url + ' "' + req.headers['user-agent'] + '"')
    return c.render('Hello Node')
}
festa.run()
