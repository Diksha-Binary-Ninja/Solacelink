const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);


let users = {}; // Track users with their preferences
let helpers = []; // Track users who are helpers
let seekers = []; // Track users who are seekers
let boredUsers = []; // Track users who are bored

const cors = require('cors');  // <-- Import CORS package


app.use(cors());  // <-- Enable CORS for all routes


const io = new Server(server, {
    cors: {
        origin: "*",  // <-- Allow requests from any origin
        methods: ["GET", "POST"]
    }
});
// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve index.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Define numerical options for matching
const optionsMapping = {
    "Want to give financial assistance to someone": 1,
    "Want to support someone suffering from family issues": 2,
    "Want to help someone with relationship problems or divorce": 3,
    "Want to support someone grieving the death of a loved one": 4,
    "Want to help someone with depression or any mental disorder": 5,
    "Want to support someone dealing with work stress": 6,
    "Want to help someone with health issues": 7,
    "Money Issues": 1,
    "Family Issues": 2,
    "Relationship Problems": 3,
    "Grieving a Death": 4,
    "Depression or Mental Disorder": 5,
    "Work Stress": 6,
    "Health Issues": 7
};

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('new-user-joined', (name) => {
        users[socket.id] = { name, socketId: socket.id, preferences: {}, role: null };
        console.log(`User joined: ${name}`);
    });

    socket.on('send', (message) => {
        const connectedUser = users[socket.id].connectedUser;  // Store the connected user
        if (connectedUser) {
            // Send the message only to the connected user
            io.to(connectedUser).emit('receive', { name: users[socket.id].name, message });
        }
    });
    socket.on('disconnect', () => {
        const disconnectedUser = users[socket.id];
        console.log(`User disconnected: ${socket.id}`);
        if (disconnectedUser && disconnectedUser.connectedUser) {
            console.log(`Notifying ${disconnectedUser.connectedUser} about disconnection`); // Log to verify
            io.to(disconnectedUser.connectedUser).emit('user-disconnected', `${disconnectedUser.name} has left the chat.`);
        }
        delete users[socket.id];
        
        helpers = helpers.filter(id => id !== socket.id);
        seekers = seekers.filter(id => id !== socket.id);
        boredUsers = boredUsers.filter(id => id !== socket.id);
    });

    socket.on('user-details', (userDetails) => {
        // Ensure preferences are correctly assigned
        users[socket.id] = {
            name: userDetails.name,
            socketId: userDetails.socketId,
            role: userDetails.role,
            preferences: {
                problems: userDetails.problems || [],
                mainIssue: userDetails.mainIssue || null,
                helpType: userDetails.helpType || null,
                interests: userDetails.interests || null
            }
        };

        console.log('User details updated: ', users[socket.id]);

        if (userDetails.role === 1) {
            // Helper
            helpers.push(socket.id);
            console.log(`Helper added: ${socket.id}`);
            findMatchForHelper(socket.id);
        } else if (userDetails.role === 2) {
            // Bored
            boredUsers.push(socket.id);
            console.log(`Bored user added: ${socket.id}`);
            findMatchForBored(users[socket.id]); // Pass the whole user object
        } else if (userDetails.role === 3) {
            // Seeker
            seekers.push(socket.id);
            console.log(`Seeker added: ${socket.id}`);
            findMatchForSeeker(socket.id);
        }
        
    });
    
    const findMatchForHelper = (helperId) => {
        
        const helper = users[helperId];
        console.log(`Finding match for helper: ${helper.name}, preference: ${helper.preferences.helpType}`);
    
        // Priority: Match helper with a seeker who has the main issue matching helper's help type
        for (let i = 0; i < seekers.length; i++) {
            const seekerId = seekers[i];
            const seeker = users[seekerId];
    
            if (seeker && seeker.preferences.mainIssue === helper.preferences.helpType ) {
                // Priority match found
                connectUsers(helperId, seekerId);
                return;
            }
        }
    
        // Fallback: If no priority seeker, connect helper with a random seeker
        if (seekers.length >0) {
            const randomSeekerId = seekers[Math.floor(Math.random() * seekers.length)];
            connectUsers(helperId, randomSeekerId);
        }
        
        else {
            io.to(helper.socketId).emit('waiting', 'Waiting for a suitable match...');
        }
        
    };
        
    const findMatchForSeeker = (seekerId) => {
        const seeker = users[seekerId];
    
        if (!seeker || !seeker.preferences || !seeker.preferences.problems) {
            io.to(seekerId).emit('waiting', 'Error in seeker details. Please try again later.');
            return;
        }
    
        // Priority: Match seeker with a helper whose help type matches seeker's main issue
        for (let i = 0; i < helpers.length; i++) {  // Declare `i` here
            const helperId = helpers[i];
            const helper = users[helperId];
    
            if (helper && helper.preferences.helpType === seeker.preferences.mainIssue) {
                // Priority match found
                connectUsers(helperId, seekerId);
                return;
            }
        }
    
        // Fallback: If no matching helper, connect seeker with a random helper or other seeker
        if (helpers.length > 0) {
            const randomHelperId = helpers[Math.floor(Math.random() * helpers.length)];
            connectUsers(randomHelperId, seekerId);
        } else {
            io.to(seeker.socketId).emit('waiting', 'Waiting for a suitable match...');
        }
    };
    
    
    
    // Helper function to connect two users and notify them
    const connectUsers = (id1, id2) => {
        users[id1].connectedUser = id2;
        users[id2].connectedUser = id1;
    
        io.to(users[id1].socketId).emit('connect-user', users[id2].name);
        io.to(users[id2].socketId).emit('connect-user', users[id1].name);
    
        // Remove matched users from their respective lists
        helpers = helpers.filter(id => id !== id1 );
        seekers = seekers.filter(id => id !== id1 && id !== id2);
        boredUsers = boredUsers.filter(id => id !== id1 && id !== id2);
    };
    

    const findMatchForBored = (userDetails) => {
        if (!userDetails || !userDetails.preferences) {
            console.log(`Error: User details are incomplete. ID: ${userDetails.socketId}`);
            io.to(userDetails.socketId).emit('waiting', 'Error in user details. Please try again later.');
            return;
        }
    
        const interest = userDetails.preferences.interests.toLowerCase();
        console.log(`Finding match for bored user: ${userDetails.name}, interest: ${interest}`);
    
        const potentialMatches = boredUsers.filter(id => id !== userDetails.socketId);
    
        if (potentialMatches.length === 0) {
            io.to(userDetails.socketId).emit('waiting', 'Waiting for a suitable match...');
            return;
        }
    
        const match = potentialMatches.find(id => users[id].preferences.interests.toLowerCase() === interest);
    
        if (match) {
            // Interest match found
            connectUsers(userDetails.socketId, match);
        } else {
            // No interest match, choose a random user
            const randomIndex = Math.floor(Math.random() * potentialMatches.length);
            const randomMatch = potentialMatches[randomIndex];
            connectUsers(userDetails.socketId, randomMatch);
        }
    
        // Update boredUsers list
        boredUsers = boredUsers.filter(id => id !== userDetails.socketId && id !== match);
    };
    

    

    
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
