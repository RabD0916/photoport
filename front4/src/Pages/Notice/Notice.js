import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Notice = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
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
            const resp = await axios.get(`${SERVER_IP}/api/type/${boardType}`, {
                params: {
                    page,
                    size: 10, // 한 페이지에 보여줄 게시글 수
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
        getBoardList(currentPage);
    }, [currentPage, sortValue, sortOrder]);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="bg-pink-100 min-h-screen p-4 flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">공지사항</h2>
            <div className="container mx-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b">번호</th>
                        <th className="py-2 px-4 border-b">제목</th>
                        <th className="py-2 px-4 border-b">작성자</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boardList.map((board, index) => (
                        <tr key={board.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b text-center">{currentPage * 10 + (index + 1)}</td>
                            <td className="py-2 px-4 border-b">
                                <Link className="text-blue-500 hover:underline" to={`/Notice/${board.id}`}>{board.title}</Link>
                            </td>
                            <td className="py-2 px-4 border-b text-center">{board.writerId}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="w-full flex justify-end mt-4">
                {id === "ADMIN" && (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={() => navigate('/NoticeWrite')}>
                        글쓰기
                    </button>
                )}
            </div>
            <div className="flex justify-center mt-6">
                <button
                    className={`px-4 py-2 mx-1 ${currentPage === 0 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-700"}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    이전
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 mx-1 ${index === currentPage ? "bg-blue-700 text-white" : "bg-blue-500 text-white hover:bg-blue-700"}`}
                        onClick={() => handlePageChange(index)}
                        disabled={index === currentPage}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className={`px-4 py-2 mx-1 ${currentPage === totalPages - 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-700"}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default Notice;
