import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "./BoardCss/Board.css";

const BoardList = () => {
    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);

    const getBoardList = async () => {
        const resp = await (await axios.get('//localhost:8080/board')).data; // 2) 게시글 목록 데이터에 할당
        setBoardList(resp.data); // 3) boardList 변수에 할당

        const pngn = resp.pagination;
        console.log(pngn);
    };

    const moveToWrite = () => {
        navigate('/write');
    };

    useEffect(() => {
        getBoardList(); // 1) 게시글 목록 조회 함수 호출
    }, []);

    return (
        <div>
            <div className="mainboard">
                <div className="boardList">
                    {/* 게시글들 */}
                    <div className="boardItem">
                        <header className="title">친구와 한컷</header>
                        <img className="boardImage" src="/boardlist1.png" alt="사진1"/>
                        <main className="imageOverlay">
                            <img src="/boardlist1.png" alt="미리보기"/>
                        </main>
                        <footer className="content">내용</footer>
                    </div>

                    <div className="boardItem">
                        <div className="title">제목</div>
                        <img className="boardImage" src="/boardlist2.png" alt="사진2"/>
                        <div className="imageOverlay">
                            <img src="/boardlist2.png" alt="미리보기"/>
                        </div>
                        <div className="content">내용</div>
                    </div>
                    <div className="boardItem">
                        <div className="title">제목</div>
                        <img className="boardImage" src="/boardlist3.jpg" alt="사진3"/>
                        <div className="imageOverlay">
                            <img src="/boardlist3.jpg" alt="미리보기"/>
                        </div>
                        <div className="content">내용</div>
                    </div>
                    <div className="boardItem">
                        <div className="title">제목</div>
                        <img className="boardImage" src="/boardlist4.png" alt="사진4"/>
                        <div className="imageOverlay">
                            <img src="/boardlist4.png" alt="미리보기"/>
                        </div>
                        <div className="content">내용</div>
                    </div>
                    <div className="boardItem">
                        <div className="title">제목</div>
                        <img className="boardImage" src="/boardlist4.png" alt="사진4"/>
                        <div className="imageOverlay">
                            <img src="/boardlist4.png" alt="미리보기"/>
                        </div>
                        <div className="content">내용</div>
                    </div>
                    <div className="boardItem">
                        <div className="title">제목</div>
                        <img className="boardImage" src="/boardlist4.png" alt="사진4"/>
                        <div className="imageOverlay">
                            <img src="/boardlist4.png" alt="미리보기"/>
                        </div>
                        <div className="content">내용</div>
                    </div>
                    {/* 필요한 만큼 게시글 추가 */}
                </div>
            </div>
            <ul>
                {boardList.map((board) => (
                    // 4) map 함수로 데이터 출력
                    <li key={board.idx}>
                        <Link to={`/board/${board.idx}`}>{board.title}</Link>
                    </li>
                ))}
            </ul>
            <div>
                <button onClick={moveToWrite}>글쓰기</button>
            </div>
        </div>
    );
};

export default BoardList;