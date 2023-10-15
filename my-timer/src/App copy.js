import { useState, useEffect } from "react";
import "./App.css";
import React from "react";
import { useTimer } from "use-timer";
import { useReducer } from "react"; // Import useReducer

function App() {
  const [timerLength, setTimerLength] = useState(3);
  const [breakLength, setBreakLength] = useState(2);
  const [isBreak, setIsBreak] = useState(false);
  
  // Set current initial time based on whether it's a break or not.
  const [currentInitialTime, setCurrentInitialTime] = useState(isBreak ? breakLength : timerLength);

  const { time, start, pause, reset, status, dispatch } = useTimer({
    initialTime: currentInitialTime,
    endTime: 0,
    timerType: "DECREMENTAL",
    onTimeOver: (dispatch) => {
    console.log("Time is over");
    setCurrentInitialTime(isBreak ? breakLength : timerLength);
    setIsBreak(!isBreak); // Switch between break and timer
    dispatch({ type: 'set', payload: { newTime: currentInitialTime } });
    start();
}

    // onTimeOver: () => {
    //   console.log("Time is over");
    //   setIsBreak(!isBreak); 
    //   setCurrentInitialTime(!isBreak ? breakLength : timerLength); // Switch initial time accordingly
    // },
  });

  useEffect(() => {
    reset();
    // Dispatch the updated initial time to the timer's state after resetting
    dispatch({ type: 'set', payload: { newTime: currentInitialTime } });
}, [currentInitialTime, reset, dispatch]);


  const handleTimer = (i) => {
    if (status !== "RUNNING" && !isBreak) {
      let newTime = i === "-" ? Math.max(0, timerLength - 1) : timerLength + 1;
      setTimerLength(newTime);
      setCurrentInitialTime(newTime); // Only update initial time if not on break
    }
  };

  const handleBreak = (i) => {
    if (status !== "RUNNING" && isBreak) {
      let newBreak = i === "-" ? Math.max(0, breakLength - 1) : breakLength + 1;
      setBreakLength(newBreak);
      setCurrentInitialTime(newBreak); // Only update initial time if on break
    }
  };

  const formatTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="app">
      <section className="main-section">
        <div className="title-div">25 + 5 Clock</div>
        <div className="timer-length-div">
          <p>Timer Length</p>
          <button value="-" onClick={() => handleTimer("-")}>
            -
          </button>
          <div className="timerLength">{timerLength}</div>
          <button value="+" onClick={() => handleTimer("+")}>
            +
          </button>
        </div>
        <div className="break-length-div">
          <p>Break Length</p>
          <button value="-" onClick={() => handleBreak("-")}>
            -
          </button>
          <div className="breakLength">{breakLength}</div>
          <button value="+" onClick={() => handleBreak("+")}>
            +
          </button>
        </div>
        <section className="timer-display">
          <p className="session">{isBreak ? "Break" : "Session"}</p>
          <div>
            <button onClick={start}>Start</button>
            <button onClick={pause}>Pause</button>
            <button onClick={reset}>Reset</button>
          </div>
          <p>Elapsed time: {formatTime(time)}</p>
          {/* added below line for test */}
          <p>InitialTime time: {formatTime(currentInitialTime)}</p>
          {status === "RUNNING" && <p>Running...</p>}
        </section>
        <section className="timer-control"></section>
      </section>
    </div>
  );
}


export default App;
