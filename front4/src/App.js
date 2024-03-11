import './App.css';
import Nav from './Nav';
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./Main";
import Gallery from "./Gallery";
import Footer from "./footer";
import MyPage from "./MyPage";
import Create from "./Create";
import Board from "./Board";

function App() {
  return (
      <div className="App">
          <BrowserRouter>
              <Nav/>
              <Routes>
                  <Route path={"/"} element={<Main/>}></Route>
                  <Route path={"/MyPage"} element={<MyPage/>}></Route>
                  <Route path={"/Create"} element={<Create/>}></Route>
                  <Route path={"/Board"} element={<Board/>}></Route>
                  <Route path={"/user/:userId"} element={<Gallery />}></Route>
              </Routes>
          </BrowserRouter>
          <Footer/>
      </div>
  );
}

export default App;