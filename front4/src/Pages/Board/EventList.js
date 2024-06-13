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
                    size: 10, // 한 페이지에 보여줄 게시글 수
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
        <div className="bg-pink-100 min-h-screen p-4 flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">이벤트 게시판</h2>
            <div className="container mx-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b">번호</th>
                        <th className="py-2 px-4 border-b">제목</th>
                        <th className="py-2 px-4 border-b">작성자</th>
                        <th className="py-2 px-4 border-b">태그</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boardList.map((board, index) => (
                        <tr key={board.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b text-center">{currentPage * 10 + (index + 1)}</td>
                            <td className="py-2 px-4 border-b">
                                <Link className="text-blue-500 hover:underline" to={`/Event/${board.id}`}>{board.title}</Link>
                            </td>
                            <td className="py-2 px-4 border-b text-center">{board.writerId}</td>
                            <td className="py-2 px-4 border-b text-center">{board.tags}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="w-full flex justify-end mt-4">
                    <button
                        onClick={() => navigate('/EventWrite')}
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 mx-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black">
                            글쓰기
                        </span>
                    </button>
            </div>
            <div className="flex justify-center mt-6">
                <button
                    className={`relative inline-flex items-center justify-center p-0.5 mb-2 mx-1 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    <span className={`relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black`}>
                        이전
                    </span>
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`relative inline-flex items-center justify-center p-0.5 mb-2 mx-1 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800`}
                        onClick={() => handlePageChange(index)}
                        disabled={index === currentPage}
                    >
                        <span className={`relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black`}>
                            {index + 1}
                        </span>
                    </button>
                ))}
                <button
                    className={`relative inline-flex items-center justify-center p-0.5 mb-2 mx-1 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                >
                    <span className={`relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black`}>
                        다음
                    </span>
                </button>
            </div>
        </div>
    );
};

export default EventList;
