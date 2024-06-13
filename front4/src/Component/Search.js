import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const GalleryContainer = styled.div`
    width: 80%;
    margin: auto;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
`;

const Search = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const accessToken = localStorage.getItem("accessToken");
    const [boardList, setBoardList] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword');

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`${SERVER_IP}/api/keywordSearch`, {
                    params: { keyword: decodeURIComponent(keyword) }, // URL 디코드
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setBoardList(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        if (keyword) {
            fetchSearchResults();
        }
    }, [keyword]); // keyword가 변경될 때마다 useEffect가 실행됩니다.

    return (
        <div className="bg-pink-100 min-h-screen p-4 flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">검색 결과</h2>
            <p className="text-lg text-gray-700 mb-4">검색어: {keyword}</p>
            <GalleryContainer>
                {boardList.map(post => (
                    <div key={post.id}
                         className="bg-white px-6 pt-6 pb-2 m-4 rounded-xl shadow-lg transform hover:scale-105 transition duration-500 border-4 border-b-blue-200 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col justify-between flex-grow">
                        <div>
                            <div className="mb-1 text-xl font-bold text-indigo-600">{post.title}</div>
                            <hr className="my-4 border-t-2 border-gray-300"/>
                            <div className="flex items-center px-2 py-3">
                                <img src={post.profileImage} alt="Profile"
                                     className="object-cover w-11 h-11 rounded-full border-2 border-emerald-400 shadow-emerald-400"/>
                                <div>
                                    <span className="ml-4 text-xl font-semibold antialiased block leading-tight">{post.writerId}</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex justify-center items-center w-full h-[300px]">
                            <img
                                className="max-w-full max-h-full object-contain rounded-xl"
                                src={`./images/${post.writerId}/${post.media.categoryName}/${post.media.mediaName}`}
                                alt="#"
                            />
                        </div>
                        <hr className="my-4 border-t-2 border-gray-300"/>
                        <div className="font-semibold text-sm mx-4 mt-2 mb-4">
                            {post.tags.filter(tag => tag.trim() !== '').map(tag => `#${tag}`).join(', ')}
                        </div>
                    </div>
                ))}
            </GalleryContainer>
        </div>
    );
}

export default Search;
