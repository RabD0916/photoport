import './Event.scss'
import test from '../../img/photoport.png'
import test2 from "../../img/kakao.png";
import axios from "axios";
import React, {useEffect, useState} from "react";
import { useLocation } from 'react-router-dom';
const Event = () => {
    const accessToken = localStorage.getItem("accessToken");
    const [boardList, setboardList] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword');

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/keywordSearch`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    params: {
                        keyword: keyword
                    }
                });
                setboardList(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (keyword) {
            fetchSearchResults();
        }
    }, [keyword]); // keyword가 변경될 때마다 useEffect가 실행됩니다.
  return (
      <>
          <div>
              <h2>검색 결과</h2>
              <p>검색어: {keyword}</p>
              <ul>
                  {/* 검색 결과를 매핑하여 리스트로 표시합니다. */}
                  {boardList.map(post => (
                      <div key={post.id}>
                          <li>제목 : {post.title}</li>
                          <li>글쓴이 : {post.writerId}</li>
                          <li>태그 : {post.tags}</li>
                          <img className="board_img"
                               src={`./images/${post.writerId}/${post.media.categoryName}/${post.media.mediaName}`}/>

                      </div>
                  ))}
              </ul>
          </div>
          <div className={"EventCenter"}>
              진행중인 이벤트
              <div className={"rowbar"}></div>
          </div>

          <div className={"EventList"}>
              <div className={"EventItem"}>
                  <img src={test2} className={"Eventimage"} alt={"이벤트 사진"}/>
                  <div className={"EventContent"}>
                      포토포트 여러분의 곁으로 곧 찾아 갑니다!
                  </div>
              </div>
              <div className={"EventItem"}>
                  <img src={test} className={"Eventimage"} alt={"이벤트 사진"}/>
                  <div className={"EventContent"}>
                      포토포트 여러분의 곁으로 곧 찾아 갑니다!
                  </div>
              </div>
              <div className={"EventItem"}>
                  <img src={test} className={"Eventimage"} alt={"이벤트 사진"}/>
                  <div className={"EventContent"}>
                      포토포트 여러분의 곁으로 곧 찾아 갑니다!
                  </div>
              </div>
              <div className={"EventItem"}>
                  <img src={test} className={"Eventimage"} alt={"이벤트 사진"}/>
                  <div className={"EventContent"}>
                      포토포트 여러분의 곁으로 곧 찾아 갑니다!
                  </div>
              </div>
              <div className={"EventItem"}>
                  <img src={test} className={"Eventimage"} alt={"이벤트 사진"}/>
                  <div className={"EventContent"}>
                      포토포트 여러분의 곁으로 곧 찾아 갑니다!
                  </div>
              </div>
          </div>
      </>
  )
}

export default Event;