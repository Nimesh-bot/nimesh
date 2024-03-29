import React from 'react'
import styled from 'styled-components'
import Contents from './Contents'
import Links from './Links'

const Container = styled.div`
    width: ${props => props.width};
    height: 60%;
    position: absolute;
    bottom: ${props => props.bottom};
    left: 50%;
    transform: translateX(-50%);
    border-top: 0.5px solid ${props => props.theme.background}25;
    border-left: 0.5px solid ${props => props.theme.background}25;
    border-right: 0.5px solid ${props => props.theme.background}25;
    border-radius: 8px 8px 0 0;
    
    background-color: ${props => props.theme.body}95;
    backdrop-filter: blur( 10px );
    -webkit-backdrop-filter: blur( 10px );

    padding: 2rem 0.5rem;
    display: flex;
    gap: 2rem;

    transition: all 0.3s ease-in-out;
`

const StartBox = ({ bottom, width }) => {
  return (
    <Container bottom={bottom} width={width}>
      <Links />
      <Contents />
    </Container>
  )
}

export default StartBox