import React, { useContext } from 'react'
import styledComponents from 'styled-components'
import { ThemeContext } from '../context/theme-context'

const Overlay = styledComponents.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: -4rem;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.primary};
    background: linear-gradient(0deg, ${props => props.theme.primary} -25%, rgba(0,212,255,0) 100%);
    color: ${props => props.theme.neutral};
    opacity: 0;
    padding: 0;
    border-radius: 0 0 8px 8px;

    @media (max-width: 790px) {
        opacity: 1;
    }
`
const Container = styledComponents.div`
    background-color: ${props => props.bg};
    background-image: url(${props => props.bgImg});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    
    &:hover ${Overlay} {
        opacity: 1;
        bottom: 0;
        padding: 0.5rem 0;
    }
`

const Cards = ({ icon, title, src, clickEvent}) => {
    const { theme } = useContext(ThemeContext)
    return (
        <Container bg={`${theme.text}`} bgImg={src} className='relative rounded h-32 w-full md:w-auto md:aspect-video cursor-pointer'>
            <Overlay className='flex items-end justify-center' onClick={clickEvent}>
                <h1 className='flex gap-x-2 items-center text-base font-medium'>{icon} {title}</h1>
            </Overlay>
        </Container>
    )
}

export default Cards