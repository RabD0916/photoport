import './App.css';
import Nav from './Nav';
import {useEffect, useState} from "react";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./Main";
import Gallery from "./Gallery";
import Footer from "./footer";

function App() {


  return (
      <div className="App">
          <BrowserRouter>
              <Nav/>
              <Routes>
                  <Route path={"/"} element={<Main/>}></Route>
                  <Route path={"/user/:userId"} element={<Gallery />}></Route>
              </Routes>
          </BrowserRouter>
          <Footer/>
      </div>
  );
}

export default App;