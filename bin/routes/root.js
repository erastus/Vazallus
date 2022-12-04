const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'), null, function(err) {
    if(err) {
      res.status(404);
      if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', '..', 'error', 'HTTP_NOT_FOUND.html'));
      } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
      } else {
        res.type('txt').send("404 Not Found");
      }
    }
  });
});

module.exports = router;