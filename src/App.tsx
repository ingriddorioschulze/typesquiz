import React, { useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import Loader from 'react-loader-spinner'

import theme from './theme'
import QuestionCard from './QuestionCard'
import GlobalStyles from './GlobalStyles'
import { fetchQuizQuestions, Difficulty, QuestionState } from './API'

export type AnswerObject = {
  question: string
  answer: string
  correct: boolean
  correctAnswer: string
}

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #eec170;
  width: 100%;
  height: 100vh;

  .title {
    font-size: 80px;
    font-family: 'Cabin Sketch';
    padding: 30px;
    color: #353535;
  }

  .start-button {
    font-family: 'Amatic SC';
    cursor: pointer;
    border: none;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #353535;
    background-color: transparent;
    font-size: 35px;
    font-weight: bold;
    padding: 20px;
  }

  .blinking {
    animation: blinkingText 1.2s infinite;
  }

  @keyframes blinkingText {
    0% {
      color: #000;
    }
    49% {
      color: #000;
    }
    60% {
      color: transparent;
    }
    99% {
      color: transparent;
    }
    100% {
      color: #000;
    }
  }

  .next-button {
    font-family: 'Amatic SC';
    cursor: pointer;
    border: none;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #353535;
    background-color: transparent;
    font-size: 35px;
    font-weight: bold;
  }

  .score {
    font-size: 30px;
    font-family: 'Amatic SC';
    font-weight: bold;
    color: #353535;
  }
`

function App() {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [number, setNumber] = useState(0)
  const [userAnswers, setUsersAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)
  const TOTAL_QUESTIONS = 10

  const startQuiz = async () => {
    setLoading(true)
    setGameOver(false)

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY,
    )
    setQuestions(newQuestions)
    setScore(0)
    setUsersAnswers([])
    setNumber(0)
    setLoading(false)
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value
      const correct = questions[number].correct_answer === answer
      if (correct) setScore((prev) => prev + 1)
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      }
      setUsersAnswers((prev) => [...prev, answerObject])
    }
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppWrapper>
        <h1 className="title">Typesquiz</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start-button blinking" onClick={startQuiz}>
            Start
          </button>
        ) : null}
        {!gameOver ? <p className="score">Score: {score}</p> : null}
        {loading ? (
          <Loader
            type="ThreeDots"
            color="#b9375e"
            height={100}
            width={100}
            timeout={3000}
          />
        ) : null}
        {!loading && !gameOver && (
          <QuestionCard
            questionNumber={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
        !loading &&
        userAnswers.length === number + 1 &&
        number !== TOTAL_QUESTIONS - 1 ? (
          <button className="next-button" onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </AppWrapper>
    </ThemeProvider>
  )
}

export default App
