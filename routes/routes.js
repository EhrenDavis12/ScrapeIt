// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models");

module.exports = function (app) {
    // A GET route for scraping the echoJS website
    app.get("/scrape", function (req, res) {
        axios.get("http://www.echojs.com/").then(function (response) {
            var $ = cheerio.load(response.data);

            $("article h2").each(function (i, element) {
                var result = {};

                result.title = $(this)
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");

                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });

            res.send("Scrape Complete");
        });
    });

    app.get("/articles", function (req, res) {
        db.Article.find({})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get("/articles/:id", function (req, res) {
        db.Article.find({ id: req.params.id })
            .populate("notes")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.User.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
            })
            .then(function (dbUser) {
                res.json(dbUser);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

};