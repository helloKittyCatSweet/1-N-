const mysql = require('mysql');

// 创建数据库连接
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'myuser',
  password : 'mypassword',
  database : 'mydatabase'
});

// 连接到数据库
connection.connect();

// 查询数据
connection.query('SELECT * FROM my_table', (error, results, fields) => {
  if (error) throw error;
  console.log(results);
});

// 关闭连接
connection.end();