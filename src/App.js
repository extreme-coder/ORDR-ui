import logo from './logo.svg';
import './App.css';
import { Accordion, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import Waiter from './pages/Waiter';

function App() {
  const router = createBrowserRouter([
    { path: "/waiters", element: <Waiter /> },
  ]);

  return (
    <div className="container" style={{ padding: 0, width: "100%", margin: 0, maxWidth: "100%" }}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
