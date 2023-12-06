import express from 'express';
import http from 'http';
import { Server , Socket } from 'socket.io';
import { db } from "./db";
import expressSession, {Session} from 'express-session';


const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const server = http.createServer(app);

const io = new Server(server);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});


/*
// Execute a simple SELECT query
db.query('SELECT * FROM users', (error, results, fields) => {
if (error) {
  console.error('Error executing SELECT query:', error);
  return;
}
// 'results' contains the query results
console.log('Query results:', results);
});*/

app.get('/', (request, response) => {
    ///response.sendFile(__dirname + '/views/login.html');
    response.redirect("/login");
});

app.get('/chat', (request, response) => {
    response.sendFile(__dirname + '/views/chat.html');
});
app.get('/login', (request, response) => {
  response.sendFile(__dirname + '/views/login.html');
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Query the database to check if the entered credentials match any user records
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      // Handle the error and display an error message
      
    } else if (Array.isArray(results) && results.length > 0)  {
      // Authentication successful
      // Redirect the user to the chat page or another authorized page
      
      // Store the user data in the session
      
      res.redirect('/chat');
    } else {
      // Invalid username or password
      // Display an error message
      res.send('Invalid username or password. Please try again.');
    }
  });
});/*
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query the database to check if the entered credentials match any user records
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      // Handle the error and display an error message
      res.redirect("/chat");
    } else if (Array.isArray(results) && results.length > 0) {
      const user = results[0];
      console.log('User:', user); // Log the user object to the console
      // Continue with the rest of your code
    } else {
      // Invalid username or password
      // Display an error message
      res.send('Invalid username or password. Please try again.');
    }
  });
  
});*/


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', (msg) => {
        console.log(msg);
        io.emit('message', msg);
      });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });




  
server.listen(3000, () => {
  console.log('listening on *:3000');  
  //console.clear();
});  



