import logo from './logo.svg';
import './App.css';
import { Accordion, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import Waiter from './pages/Waiter';
import Kitchen from './pages/Kitchen';


function App() {
  const router = createBrowserRouter([
    {
      path: "/", element:
        <div>
          <a href="/waiters">Waiter Page</a>
        </div> },
    { path: "/waiters", element: <Waiter /> },
    {path: "/Kitchen", element: <Kitchen />},
  ]);

  return (
    <div className="container" style={{ padding: 0, width: "100%", margin: 0, maxWidth: "100%" }}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
