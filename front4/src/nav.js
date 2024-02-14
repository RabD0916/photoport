import './nav.css';
function nav() {
    return(
        <nav className="navbar">
            <ul className="margin">
                <li className="navMenu left"><a href="">공지사항</a></li>
                <li className="navMenu left"><a href="">갤러리</a></li>
                <li className="navMenu"><a href="">네컷 생성</a></li>
                <li className="navMenu right"><a href="">이름 로고</a></li>
                <li className="navMenu right"><a href="">검색하기</a></li>
                </ul>
        </nav>
    );
}

export default nav;
