import React, { useContext } from 'react'
import styled from 'styled-components'

import Draggable from 'react-draggable';

import { IoIosClose } from 'react-icons/io'
import { StateContext } from '../../context/state-context'

const Container = styled.div`
    width: 35%;
    height: 60vh;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    z-index: 90;
`
const HeadingBar = styled.div`
    width: 100%;
    height: 3rem;
    background-color: ${props => props.theme.body};
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px 8px 0 0;

    h3 {
        padding: 0 2rem;
        color: ${props => props.theme.text};
    }

    div {
        padding: 0 1rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0 8px 0 0;
        background-color: ${props => props.theme.primary};
        color: ${props => props.theme.text};
    }
`
const Content = styled.form`
    width: 100%;
    height: calc(60vh-3rem);
    padding: 2rem;
    background-color: ${props => props.theme.background};
    border: 0.5px solid ${props => props.theme.neutral};
    border-radius: 0 0 8px 8px;

    div {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
        gap: 0.5rem;

        label {
            font-size: 12px;
            color: ${props => props.theme.fade};
        }   

        input {
            width: 100%;
            background-color: transparent;
            color: ${props => props.theme.text};
            border: none;
            font-size: 12px;
    
            &:focus {
                outline: none;
                border: none;
            }
        }
        textarea {
            width: 100%;
            min-height: 25vh;
            max-height: calc(60vh - 12rem);
            background-color: transparent;
            color: ${props => props.theme.text};
            border: none;
            font-size: 12px;
    
            &:focus {
                outline: none;
                border: none;
            }
        }
    }
    button {
        color: ${props => props.theme.primary};
        background-color: ${props => props.theme.primary}15;
        padding: 0.5rem 1.5rem;
        border-radius: 4px;
        
        &:hover {
            background-color: ${props => props.theme.primary};
            color: ${props => props.theme.text};
        }
    }
    
` 

const HireForm = () => {
    const { setHireOpen } = useContext(StateContext)
    // const [email, setEmail] = useState('');
    // const [subject, setSubject] = useState('');
    // const [message, setMessage] = useState('');

    return (
        <Draggable>
            <Container>
                <HeadingBar>
                    <h3>Hire Me</h3>
                    <div>
                        <IoIosClose className='text-[27px]' onClick={() => setHireOpen(false)}/>
                    </div>
                </HeadingBar>
                <Content>
                    <div>
                        <label>Your Email</label>
                        <input onChange={() => {}} />
                    </div>
                    <div>
                        <label>Subject</label>
                        <input onChange={() => {}} />
                    </div>
                    <div>
                        <label>Body</label>
                        <textarea onChange={() => {}} />
                    </div>
                    <button>SEND</button>
                </Content>
            </Container>
        </Draggable>
    )
}

export default HireForm