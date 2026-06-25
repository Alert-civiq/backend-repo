//Setup basique du serveur Express
const port = 3000;
const compression = require('compression');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const path = require('path')
const mysql = require('mysql2');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(compression());

//Définition des clés secrètes
const JWT_KEY = process.env.JWT_KEY || 'Cle_random_pour_le_jwt';
const CRYPT_KEY = process.env.CRYPT_KEY || 'Cle_random_pour_bcrypt';

//Setup de la connexion à la base de données MySQL

const DB = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'alerte-civiq'
});

async function hasher(string) {
  console.log("Hash en cours\n")
  let hash = await bcrypt.hash(string, 10)
  console.log("Hash terminé\n")
  return hash
}

app.post('/api/sign_up', (req, res) => {
  console.log(req)

  let { nom, prenom, email, telephone, mdp } = req.body

  
 
  const sql_check_ins = "SELECT * FROM utilisateur WHERE email = ?"
  DB.query(sql_check_ins, [email], (err, result) => {
    if (err) {
      console.log("Erreur_verif_inscription...")
      res.status(500).json({ erreur: "Erreur serveur..." })
    } else if (result.length > 0) {
      res.status(403).json({ erreur: "Utilisateur déjà existant" })
    } else {
      const sql_sign_up = "INSERT INTO utilisateur(nom,prenom,email,telephone,mot_de_passe)"

      DB.query(sql_sign_up, [nom, prenom, email, telephone, hasher(mdp)], (err, result) => {
        if (err) {

          console.log("Erreur_BD_Inscription...")
          res.status(500).json({ erreur: "Erreur serveur..." })

        } else {
          const payload = { nom: nom, prenom: prenom, email: email }
          console.log(`...Nouvelle insciption ...`);
          const token = jwt.sign(payload,
            JWT_KEY,
            {
              expiresIn: '2h'
            }
          )

          res.json({
            message: "Inscription réussie",
            token
          })
        }
      })
    }
  })


})
app.post('/api/sign_in', (req, res) => {

  let { email, mdp } = req.body
  const sql_check_con = "SELECT nom,prenom,email,telephone,mot_de_passe FROM utilisateur WHERE email = ? LIMIT 1"
  DB.query(sql_check_con, [email], (err, result) => {

    if (err) {

      console.log("Erreur_BD_Connexion...")
      res.status(500).json({ erreur: "Erreur serveur...." })

    } else if (!result) {

      res.status(404).json({ erreur: "Utilisateur introuvable" })

    } else {

      bcrypt.compare(mdp, result[0].mot_de_passe, (err, isMatch) => {

        if (err) {

          console.log(err)

        } else {
          if (isMatch) {
            let nom = result[0]
            let prenom = result[1]
            let email = result[2]
            let telephone = result[3]
            const payload = { nom, prenom, email, telephone }
            const token = jwt.sign(
              payload,
              JWT_KEY,
              {
                expiresIn: "2h"
              }
            );
            res.status(200).json({
              message: "Connexion réussie",
              token
            })
          } else {
            res.json({ message: "Mot de passe incorrect" })
          }
        }
      })
    }
  })
})


app.listen(port, () => {
  console.log(`Server en cours sur le port ${port}`);
});