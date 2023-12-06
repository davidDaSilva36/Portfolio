import express from 'express';
import http, { IncomingMessage } from 'http';
import bodyParser from "body-parser";
import { db } from "./db";
import expressSession, { SessionData } from 'express-session';
import { RowDataPacket} from 'mysql2';
import { Server , Socket } from 'socket.io';
const fs = require('fs');

declare module 'express-session' {
    interface SessionData {
      user?: { id : number ,username: string, role: string };
    }
  };

interface SessionIncommingMessage extends IncomingMessage
{
    session: SessionData
};

interface SessionSocket extends Socket
{
    request: SessionIncommingMessage
};

const app = express();
const httpServer = http.createServer (app);
const io = new Server(httpServer);

const session = expressSession({
    secret: 'verysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
})

const wrapper = (middleware: any) => (socket: Socket, next: any) => middleware (socket. request, {}, next);
io.use(wrapper (session));

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(jsonParser);
app.use(urlencodedParser);

app.use(session);


app.get('/', (request, response) => {
    ///response.sendFile(__dirname + '/views/login.html');
    response.redirect("/login");
});

app.get('/login', (request, response) => {
  response.sendFile(__dirname + '/views/login.html');
});

app.get('/chat', (request, response) => {
    if (request.session.user) {
        const channelId = request.query.channelId;
        if (channelId) {
            // You can use the channelId to identify and join the specific channel.
            // Implement your logic to join the channel here.
            // For example, you can use the channelId to fetch the channel details from your database.
            // If the channel exists, you can render the chat page for that channel.
            // If the channel doesn't exist, you can redirect the user to an error page.
            // Replace the following logic with your implementation.
            response.sendFile(__dirname + '/views/chat.html');
        } else {
            response.redirect("/channels"); // Redirect the user back to the channels page if channelId is missing.
        }
    } else {
        response.redirect("/login");
    }
});

app.get('/chat-solo', (request, response) => {
    if (request.session.user) {
        const userId = request.query.userId;
        if (userId) {
            // Check if the chat room between the current user and the specified user already exists.
            // If it doesn't exist, create a new chat room in your database and get its ID.
            // Redirect the user to the chat room with the generated room ID.
            
            response.sendFile(__dirname + '/views/chat-solo.html');
        }else{
            response.redirect("/channels")
        }
        
        } else {
        response.redirect("/login");
    }
});


app.post("/login", (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    if (username && password) {
        const query = "SELECT * FROM users WHERE username = ? AND password = ?";
        db.query(query, [username, password], (error, result) => {
            if (error) {
                console.log(error);
                response.send("User not found");
            } else {
                if (Array.isArray(result)) {
                    if (result.length > 0) {
                        request.session. user = {
                            id: (result as RowDataPacket[])[0].id,
                            username: username,
                            role: (result as RowDataPacket[])[0].role
                            
                        }  
            response.redirect("/channels");
        } else {
            response.redirect("login");
        }
    } else {
        response.send("Unexpected result from the database");
    }
}
});
} else {
console.log("Username or password missing");
response.send("Username or password is missing");
}
});


app.get('/channels', (request, response) => {
    if (request.session.user) {
        response.sendFile(__dirname + "/views/channels.html");
        
        
    } else {
        response.redirect("/login");
    }
});

app.post('/createChannel', (request, response) => {
    if (request.session.user) {
        const channelName = request.body.channelName;
        const visibility = request.body.visibility; // 'public' or 'private'
        const userId = request.session.user.id; // Get the user ID
        const user = request.session.user.username;

        if (channelName) {
            // Create the log file of the current channel
            let pathlog: string = "./logs/" + "channelLog" + user + ".txt"; //chemin ou va etre creer le fichier
            fs.open(pathlog,'w+', function (err: any, f: any) {
                console.log('Saved!');
            });
            // Insert the new channel into the database with the user ID
            const query = "INSERT INTO channels (name, visibility, user_id) VALUES (?, ?, ?)";
            db.query(query, [channelName, visibility, userId], (error, result) => {
                if (error) {
                    console.log(error);
                    response.send("Error creating a channel.");
                } else {
                    const channelId = (result as any).insertId; // Explicitly cast result to 'any'

                    if (visibility === 'private') {
                        // For private channels, add the creator as a member
                        const membershipQuery = "INSERT INTO channel_memberships (channel_id, user_id) VALUES (?, ?)";
                        db.query(membershipQuery, [channelId, userId], (membershipError) => {
                            if (membershipError) {
                                console.log(membershipError);
                                response.send("Error adding the creator to the channel.");
                            } else {
                                // Continue with adding other members to the channel, if needed.
                                response.redirect('/channels');
                            }
                        });
                    } else {
                        response.redirect('/channels');
                    }
                }
            });
        } else {
            response.send("Channel name is missing.");
        }
    } else {
        response.redirect("/login");
    }
});

app.get('/getChannels', (request, response) => {
    if (request.session.user) {
        // Fetch the user data, channels, and their visibility.
        const query = "SELECT c.id, c.name, c.visibility FROM channels c";
        db.query(query, (error, results) => {
            if (error) {
                console.log(error);
                response.status(500).json({ error: "Error fetching channels." });
            } else {
                const channels = results as RowDataPacket[];
                response.json({ user: request.session.user, channels });
            }
        });
    } else {
        response.status(401).json({ error: "Unauthorized" });
    }
});


