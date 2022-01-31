const express = require('express');
const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./config/config');

const postRouter = require('./routes/postRoutes');

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    })
    .then(() => {
      console.log('Successfully connected to DB');
    })
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5);
    });
};

connectWithRetry();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h2>Hi There!!!</h2>');
});

// localhost:3000/api/v1/posts/
app.use('/api/v1/posts', postRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
