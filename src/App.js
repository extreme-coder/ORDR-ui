import logo from './logo.svg';
import './App.css';
import { Accordion, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import Waiter from './pages/Waiter';
import Kitchen from './pages/Kitchen';
import { Confirmation, Preorder } from './pages/Preorder';
import Host from './pages/pageStyles/Host';
import { ToastContainer } from 'react-toastify';


function App() {
  const router = createBrowserRouter([
    {
      path: "/", element:
        <div>
          <a href="/waiters">Waiter Page</a>
          <br />
          <a href="/preorder">Preorder Page</a>
          <br />
          <a href="/Kitchen">Kitchen Page</a>
          <br />
          <a href="/host">Host Page</a>
          
        </div>
    },
    {
      path: "/waiters",
      element: <Waiter />,
      children: [
        { path: ":id", element: <Waiter /> },
      ]
    },
    { path: "/preorder", element: <Preorder /> },
    {
      path: "/Kitchen",
      element: <Kitchen />,
      children: [
        { path: ":type", element: <Kitchen /> },
      ]
    },
    { path: "/host", element: <Host /> },
    { path: "confirmation", element: <Confirmation /> }
  ]);

  return (
    <div className="container" style={{ padding: 0, width: "100%", margin: 0, maxWidth: "100%" }}>
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
