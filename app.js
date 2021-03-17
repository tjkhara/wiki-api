const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create the schema
const arcticlesSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// Create the model
const Article = mongoose.model("Article", arcticlesSchema);

// Read
// app.get('/articles', )

// Create
// app.post('/articles', )

// Delete
// app.delete('/articles', )

// Chaining
app
  .route("/articles")
  // All articles
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })

  .post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    const newArticle = new Article({
      title: title,
      content: content,
    });

    newArticle.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.send("Successfully added the new article.");
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Deleted successfully.");
      }
    });
  });

app
  .route("/articles/:articleName")
  // Single article
  .get((req, res) => {
    const name = req.params.articleName;
    Article.find({ title: name }, (err, article) => {
      if (err) {
        console.log(err);
      } else {
        if (article.length === 0) {
          res.send("No article with that title found.");
        } else {
          res.send(article);
        }
      }
    });
  })

  .put(function (req, res) {
    // Find all documents matching the condition
    // (age >= 5) and update first document
    // This function has 4 parameters i.e.
    // filter, update, options, callback
    Article.update(
      { title: req.params.articleName },
      { title: req.body.title, content: req.body.content },
      {overwrite: true},
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          res.send("Successfully updated article.")
        }
      }
    )
  })

  .patch(function(req, res) {
      Article.update(
          {
              title: req.params.articleName
          },
          {
              $set: req.body
          },
          function(err){
              if(err){
                  res.send(err)
              } else {
                  res.send("Patch request executed successfully.")
              }
          }
      )
  })

  .delete(function(req, res){
      Article.deleteOne({title: req.params.articleName}, function(err, result){
          if(err){
              res.send(err)
          } else {
              if(result.deletedCount === 0){
                  res.send("No articles with that name found.")
              } else {
                  res.send("Article deleted successfully.")
              }
          }
      })
  })

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server has started.");
});
