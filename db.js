'use strict';
let mysql = require('mysql');

var connection;

function handleDisconnect() {
  connection = mysql.createConnection({
      host        :   process.env.DB_HOST,
      user        :   process.env.DB_USER,
      password    :   process.env.DB_PASSWORD,
      database    :   process.env.DB_DATABASE
  });
  connection.connect((err) => {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });
  connection.on('error', (err) => {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection;
