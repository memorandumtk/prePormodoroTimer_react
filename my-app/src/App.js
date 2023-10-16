import "./App.css";
import { useState } from "react";

function Square({ value, onSquareClick, id }) {
  return (
    <button id={id} className="square" onClick={() => onSquareClick(value)}>
      {value}
    </button>
  );
}
// comment
function App() {
  const [formula, setFormula] = useState([]);
  const [answer, setAnswer] = useState("0");
  const [term, setTerm] = useState([]);
  const [ope, setOpe] = useState([]);
  const [showingAnswer, setShowingAnswer] = useState(true);
  const [historyAnswer, setHistoryAnswer] = useState(null);

  const operatorRe = /[\+\-\*\/]/;

  function enterNumber(value) {
    // if (value === "0" && formula[formula.length - 1] === "0") return;
    if (value === "0" && term.includes("0")) return;
    if (value === "." && term.includes(".")) return;
    setTerm((prevTerm) => [...prevTerm, value]);
    setFormula((prevFormula) => [...prevFormula, value]);
    setShowingAnswer(false);  // Reset showingAnswer
    setOpe([]); // Reset the ope when an number is entered
  }

  function enterOperator(value) {
    if (historyAnswer === null && formula.length === 0) {
      return;
    } else if (historyAnswer !== null && formula.length === 0) {
      setFormula((prevFormula) => [...prevFormula, historyAnswer]);
    }
    if (!operatorRe.test(ope) && operatorRe.test(value)) {
      setOpe([value]);
      setFormula((prevFormula) => [...prevFormula, value]);
    } else if (
      (ope[ope.length - 1] === "+" || ope[ope.length - 1] === "-") &&
      (/[\*\/]/.test(ope)) &&
      (value === "+")
    ) {
      setOpe([value]);
      setFormula((prevFormula) => [...prevFormula.slice(0, (prevFormula.indexOf(/[\*\/]/) - 1)), value]);
    } else if (
      (ope[ope.length - 1] === "+" || ope[ope.length - 1] === "-") &&
      (value === "+" || value === "-")
    ) {
      setOpe((prevOpe) => {
        let updatedOpe = [...prevOpe];
        updatedOpe[updatedOpe.length - 1] = value;
        return updatedOpe;
      });
      setFormula((prevFormula) => {
        let updatedFormula = [...prevFormula];
        updatedFormula[updatedFormula.length - 1] = value;
        return updatedFormula;
      });
    } else if (
      (ope[ope.length - 1] === "*" || ope[ope.length - 1] === "/") &&
      (value === "-")
    ) {
      setOpe((prevOpe) => [...prevOpe, value]);
      setFormula((prevFormula) => [...prevFormula, value]);
    }

    setTerm([]); // Reset the term when an operator is entered
  }

  function clearFormula() {
    setFormula([]);
    setTerm([]);
    setOpe([]);
    setAnswer("0");
    setShowingAnswer(true);  // Reset showingAnswer
    setHistoryAnswer(null);
  }

  function calcAnswer() {
    try {
      const formulaString = formula.join("");
      const validFormula = formulaString.replace(/[^-()\d/*+.]/g, "");
      const calculate = new Function("return " + validFormula);
      const calculatedResult = calculate();
      setAnswer(calculatedResult);
      setHistoryAnswer(calculatedResult);
    } catch (error) {
      setAnswer("Error");
    }
    setFormula([]);
    setTerm([]);
    setShowingAnswer(true);  // Set showingAnswer to true after getting the result
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
        <div className="formulaScreen">
          <p>{formula}</p>
        </div>
        <div className="answerScreen">
          {/* <p id="display">{answer}</p> */}
          <p id="display">{showingAnswer ? answer : term.join('')}</p>
        </div>
        {buttons.map((value) => (
          <Square
            key={value}
            value={value}
            id={idPut[value]}
            onSquareClick={operations[value] || (operatorRe.test(value) ? enterOperator : enterNumber)}
          />
        ))}
        {/* <div>Term: {term.join('')}</div>
        <br />
        <div>ope: {ope.join('')}</div> */}
      </main>
    </div>
  );
}

export default App;