#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Book = require('./models/book')
var Author = require("./models/author")
var Field = require('./models/field')
var Difficulty = require('./models/difficulty')
var Publisher = require('./models/publisher')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var authors = []
var difficultys = []
var books = []
var fields = []
var publishers = []

function authorCreate(first_name, last_name, cb) {
  authordetail = {first_name: first_name, last_name: last_name }

  var author = new Author(authordetail);
       
  author.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Author: ' + author);
    authors.push(author)
    cb(null, author)
  }  );
}

function fieldCreate(field, cb) {
  var field = new Field({ field: field });
       
  field.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Field: ' + field);
    fields.push(field)
    cb(null, field);
  }   );
}

function difficultyCreate(difficulty, cb) {
    var difficulty = new Difficulty({ difficulty: difficulty });
         
    difficulty.save(function (err) {
      if (err) {
        cb(err, null);
        return;
      }
      console.log('New Difficulty: ' + difficulty);
      difficultys.push(difficulty)
      cb(null, difficulty);
    }   );
}

function publisherCreate(publisher, cb) {
    var publisher = new Publisher({ publisher: publisher });
         
    publisher.save(function (err) {
      if (err) {
        cb(err, null);
        return;
      }
      console.log('New Publisher: ' + publisher);
      publishers.push(publisher)
      cb(null, publisher);
    }   );
  }

function bookCreate(title, author, summary, field, difficulty, publisher, cb) {
  bookdetail = { 
    title: title,
    author: author,
    field: field,
    difficulty: difficulty
  }
  
  if (summary != null) bookdetail.field = field
  if (publisher != null) bookdetail.publisher = publisher
    
  var book = new Book(bookdetail);    
  book.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Book: ' + book);
    books.push(book)
    cb(null, book)
  }  );
}

function createAuthors(cb) {
    async.series([
        function(callback) {
          authorCreate('Michael', 'Spivak', callback);
        },
        function(callback) {
          authorCreate('Stephen', 'Abbott', callback);
        },
        function(callback) {
          authorCreate('James', 'Munkres', callback);
        },
        function(callback) {
          authorCreate('Charles', 'Pinter', callback);
        },
        function(callback) {
          authorCreate('Sheldon', 'Axler', callback);
        },
        function(callback) {
          authorCreate('Israel', 'Gelfand', callback);
        },
        function(callback) {
          authorCreate('Donald', 'Knuth', callback);
        }],
    cb);
}

function createFields(cb) {
    async.series([
        function(callback) {
            fieldCreate("Topology", callback);
          },
          function(callback) {
            fieldCreate("Analysis", callback);
          },
          function(callback) {
            fieldCreate("Algebra", callback);
          },
          function(callback) {
            fieldCreate("Graph Theory", callback);
          },
          function(callback) {
            fieldCreate("Calculus", callback);
          },
          function(callback) {
            fieldCreate("Linear Algebra", callback);
          },
          function(callback) {
            fieldCreate("Computer Science", callback);
          },
          function(callback) {
            fieldCreate("Pre-Calculus", callback);
          },
          function(callback) {
            fieldCreate("Miscellaneous", callback);
          }
    ], cb)
}

function createDifficulties(cb) {
  async.series([
    function(callback) {
      difficultyCreate("Elementary", callback);
    },
    function(callback) {
      difficultyCreate("Intermediate", callback);
    },
    function(callback) {
      difficultyCreate("Advanced", callback);
    }
  ], cb)
}

function createPublishers(cb) {
  async.series([
    function(callback) {
      publisherCreate("Dover", callback);
    },
    function(callback) {
      publisherCreate("Springer", callback);
    } 
  ], cb)
}


function createBooks(cb) {
    async.parallel([
        function(callback) {
          bookCreate('Calculus',  authors[0], null, fields[4], difficultys[1], null, callback);
        },
        function(callback) {
          bookCreate("The Art of Computer Programming: Volume 1", authors[6], null, fields[6], difficultys[1], null, callback);
        },
        function(callback) {
          bookCreate("A Book of Abstract Algebra",  authors[3], null, fields[2], difficultys[1], publishers[0], callback);
        },
        function(callback) {
            bookCreate("Trigonometry",  authors[5], null, fields[7], difficultys[0], null, callback);
        },
        function(callback) {
          bookCreate("Algebra",  authors[5], null, fields[7], difficultys[0], null, callback);
        },
        function(callback) {
          bookCreate("Linear Algebra Done Right", authors[4], null, fields[5], difficultys[1], publishers[1], callback);
        },
        function(callback) {
          bookCreate("Topology; a first course", authors[2], null, fields[0], difficultys[2], null, callback);
        },
        function(callback) {
          bookCreate("Understanding Analysis", authors[1], null, fields[1], difficultys[2], publishers[1], callback);
        },
        function(callback) {
          bookCreate("Introduction to Graph Theory", authors[1], null, fields[3], difficultys[1], publishers[0], callback);
        }
        ],
        cb);
}

async.series([
    createAuthors,
    createFields,
    createPublishers,
    createDifficulties,
    createBooks
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log("Done");
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



