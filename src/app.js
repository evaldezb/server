const express = require('express')
const bodyParser = require('body-parser')
const sql = require('mssql/msnodesqlv8')
const cors = require('cors')
const morgan = require('morgan')
const localConfiguration = require('./config')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)

    if (localConfiguration.AllowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.'

      return callback(new Error(msg), false)
    }

    return callback(null, true)
  }
}))

var cnt = app.listen(4000, function () {
  var port = cnt.address().port
  var host = cnt.address().address
  console.log(`App now running on: ${host}:${port}`)
})

var sqlConfig = {
  driver: 'msnodesqlv8',
  connectionString: localConfiguration.ConnectionString()
}

var executeQuery = function (res, query) {
  sql.connect(sqlConfig, function (err) {
    if (err) {
      console.log('Error while connecting: ', err)
      res.send(err)
    } else {
      var request = new sql.Request()
      request.query(query, function (err, rs) {
        if (err) {
          console.log('Error while querying database: ', err)
          res.send(err)
        } else {
          res.setHeader('Content-Type', 'application/json')
          res.send(JSON.stringify(rs, null, 3))
        }
      })
    }
  })
}

// GET all MERCHANTS
app.get('/api/merchants', function (req, res) {
  var query = localConfiguration.SelectStatament()
  sql.close() // <------ Cerrar la conexion antes de volver a consultar
  executeQuery(res, query)
})

// GET MERCHANTS by ID
app.get('/api/merchants/:id', function (req, res) {
  var query = localConfiguration.SelectWhereStatament(req.params.id)
  sql.close() // <------ Cerrar la conexion antes de volver a consultar
  executeQuery(res, query)
})
