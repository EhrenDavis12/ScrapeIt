var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");


module.exports = function (app) {

    app.get("/", function (req, res) {
        var result = {
            articlesPage: true
        };
        res.render("index", result);
    });

    app.get("/notes", function (req, res) {
        var result = {
            notesPage: true
        };
        res.render("index", result);
    });

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

            var result = {
                scrapePage: true
            };
            res.render("index", result);
        });
    });

    // Render 404 page for any unmatched routes
    app.get("*", function (req, res) {
        res.render("404");
    });
};