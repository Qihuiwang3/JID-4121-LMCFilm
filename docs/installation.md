# Installation

The following contains the process and requirements to install and run this project.

## Prerequisites

1. Git >= `2.41.x`
2. Node >= `v18.x.x`
3. Mongo backend URI
4. Paypal client ID

## Dependent Libraries that must be Installed

### 1. Install NPM packages for both frontend and backend

```
cd frontend
npm i
cd backend
npm i
```

## Download Instructions

### Our application has not been deployed yet. To use it, you will need to clone the repository from GitHub. Please follow the installation instructions provided below to set up the application.


## Installation of Actual Application:

### 1. Clone repo on your terminal
```
git clone https://github.com/Qihuiwang3/JID-4121-LMCFilm.git
```


## Run Instructions: 

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

### 1. Frontend error after running ```npm start```:
``` This issue might occur due to a missing package. To resolve it, run npm install <missing-package-name> (replace <missing-package-name> with the name of the missing package mentioned in the error).```


### 2. Login information missing while the project is running: 
```This occurs because the user’s token, used to store login information, expires after 1 hour. To resolve this issue, simply re-login to refresh the token.```

### 3. Unknown error encountered: 
```Restart the frontend by stopping the current session and running it again using npm start. This should resolve most unknown errors.```