import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./css/Join.scss";

const Join = () => {
    const [selectAll, setSelectAll] = useState(false);
    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);
    const [checkbox3, setCheckbox3] = useState(false);
    const navigate = useNavigate();

    // 전체 동의 체크박스가 변경되었을 때
    const handleSelectAllChange = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);
        setCheckbox1(isChecked);
        setCheckbox2(isChecked);
        setCheckbox3(isChecked);
    };

    // 개별 체크박스가 변경되었을 때
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;

        switch (name) {
            case 'checkbox1':
                setCheckbox1(checked);
                break;
            case 'checkbox2':
                setCheckbox2(checked);
                break;
            case 'checkbox3':
                setCheckbox3(checked);
                break;
            default:
                break;
        }

        // 모든 체크박스가 체크되었는지 확인 후 전체 동의 체크박스 업데이트
        if (checkbox1 && checkbox2 && checkbox3) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    };

    // 버튼 클릭시 submit 사용
    const clickhandle = (e) => {
        // 모든 체크박스가 체크되었는지 확인
        if (!checkbox1 || !checkbox2) {
            e.preventDefault(); // 다음 화면으로 이동하지 못하도록 기본 동작 막기
            alert("모든 항목에 동의해주세요!"); // 사용자에게 메시지 표시
        }
        else {

            navigate("/signup");
        }
    };

    return (
        <div>
            <h2 className={"sign_main"}>회원가입</h2>
            <div className={"sign_div"}>
            <form action="/Signup" method="post" className={"sign_form"}>
                <div className="join_style">
                    <h3 className="top_font">회원가입 약관동의 및 본인인증단계 입니다.</h3>
                    <div className="all_agree"> 전체동의<input className={"check_box"} type="checkbox" checked={selectAll} onChange={handleSelectAllChange} /></div>
                    <h4 className="check_agree">*홈페이지 이용약관 동의 (필수) 동의<input className={"check_box"} type="checkbox" name="checkbox1" checked={checkbox1} onChange={handleCheckboxChange} /></h4>
                    <textarea readOnly className={"scroll"}>
                    </textarea>
                    <h4 className="check_agree">개인정보 수집 및 이용동의 (필수) 동의<input className={"check_box"} type="checkbox" name="checkbox2" checked={checkbox2} onChange={handleCheckboxChange} /></h4>
                    <textarea name="" className="scroll" readOnly>

                    </textarea>
                    <h4 className="check_agree">광고성 정보 수신동의 (선택)동의<input className={"check_box"} type="checkbox" name="checkbox3" checked={checkbox3} onChange={handleCheckboxChange} value={checkbox3 ? "checked" : ""}/></h4>
                    <textarea name="" className="scroll" readOnly>
                    </textarea>
                    <h4 className="check_agree">회원가입 유의사항</h4>
                    <textarea name="" className="scroll" readOnly>

                    </textarea>
                    {/* 다음 버튼 클릭시 clickhandle 함수 실행 */}
                    <input type="submit" className={"sign_next"} onClick={clickhandle} value={"다음"} />
                </div>
            </form>
            </div>
        </div>
    )
}
export default Join;
