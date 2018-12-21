// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("../models");

module.exports = function (app) {

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
        db.Article
            .findById({ _id: req.params.id })
            .then(dbModel => dbModel.populate("notes"))
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
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
            })
            .then(function (dbNote) {
                res.json(dbNote);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/clear", function (req, res) {
        try {
            db.Article.collection.drop().catch(console.log("nothing to delete"));
            db.Note.collection.drop().catch(console.log("nothing to delete"));
            data = {};
            res.json(data);
        } catch (err) {
            res.status(400).json("Invalid request");
        }
    });

    app.get("/notes/data", function (req, res) {
        db.Article.find({ $where: "this.notes.length > 0" })
            .populate("notes")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/note/:id", function (req, res) {
        try {
            db.Note
                .findById({ _id: req.params.id })
                .then(dbModel => dbModel.remove())
                    /* .then(db.Article.findOne({ "notes": req.params.id }, 
                    { $pull: { "notes": req.params.id } }))) */
                //.then(db.Article.update({},{ $pull: { "notes": req.params.id } },{multi: true}))
                .then(dbModel => res.json(dbModel))
                .catch(err => res.status(422).json(err));
        } catch (err) {
            res.status(400).json("Invalid request");
        }
    });

};