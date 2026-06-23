//Setup basique du serveur Express
const port = 3000;
const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Définition de la clé secrète pour le JWT
process.env.JWT_KEY = process.env.JWT_KEY || 'Cle_random_pour_le_jwt';

//Setup de la connexion à la base de données MySQL
const mysql = require('mysql2');
const DB = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Alert-Civiq'
});





app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});