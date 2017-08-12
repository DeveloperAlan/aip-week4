  var express = require('express'); //cleaner and faster way to handle server requests
  var fs = require('fs'); //include File System module
  var ejs = require('ejs'); //include view template engine
  var bodyParser = require('body-parser');
  
  var app = express();
  //Parses the text as JSON and exposes the resulting object on req.body.
  app.use(bodyParser.json());
  //Parses the text as URL encoded data and exposes the resulting object (containing the keys and values) on req.body
  app.use(bodyParser.urlencoded({ extended: false }));
  
  /* route start */
  //call homepage
  app.get('/', function(req, res) {
    displayInfo(res); 
  });
  
  //call update page
  app.get('/update', function(req, res) {
    displayForm(res); 
  });
  
  //update recommendation
  app.post('/update', function(req, res) {
    
    //read post data and update 'MovieRecommendation.json' file
    fs.writeFile('MovieRecommendation.json', JSON.stringify(req.body), function (err, file) {
      if (err) {
        console.log('An error occurred.');
        return;
      }
      
      console.log('Saved recommendation!');
      return res.redirect('/');
    });
  });
  /* route end */

  
  //get stored recommendation content from file
  function getRecommendation(){
    fs.readFile('MovieRecommendation.json', function(err, recommendationData) {
        //if (err)throw err;
        console.log(recommendationData);
        return recommendationData;
    });
  }
  
  //display recommendation
  function displayInfo(res){
    
    //display page with recommendation
    fs.readFile('index.html', 'utf-8', function(err, content) {
        //check if there is an error
        if (err) {
          res.end('An error occurred while reading index.html file.');
          return;
        }
        
        fs.readFile('MovieRecommendation.json', function(err, recommendationData) {
            if (err) {
              res.end('An error occurred reading recommendation.');
              return;
            }
            
            var renderedHtml = ejs.render(content, JSON.parse(recommendationData));  //get redered HTML code
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(renderedHtml);
        });
    });
  }
  
  
  function displayForm(res){
    
    //display form to update recommendation
    fs.readFile('form.html', 'utf-8', function(err, content) {
      //check if there is an error
      if(err){
          res.end('An error occurred while reading form.html file.');
          return;
      }
      
      fs.readFile('MovieRecommendation.json', function(err, recommendationData) {
           if (err) {
             res.end('An error occurred reading recommendation.');
             return;
           }
           
           var renderedHtml = ejs.render(content, JSON.parse(recommendationData));  //get redered HTML code
           res.writeHead(200, {'Content-Type': 'text/html'});
           res.end(renderedHtml);
       });
    });
  }
  
  app.listen(8080);
  console.log("server listening on 8080");