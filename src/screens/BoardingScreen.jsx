import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Container } from "../assets/Global";
import { StateContext } from "../context/state-context";
import { ThemeContext } from "../context/theme-context";
import axiosInstance from "../utils/axios.config";

const Button = styled.button`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.primary};
  padding: 1rem 3rem;

  &:hover {
    background-color: ${(props) => props.theme.primary};
    color: ${(props) => props.theme.background};
  }
`;
const Note = styled.p`
  color: ${(props) => props.theme.primary};
  font-size: 1rem;
  text-align: center;
  margin: 1rem 0;
`;

const BoardingScreen = ({ click }) => {
  const { theme } = useContext(ThemeContext);
  const { setLoadingCount } = useContext(StateContext);

  const navigate = useNavigate();

  useEffect(() => {
    setLoadingCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const wakeUp = async () => {
      const response = await axiosInstance.get("/");
      if (response.data.status === "success") {
        console.log(response?.data?.message);
      }
    };
    wakeUp();
  }, []);

  return (
    <Container
      bg={`${theme.body}`}
      className="px-4 flex flex-col w-full h-screen justify-center items-center"
      onClick={click}
    >
      <Note className="md:hidden">
        For the best experience, please use a desktop browser.
      </Note>
      <Button onClick={() => navigate("/desktop")}>PROCEED</Button>
      <Note>
        Currently hosted on free Render server. Please allow few minutes for the
        server to wake up.
      </Note>
      <Note>
        **I sincerly apologize for some features are broken and maintenance haven't been done since deployment**
      </Note>
    </Container>
  );
};

export default BoardingScreen;
