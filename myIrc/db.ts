import mysql from 'mysql2';

export const db = mysql.createConnection(
    {
        host : "localhost",
        user : "root",
        password : "Root1234#",
        database : 'myIRC'
    }
    
);
/*
const userData = [
    { username: 'siiker', password: '123' },
    { username: 'siiker1', password: '123' },
   
  ];
  
  // Loop through user data and insert each user into the 'users' table
  userData.forEach((user) => {
    const { username, password } = user;
    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
  
    db.query(query, [username, password], (error, results) => {
      if (error) {
        console.error(`Error inserting user '${username}':`, error);
      } else {
        console.log(`User '${username}' inserted successfully.`);
      }
    });
  });
 */
