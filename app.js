const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const port = process.env.PORT | 3000;
const app = express();

//view engiene
app.set("view engine", "ejs");

//body-parser
app.use(bodyParser.urlencoded({extended: true}));

//conection
mongoose.connect("mongodb://0.0.0.0:27017/wikiDB", { useNewUrlParser: true });

//schema
const articleSchema = mongoose.Schema({
    tittle: String,
    content: String
});

//model
const Article = mongoose.model("Article", articleSchema);

app.get("/", (req, res)=>{
    res.send("Your app is healty and running on the port " + port);
})

//use of GET method to find all the articles to fetch the atricles from Robo 3T
app.get("/articles", (req, res)=>{
    Article.find((err, foundArticles)=>{
        if(err){
            console.log(err);
        } else{
            res.send(foundArticles);
        }
    });
});

//use of POST method to create a data in the database
app.post("/articles", (req, res)=>{
    console.log(req.body.tittle);
    console.log(req.body.content);
});


app.listen(port, ()=>{
    console.log("Your app is listening on the port " + port);
})