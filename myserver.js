const http = require('http');//loading the http module
const PORT = 3000;//port number for the server to listen on
//creating the server and defining the request handler
// The server handles GET, POST, PUT, and DELETE requests for user data
const server = http.createServer((req, res) => {
    console.log(req.method, req.url);//printing the method and url of the incoming request
   //GET/USERS - returns a list of all users
    if (req.method === 'GET' && req.url === '/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
        //GET/USERS/:ID - returns one user by ID
    }else if (req.method === 'GET' && req.url.startsWith('/users/')) {
        const idfromUrl = req.url.split('/')[2];//extracting the user ID from the URL
        const id = Number(idfromUrl);//converting the ID to a number
        //checking if the ID is a valid number
        if (isNaN(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid user ID' }));
            return;//returning a 400 error if the ID is not valid
        }
        const user = users.find(u => u.id === id);//finding the user with the specified ID
        //checking if the user exists
        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });//returning a 404 error if the user is not found
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
        }
        //User found, returning the user data
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
        //POST/USERS - creates a new user
    }else if (req.method === 'POST' && req.url === '/users') {
            let body = '';//initializing an empty string to store the request body
            req.on('data', chunk => {
                body += chunk;//joining the incoming data chunks to form the complete request body
        });
        //whole body has arrived, parsing the JSON data and creating a new user
        req.on('end', () => {
            let data;//converting the request body to a JavaScript object
            try {
                data = JSON.parse(body);
                //checking if the request body is valid JSON
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;//returning a 400 error if the JSON is invalid
            }
            //check the name and email fields are present in the request body
            if (!data ||!data.name || !data.email) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing name or email' }));
                return;//returning a 400 error if the name or email is missing
            }
            //creating a new user object with a unique ID and adding it to the users array
            const newUser = {id: nextId++, name: data.name, email: data.email};
            users.push(newUser);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));//returning a 201 status code and the newly created user object
        });
        //PUT/USERS/:ID - updates an existing user by ID
    }else if (req.method === 'PUT' && req.url.startsWith('/users/')) {
        const idfromUrl = req.url.split('/')[2];//extracting the user ID from the URL
        const id = Number(idfromUrl);//converting the ID to a number
        //checking if the ID is a valid number
        if (isNaN(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid user ID' }));
            return;//returning a 400 error if the ID is not valid
        }
        //initializing an empty string to store the request body
        let body = '';
        req.on('data', chunk => {
            body += chunk;//joining the  data  to form the request body
        });
        //whole body has arrived, parsing the JSON data and updating the user
        req.on('end', () => {
            let data;
            try {
                data = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
                return;
            }//checking if the user with the specified ID exists
            const userIndex = users.findIndex(u => u.id === id);
            if (userIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User not found' }));
                return;
            }//checking if the name and email fields are present in the request body
            if (!data ||!data.name || !data.email) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing name or email' }));
                return;
            }//updating the user object with the new name and email values
            users[userIndex] = { id: id, name: data.name, email: data.email };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users[userIndex]));
        });//returning a 200 status code and the updated user object
    }else if (req.method === 'DELETE' && req.url.startsWith('/users/')) {
        const idfromUrl = req.url.split('/')[2];
        const id = Number(idfromUrl);
        //checking if the ID is a valid number
        if (isNaN(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid user ID' }));
            return;
        }//checking if the user with the specified ID exists
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
        }//removing the user from the users array
        users.splice(userIndex, 1);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User deleted' }));
        //returning a 200 status code and a message indicating that the user has been deleted
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }//returning a 404 error for any other requests that do not match the defined routes
});
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
];
let nextId = 2;
server.listen(PORT, () => {
    console.log(`This Server is running on http://localhost:${PORT}`);
});//starting the server and listening for incoming requests on the specified port