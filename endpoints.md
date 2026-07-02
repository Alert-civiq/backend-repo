# 📡 API Endpoints - AlerteCiviq

Documentation complète des endpoints de l'API AlerteCiviq.

---

## � Résumé rapide

| Statut | Nombre |
|--------|--------|
| ✅ Endpoints implémentés | 4 |
| 🚧 Endpoints à implémenter | 35 |
| 📦 Total endpoints | 39 |

**Base URL:** `http://localhost:3000/api`

---

## �📑 Table des matières

- [Authentification](#authentification)
- [Signalements](#signalements)
- [Endpoints à implémenter](#endpoints-à-implémenter-todo)
  - [Gestion des Catégories](#gestion-des-catégories)
  - [Gestion des Zones Géographiques](#gestion-des-zones-géographiques)
  - [Gestion des Signalements](#gestion-des-signalements)
  - [Gestion des Preuves](#gestion-des-preuves)
  - [Confirmations de Citoyens](#confirmations-de-citoyens)
  - [Affectations (Admin)](#affectations-admin)
  - [Notifications](#notifications)
  - [Gestion Utilisateur (Admin)](#gestion-utilisateur-admin)
  - [Audit Logs](#audit-logs)
  - [Profil Utilisateur](#profil-utilisateur)
- [Codes d'erreur HTTP](#codes-derreur-http)
- [Note sur l'authentification](#note-sur-lauthentification)

---

## 🔐 Authentification

### POST /api/inscription/citoyen
Inscription d'un nouveau citoyen.

**Requête (Body JSON):**
```json
{
  "est_anonyme": false,
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@email.com",
  "telephone": "+213555123456",
  "mdp": "MotDePasse123!"
}
```

**Si anonyme:**
```json
{
  "est_anonyme": true,
  "mdp": "MotDePasse123!"
}
```

**Réponse (200):**
```json
{
  "message": "Inscription réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs:**
- `403` - Email déjà existant
- `500` - Erreur serveur

---

### POST /api/connexion/citoyen
Connexion d'un citoyen existant.

**Requête (Body JSON):**
```json
{
  "email": "jean.dupont@email.com",
  "mdp": "MotDePasse123!"
}
```

**Réponse (200):**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs:**
- `404` - Utilisateur introuvable
- `401` - Mot de passe incorrect
- `500` - Erreur serveur

---

## 🚨 Signalements

### POST /api/signaler_sans_preuves
Création d'un signalement sans fichier de preuve.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Requête (Body JSON):**
```json
{
  "categorie": "Corruption",
  "titre": "Pot-de-vin détecté",
  "description": "Description détaillée du signalement...",
  "est_anonyme": false,
  "lat": 36.7538,
  "lon": 3.0588
}
```

**Catégories disponibles:**
- `Corruption`
- `Insecurité`
- `Incendie`
- `Médicale`

**Réponse (200):**
```json
{
  "message": "Signalement effectué"
}
```

**Erreurs:**
- `401` - Non autorisé (token invalide)
- `500` - Erreur serveur

---

### POST /api/signaler_avec_preuves
Création d'un signalement avec fichiers de preuve.

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: multipart/form-data
```

**Requête (FormData):**
```
categorie: "Corruption"
titre: "Pot-de-vin détecté"
description: "Description détaillée..."
est_anonyme: false
lat: 36.7538
lon: 3.0588
fichiers: [File, File, ...] // Tableau de fichiers
```

**Formats acceptés:**
- Images: `image/jpeg`, `image/png`
- Vidéo: `video/mp4`
- Audio: `audio/mp3`, `audio/mpeg`
- Documents: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain`

**Taille max:** 10 Mo par fichier

**Réponse (200):**
```json
{
  "message": "Signalement effectué"
}
```

**Erreurs:**
- `401` - Non autorisé
- `500` - Erreur serveur

---

## 🚧 Endpoints à implémenter (TODO)

### 📂 Gestion des Catégories

#### GET /api/categories
Récupérer la liste des catégories actives.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Réponse attendue (200):**
```json
{
  "categories": [
    {
      "id_categorie": 1,
      "libelle": "Corruption",
      "description": "Cas de corruption détectés",
      "icone": "shield",
      "est_active": true
    }
  ]
}
```

---

#### POST /api/categories
Créer une nouvelle catégorie (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Requête (Body JSON):**
```json
{
  "libelle": "Nouvelle catégorie",
  "description": "Description de la catégorie",
  "icone": "icon_name"
}
```

**Réponse attendue (201):**
```json
{
  "message": "Catégorie créée",
  "id_categorie": 5
}
```

---

#### PUT /api/categories/:id
Modifier une catégorie (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Requête (Body JSON):**
```json
{
  "libelle": "Catégorie modifiée",
  "description": "Nouvelle description",
  "icone": "new_icon",
  "est_active": true
}
```

**Réponse attendue (200):**
```json
{
  "message": "Catégorie modifiée"
}
```

---

#### DELETE /api/categories/:id
Désactiver une catégorie (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Réponse attendue (200):**
```json
{
  "message": "Catégorie désactivée"
}
```

---

### 🗺️ Gestion des Zones Géographiques

#### GET /api/zones
Récupérer la liste des zones géographiques.

**Réponse attendue (200):**
```json
{
  "zones": [
    {
      "id_zone": 1,
      "nom_zone": "Commune de Bab El Oued",
      "type_zone": "local",
      "region": "Alger",
      "pays": "Algérie"
    }
  ]
}
```

---

#### POST /api/zones
Créer une nouvelle zone (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Requête (Body JSON):**
```json
{
  "nom_zone": "Nouvelle zone",
  "type_zone": "local",
  "region": "Alger",
  "pays": "Algérie",
  "coordonnees_perimetre": "GeoJSON ou WKT"
}
```

**Réponse attendue (201):**
```json
{
  "message": "Zone créée",
  "id_zone": 4
}
```

---

#### PUT /api/zones/:id
Modifier une zone (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Requête (Body JSON):**
```json
{
  "nom_zone": "Zone modifiée",
  "type_zone": "regional",
  "region": "Alger"
}
```

**Réponse attendue (200):**
```json
{
  "message": "Zone modifiée"
}
```

---

#### DELETE /api/zones/:id
Supprimer une zone (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Réponse attendue (200):**
```json
{
  "message": "Zone supprimée"
}
```

---

### 📋 Gestion des Signalements

#### GET /api/signalements
Lister les signalements avec filtres.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Query Parameters (optionnels):**
```
?statut=en_attente
&categorie=1
&zone=1
&date_debut=2026-01-01
&date_fin=2026-12-31
&page=1
&limit=20
```

**Réponse attendue (200):**
```json
{
  "signalements": [
    {
      "id_signalement": 1,
      "titre": "Titre du signalement",
      "description": "Description...",
      "statut": "en_attente",
      "categorie": "Corruption",
      "est_anonyme": false,
      "code_suivi": "ALG-2026-001",
      "latitude": 36.7538,
      "longitude": 3.0588,
      "est_urgence": true,
      "date_soumission": "2026-06-28T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 5
}
```

---

#### GET /api/signalements/:id
Récupérer les détails d'un signalement.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Réponse attendue (200):**
```json
{
  "id_signalement": 1,
  "titre": "Titre du signalement",
  "description": "Description complète...",
  "statut": "en_attente",
  "categorie": {
    "id_categorie": 1,
    "libelle": "Corruption"
  },
  "utilisateur": {
    "id_utilisateur": 5,
    "nom": "Dupont",
    "prenom": "Jean"
  },
  "zone": {
    "id_zone": 1,
    "nom_zone": "Commune de Bab El Oued"
  },
  "est_anonyme": false,
  "code_suivi": "ALG-2026-001",
  "latitude": 36.7538,
  "longitude": 3.0588,
  "est_urgence": true,
  "date_soumission": "2026-06-28T00:00:00Z",
  "preuves": [],
  "confirmations": 0
}
```

---

#### GET /api/signalements/code/:code_suivi
Suivre un signalement par son code de suivi.

**Réponse attendue (200):**
```json
{
  "id_signalement": 1,
  "titre": "Titre du signalement",
  "statut": "en_cours",
  "date_soumission": "2026-06-28T00:00:00Z",
  "date_cloture": null
}
```

---

#### PUT /api/signalements/:id
Modifier un signalement (propriétaire ou admin).

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Requête (Body JSON):**
```json
{
  "titre": "Titre modifié",
  "description": "Description modifiée",
  "latitude": 36.7540,
  "longitude": 3.0590
}
```

**Réponse attendue (200):**
```json
{
  "message": "Signalement modifié"
}
```

---

#### DELETE /api/signalements/:id
Supprimer un signalement (propriétaire ou admin).

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Réponse attendue (200):**
```json
{
  "message": "Signalement supprimé"
}
```

---

#### PATCH /api/signalements/:id/statut
Changer le statut d'un signalement (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Requête (Body JSON):**
```json
{
  "statut": "en_cours"
}
```

**Statuts disponibles:**
- `en_attente`
- `en_cours`
- `traite`
- `clos`
- `rejete`

**Réponse attendue (200):**
```json
{
  "message": "Statut modifié"
}
```

---

### 📎 Gestion des Preuves

#### GET /api/signalements/:id/preuves
Lister les preuves d'un signalement.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Réponse attendue (200):**
```json
{
  "preuves": [
    {
      "id_preuve": 1,
      "type_preuve": "image",
      "url_fichier": "/uploads/preuves/1719571200000-image.jpg",
      "taille_fichier": 1024,
      "description": "Photo de la scène"
    }
  ]
}
```

---

#### POST /api/signalements/:id/preuves
Ajouter une preuve à un signalement.

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: multipart/form-data
```

**Requête (FormData):**
```
fichier: File
description: "Description de la preuve"
```

**Réponse attendue (201):**
```json
{
  "message": "Preuve ajoutée",
  "id_preuve": 5
}
```

---

#### DELETE /api/preuves/:id
Supprimer une preuve.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Réponse attendue (200):**
```json
{
  "message": "Preuve supprimée"
}
```

---

#### GET /api/preuves/:id
Télécharger une preuve.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Réponse:** Fichier binaire

---

### ✅ Confirmations de Citoyens

#### POST /api/signalements/:id/confirmation
Confirmer ou infirmer un signalement (citoyen).

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Requête (Body JSON):**
```json
{
  "type_confirmation": "confirme",
  "commentaire": "J'ai aussi vu cela"
}
```

**Types disponibles:**
- `confirme`
- `infirme`

**Réponse attendue (200):**
```json
{
  "message": "Confirmation enregistrée"
}
```

---

#### GET /api/signalements/:id/confirmations
Lister les confirmations d'un signalement.

**Réponse attendue (200):**
```json
{
  "confirmations": [
    {
      "id_utilisateur": 5,
      "nom": "Dupont",
      "prenom": "Jean",
      "type_confirmation": "confirme",
      "commentaire": "J'ai aussi vu cela",
      "date_confirmation": "2026-06-28T00:00:00Z"
    }
  ],
  "total_confirme": 15,
  "total_infirme": 2
}
```

---

#### DELETE /api/signalements/:id/confirmation
Retirer sa confirmation.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Réponse attendue (200):**
```json
{
  "message": "Confirmation retirée"
}
```

---

### 👤 Affectations (Admin)

#### POST /api/signalements/:id/affectation
Affecter un signalement à un admin.

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Requête (Body JSON):**
```json
{
  "id_admin": 3,
  "commentaire": "Affectation pour traitement"
}
```

**Réponse attendue (201):**
```json
{
  "message": "Signalement affecté",
  "id_affectation": 10
}
```

---

#### GET /api/signalements/:id/affectation
Voir l'affectation d'un signalement.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Réponse attendue (200):**
```json
{
  "id_affectation": 10,
  "admin": {
    "id_utilisateur": 3,
    "nom": "Admin",
    "prenom": "Local"
  },
  "date_affectation": "2026-06-28T00:00:00Z",
  "commentaire": "Affectation pour traitement",
  "statut_traitement": "en_cours"
}
```

---

#### PUT /api/affectations/:id
Modifier le statut de traitement.

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Requête (Body JSON):**
```json
{
  "statut_traitement": "resolu",
  "commentaire": "Problème résolu"
}
```

**Statuts disponibles:**
- `en_cours`
- `resolu`
- `non_resolu`

**Réponse attendue (200):**
```json
{
  "message": "Statut de traitement modifié"
}
```

---

#### GET /api/admin/:id/signalements
Lister les signalements affectés à un admin.

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Réponse attendue (200):**
```json
{
  "signalements": [
    {
      "id_signalement": 1,
      "titre": "Titre",
      "statut": "en_cours",
      "date_affectation": "2026-06-28T00:00:00Z"
    }
  ]
}
```

---

### 🔔 Notifications

#### GET /api/notifications
Lister les notifications de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Query Parameters:**
```
?non_lu_only=true
&page=1
&limit=20
```

**Réponse attendue (200):**
```json
{
  "notifications": [
    {
      "id_notif": 1,
      "message": "Votre signalement a été traité",
      "canal": "push",
      "est_lu": false,
      "date_envoi": "2026-06-28T00:00:00Z",
      "id_signalement": 1
    }
  ],
  "non_lu": 5
}
```

---

#### PATCH /api/notifications/:id
Marquer une notification comme lue.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Requête (Body JSON):**
```json
{
  "est_lu": true
}
```

**Réponse attendue (200):**
```json
{
  "message": "Notification marquée comme lue"
}
```

---

#### POST /api/notifications/send
Envoyer une notification (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Requête (Body JSON):**
```json
{
  "id_utilisateur": 5,
  "id_signalement": 1,
  "canal": "push",
  "message": "Votre signalement est en cours de traitement"
}
```

**Canaux disponibles:**
- `push`
- `sms`
- `email`

**Réponse attendue (201):**
```json
{
  "message": "Notification envoyée",
  "id_notif": 20
}
```

---

### 👥 Gestion Utilisateur (Admin)

#### GET /api/utilisateurs
Lister les utilisateurs (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Query Parameters:**
```
?role=citoyen
&statut=actif
&page=1
&limit=20
```

**Réponse attendue (200):**
```json
{
  "utilisateurs": [
    {
      "id_utilisateur": 5,
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@email.com",
      "role": "citoyen",
      "statut": "actif",
      "score_fiabilite": 85.5,
      "date_inscription": "2026-06-01T00:00:00Z",
      "derniere_connexion": "2026-06-28T00:00:00Z"
    }
  ],
  "total": 100
}
```

---

#### GET /api/utilisateurs/:id
Détails d'un utilisateur (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Réponse attendue (200):**
```json
{
  "id_utilisateur": 5,
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@email.com",
  "telephone": "+213555123456",
  "role": "citoyen",
  "statut": "actif",
  "score_fiabilite": 85.5,
  "est_anonyme": false,
  "date_inscription": "2026-06-01T00:00:00Z",
  "derniere_connexion": "2026-06-28T00:00:00Z"
}
```

---

#### PUT /api/utilisateurs/:id/statut
Modifier le statut d'un utilisateur (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Requête (Body JSON):**
```json
{
  "statut": "suspendu"
}
```

**Statuts disponibles:**
- `actif`
- `suspendu`
- `en_attente`

**Réponse attendue (200):**
```json
{
  "message": "Statut modifié"
}
```

---

#### PUT /api/utilisateurs/:id/score
Modifier le score de fiabilité (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Requête (Body JSON):**
```json
{
  "score_fiabilite": 90.0
}
```

**Réponse attendue (200):**
```json
{
  "message": "Score de fiabilité modifié"
}
```

---

#### POST /api/inscription/admin
Inscription admin (superadmin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_superadmin>
```

**Requête (Body JSON):**
```json
{
  "nom": "Admin",
  "prenom": "Système",
  "email": "admin@alerteciviq.dz",
  "telephone": "+213600000000",
  "mdp": "MotDePasse123!"
}
```

**Réponse attendue (201):**
```json
{
  "message": "Admin créé",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### POST /api/inscription/admin_local
Inscription admin local (superadmin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_superadmin>
```

**Requête (Body JSON):**
```json
{
  "nom": "Admin",
  "prenom": "Local",
  "email": "admin.local@alerteciviq.dz",
  "telephone": "+213600000001",
  "mdp": "MotDePasse123!",
  "id_zone": 1
}
```

**Réponse attendue (201):**
```json
{
  "message": "Admin local créé",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### POST /api/inscription/admin_regional
Inscription admin régional (superadmin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_superadmin>
```

**Requête (Body JSON):**
```json
{
  "nom": "Admin",
  "prenom": "Régional",
  "email": "admin.regional@alerteciviq.dz",
  "telephone": "+213600000002",
  "mdp": "MotDePasse123!",
  "id_zone": 2
}
```

**Réponse attendue (201):**
```json
{
  "message": "Admin régional créé",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 📊 Audit Logs

#### GET /api/audit
Consulter les logs d'audit (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Query Parameters:**
```
?action=Inscription
&table_cible=utilisateur
&date_debut=2026-06-01
&date_fin=2026-06-30
&page=1
&limit=50
```

**Réponse attendue (200):**
```json
{
  "logs": [
    {
      "id_log": 1,
      "id_utilisateur": 5,
      "action": "Inscription",
      "table_cible": "utilisateur",
      "id_cible": 5,
      "details": "Inscription",
      "adresse_ip": "192.168.1.1",
      "date_action": "2026-06-28T00:00:00Z"
    }
  ],
  "total": 500
}
```

---

#### GET /api/audit/utilisateur/:id
Logs d'un utilisateur spécifique (admin uniquement).

**Headers:**
```
Authorization: Bearer <token_jwt_admin>
```

**Réponse attendue (200):**
```json
{
  "logs": [
    {
      "id_log": 1,
      "action": "Connexion",
      "table_cible": "utilisateur",
      "details": "Connexion",
      "adresse_ip": "192.168.1.1",
      "date_action": "2026-06-28T00:00:00Z"
    }
  ]
}
```

---

### 👤 Profil Utilisateur

#### GET /api/profil
Récupérer le profil de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Réponse attendue (200):**
```json
{
  "id_utilisateur": 5,
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@email.com",
  "telephone": "+213555123456",
  "role": "citoyen",
  "statut": "actif",
  "score_fiabilite": 85.5,
  "est_anonyme": false,
  "date_inscription": "2026-06-01T00:00:00Z",
  "derniere_connexion": "2026-06-28T00:00:00Z"
}
```

---

#### PUT /api/profil
Modifier le profil de l'utilisateur connecté.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Requête (Body JSON):**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "+213555123456"
}
```

**Réponse attendue (200):**
```json
{
  "message": "Profil modifié"
}
```

---

#### PUT /api/profil/mot_de_passe
Changer le mot de passe.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Requête (Body JSON):**
```json
{
  "mdp_actuel": "AncienMotDePasse123!",
  "mdp_nouveau": "NouveauMotDePasse123!"
}
```

**Réponse attendue (200):**
```json
{
  "message": "Mot de passe modifié"
}
```

**Erreurs:**
- `400` - Mot de passe actuel incorrect

---

#### DELETE /api/compte
Supprimer le compte utilisateur.

**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Requête (Body JSON):**
```json
{
  "confirmation": true
}
```

**Réponse attendue (200):**
```json
{
  "message": "Compte supprimé"
}
```

---

## ⚠️ Codes d'erreur HTTP

- `200` - Succès
- `201` - Créé
- `400` - Requête invalide
- `401` - Non autorisé (token manquant ou invalide)
- `403` - Accès refusé (permissions insuffisantes)
- `404` - Ressource introuvable
- `500` - Erreur serveur interne

---

## 🔑 Note sur l'authentification

Tous les endpoints (sauf inscription et connexion) nécessitent un token JWT dans l'en-tête `Authorization`:

```
Authorization: Bearer <votre_token_jwt>
```

Le token est obtenu lors de la connexion et est valide pendant 2 heures.
