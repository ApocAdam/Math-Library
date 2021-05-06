const express = require("express");
const router = express.Router();

const author_controller = require("../controllers/authorController");
const book_controller = require("../controllers/bookController");
const field_controller = require("../controllers/fieldController");
const difficulty_controller = require("../controllers/difficultyController");
const publisher_controller = require("../controllers/publisherController");

// Home Page

router.get("/", book_controller.index);

// Book Routes

router.get("/book/:id", book_controller.book_detail);

router.get("/books", book_controller.book_list);

// Author Routes

router.get("/author/:id", author_controller.author_detail);

router.get("/authors", author_controller.author_list);

// Field Routes

router.get("/field/:id", field_controller.field_detail);

router.get("/fields", field_controller.field_list);

// Difficulty Routes

router.get("/difficulty/:id", difficulty_controller.difficulty_detail);

router.get("/difficultys", difficulty_controller.difficulty_list);

// Publisher Routes

router.get("/publisher/:id", publisher_controller.publisher_detail);

router.get("/publishers", publisher_controller.publisher_list);

module.exports = router;