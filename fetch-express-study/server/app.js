const express = require('express');
const cors = require('cors');

const app = express();

// body parser
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing

// CORS 해결
app.use(cors());

// to do list 서버 만들기

let id = 2;

const todolist = [
  {
    id: 1,
    text: '도넛츠 500개 먹기',
    done: true,
  },
]; // 서버의 메모리에 저장

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(3000, () => {
  // 3000번 포트에서 열기
  console.log('server start ! ');
});

// get 요청에 대한 메소드
app.get('/api/todo', (req, res) => {
  res.json(todolist); // get 요청을 받으면 todolist 를 json 객체를 response로 보냄
});

// id 에 따른 get 요청에 대한 메소드

app.get('/api/todo/:id', (req, res) => {
  const idRequested = parseInt(req.params.id, 10); // 클라이언트가 보낸 ID 값을 가져옴

  // 클라이언트가 보낸 id parameter와 맞는 todo.id 를 찾아 보냄
  const todoExisted = todolist.find((todo) => todo.id === idRequested);
  if (!todoExisted) {
    return res.status(404).send('해당 ID를 찾을 수가 없습니다');
  }
  return res.send(todoExisted);
});

// post 요청에 대한 메소드
app.post('/api/todo', (req, res) => {
  const { text, done } = req.body; // 클라이언트는 require 요청 본문 (body)에 할 일을 적어 보냄
  // 받은 text , done 을 todolist 객체에 저장

  if (!text || text.trim() === '') return res.send('텍스트를 넣어주세요');

  todolist.push({
    id: id++,
    text,
    done,
  });
  res.send('포스팅에 성공했습니다'); // post 가 성공하고 나면 success 보내기
});

// patch 요청에 대한 메소드

app.patch('/api/todo:id', (req, res) => {
  const idRequested = parseInt(req.params.id, 10);
  const todoExisted = todolist.find((todo) => todo.id === idRequested);

  if (!todoExisted) {
    return res.status(404).send('해당 ID를 찾을 수 없습니다');
  }

  // 수정을 요청받은 값들을 수정
  // 이 떄 수정 할 때 todoExsited 의 id 값은 변경하지 않도록 함
  const { text, done } = req.body;
  todoExisted.text = text;
  todoExisted.done = done;
});
