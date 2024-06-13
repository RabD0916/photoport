import './App.scss';
import './output.css';
import './input.css';
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
import Notice from "./Pages/Notice/Notice";
import NoticeDetail from "./Pages/Notice/NoticeDetail";
import NoticeWrite from "./Pages/Notice/NoticeWrite";
import NoticeUpdate from "./Pages/Notice/NoticeUpdate";
import Create from "./Pages/CreateCut/Create";
import MyPage from "./Pages/mypage/MyPage";
import BoardList from "./Pages/Board/BoardList";
import BoardWrite from "./Pages/Board/BoardWrite";
import Test1 from "./Pages/mypage/Test1";
import NewPw from "./Pages/mypage/NewPw";
import FindFriend from "./Pages/mypage/FindFriend";
import PoseList from "./Pages/Board/PoseList";
import PoseWrite from "./Pages/Board/PoseWrite";
import KakaoRedirect from "./Pages/mypage/KakaoRedirect";
import EventDetail from "./Pages/Board/EventDetail";
// import Report from "./Pages/Board/Report";
import EventList from "./Pages/Board/EventList";
import ModalModel from "./Component/ModalModel";
import BoardModify from "./Pages/Board/BoardModify";
import Search from "./Component/Search";
import WritePage from "./Pages/Admin/WritePage";
import BlackList from "./Pages/Admin/BlackList";
import ReportList from "./Pages/Admin/ReportList";
import Eventwrite from "./Pages/Board/Eventwrite";
import EventUpdate from "./Pages/Board/EventUpdate";
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
                  <Route path={"/FindFriend"} element={<FindFriend/>}></Route>
                  <Route path={"/Board"} element={<BoardList/>}></Route>
                  <Route path={"/BoardWrite"} element={<BoardWrite/>}></Route>
                  <Route path={"/Pose"} element={<PoseList/>}></Route>
                  <Route path={"/PoseWrite"} element={<PoseWrite/>}></Route>
                  <Route path={"/login"} element={<Login/>}></Route>
                  <Route path={"/Notice"} element={<Notice/>}></Route>
                  <Route path={"/Notice/:id"} element={<NoticeDetail/>}></Route>
                  <Route path={"/update/:id"} element={<NoticeUpdate/>}></Route>
                  <Route path={"/NoticeWrite"} element={<NoticeWrite/>}></Route>
                  <Route path={"/signup"} element={<Signup/>}></Route>
                  <Route path={"/findID"} element={<FindID/>}></Route>
                  <Route path={"/findPW"} element={<FindPW/>}></Route>
                  <Route path={"/CreateCut"} element={<Create/>}></Route>
                  <Route path={"/compoTest"} element={<Test1/>}></Route>
                  <Route path={"/newPw"} element={<NewPw/>}></Route>
                  <Route path={"/Search"} element={<Search/>}></Route>
                  <Route path={"/board/:id"} element={<BoardModify/>}></Route>
                  <Route path={"/oauth/kakao"} element={<KakaoRedirect/>}></Route>
                  <Route path={"/ModalModel"} element={<ModalModel/>}></Route>
                  <Route path={"/WritePage"} element={<WritePage/>}></Route>
                  <Route path={"/ReportList"} element={<ReportList/>}></Route>
                  <Route path={"/BlackList"} element={<BlackList/>}></Route>
                  <Route path={"/EventList"} element={<EventList/>}></Route>
                  <Route path={"/Eventwrite"} element={<Eventwrite/>}></Route>
                  <Route path={"/Event/:id"} element={<EventDetail/>}></Route>
                  <Route path={"/update/:id"} element={<EventUpdate/>}></Route>
              </Routes>
          </BrowserRouter>
          <Footer/>
      </div>
  );
}

export default App;