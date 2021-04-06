const express_server = require('./server/express_server');
const indexRouter = require('./server/routes/index');
const usersRouter = require('./server/routes/users');
const oauth2_client = require('./security/oauth2_client');
const parseurl = require('parseurl')
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
//TODO:remove accidently added nodejs modules to git.
//**********************************************************************************************************************
express_server.use('/', indexRouter);
express_server.use('/users', usersRouter);
//**********************************************************************************************************************
//demonstrate user session
//demonstrate oauth2 client using authorization code grant
express_server.use(function (req, res, next) {
    if (!req.session.views) {
        req.session.views = {}
    }
    // get the url pathname
    var pathname = parseurl(req).pathname
    // count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
    next()
});

//check the session to see if there is a access token.
//create a access token persistence store

express_server.get('/foo', function (req, res, next) {
    res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
    console.info(req.url);
    console.info(req.originalUrl);
});

express_server.get('/bar', function (req, res, next) {
    res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
});

//TODO: if the user is redirected then I need to save the original request during a redirect.
//TODO: i need a request store. The key will be the state UUID.
//TODO: create RequestCache,
//TODO: org.springframework.security.web.savedrequest.RequestCache
//TODO: org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler
//TODO: org.springframework.security.web.access.ExceptionTranslationFilter: stores the original request when the user is not authenticated but needs to be
//TODO: org.springframework.security.web.savedrequest.RequestCacheAwareFilter: tries to match the current request, if it does match get the matching one and remove it from the cache, used for redirection
//**********************************************************************************************************************
//demonstrate oauth2 client using authorization code grant
express_server.get('/auth/github', function (req, res) {
    console.info("method called is /auth/github");
    console.info("1------------------- request is:          " + req.url + " --------------------------------------------");
    console.info("1------------------- original request is: " + req.originalUrl + " --------------------------------------------");
    const uri = oauth2_client.code.getUri({state: uuidv4()})
    //TODO: if the user is redirected then I need to save the original request during a redirect.
    res.redirect(uri)
});

express_server.get('/auth/github/callback', function (req, res, next) {
    console.info("method called is /auth/github/callback");
    let uuid = uuidv4();
    uuid = uuid.replace("-","")
    //aouth2_client.options.state = "12567567567345";
    console.info("2------------------- request is:          " + req.url + " --------------------------------------------");
    console.info("2------------------- original request is: " + req.originalUrl + " --------------------------------------------");
    oauth2_client.code.getToken(req.originalUrl)
        .then(function (userToken) {
            console.info("print access token");
            console.log(userToken) //=> { accessToken: '...', tokenType: 'bearer', ... }

            //TODO: save the access token to session object
            //TODO: i have added all the necessary javascript files, just need to complete

            // Refresh the current users access token.
            // user.refresh().then(function (updatedUser) {
            //   console.log(updatedUser !== user) //=> true
            //   console.log(updatedUser.accessToken)
            // })
            // Sign API requests on behalf of the current user.
            const signedRequest = userToken.sign({
                method: 'get',
                url: 'https://api.github.com/user'
            });
            const apiResonse = (async (signedRequest) => {
                const apiResponse = await axios.request(signedRequest);
                return apiResponse.data;
            })(signedRequest);
            apiResonse
                .then((apiResponse) => res.send(apiResponse))
                .catch((error) => next(error));
        });

//***********************************************************************************************************************
//TODO: find out how error handlers work.
// catch 404 and forward to error handler
    express_server.use(function (req, res, next) {
        next(createError(404));
    });

//TODO: find out how error handlers work.
// error handler
    express_server.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
});
module.exports = express_server;
