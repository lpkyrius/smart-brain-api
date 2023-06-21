const express = require('express'); 
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432, // double-check the right PORT
      user : 'postgres',
      password : '',
      database : 'smart-brain'
    }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('it is working!') })
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)}) // (req, res, db, bcrypt) -> dependency injection
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)}) 

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${ process.env.PORT  || 3000 }`);
})
