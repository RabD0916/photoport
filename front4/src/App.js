import './App.css';
import Nav from'./nav';
import {useEffect, useState} from "react";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./Main";
import Gallary from "./Gallary";

function App() {


  return (
      <div className="App">
          <BrowserRouter>
              <Nav/>
              <Routes>
                  <Route path={"/"} element={<Main/>}></Route>
                  <Route path={"/user/:userId"} element={<Gallary />}></Route>
              </Routes>
          </BrowserRouter>

      </div>
  );
}

export default App;