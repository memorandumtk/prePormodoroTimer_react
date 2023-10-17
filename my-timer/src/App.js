import React, { useState, useEffect, useRef } from "react";
import { SkipStartBtnFill } from "react-bootstrap-icons";
import { PauseBtnFill } from "react-bootstrap-icons";
import { ArrowClockwise } from "react-bootstrap-icons";
import { ArrowBarUp } from "react-bootstrap-icons";
import { ArrowBarDown } from "react-bootstrap-icons";
const audioFile =
  "https://github.com/memorandumtk/freecodecamp_react/raw/main/my-timer/src/sound.mp3";
// import audioFile from "./sound.mp3"

function App() {
  const [timerLength, setTimerLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [isBreak, setIsBreak] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(timerLength * 60);
  const [isActive, setIsActive] = useState(false);
  const [marginTimeLeft, setMarginTimeLeft] = useState(1); // New State for Margin Time
  const alarmSound = useRef(null); // Create a ref

  useEffect(() => {
    let interval;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
    } else if (isActive && secondsLeft <= 0 && marginTimeLeft > 0) {
      // Check for Margin Time
      alarmSound.current.play();
      interval = setInterval(() => {
        setMarginTimeLeft(marginTimeLeft - 1);
      }, 3000); // to keep sound to last 5 sec, interval value change from 1000 to 5000
    } else if (isActive && secondsLeft <= 0 && marginTimeLeft <= 0) {
      setIsBreak(!isBreak);
      setSecondsLeft(isBreak ? timerLength * 60 : breakLength * 60);
      setMarginTimeLeft(1);
      alarmSound.current.pause();
      alarmSound.current.currentTime = 0;
    }
    return () => {
      clearInterval(interval);
      alarmSound.current.pause();
      alarmSound.current.currentTime = 0;
    };
  }, [
    isActive,
    secondsLeft,
    isBreak,
    timerLength,
    breakLength,
    marginTimeLeft,
  ]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimerChange = (delta) => {
    if (!isActive && timerLength >= 2 && timerLength <= 59) {
      setTimerLength((prev) => Math.max(1, prev + delta));
      if (!isBreak && !(timerLength === 1 && delta === -1))
        setSecondsLeft((timerLength + delta) * 60);
    }
  };

  const handleBreakChange = (delta) => {
    if (!isActive && breakLength >= 2 && breakLength <= 59) {
      setBreakLength((prev) => Math.max(1, prev + delta));
      if (isBreak && !(breakLength === 1 && delta === -1))
        setSecondsLeft((breakLength + delta) * 60);
    }
  };

  return (
    <div className="app">
      <section className="main-section container-sm text-center">
        <div id="title-div">25 + 5 Clock</div>

        <div className="length-div row row-cols-2">
          <div id="session-label" className="timer-length-div col">
            <p>Timer Length</p>
            <div className="row row-cols-3 mx-auto">
              <button
                id="session-decrement"
                className="btn btn-secondary col"
                onClick={() => handleTimerChange(-1)}
              >
                <ArrowBarDown />
              </button>
              <div id="session-length" className="col">
                {timerLength}
              </div>
              <button
                id="session-increment"
                className="btn btn-secondary col"
                onClick={() => handleTimerChange(1)}
              >
                <ArrowBarUp />
              </button>
            </div>
          </div>

          <div id="break-label" className="break-length-div col">
            <p>Break Length</p>
            <div className="row row-cols-3 mx-auto">
              <button
                id="break-decrement"
                className="btn btn-secondary col-4"
                onClick={() => handleBreakChange(-1)}
              >
                <ArrowBarDown />
              </button>
              <div id="break-length" className="col-4">
                {breakLength}
              </div>
              <button
                id="break-increment"
                className="btn btn-secondary col-4"
                onClick={() => handleBreakChange(1)}
              >
                <ArrowBarUp />
              </button>
            </div>
          </div>
        </div>

        <section id="timer-section" className="container">
          <div
            id="timer-display"
            className={
              "container " + (isBreak ? "breaking-border" : "working-border")
            }
          >
            <p id="timer-label">{isBreak ? "Breaking" : "Working"}</p>
            <p id="time-left">{formatTime(secondsLeft)}</p>
            <audio
              id="beep"
              ref={alarmSound}
              src={audioFile}
              preload="auto"
              loop
            ></audio>
          </div>

          <div id="timer-control">
            <button
              id="start_stop"
              className="btn btn-secondary"
              onClick={() => setIsActive(!isActive)}
            >
              <SkipStartBtnFill size={50} />
              <PauseBtnFill size={50} />
            </button>
            <button
              id="reset"
              className="btn btn-secondary"
              value="reset"
              onClick={() => {
                setIsActive(false);
                setIsBreak(false);
                alarmSound.current.pause();
                setTimerLength(25);
                setBreakLength(5);
                setSecondsLeft(timerLength);
              }}
            >
              <ArrowClockwise size={50} />
            </button>
          </div>
        </section>
      </section>
    </div>
  );
}

export default App;
