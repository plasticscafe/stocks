#########################################
# simple web application framework Festa 
#########################################

#########################################
# create app file

# require Festa  
var festa = require('festa')
# prepare festa apps
var app = festa.apps
# method define
app.index = function(req, c){
    # render text
    return c.render('Hello Node!!')
}
# render start
festa.run()

########################################
# run

$ node web.js

########################################
# browser (default port 5000)

http://localhost:5000/

########################################
# url rule

/       -> index
/method -> method

# use param devopping now ....
