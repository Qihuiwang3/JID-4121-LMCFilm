# Installation

The following contains the process and requirements to install and run this project.

## Prerequisites

- Git >= `2.41.x`
- Node >= `v18.x.x`
- Mongo backend URI
- Paypal client ID

### Running

### 1. Clone repo
```
git clone https://github.com/Qihuiwang3/JID-4121-LMCFilm.git
```

### 2. Install NPM packages for both frontend and backend

```
cd frontend
npm i
cd backend
npm i
```
### 3. Generate a Secure JWT Secret:
You need a secure JWT_SECRET for authentication. Use the following command to generate a random 256-byte base64 string:

```
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"

```
Copy the generated string and use it in the backend .env file (explained below).


### 4. Create `.env` files for both frontend and backend:

#### Frontend
```
REACT_APP_BACKEND_URL=http://localhost:3500
REACT_APP_PAYPAL_CLIENT_ID=[paypal client id]
```

#### Backend
```
NODE_ENV=development 
DATABASE_URI=[mongo backend URI]
JWT_SECRET=[random jwt secret] 
```

### 5. Run frontend and backend

```
cd frontend
npm run start
cd backend
npm run dev
```
