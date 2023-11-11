import { createBrowserRouter } from "react-router-dom";

import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CarDetail } from "./pages/Car";
import { Dashboard } from "./pages/Dashboard";
import { New } from "./pages/New";

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children:[
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/car/:id",
        element: <CarDetail/>
      },
      {
        path: "/dashboard",
        element: <Dashboard/>
      },
      {
        path: "dashboard/new",
        element: <New/>
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  }
])

export {router};