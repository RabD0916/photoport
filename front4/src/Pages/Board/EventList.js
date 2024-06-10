import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventList = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const navigate = useNavigate();
    const id = localStorage.getItem("id");
    const boardType = "EVENT"; // 게시글 종류 지정
    const accessToken = localStorage.getItem("accessToken");

    const [adminBoardList, setAdminBoardList] = useState([]);
    const [boardList, setBoardList] = useState([]);
    const [sortValue, setSortValue] = useState("createdAt"); // Can use: title, createdAt, view, like, bookmark
    const [sortOrder, setSortOrder] = useState("desc"); // asc = ascending, desc = descending
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const getAdminList = async () => {
        try {
            const resp = await axios.get(`${SERVER_IP}/api/eventBoard`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setAdminBoardList(resp.data);
        } catch (error) {
            console.error("Error fetching admin board list:", error);
        }
    };

    const getBoardList = async (page = 0) => {
        try {
            const resp = await axios.get(`${SERVER_IP}/api/type/${boardType}`, {
                params: {
                    page,
                    size: 6, // 한 페이지에 보여줄 게시글 수
                    sortValue,
                    sortOrder
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(resp);
            const combinedBoardList = [...adminBoardList, ...resp.data.content];
            setBoardList(combinedBoardList);
            setTotalPages(resp.data.totalPages);
            setCurrentPage(resp.data.number);
        } catch (error) {
            console.error("Error fetching board list:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getAdminList();
            await getBoardList(currentPage);
        };

        fetchData(); // 초기 데이터 로드
    }, [currentPage, sortValue, sortOrder]);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">이벤트 star 게시판</h2>
            <div className="flex justify-end mb-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                    onClick={() => navigate('/EventWrite')}
                >
                    글쓰기
                </button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <tr>
                        <th className="py-3 px-6 text-left">번호</th>
                        <th className="py-3 px-6 text-left">제목</th>
                        <th className="py-3 px-6 text-left">작성자</th>
                        <th className="py-3 px-6 text-left">태그</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                    {boardList.map((board, index) => (
                        <tr key={board.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left">{currentPage * 6 + (index + 1)}</td>
                            <td className="py-3 px-6 text-left">
                                <Link to={`/Event/${board.id}`} className="text-blue-500 hover:underline">
                                    {board.title}
                                </Link>
                            </td>
                            <td className="py-3 px-6 text-left">{board.writerId}</td>
                            <td className="py-3 px-6 text-left">{board.tags}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                <button
                    className={`mx-1 px-4 py-2 bg-blue-500 text-white rounded ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    이전
                </button>
                {Array.from({length: totalPages}, (_, index) => (
                    <button
                        key={index}
                        className={`mx-1 px-4 py-2 bg-blue-500 text-white rounded ${index === currentPage ? 'bg-blue-700' : ''}`}
                        onClick={() => handlePageChange(index)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className={`mx-1 px-4 py-2 bg-blue-500 text-white rounded ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default EventList;
