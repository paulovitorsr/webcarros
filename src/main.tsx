import React from 'react'
import ReactDOM from 'react-dom/client'
import {router} from './App.tsx'
import {RouterProvider} from "react-router-dom";
import './index.css'

import {Toaster} from "react-hot-toast"
import AuthProvider from './contexts/AuthContexts.tsx';

import {register} from "swiper/element/bundle";

register();
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


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
