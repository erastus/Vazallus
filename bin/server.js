const express = require('express');
let app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 2082;

// custom middleware logger
app.use(logger);

const server = require("http").Server(app)

var corsOptions = {
  origin: true
}

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//serve static files
app.use('/', express.static(path.join(__dirname, '..', '/public')));

// routes
app.use('/', require('./routes/root'));

try {
  require(path.join(__dirname, '..', '/public/index.js'))(app, server, corsOptions);
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    throw e;
  }
}

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '..', 'error', 'HTTP_NOT_FOUND.html'));
  } else if (req.accepts('json')) {
    res.json({ "error": "404 Not Found" });
  } else {
    res.type('txt').send("404 Not Found");
  }
});

app.use(errorHandler);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
