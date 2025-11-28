import React, { useEffect } from "react";
import styled from "styled-components";
import FullScreenWrapper from "../../components/container/FullScreenWrapper";
import FullSizeSpaceContainer from "../../components/container/FullSizeSpaceContainer";

type Student = {
  name: string;
  studentId: string;
  githubUsername: string;
};

const students: Student[] = [

  {
    name: "Shoaib Zafar Mian",
    studentId: "s200784",
    githubUsername: "ShoaibZMian",
  },
];

const StyledDiv = styled.div`
  padding: 20px;
  font-family: "Arial", sans-serif;
`;

const Title = styled.h1`
  color: #123456;
  text-align: center;
`;

const Description = styled.p`
  text-align: center;
  color: #555;
`;

const StyledTable = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  text-align: left;
`;

const StyledTh = styled.th`
  background-color: #f2f2f2;
  color: #000;
  padding: 10px 20px;
  border-bottom: 2px solid #ddd;
`;

const StyledTd = styled.td`
  padding: 8px 20px;
  border-bottom: 1px solid #ddd;
`;

const About: React.FC = () => {
  useEffect(() => {
    document.title = "About";
  }, []);

  return (
    <FullScreenWrapper>
      <FullSizeSpaceContainer>
        <StyledDiv>
          <Title>Group 9</Title>
          <Description>
            Below is a list of the participants along with their student ID and
            github username
          </Description>
          <StyledTable>
            <thead>
              <tr>
                <StyledTh>Name</StyledTh>
                <StyledTh>Student ID</StyledTh>
                <StyledTh>GitHub Username</StyledTh>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.studentId}>
                  <StyledTd>{student.name}</StyledTd>
                  <StyledTd>{student.studentId}</StyledTd>
                  <StyledTd>{student.githubUsername}</StyledTd>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </StyledDiv>
      </FullSizeSpaceContainer>
    </FullScreenWrapper>
  );
};

export default About;
