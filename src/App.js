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
import ShoppingRef from './pages/ShoppingRef';
import FloorManager from './pages/FloorManager';
import ServerAssistant from './pages/ServerAssistant';


function App() {
  const btnStyle = {
    margin:'0.5rem',
    marginLeft: '1.5rem',
    
}
const btnStyleFirst = {
  margin:'0.5rem',
  marginLeft: '1.5rem',
  marginTop: '1.5rem'
}
  const router = createBrowserRouter([
    {
      path: "/", element:
        <div className="btnList">
          <a  className="option" href="/floor-manager">Floor Manager</a>
          
          <a  className="option" href="/waiters">Waiter</a>
          
          <a  className="option" href="/server-assistant">Server Assistant</a>
          
          <a  className="option" href="/preorder">Preorder</a>
          
          <a  className="option" href="/Kitchen">Kitchen</a>
          
          <a  className="option" href="/host">Host</a>
          
          <a  className="option" href="/Shopping-Ref">Shopping Reference</a>
        </div>
    },
    {
      path: "/floor-manager",
      element: <FloorManager />,
      children: [
        { path: ":id", element: <FloorManager /> },
      ]
    },
    {
      path: "/waiters",
      element: <Waiter />,
      children: [
        { path: ":id", element: <Waiter /> },
      ]
    },
    {
      path: "/server-assistant",
      element: <ServerAssistant />,
      children: [
        { path: ":id", element: <ServerAssistant /> },
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
    {
      path: "/Shopping-Ref",
      element: <ShoppingRef />,
      children: [
        { path: ":type", element: <ShoppingRef /> },
      ]
    },
    { path: "/host", element: <Host /> },
    { path: "confirmation", element: <Confirmation /> }
  ]);

  return (
    <div className="container" style={{ padding: 0, width: "100%", margin: "0", maxWidth: "100%" }}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
