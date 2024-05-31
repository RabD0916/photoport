import React, { useEffect, useState } from 'react';
import axios from "axios";
import Menu from "./Menu.js";
import { Link, useNavigate } from 'react-router-dom';
import './css/Notice.css';
import './css/CommonTable.css';
import styled from "styled-components";

const Notice = () => {
    const navigate = useNavigate();
    const id = localStorage.getItem("id");
    const boardType = "NOTICE"; // 게시글 종류 지정
    const accessToken = localStorage.getItem("accessToken");

    const [boardList, setBoardList] = useState([]);
    const [sortValue, setSortValue] = useState("createdAt"); // Can use: title, createdAt, view, like, bookmark
    const [sortOrder, setSortOrder] = useState("desc"); // asc = ascending, desc = descending
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const getBoardList = async (page = 0) => {
        try {
            const resp = await axios.get(`http://localhost:8080/api/type/${boardType}`, {
                params: {
                    page,
                    size: 5, // 한 페이지에 보여줄 게시글 수
                    sortValue,
                    sortOrder
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(resp);
            setBoardList(resp.data.content);
            setTotalPages(resp.data.totalPages);
            setCurrentPage(resp.data.number);
        } catch (error) {
            console.error("Error fetching board list:", error);
        }
    };

    useEffect(() => {
        getBoardList(currentPage); // currentPage를 dependency로 추가
    }, [currentPage, sortValue, sortOrder]);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <Menu />
            <div>
                &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;
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
                    {boardList.map((board, index) => (
                        <tr key={board.id} className="common-table-row">
                            <td className="common-table-column">{currentPage * 10 + (index + 1)}</td>
                            <td className="common-table-column">
                                <Link to={`/Notice/${board.id}`}>{board.title}</Link>
                            </td>
                            <td className="common-table-column">{board.writerId}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <PaginationContainer>
                <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                    이전
                </PageButton>
                {Array.from({ length: totalPages }, (_, index) => (
                    <PageButton key={index} onClick={() => handlePageChange(index)} disabled={index === currentPage}>
                        {index + 1}
                    </PageButton>
                ))}
                <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>
                    다음
                </PageButton>
            </PaginationContainer>
            <br />
        </div>
    );
};

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

const PageButton = styled.button`
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

export default Notice;