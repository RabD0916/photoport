import React, { useState } from 'react';
import styled from 'styled-components';
import { MAIN_DATA } from './MainData';
import First from './Number/First';

import Second from './Number/Second';


const Test1 = () => {
    const [content, setContent] = useState();

    const handleClickButton = e => {
        const { name } = e.target;
        setContent(name);
    };

    const selectComponent = {
        first: <First />,
        second: <Second />,
    };

    console.log(content);

    return (
        <div>
            <Container>
                {MAIN_DATA.map(data => {
                    return (
                        <Button onClick={handleClickButton} name={data.name} key={data.id}>
                            {data.text}
                        </Button>
                    );
                })}
            </Container>
            {content && <Content>{selectComponent[content]}</Content>}
        </div>
    );
};

export default Test1;


const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20vh;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  margin-right: 1rem;
  color: #111111;
  background-color: #eeeeee;
  border-radius: 2rem;
`;

const Content = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;
