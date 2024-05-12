import React, {useCallback, useEffect, useState} from 'react';
import axios from "axios";
import Menu from "./Menu.js";
import { Link, useNavigate } from 'react-router-dom';
import './css/Notice.css';
import './css/CommonTable.css';

const Notice = () => {
    const navigate = useNavigate();
    const id = localStorage.getItem("id");
    const boardType = "NOTICE"; // 게시글 종류 지정
    const accessToken = localStorage.getItem("accessToken");


    const [boardList, setBoardList] = useState([{
        id: null,
        title: null,
        createdAt: null,
        view: null,
        like: null,
        bookmark: null,
        writerId: null,
        writerName: null,
        media: {
            mediaName: null,
            categoryName: null
        },
        commentsDto: {
            id: null,
            content: null,
            writerId: null,
            writerName: null
        },
        tags: null
    }]);

    const [sortValue, setSortValue] = useState("createdAt");        // Can use : title, createdAt, view, like, bookmark
    const [sortOrder, setSortOrder] = useState("desc");             // asc = ascending, desc = descending

    const getBoardList = async () => {
        try {
            const resp = await axios.get(`http://localhost:8080/api/type/${boardType}/${sortValue}/${sortOrder}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(resp);
            setBoardList(resp.data);
        } catch (error) {
            console.error("Error board list: ", error);
        }

    };


    useEffect(() => {
        getBoardList();
    }, []);

    return (
        <div>
            <Menu />
            <div>
                &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;
                {/* ADMIN일 때만 글쓰기 버튼 보이기 */}
                {id === "ADMIN" && (
                    <button id='select' onClick={() => navigate('/NoticeWrite')}>글쓰기</button>
                )}
            </div>
            <br />
            <div className='container'>
                <table className='common-table'>
                    <thead>
                    <tr>
                        <th className="common-table-header-column">번호</th>
                        <th className="common-table-header-column">제목</th>
                        <th className="common-table-header-column">작성자</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boardList.map((board) => (
                        <tr key={board.id} className="common-table-row">
                            <td className="common-table-column">{board.id}</td>
                            <td className="common-table-column">
                                <Link to={`/Notice/${board.id}`}>{board.title}</Link>
                            </td>
                            <td className="common-table-column">{board.writerId}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>
            <br />
        </div>
    );
};

export default Notice;
