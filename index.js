const express = require("express");
const cors = require("cors");
const myapp = express();

myapp.use(cors()); // Apply CORS middleware separately
myapp.use(express.json()); // Apply body parser middleware for JSON

const loginroute = require('./login-create/login');
const createuserroute = require('./login-create/usercreate');
const testroutes = require('./routes/assignment');

myapp.use('/login', loginroute); // Set the route prefix for login
myapp.use('/createUser', createuserroute); // Set the route prefix for user creation
myapp.use('/',testroutes)

myapp.get('/', (req, res) => {
  res.send('Hello, World');
});

const port = 3000;
myapp.listen(port, () => console.log(`Server Started on port ${port}...`));
