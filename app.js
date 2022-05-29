//requiring the libraries
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

//initialising express
const app = express();

//setting up the nody parser and for the static files
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

 //setting up the mongoDB connection
 mongoose.connect("mongodb://localhost:27017/wikiDB");

 //making the schema
 const articleSchema = {
     title:String,
     content: String
 };

 //creating the model
 const Article = mongoose.model("Article",articleSchema);

//////////////////////////////////////////////////////////////////////////// Requests targetting all the articles ////////////////////////////////////////////////////////////////////////////

 //making use of the chained route requests
 app.route("/articles")
    .get(function(req,res){
        Article.find({}, function(err,foundArticles){
            if(!err){
                res.send(foundArticles)
            }else{
                res.send(err)
            }
            
        })
    })

    .post(function(req,res){
        //making the new document
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content

    });

    //saving the article
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article");
        }else{
            res.send(err);
        }
    });
})

    .delete(function(req,res){
        Article.deleteMany({}, function(err){
            if(!err){
            res.send("Successfully deleted all the articles");
            }else{
                res.send(err);
            }
    })
})

///////////////////////////////////////////////////////////////////////// Requests targetting specific article ///////////////////////////////////////////////////////////////////////////////

//requests on specific article
app.route("/articles/:articleTitle")
    .get(function(req,res){
        const articleTitle = req.params.articleTitle;
        Article.findOne({title:articleTitle}, function(err,foundArticle){
            if(foundArticle){
                res.send(foundArticle)
            }else{
                res.send("No articles matching that title was found!")
            }
        })
    })

    //using the put request
    .put(function(req, res){

        Article.replaceOne(
          {title: req.params.articleTitle},
          {title: req.body.title, content: req.body.content},
          {overwrite: true},
          function(err){
            if(!err){
              res.send("Successfully updated the selected article.");
            }else{
                res.send(err)
            }
          }
        );
      })

      .patch(function(req,res){
          Article.updateOne(
              {title:req.params.articleTitle},
              {$set: req.body},
              function(err){
                  if(!err){
                      res.send("Successfully updated the article")
                  }else{
                      res.send(err);
                  }
              }
          )
      })

      .delete(function(req,res){
          Article.deleteOne(
              {title:req.params.articleTitle},
              function(err){
                  if(!err){
                      res.send("Successfully deleted the required article")
                  }else{
                      res.send(err)
                  }
              }
          )
      })



//setting up the server
app.listen(3000, function(){
    console.log("Port started at 3000")
})