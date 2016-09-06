var neo4j = require('neo4j-driver').v1;
var express = require('express');
var app = express();

var driver = neo4j.driver("bolt://52.57.59.97:7687", neo4j.auth.basic("neo4j", "360hc"));
var session = driver.session();
var http = require("http");

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
var results={test:"data"};

app.get('/', function(req, response){
  
  
  var options = {
  host: '52.57.59.97',
  port: '7474',
  path: '/db/data/',
  method : 'GET',
  headers: {
     'Authorization': 'Basic ' + new Buffer('neo4j' + ':' + '360hc').toString('base64')
   }
  
};

  var req = http.get(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));

  // Buffer the body entirely for processing as a whole.
  var bodyChunks = [];
  res.on('data', function(chunk) {
    // You can process streamed parts here...
    bodyChunks.push(chunk);
  }).on('end', function() {
    var body = Buffer.concat(bodyChunks);
    
    var result_json={info : bodyChunks.toString()}
    response.json(result_json)
    console.log('BODY: ' + body);
    // ...and/or process the entire body here.
  })
});

req.on('error', function(e) {
    response.json(e)
  console.log('ERROR: ' + e.message);
});
    
})

app.get('/edges', function (req, res) {
    console.log("request")
    session
    .beginTransaction()
    .run( "MATCH (n)  RETURN n" )
    .then(function (result) {
    //console.log(result.summary.profile);
    res.json(result);
     console.log("then: "+JSON.stringify(result));
    })
    .catch(function(err){
        console.log("err: " + err);
        res.json(err);
    })
    .close;
  
 
  /*
  .subscribe(
      
      {
    onNext: function(record) {
         console.log("onNext")
      var sword = [];
      record.forEach(function(value, key)
      {
        sword.push(key + ": " + value);
      });
      console.log(sword);
    },
    onCompleted: function() {
         console.log("onCompleted")
      session.close();
    },
    onError: function(error) {
         console.log("error")
      console.log(error);
    }
  });*/

 
   res.json(results);

});  

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});