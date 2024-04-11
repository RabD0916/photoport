import React, { useEffect, useState } from 'react';
import axios from "axios";
import Menu from "./Menu.js";
import { Link, useNavigate } from 'react-router-dom';
import './css/Notice.css';
import './css/CommonTable.css';

const Notice = () => {
    const navigate = useNavigate();
    const [noticeList, setNotice] = useState([]);
    const [pageList, setPageList] = useState([]);

    const [curPage, setCurPage] = useState(0); // 현재 페이지 세팅
    const [prevBlock, setPrevBlock] = useState(0); // 이전 페이지 블록
    const [nextBlock, setNextBlock] = useState(0); // 다음 페이지 블록
    const [lastPage, setLastPage] = useState(0); // 마지막 페이지

    const [search, setSearch] = useState({
        page: 1,
        sk: '',
        sv: '',
    });

    const getNotice = async () => {
        if (search.page === curPage) return; // 현재 페이지와 누른 페이지가 같으면 return

        const queryString = Object.entries(search)
            .map((e) => e.join('='))
            .join('&');
        /*axios url 수정 필요*/
        const resp = await axios.get('http://localhost:8080/Notice' + queryString);
        const data = resp.data;

        setNotice(data.data);

        const { endPage, nextBlock, prevBlock, startPage, totalPageCnt } = data.pagination;

        setCurPage(search.page);
        setPrevBlock(prevBlock);
        setNextBlock(nextBlock);
        setLastPage(totalPageCnt);

        const tmpPages = [];
        for (let i = startPage; i <= endPage; i++) {
            tmpPages.push(i);
        }

        setPageList(tmpPages);
    };

    const moveToWrite = () => {
        navigate('/NoticeWrite');
    };

    const onClick = (event) => {
        let value = event.target.value;
        setSearch({
            ...search,
            page: value,
        });
    };

    const onChange = (event) => {
        const { value, name } = event.target; // event.target에서 name과 value만 가져오기
        setSearch({
            ...search,
            [name]: value,
        });
    };

    const onSearch = () => {
        if (search.sk !== '' && search.sv !== '') {
            setSearch({
                ...search,
                page: 1,
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getNotice();
            } catch (error) {
                console.error('Error fetching notice:', error);
            }
        };

        fetchData();
    }, [getNotice]);


    return (
        <div>
            <Menu />
            <div>
                <select id='select' name="sk" onChange={onChange}>
                    <option id='select' value="">-선택-</option>
                    <option id='select' value="title">제목</option>
                    <option id='select' value="contents">내용</option>
                </select>
                <input className='searchbox' type="text" name="sv" id="" onChange={onChange} />
                <button id='#paging_btn' onClick={onSearch}>검색</button>
                &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;
                <button id='select' onClick={moveToWrite}>글쓰기</button>
            </div>
            <br />
            <div className='container'>
                <table className='common-table'>
                    <thead>
                    <tr>
                        <th className="common-table-header-column">번호</th>
                        <th className="common-table-header-column">제목</th>
                        <th className="common-table-header-column">작성자</th>
                        {/* 추가 필요한 열이 있다면 여기에 추가합니다. */}
                    </tr>
                    </thead>
                    <tbody>
                    {noticeList.map((board) => (
                        <tr key={board.id} className="common-table-row">
                            <td className="common-table-column">{board.id}</td>
                            <td className="common-table-column">
                                <Link to={`/Notice/${board.id}`}>{board.title}</Link>
                            </td>
                            <td className="common-table-column">{board.createdBy}</td>
                            {/*createdBy -> 로그인 된 관리자 계정 필요*/}
                            {/*createAt 작성 시간 저장 필요*/}
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>

            <br />
            <div>
                <button id='paging_btn' onClick={onClick} value={1}>
                    &lt;&lt;
                </button>
                <button id='paging_btn' onClick={onClick} value={prevBlock}>
                    &lt;
                </button>
                {pageList.map((page, index) => (
                    <button id='paging_btn' key={index} onClick={onClick} value={page}>
                        {page}
                    </button>
                ))}
                <button id='paging_btn' onClick={onClick} value={nextBlock}>
                    &gt;
                </button>
                <button id='paging_btn' onClick={onClick} value={lastPage}>
                    &gt;&gt;
                </button>
            </div>


        </div>
    );
};

export default Notice;
