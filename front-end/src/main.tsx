import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(

    <GoogleOAuthProvider clientId="158478297408-gevob1skc53nfic5u33qd9nguctbmkq8.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  
)
