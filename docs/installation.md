# Installation

The following contains the process and requirements to install and run this project.

## Prerequisites

- Git >= `2.41.x`
- Node >= `v18.x.x`
- Mongo backend URI
- Paypal client ID

## Dependent libraries that must be installed

### 2. Install NPM packages for both frontend and backend

```
cd frontend
npm i
cd backend
npm i
```

## Download instructions(We didn't deploy our app yet, so right now need to clone from github, please follow the Installation of actual application below to download instructions)


## Installation of actual application:

### 1. Clone repo
```
git clone https://github.com/Qihuiwang3/JID-4121-LMCFilm.git
```


## Run instructions: 

### 1. Generate a Secure JWT Secret:
You need a secure JWT_SECRET for authentication. Use the following command to generate a random 256-byte base64 string:

```
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"

```
Copy the generated string and use it in the backend .env file (explained below).


### 2. Create `.env` files for both frontend and backend:

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

### 3. Run frontend and backend

```
cd frontend
npm run start
cd backend
npm run dev
```


## Troubleshooting:

### 1. frontend error after enter ```npm start```:
``` it might because missing package, just need to run npm install xxx(xxx will be the missing packge error name)```

### 2. login in info missing when this project is running: 
```the solution is to re-login, since we using token to store user's info, the token will expire in 1 hour. re-login will solve this issue.```

### 3. When you have some unknown error showing: 
```Please re-run the frontend to resolve this issue.```


