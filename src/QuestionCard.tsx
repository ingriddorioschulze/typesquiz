import React from 'react'
import styled from 'styled-components'

import { AnswerObject } from './App'

const QuestionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 45px;

  .question-name {
    font-size: 35px;
    font-family: 'Amatic SC';
    color: #353535;
    font-weight: bold;
    padding: 10px;
  }

  .question {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 30px;
    font-family: 'Amatic SC';
    color: #353535;
    padding: 10px;
  }
`

type ButtonWrapperProps = {
  correct: boolean
  userClicked: boolean
}

const ButtonWrapper = styled.div<ButtonWrapperProps>`
  .answer {
    font-family: 'Amatic SC';
    cursor: pointer;
    border: none;
    margin: 5px;
    padding: 5px;
    width: 20vw;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #353535;
    background-color: ${({ correct, userClicked }) =>
      correct
        ? '#2b9348'
        : !correct && userClicked
        ? '#f94144'
        : 'transparent'};
    font-size: 25px;
  }

  .answer:hover {
    font-weight: bold;
    text-decoration: underline;
  }
`

type QuestionsProps = {
  question: string
  answers: string[]
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void
  userAnswer: AnswerObject | undefined
  questionNumber: number
  totalQuestions: number
}

function QuestionCard({
  question,
  answers,
  callback,
  userAnswer,
  questionNumber,
  totalQuestions,
}: QuestionsProps) {
  return (
    <QuestionWrapper>
      <p className="question-name">
        Question: {questionNumber} / {totalQuestions}
      </p>
      <p className="question" dangerouslySetInnerHTML={{ __html: question }} />
      <div>
        {answers.map((answer) => (
          <ButtonWrapper
            key={answer}
            correct={userAnswer?.correctAnswer === answer}
            userClicked={userAnswer?.answer === answer}
          >
            <button
              className="answer"
              disabled={userAnswer ? true : false}
              onClick={callback}
              value={answer}
            >
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </button>
          </ButtonWrapper>
        ))}
      </div>
    </QuestionWrapper>
  )
}

export default QuestionCard
