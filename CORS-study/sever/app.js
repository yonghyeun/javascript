const express = require('express');
// const cors = require('cors');
const PORT = 3000;
const app = express();
const dataBase = [{ id: 1, name: 'lee' }];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log('Server Start !');
  console.log(`Server address : http://localhost:${PORT}`);
});

// CORS 설정
// app.use((req, res, next) => {
//   const allowUrl = 'http://127.0.0.1:5500';
//   res.header('Access-Control-Allow-Origin', allowUrl); // 모든 origin에 대해 허용
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // 허용하는 HTTP 메소드
//   res.header('Access-Control-Allow-Headers', 'Content-Type'); // 허용하는 헤더
//   next();
// });

app.get('/', (req, res) => {
  // CORS 헤더 추가
  res.send(dataBase);
});
