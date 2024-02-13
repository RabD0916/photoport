import './nav.css';
import {Link} from "react-router-dom";
function nav() {
    const userId = "test1";
    return(
        <nav className="navbar">
            <ul>

                <li className="navMenu left"><a href="">공지사항</a></li>
                <li className="navMenu left"><Link to={`/user/${userId}`}>갤러리</Link></li>
                <li className="navMenu"><Link to={"/"}>메인</Link></li>
                <li className="navMenu"><a href="">네컷 생성</a></li>
                <li className="navMenu right"><a href="">이름 로고</a></li>
                <li className="navMenu right"><a href="">검색하기</a></li>

            </ul>
        </nav>
    );
}

export default nav;
