import './App.css';
import Nav from './Component/Nav';
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./Component/Main";
import Footer from "./Component/Footer";
import InGallery from "./Pages/Gallery/InGallery";
import InCategory from "./Pages/Gallery/InCategory";
import HiddenGallery from "./Pages/Gallery/hidden/Gallery";
import HiddenCategory from "./Pages/Gallery/hidden/Media";
import Login from "./Pages/mypage/Login";
import Signup from "./Pages/mypage/Signup";
import FindID from "./Pages/mypage/FindID";
import FindPW from "./Pages/mypage/FindPW";
import Join from "./Pages/mypage/Join"
import Eventpage from "./Pages/Event/Event";
import Notice from "./Pages/Notice/Notice";
import NoticeDetail from "./Pages/Notice/NoticeDetail";
import NoticeWrite from "./Pages/Notice/NoticeWrite";
import NoticeShow from "./Pages/Notice/NoticeShow";
import NoticeUpdate from "./Pages/Notice/NoticeUpdate";
import FQ from "./Pages/Notice/FQ";
import Create from "./Pages/CreateCut/Create";
import MyPage from "./Pages/mypage/MyPage";
import BoardList from "./Pages/Board/BoardList";
import BoardWrite from "./Pages/Board/BoardWrite";
import EventDetail from "./Pages/Event/EventDetail";
import Test1 from "./Pages/mypage/Test1";
import NewPw from "./Pages/mypage/NewPw";

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

                  <Route path={"/gallery/hidden/:userId"} element={<HiddenGallery />}></Route>
                  <Route path={"/gallery/hidden/:userId/:cateId"} element={<HiddenCategory />}></Route>

                  <Route path={"/Board"} element={<BoardList/>}></Route>
                  <Route path={"/Boardwrite"} element={<BoardWrite/>}></Route>
                  <Route path={"/login"} element={<Login/>}></Route>
                  <Route path={"/Event"} element={<Eventpage/>}></Route>
                  <Route path={"/Notice"} element={<Notice/>}></Route>
                  <Route path={"/NoticeDetail"} element={<NoticeDetail/>}></Route>
                  <Route path={"/NoticeShow"} element={<NoticeShow/>}></Route>
                  <Route path={"/NoticeUpdate"} element={<NoticeUpdate/>}></Route>
                  <Route path={"/NoticeWrite"} element={<NoticeWrite/>}></Route>
                  <Route path={"/FQ"} element={<FQ/>}></Route>
                  <Route path={"/signup"} element={<Signup/>}></Route>
                  <Route path={"/findID"} element={<FindID/>}></Route>
                  <Route path={"/findPW"} element={<FindPW/>}></Route>
                  <Route path={"/join"} element={<Join/>}></Route>
                  <Route path={"/CreateCut"} element={<Create/>}></Route>
                  <Route path={"/EventDetail"} element={<EventDetail/>}></Route>
                  <Route path={"/compotest"} element={<Test1/>}></Route>
                  <Route path={"/newPw"} element={<NewPw/>}></Route>
              </Routes>
          </BrowserRouter>
          <Footer/>
      </div>
  );
}

export default App;