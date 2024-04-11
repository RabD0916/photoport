import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Button = styled.button`
    width: 250px;
    height: 80px;
  font-size: 30px;
  font-weight: bold;
  padding: 20px 20px;
    margin-bottom: 100px;
  color: ${({ isActive }) => (isActive ? '#ffffff' : '#87CEEB')};
  background-color: ${({ isActive }) => (isActive ? '#87CEEB' : 'transparent')};
  border: 2px solid #87CEEB;
  border-radius: 100px 0px 0px 100px / 100px 100px 100px 100px;
  outline: none;
  cursor: pointer;

    &:hover {
        background-color: ${({isActive}) => (isActive ? '#87CEEB' : '#e0f7fa')};
    }

    

`;

const Button2 = styled.button`
    width: 250px;
    height: 80px;
  font-size: 30px;
  font-weight: bold;
  padding: 20px 20px;
    margin-bottom: 100px;
  color: ${({ isActive }) => (isActive ? '#ffffff' : '#87CEEB')};
  background-color: ${({ isActive }) => (isActive ? '#87CEEB' : 'transparent')};
  border: 2px solid #87CEEB;
  border-radius: 0px 100px 100px 0px / 100px 100px 100px 100px;
  outline: none;
  cursor: pointer;

    &:hover {
        background-color: ${({ isActive }) => (isActive ? '#87CEEB' : '#e0f7fa')};
    }
`;
const Menu = () => {
    const [activeButton, setActiveButton] = useState('Notice');
    const navigate = useNavigate();

    useEffect(() => {
        const currentPath = window.location.pathname;
        if (currentPath === '/FQ') {
            setActiveButton('FQ');
        } else {
            setActiveButton('Notice');
        }
    }, []);

    const handleButtonClick = (buttonType) => {
        if (buttonType === 'Notice') {
            setActiveButton('Notice');
            navigate('/Notice');
        } else if (buttonType === 'FQ') {
            setActiveButton('FQ');
            navigate('/FQ');
        }
    };

    return (
        <div>
            <Button
                isActive={activeButton === 'Notice'}
                onClick={() => handleButtonClick('Notice')}
            >
                공지사항
            </Button>
            <Button2
                isActive={activeButton === 'FQ'}
                onClick={() => handleButtonClick('FQ')}
            >
                F&Q
            </Button2>
        </div>
    );
};
export default Menu;