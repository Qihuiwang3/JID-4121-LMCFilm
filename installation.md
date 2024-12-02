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

### 3. Create `.env` files for both frontend and backend:

#### Frontend
```
REACT_APP_BACKEND_URL=http://localhost:3500
REACT_APP_PAYPAL_CLIENT_ID=[paypal client id]
JWT_SECRET=[random jwt secret]
```

#### Backend
```
NODE_ENV=development 
DATABASE_URI=[mongo backend URI]
```

### 5. Run frontend and backend

```
cd frontend
npm run start
cd backend
npm run dev
```