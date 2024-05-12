import axios from "axios";
import React, {useEffect, useState} from "react";
import { useLocation } from 'react-router-dom';
const Search = () => {
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

    return(
        <div>
            <h2>검색 결과</h2>
            <p>검색어: {keyword}</p>
            <ul>
                {/* 검색 결과를 매핑하여 리스트로 표시합니다. */}
                {boardList.map(post => (
                    <div key={post.id}>
                    <li>제목 : {post.title}</li>
                    <li>글쓴이 : {post.writerId}</li>
                    <img className="board_img"
                    src={`./images/${post.writerId}/${post.media.categoryName}/${post.media.mediaName}`}/>

                    </div>
                ))}
            </ul>
        </div>
    );
}
export default Search;