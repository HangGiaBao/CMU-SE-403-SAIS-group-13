// app.js
const express = require('express');
const app = express();

const fibonacciRouter = require('./routes/fibonacci.js');

app.use('/api', fibonacciRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server is running at http://localhost:${PORT}`);
});
