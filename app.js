// using mongoose 5.13.16
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const port = process.env.PORT | 3000;
const app = express();

//view engiene
app.set("view engine", "ejs");

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//conection
mongoose.connect("mongodb://0.0.0.0:27017/wikiDB", { useNewUrlParser: true });

//schema
const articleSchema = mongoose.Schema({
    tittle: String,
    content: String
});

//model
const Article = mongoose.model("Article", articleSchema);

//route for home route
app.get("/", (req, res) => {
    res.send("Your app is healty and running on the port " + port);
})

// -----------------------------------------------------Route for all articles--------------------------------------------------
//route handelers
app.route("/articles").
    get((req, res) => {
        Article.find((err, foundArticles) => {
            if (err) {
                res.send(err);
            } else {
                res.send(foundArticles);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            tittle: req.body.tittle,
            content: req.body.content
        });
        newArticle.save((err) => {
            if (!err) {
                res.send("successfully enterd the data");
            } else {
                res.send("Oops error found");
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully deteled all the data");
            } else {
                res.send(err);
            }
        });
    });

// -------------------------------------------------------------Route for a specific article----------------------------------
app.route("/articles/:articleTitle").
    get((req, res)=>{
        Article.find({tittle:req.params.articleTitle},(err,foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle)
            } else{
                res.send("Article not found");
            }
        });
    })
    .put(function(req, res){

        Article.update(
          {title: req.params.articleTitle},
          {title: req.body.title, content: req.body.content},
          {overwrite: true},
          function(err){
            if(!err){
              res.send("Successfully updated the selected article.");
            }
          }
        );
    })

    .patch((req, res)=>{
        Article.update(
            {tittle: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Succesfully updated article.");
                } else{
                    res.send(err);
                }
            }
        );
    })

    .delete((req, res)=>{
        Article.deleteOne(
            {tittle: req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Succesfully deleted the selected article.");
                } else{
                    res.send(err);
                }
            }
        );
    });


app.listen(port, () => {
    console.log("Your app is listening on the port " + port);
})