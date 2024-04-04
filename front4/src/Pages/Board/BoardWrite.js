import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./BoardCss/BoardWrite.css"

const BoardWrite = () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('username');
    const navigate = useNavigate();

    const [board, setBoard] = useState({
        title: '',
        tag: '',
        contents: '',
        picture : '',
    });

    const { title, tag, contents,picture } = board; //비구조화 할당

    const onChange = (event) => {
        const { value, name } = event.target; //event.target에서 name과 value만 가져오기
        setBoard({
            ...board,
            [name]: value,
        });
    };

    const saveBoard = async () => {
        console.log(board.title);
        console.log(board.tag);
        console.log(board.picture);
        console.log(board.contents);
        await axios.post(`http://localhost:8080/api/boards`, board, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        }).then((res) => {
            alert('등록되었습니다.');
            navigate('/board');
        });
    };

    const backToList = () => {
        navigate('/board');
    };

    return (
        <div className="center-align">
            <div className="big-font">
                <div>
                    <span className="content">제목</span>
                    <input type="text" name="title" value={title} onChange={onChange}/>
                </div>
                <br/>
                <div>
                    <span className="content">태그</span>
                    <input
                        type="text"
                        name="tag"
                        value={tag}
                        onChange={onChange}
                    />
                </div>
                <br/>
                <div>
                    <span className="content">사진</span>
                    <div className="picture">
                        안녕
                    </div>
                </div>
                <div>
                    <span className="content">내용</span>
                    <textarea className="text"
                        name="contents"
                        value={contents}
                        onChange={onChange}
                    ></textarea>
                </div>
                <br/>
                <div>
                    <button className="button-style" onClick={backToList}>사진가져오기</button>
                    <button className="button-style" onClick={saveBoard}>글쓰기</button>
                    <button className="button-style" onClick={backToList}>취소</button>
                </div>
            </div>
        </div>

    );
};

export default BoardWrite;