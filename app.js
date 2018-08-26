const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const GraphQLSchema = require('./schema/schema');
const isAuthorized = require('./utils/isAuthorized');
const usersRoute = require('./routes/users');

const app = express();
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'application/graphql' }));
app.use(cookieParser());

/* Auth */
app.use(isAuthorized);
app.use('/graphql', graphqlHTTP((req, res) => ({
  schema: GraphQLSchema,
  context: { user: req.user, res },
  graphiql: true,
  formatError: error => ({
    message: error.message
  })
})));
app.use('/users', usersRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.end(err.message);
});

module.exports = app;
