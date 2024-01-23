const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, '../public')));

const database = [
  {
    email: 'example123@naver.com',
    password: 'Password123!',
  },
  { email: 'dongdong1@gmail.com', password: 'Password13!' },
];

const rememberUsers = [];

app.listen(PORT, () => {
  console.log('Sever is Running');
  console.log('http://localhost:3000');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public'));
});

app.get('/users', (req, res) => {
  res.send(database);
});

app.post('/users', (req, res) => {
  const { email, password, remember } = req.body;
  const emailId = database.findIndex((users) => users.email === email);

  if (emailId === -1) {
    return res
      .status(404)
      .json({ error: '일치하는 아이디를 찾을 수 없습니다' });
  }

  if (database[emailId].password !== password) {
    return res.status(404).json({ error: '비밀번호가 일치하지 않습니다' });
  }

  if (remember) {
    rememberUsers.push(email);
  }

  app.use(express.static(path.join(__dirname, '../mypage')));

  return res.sendFile(path.join(__dirname, '../mypage'));
});
