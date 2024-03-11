import './App.css';
import Nav from './Nav';
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./Main";
import Footer from "./footer";
import InGallery from "./InGallery";
import InCategory from "./InCategory";

function App() {
  return (
      <div className="App">
          <BrowserRouter>
              <Nav/>
              <Routes>
                  <Route path={"/"} element={<Main/>}></Route>
                  <Route path={"/gallery/:userId"} element={<InGallery />}></Route>
                  <Route path={"/gallery/:userId/:cateId"} element={<InCategory />}></Route>
              </Routes>
          </BrowserRouter>
          <Footer/>
      </div>
  );
}

export default App;