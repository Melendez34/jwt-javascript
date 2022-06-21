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

//cada que se inicie el JS va a limpiar el array
//se requiere DB para almacenar los token
let refreshTokens = [];

app.post('/token', (request, response) => {
  const refreshToken = request.body.token;
  if (refreshToken == null) return response.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return response.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (error) {
      return response.sendStatus(403);
    }
    const accessToken = generateAccessToken({ name: user.name });
    response.json({ accessToken: accessToken });
  });
});

app.delete('/logout', (request, response) => {
  refreshTokens = refreshTokens.filter((token) => token !== request.body.token);
  response.sendStatus(204);
});

app.post('/login', (req, res) => {
  //authentication User
  const username = req.body.username;
  const user = { name: username };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
}

app.listen(3030);
