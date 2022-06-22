const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
dotenv.config();
app.use(express.json());

const posts = [
  /*{
    username: 'Omar',
    title: 'post 1',
  },
  {
    username: 'Guadalupe',
    title: 'post 2',
  },*/
  {
    username: 'Luis',
    title: 'post 3',
  }
];

app.get('/users', (req,res) => {
  res.json(posts)
})

app.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(req.body.password, 10)
    console.log(salt);
    console.log(hashedPass);
    const user = { username:req.body.name, password: hashedPass }
    posts.push(user)
    res.sendStatus(201)
  } catch {
    res.sendStatus(500)
  }
})

app.post('/users/login', async (req, response) => {
  const user = posts.find(user => user.username == req.body.name)
  if(user == null){
    return response.sendStatus(400)
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      response.send("Success")
    } else {
      response.send("Not allowed")
    }
  } catch {
    response.sendStatus(500)
  }
})

app.get('/posts', authorizationToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post('/login', (req, res) => {
  //authentication User
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

function authorizationToken(request, response, next) {
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
