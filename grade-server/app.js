const express = require("express");
const app = express();
const https = require('https');



// 跨域
app.use(require("cors")());

//处理post请求,解析json数据 (中间件)
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// jsonwebtoken生成token
app.set("secret", "grade-management-system");

// 引入mongoose
require("./mongodb/db.js")(app);

// 引入路由
import router from "./routes/index.js";
router(app);


// 线上
// const httpsServer = https.createServer(credentials, app);
// httpsServer.listen(3000, () => {
//   console.log("App Listening on port 3000");
// });

// 本地
app.listen(3000, () => {
  console.log("App Listening on port 3000");
});

