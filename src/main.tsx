import React from 'react'
import ReactDOM from 'react-dom/client'
import {router} from './App.tsx'
import {RouterProvider} from "react-router-dom";
import './index.css'

import {Toaster} from "react-hot-toast"
import AuthProvider from './contexts/AuthContexts.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>  
      <Toaster 
        position='bottom-center'
        reverseOrder={false}
      />
      <RouterProvider router={router} />
    </AuthProvider>  
  </React.StrictMode>,
)
