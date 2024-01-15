const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;
// body parser 를 위한 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  '/api',
  createProxyMiddleware({
    target:
      'https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php?tm=202211300900&stn=0&help=1&authKey=WLBZf5mRTW6wWX-Zke1u7w',
    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
      console.log(proxyRes);
      res.send(proxyRes);
    },
  }),
);

app.listen(PORT, () => {
  console.log('Proxy Sever on 🐸');
  console.log(`http://localhost:${PORT}`);
});
