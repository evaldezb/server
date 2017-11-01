# server
Api server to connect to the database

On the app.js file there is a import to local settings:
const localConfiguration = require('./config')

that file need to be in the same directory as the app.js file in order to work properly.

The file look like this:

`const connectionString = 'Driver={SQL Server Native Client 11.0};Server={<DATABSE_SERVER>};Database={<DATABASE_NAME>};Trusted_Connection={yes};'

const selectScript = 'SELECT <COLUMNS> FROM <TABLE>'

exports.ConnectionString = function () {
  return connectionString
}

exports.SelectStatament = function () {
  return selectScript
}

exports.SelectWhereStatament = function (id) {
  return ${selectScript} WHERE [ID] = ${id}
}`
/*
This file is ignored due to containing sensitive information
 */
