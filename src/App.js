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
        <div>
          <Button style={btnStyleFirst} variant="secondary" href="/floor-manager">Floor Manager</Button>
          <br />
          <Button style={btnStyle} variant="secondary" href="/waiters">Waiter Page</Button>
          <br />
          <Button style={btnStyle} variant="secondary" href="/server-assistant">Server Assistant</Button>
          <br />
          <Button style={btnStyle} variant="secondary" href="/preorder">Preorder Page</Button>
          <br />
          <Button style={btnStyle} variant="secondary" href="/Kitchen">Kitchen Page</Button>
          <br />
          <Button style={btnStyle} variant="secondary" href="/host">Host Page</Button>
          <br />
          <Button style={btnStyle} variant="secondary" href="/Shopping-Ref">Shopping Reference</Button>
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
