# E-Commerce Shopping App SAAS

## Introduzione
Benvenuti nel nostro E-commerce, un'applicazione completa costruita utilizzando lo stack MERN (MongoDB, Express, React, Node.js) e Material-UI (MUI) per l'interfaccia utente. Questo progetto offre modalità utente normale e amministratore, fornendo un'ampia gamma di funzionalità per migliorare l'esperienza di shopping.

## Stack Tecnologico

![MongoDB](https://img.shields.io/badge/-MongoDB-green) ![Express](https://img.shields.io/badge/-Express-blue) ![React](https://img.shields.io/badge/-React-blue) ![Node.js](https://img.shields.io/badge/-Node.js-green) ![Material-UI](https://img.shields.io/badge/-Material--UI-blue) ![Stripe](https://img.shields.io/badge/-Stripe-blue) ![Mongoose](https://img.shields.io/badge/-Mongoose-green) ![Redux](https://img.shields.io/badge/-Redux-purple) ![Redux-thunk](https://img.shields.io/badge/-Redux--thunk-purple) ![CSS3](https://img.shields.io/badge/-CSS3-blue)

## 🚀 Funzionalità Principali

### 👤 Gestione Utenti
- Autenticazione completa (login/registrazione)
- Profili utente personalizzabili con avatar (upload o generazione casuale)
- Sistema di recupero password via email
- Gestione profilo (modifica dati, password, avatar)
- Cronologia ordini dettagliata
- Gestione indirizzi di spedizione multipli
- Sistema di ruoli (Admin/User)
- Protezione delle route basata sui ruoli

### 🛍️ Catalogo Prodotti
- Visualizzazione prodotti con immagini multiple
- Sistema di filtri avanzato
- Ricerca prodotti
- Gestione taglie per ogni prodotto con stock dedicato
- Sistema di recensioni e valutazioni dettagliato
- Indicatore di disponibilità prodotti
- Prezzi scontati e badge "Esaurito"
- Sistema di raccomandazione prodotti
- Slider prodotti sponsorizzati
- Sezione prodotti di tendenza

### 🛒 Carrello e Checkout
- Carrello della spesa persistente
- Selezione taglie con verifica disponibilità
- Gestione quantità dinamica
- Calcolo automatico totali e sconti
- Processo di checkout multi-step
- Integrazione pagamenti Stripe
- Conferma ordine via email
- Tracking stato ordini
- Possibilità di riacquisto da ordini precedenti

### 👨‍💼 Pannello Amministratore
- Dashboard completa con statistiche
- Gestione prodotti (CRUD)
  - Upload immagini multiple
  - Gestione stock per taglia
  - Gestione prezzi e sconti
- Gestione categorie
- Gestione taglie
  - Creazione taglie personalizzate
  - Gestione stock per taglia
- Gestione ordini
  - Visualizzazione ordini
  - Aggiornamento stato
  - Gestione spedizioni
- Gestione utenti
  - Modifica ruoli
  - Gestione account
- Gestione recensioni
- Analytics e report vendite

### 🎨 Personalizzazione Sito
- Gestione logo e nome negozio
- Personalizzazione hero slider
- Gestione social media links
- Personalizzazione testi
- Configurazione metodi di pagamento
  - Gestione chiavi Stripe
  - Configurazione gateway
- Gestione SMTP per email
  - Configurazione server mail
  - Template email personalizzabili
- Integrazione WhatsApp Business
- Gestione informazioni di contatto
- Personalizzazione pagine About/Info

### 📱 Features Aggiuntive
- Design completamente responsive
- Sistema di notifiche
- Cookie banner personalizzabile
- Integrazione social media
- Pagine informative (Privacy, Termini)
- Sistema di webhook per Stripe
- API RESTful completa
- Gestione errori avanzata
- Rate limiting e sicurezza

## 🛠️ Installazione e Configurazione

### 1. Clonare il repository:
```bash
git clone https://github.com/PixelPunkNFT/Ecommerce-react-stripe-mongoDB.git
cd Cartella
```

### 2. Installazione Backend:
```bash
npm install
```

### 3. Installazione Frontend:
```bash
cd frontend
npm install


### 4. Configurazione Variabili d'Ambiente

#### Backend (.env):
Creare un file `.env` nella cartella backend con le seguenti variabili:
```env
# Server Configuration
PORT = "5000"
NODE_ENV = "development"

# MongoDB Configuration
DB_LINK = "mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority"

# JWT Configuration
JWT_SECRET = "<your-jwt-secret>"
JWT_EXPIRE = "1y"
COOKIE_EXPIRE = "5"

# SMTP Configuration
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = "587"
SMTP_SECURE = "false"
SMTP_USER = "<your-email>"
SMTP_PASS = "<your-app-password>"
SMTP_FROM = "Your Name <your-email>"

# Cloudinary Configuration
CLOUDINARY_NAME = "<your-cloudinary-name>"
API_KEY = "<your-cloudinary-api-key>"
API_SECRET = "<your-cloudinary-api-secret>"
CLOUDINARY_URL = "cloudinary://<api-key>:<api-secret>@<cloudinary-name>"

# URLs
FRONTEND_URL = "http://localhost:3000"
BACKEND_URL = "http://localhost:5000"

# Stripe Configuration
STRIPE_API_KEY = "<your-stripe-publishable-key>"
STRIPE_SECRET_KEY = "<your-stripe-secret-key>"
STRIPE_WEBHOOK_SECRET = "<your-stripe-webhook-secret>"
SUBSCRIPTION_PRICE = "<your-stripe-subscription-price-id>"
```

#### Frontend (.env.local):
Creare un file `.env.local` nella cartella frontend con le seguenti variabili:
```env
REACT_APP_STRIPE_KEY=<your-stripe-publishable-key>
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### 5. Avvio dell'applicazione:

#### Backend:
```bash
cd backend
npm start
```

#### Frontend:
```bash
cd frontend
npm start
```

L'applicazione sarà accessibile su:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Responsive Design
L'applicazione è completamente ottimizzata per:
- Desktop
- Tablet
- Dispositivi mobili

## 🔐 Sicurezza
- Autenticazione JWT
- Password hashing
- Protected routes
- Input sanitization
- CORS policy
- Rate limiting
- Gestione errori avanzata
- Validazione dati
- Protezione contro XSS
- Sicurezza delle sessioni

## 🚀 Deployment su Vercel

Per deployare l'applicazione su Vercel:

1. Preparare il progetto con la struttura corretta
2. Configurare vercel.json nella root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "./backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "./frontend/build",
      "use": "@vercel/static"
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/backend/server.js"
    }
  ]
}
```

3. Buildare il frontend
4. Pushare su GitHub
5. Connettere il repository a Vercel
6. Configurare le variabili d'ambiente
7. Deployare

## 👨‍💻 Autore
[Juri Moretti](https://github.com/PixelPunkNFT)

## 📄 Licenza
ISC
