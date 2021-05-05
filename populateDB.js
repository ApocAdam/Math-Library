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
var Field = require('./models/field')
var Difficulty = require('./models/difficulty')
var Publisher = require('./models/Publisher')


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

function fieldCreate(name, cb) {
  var field = new Field({ name: name });
       
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

function difficultyCreate(name, cb) {
    var difficulty = new Difficulty({ name: name });
         
    field.save(function (err) {
      if (err) {
        cb(err, null);
        return;
      }
      console.log('New Difficulty: ' + difficulty);
      difficultys.push(difficulty)
      cb(null, field);
    }   );
  }

function publisherCreate(name, cb) {
    var publisher = new Publisher({ name: name });
         
    field.save(function (err) {
      if (err) {
        cb(err, null);
        return;
      }
      console.log('New Publisher: ' + publisher);
      publishers.push(publisher)
      cb(null, field);
    }   );
  }

function bookCreate(title, author, summary, field, publisher, cb) {
  bookdetail = { 
    title: title,
    author: author,
    summary: summary
  }
  
  if (field != false) bookdetail.field = field
  if (publisher != false) bookdetail.publisher = publisher
    
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

function createGenreAuthors(cb) {
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
        },
        function(callback) {
          publisherCreate("Dover", callback);
        }
        ],
    cb);
}

function createFields(cb) {
    async.parallel([
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
            fieldCreate("Discrete Mathematics", callback);
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


function createBooks(cb) {
    async.parallel([
        function(callback) {
          bookCreate('Calculus', '', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("The Art of Computer Programming: Volume 1", '', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("Algebra", '', authors[0], [genres[0],], callback);
        },
        function(callback) {
            bookCreate("Trigonometry", '', authors[0], [genres[0],], callback);
        },
        function(callback) {
          bookCreate("Linear Algebra Done Right", "", authors[1], [genres[1],], callback);
        },
        function(callback) {
          bookCreate("","", '9780765379504', authors[1], [genres[1],], callback);
        }
        ],
        // optional callback
        cb);
}

async.series([
    createGenreAuthors,
    createFields,
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



