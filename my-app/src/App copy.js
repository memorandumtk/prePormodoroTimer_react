import "./App.css";
import { useState } from "react";

function Square({ value, onSquareClick, id }) {
  return (
    <button id={id} className="square" onClick={() => onSquareClick(value)}>
      {value}
    </button>
  );
}

function App() {
  const [formula, setFormula] = useState([]);
  const [answer, setAnswer] = useState("0");
  // const notNumber = /[-+*/]/;

  function splitFormula(i) {
    return i.split(/[+-*/]/);
  }

  function enterValue(value) {
    let splitedFormula = splitFormula(value);
    if (value === "0" && formula[formula.length - 1] === "0") return;
    if (value === "." && splitedFormula[splitedFormula.length - 1].includes(".")) return;
    if (/[*/]/.test(value) && /\d/.test(formula[formula.length - 1])) {
      formula[formula.length - 1] = "";
    }
    // if (answer !== "") setAnswer("0");
    setFormula((prevFormula) => [...prevFormula, value]);
  }

  function clearFormula() {
    setFormula([]);
    setAnswer("0");
  }

  function calcAnswer() {
    try {
      const formulaString = formula.join("");
      const validFormula = formulaString.replace(/[^-()\d/*+.]/g, "");
      const calculate = new Function("return " + validFormula);
      const calculatedResult = calculate();
      setAnswer(calculatedResult);
    } catch (error) {
      setAnswer("Error");
    }
    setFormula([]);
  }

  const buttons = [
    "AC",
    "+",
    "-",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "/",
    "1",
    "2",
    "3",
    "=",
    "0",
    ".",
  ];
  const operations = {
    "=": calcAnswer,
    AC: clearFormula,
  };
  const idPut = {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    0: "zero",
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide",
    ".": "decimal",
    "=": "equals",
    AC: "clear",
  };

  return (
    <div className="App">
      <main className="App-main">
        <div id="display" className="formulaScreen">
          <p>{formula}</p>
        </div>
        <div className="answerScreen">
          <p>{answer}</p>
        </div>
        {buttons.map((value) => (
          <Square
            key={value}
            value={value}
            id={idPut[value]}
            onSquareClick={operations[value] || enterValue}
          />
        ))}
      </main>
    </div>
  );
}

export default App;
