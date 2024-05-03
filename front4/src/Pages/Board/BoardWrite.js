import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./BoardCss/BoardWrite.css"
import Media from "../Gallery/hidden/Media";
const BoardWrite = () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();
    const [childWindowReady, setChildWindowReady] = useState(false);
    const [receivedData, setReceivedData] = useState('');
    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);
    const handleMessage = (event) => {
        if (event.data) {
            if (typeof event.data === 'object') {
                setReceivedData(JSON.stringify(event.data));
            } else {
                // 객체가 아닌 경우 그대로 설정
                setReceivedData(event.data);
            }
        }
    };


    const [board, setBoard] = useState({
        title: '',
        tag: '',
        contents: '',
        fileName : '',
    });

    const { title, tag, contents} = board; //비구조화 할당

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
        console.log(board.fileName);
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
    const backToList=() =>{
        window.open("gallery/hidden/"+userId,"_blank","width=100");
    }

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
                    <p>부모 창에서 받은 데이터: {receivedData}</p>
                    <button onClick={backToList}>클릭</button>
                    {/*<input*/}
                    {/*    type="file"*/}
                    {/*    name="fileName"*/}
                    {/*    value={fileName}*/}
                    {/*    onChange={onChange}*/}
                    {/*/>*/}
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
                    <button className="button-style" onClick={saveBoard}>글쓰기</button>
                    <button className="button-style" onClick={backToList}>취소</button>
                </div>
            </div>
        </div>

    );
};

export default BoardWrite;