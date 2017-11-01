const express = require('express')
const bodyParser = require('body-parser')
const sql = require('mssql/msnodesqlv8')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'HEAD, OPTIONS, POST, PUT')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization')
  next()
})

var cnt = app.listen(4000, function () {
  var port = cnt.address().port
  var host = cnt.address().address
  console.log(`App now running on: ${host}:${port}`)
})

var sqlConfig = {
  driver: 'msnodesqlv8',
  connectionString: 'Driver={SQL Server Native Client 11.0};Server={SERDBDESA04\\SQL2012};Database={CNT};Trusted_Connection={yes};'
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
  var query = `SELECT TOP 100 
                    [ID], [NAME], [TOWN_DISTRICT_ID]
                FROM 
                    [CNT].[ca].[MERCHANTS]`
  sql.close() // <------ Cerrar la conexion antes de volver a consultar
  executeQuery(res, query)
})

// GET MERCHANTS by ID
app.get('/api/merchants/:id', function (req, res) {
  var query = `SELECT TOP 100 
                    [ID], [NAME], [TOWN_DISTRICT_ID]
                FROM 
                    [CNT].[ca].[MERCHANTS]
                WHERE [ID] = ` + req.params.id
  sql.close() // <------ Cerrar la conexion antes de volver a consultar
  executeQuery(res, query)
})
