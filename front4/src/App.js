import './App.css';
import Nav from './Component/Nav';
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./Component/Main";
import Footer from "./Component/Footer";
import InGallery from "./Pages/Gallery/InGallery";
import InCategory from "./Pages/Gallery/InCategory";
import Login from "./Pages/mypage/Login";
import Signup from "./Pages/mypage/Signup";
import FindID from "./Pages/mypage/FindID";
import FindPW from "./Pages/mypage/FindPW";
import Join from "./Pages/mypage/Join"
import Eventpage from "./Pages/Event/Event";
import Noticepage from "./Pages/Notice/Notice";
import Create from "./Pages/CreateCut/Create";
import MyPage from "./Pages/mypage/MyPage";
import BoardList from "./Pages/Board/BoardList";
import BoardWrite from "./Pages/Board/BoardWrite";
import EventDetail from "./Pages/Event/EventDetail";
import Test1 from "./Pages/mypage/Test1";

/*
function Eventpage() {
    return null;
}

function Noticepage() {
    return null;
}
*/
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
                  <Route path={"/login"} element={<Login/>}></Route>
                  <Route path={"/Event"} element={<Eventpage/>}></Route>
                  <Route path={"/Notice"} element={<Noticepage/>}></Route>
                  <Route path={"/signup"} element={<Signup/>}></Route>
                  <Route path={"/findID"} element={<FindID/>}></Route>
                  <Route path={"/findPW"} element={<FindPW/>}></Route>
                  <Route path={"/join"} element={<Join/>}></Route>
                  <Route path={"/CreateCut"} element={<Create/>}></Route>
                  <Route path={"/EventDetail"} element={<EventDetail/>}></Route>
                  <Route path={"/compotest"} element={<Test1/>}></Route>
              </Routes>
          </BrowserRouter>
          <Footer/>
      </div>
  );
}

export default App;