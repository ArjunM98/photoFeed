import React, {useState} from 'react';
import {Router, Route} from "react-router-dom";
import {createBrowserHistory as createHistory} from 'history';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import MainPage from './components/MainPage';

import './App.css';
import {Button, Dialog, DialogTitle} from "@material-ui/core";

const history = createHistory();


function App() {

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div className="App">
      <Router history={history}>
        <Navbar bg="dark" expand="lg" variant="dark">
          <Navbar.Brand href="/"> PhotoFeed </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" >
            <Nav className="mr-auto">
              <Nav.Link href="/">HOME</Nav.Link>
              <Button style={{color:"grey"}} onClick={handleClickOpen}>Description</Button>
            </Nav>
              <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle id="simple-dialog-title">Description of Photo Feed</DialogTitle>
                <div className="Description">
                  <ul>
                      <li> Press "Home" to return to original state </li>
                      <li> Select a type you want to search by from drop down list </li>
                      <li> Press enter after typing each value and before clicking "Search" in search bar </li>
                      <li> When searching by name, image name must match exactly. ie. Dog.jpg </li>
                      <li> For searching by an image: </li>
                          <ul>
                              <li> Select the Image attribute from drop down list </li>
                              <li> Click on an image already uploaded </li>
                              <li> Press search </li>
                          </ul>
                  </ul>
                </div>
              </Dialog>
          </  Navbar.Collapse>
        </Navbar>
        <Route path="/" exact component={MainPage} />
      </Router>
    </div>
  );
}

export default App;
