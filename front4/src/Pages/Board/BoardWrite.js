import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BoardCss/BoardWrite.scss"

const BoardWrite = () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();
    const [key,setKey] =useState([]);
    const [value,setValue]=useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const settings = {
        dots: true,
        fade: true,
        arrows : false, 		// 옆으로 이동하는 화살표 표시 여부
        infinite: true,
        draggable : true, 	//드래그 가능 여부
        speed: 100,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [ // 반응형 웹 구현 옵션
            {
                breakpoint: 960, //화면 사이즈 960px일 때
                settings: {
                    //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
                    slidesToShow:3
                }
            },
            {
                breakpoint: 768, //화면 사이즈 768px일 때
                settings: {
                    //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
                    slidesToShow:2
                }
            }
        ]
    };
    const [board, setBoard] = useState({
        title: '',
        content: '',
        fileName : [],
        tag: '',
        share: 'PUBLIC',
        type: 'NORMAL',
        writer: userId
    });
    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const onChange = (event) => {
        const { value, name } = event.target; //event.target에서 name과 value만 가져오기
        setBoard({
            ...board,
            [name]: value,
        });
    };

    const handleMessage = (event) => {
        if (typeof event.data === 'object' && event.data[0] !== undefined && event.data[1] !== undefined) {
            const newData = event.data[1];
            const newKeys = newData.map((item) => event.data[0]);
            setKey(prevKey => [...prevKey, ...newKeys]);
            setValue(prevValue => [...prevValue, ...newData])
            setBoard({
                ...board,
                ["fileName"]: value,
            });
            console.log(key);
        }
    };

    const { title, tag, content} = board; //비구조화 할당


    const saveBoard = async () => {

        console.log(board.title);
        console.log(board.tag);
        console.log(key);
        console.log(value);
        console.log(board.content);
        console.log(accessToken);
        await axios.post(`http://localhost:8080/api/boards`, {
            title: board.title,
            content: board.content,
            categories: key,
            mediaNames: value,
            tags: board.tag,
            share: board.share,
            type: board.type,
            writerId: board.writer
        },{
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        }).then((res) => {
            alert('등록되었습니다.');
            navigate('/board');
        });
    };
    const backToList = async (userId) => {

        try {
            const resp = await axios.get(`http://localhost:8080/api/"gallery/hidden/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(resp.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("사진선택실패:", error);
        }
    };

    const close_board = () => {
        setIsModalOpen(false);
    };
    const go_back=() =>{
        navigate('/board')
    }
    const remove_index=(index)=>{
        const newKey = [...key.slice(0, index), ...key.slice(index + 1)];
        const newValue = [...value.slice(0, index), ...value.slice(index + 1)];
        setKey(newKey);
        setValue(newValue);
    }
    return (
        <div className="center-align">
            <div className="big-font">
                <div className={`modal ${isModalOpen ? 'on' : ''}`}>
                    <div className="report_popup">
                        사진선택
                    </div>
                </div>
                <div className={"content_div"}>
                    <span className={"p_name"}>사진</span>
                    <div>
                    <Slider {...settings}>
                    {key.map((item, index) => (
                        <img
                            key={index}
                            src={"/images/" + userId + "/" + item + "/" + value[index]}
                            alt={item}
                            onClick={() => remove_index(index)}
                        />
                    ))}
                    </Slider>
                </div>
                    {/*<h1>값:{key[0]}{value[0]}</h1>*/}
                    <button className={"plus_button"} onClick={backToList}>사진추가</button>
                    <span>제목</span>
                    <input type="text" name="title" value={title} onChange={onChange}/>
                <br/>
                    <span>태그</span>
                    <input
                        type="text"
                        name="tag"
                        value={tag}
                        onChange={onChange}
                    />
                <br/>
                    <span>내용</span>
                    <textarea className="text_area"
                              name="content"
                              value={content}
                        onChange={onChange}
                    />
                <br/>
                </div>
                <div>
                    <button className="button-style" onClick={saveBoard}>글쓰기</button>
                    <button className="button-style" onClick={go_back}>취소</button>
                </div>
            </div>
        </div>

    );
};

export default BoardWrite;