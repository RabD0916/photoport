import './App.css';
import Nav from './Component/Nav';
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./Component/Main";
import MyPage from "./Component/MyPage";
import Create from "./CreateCut/Create";
import BoardList from "./Board/BoardList";
import BoardWrite from "./Board/BoardWrite";
import Footer from "./Component/footer";
import InGallery from "./Component/InGallery";
import InCategory from "./Component/InCategory";


function App() {
  return (
      <div className="App">
          <BrowserRouter>
              <Nav/>
              <Routes>
                  <Route path={"/"} element={<Main/>}></Route>
                  <Route path={"/MyPage"} element={<MyPage/>}></Route>
                  <Route path={"/Create"} element={<Create/>}></Route>
                  <Route path={"/gallery/:userId"} element={<InGallery />}></Route>
                  <Route path={"/gallery/:userId/:cateId"} element={<InCategory />}></Route>
                  <Route path={"/Board"} element={<BoardList/>}></Route>
                  <Route path={"/write"} element={<BoardWrite/>}></Route>
              </Routes>
          </BrowserRouter>
          <Footer/>
      </div>
  );
}

export default App;