app.get('/joinChannel', (request, response) => {
    if (request.session.user) {
        const userId = request.query.channId;
        if (userId) {
            // Check if the chat room between the current user and the specified user already exists.
            // If it doesn't exist, create a new chat room in your database and get its ID.
            // Redirect the user to the chat room with the generated room ID.
            response.sendFile(__dirname + '/views/joinChannel.html');
        }else{
            response.redirect("/channels")
        }
        
        } else {
        response.redirect("/login");
    }
});

app.get('/joinChannel/:channelId', (request, response) => {
    if (request.session.user) {
        const channelId = request.params.channelId;
        if (channelId) {
            // Check if the user has permission to join the specified channel.
            const checkPermissionQuery = "SELECT * FROM channel_memberships WHERE user_id = ? AND channel_id = ?";
            db.query(checkPermissionQuery, [request.session.user.id, channelId], (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(500).json({ error: "Error checking channel membership." });
                } else {
                    if (Array.isArray(results) && results.length > 0) {
                        // The user has permission to join the channel.
                        response.sendFile(__dirname + '/views/joinChannel.html');
                    } else {
                        // The user does not have permission to join the channel.
                        // Check if the channel is public
                        const getChannelVisibilityQuery = "SELECT visibility FROM channels WHERE id = ?";
                        db.query(getChannelVisibilityQuery, [channelId], (visibilityError, visibilityResults) => {
                            if (visibilityError) {
                                console.log(visibilityError);
                                response.status(500).json({ error: "Error checking channel visibility." });
                            } else {
                                const visibility = (visibilityResults as RowDataPacket[])[0]?.visibility; // Update the type assertion
                                if (visibility === 'public') {
                                    // The channel is public, and any user can join it.
                                    response.sendFile(__dirname + '/views/joinChannel.html');
                                } else {
                                    // The user does not have permission to join this private channel.
                                    response.send('You do not have permission to join this channel.');
                                }
                            }
                        });
                    }
                }
            });
        } else {
            response.send('Channel ID is missing.');
        }
    } else {
        response.redirect("/login");
    }
});


app.get('/getUsers/', (request, response) => {
    if (request.session.user) {
        // Fetch the list of users from your database
        const query = "SELECT id, username FROM users WHERE id <> ?";
        db.query(query, [request.session.user.id], (error, results) => {
            if (error) {
                console.log(error);
                response.status(500).json({ error: "Error fetching users." });
            } else {
                const users = results as RowDataPacket[];
                response.json({ users });
            }
        });
    } else {
        response.status(401).json({ error: "Unauthorized" });
    }
});
app.get('/startChat/:userId', (request, response) => {
    if (request.session.user) {
        const userId = request.params.userId;
        if (userId) {
            // Check if the chat room between the current user and the specified user already exists.
            // If it doesn't exist, create a new chat room in your database and get its ID.
            // Redirect the user to the chat room with the generated room ID.
        } else {
            response.send('User ID is missing.');
        }
    } else {
        response.redirect('/login');
    }
});

app.post('/change', (request,response) =>{
    if(request.session.user){
        const userRole = request.session.user?.role;
        if(userRole === 'admin'){
            response.sendFile(__dirname + '/views/change_login.html');
        } else {
            response.redirect('/channels');
        }
    }
})
app.post('/changePassword', (request, response) => {
    if (request.session.user){
        const username = request.body.usernameChangePassword;
        const userId = request.session.user.id; // Get the user ID
        const newPassword = request.body.newPassword;
        const userRole = request.session.user?.role;
        if(userRole === 'admin'){
            // response.sendFile(__dirname + '/views/change_login.html');
            const query = "UPDATE users SET password = '" + newPassword + "' WHERE username = '" + username + "';" ;
            db.query(query, [request.session.user.id], (error, results) => {
                if (error) {
                    console.log(error);
                    response.status(500).json({ error: "Error fetching users." });
                } else {
                    // response.send('You have change the password of ' + username + ' succesfully.');
                    response.redirect('/channels');
                }
            });
        }
    }
})

io.on('connection', (defaultSocket: Socket) => {
    const socket = <SessionSocket> defaultSocket;
    const userSession = socket.request.session.user;
    const user = socket.request.session.user?.username
    if(userSession)
    {    
        console.log(userSession.username + ' is connected');
        socket.on('message', (msg) => {
             // Append the message in the log file of the chanel
             fs.appendFile("./logs/" + "channelLog" + user + ".txt","Message of " + user + " " + msg + "\n", (err: any) => { 
                if (err) { 
                  console.log(err); 
                } 
                else { 
                  // Get the file contents after the append operation 
                  console.log("\nFile Contents of file after append:"); 
                } });
            console.log(msg);
            io.emit('message',userSession.username+ ": "+ msg);
        });
        socket.on('disconnect', () => {
        console.log('user disconnected');
        })
    }
  });
  

  io.on('connection', (defaultSocket: Socket) => {
    const socket = <SessionSocket>defaultSocket;
    const userSession = socket.request.session.user;

    if (userSession) {
        console.log(userSession.username + ' is connected');
        socket.on('privateMessage', (msg) => {
            console.log(msg.to);
            console.log(userSession.id);
            msg.from = userSession.id;
            msg.username = userSession.username;
            if(userSession.id === msg.to || userSession.id === msg.from)
            {    console.log(msg.to); 
                console.log(msg)
                io.emit('privateMessage',msg);}
        });
    }
});


httpServer.listen(3000, () => {
    console.log('listening on *:3000');  
    //console.clear();
  });  
  
  