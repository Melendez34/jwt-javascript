const dotenv = require('dotenv');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
dotenv.config();
const posts = [
  {
    username: 'Omar',
    title: 'post 1',
  },
  {
    username: 'Guadalupe',
    title: 'post 2',
  },
  {
    username: 'Luis',
    title: 'post 3',
  },
];

app.use(express.json());

app.get('/posts', authenticationToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post('/login', (req, res) => {
  //authentication User
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

function authenticationToken(request, response, next) {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      return response.sendStatus(403);
    }
    request.user = user;
    next();
  });
}

app.listen(3000);
