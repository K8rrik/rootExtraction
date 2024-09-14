import "./answers.css"
import './App.css'
import {useState} from "react";
import {complex,sqrt} from "mathjs"
import {simplify,sqrt as sqrtAlgebrite} from "algebrite"


function App() {



    const [inputValue, setInputValue] = useState('')
    const [outputValue, setOutputValue] = useState([])
    const extraction = () => {
        try {
            const trigPattern = /(sin|cos|tan|cot|sec|csc)/i;
            const alphPattern = /[a-hj-zA-HJ-Z]/;
            const cleanedInput = inputValue.trim();
            if (trigPattern.test(cleanedInput)) {
                const trigonomNumber = simplify(inputValue)
                setOutputValue([sqrtAlgebrite(trigonomNumber).toString()])
            }
            else if(alphPattern.test(cleanedInput)){
                setOutputValue([sqrtAlgebrite(cleanedInput).toString()])
            }
            else{
                const complexNumber = complex(inputValue);
                const roots = sqrt(complexNumber);
                if (roots.im === 0) {
                    setOutputValue([`${roots.re}`, `${-roots.re}`]);

                }
                else{
                    setOutputValue([
                        `${roots.re} + ${roots.im}i`,
                        `${-roots.re} - ${roots.im}i`
                    ])
                }
            }

        } catch (error) {
            console.log(error);
            setOutputValue(['Ошибка: введите корректное число']);
        }
    }

    const handleChange= (e) => {
        let newValue = e.target.value
        if (newValue.length > 1 && newValue[0] === '0' && newValue[1] !== '.') {
            newValue = newValue.substring(1);
        }
        setInputValue(newValue);
    }
    const handleChangeKeyboard = (e) => {
        let newValue = e
        if (newValue.length > 1 && newValue[0] === '0' && newValue[1] !== '.') {
            newValue = newValue.substring(1);
        }
        setInputValue(newValue);
    }
  return (
      <div className="main-container">
          <div className="calculator">
              <div className="graphic-input">
                  <input
                      type="text"
                      placeholder="Введите число, букву или формулу"
                      value={inputValue}
                      onChange={handleChange}
                  />

              </div>
              <div className="buttons">
                  <div className="buttons-operators">
                      <button onClick={() => extraction()}>√</button>
                      <button>&lt;</button>
                      <button onClick={() => handleChangeKeyboard(inputValue + '0')}>0</button>
                      <button onClick={() => handleChangeKeyboard(inputValue + ' + ')}>+</button>
                      <button onClick={() => handleChangeKeyboard(inputValue + 'i')}>i</button>
                      <button onClick={() => {handleChangeKeyboard(''), setOutputValue([])}}>c</button>

                  </div>
                  <div className="buttons-nums">
                      <button onClick={() => handleChangeKeyboard(inputValue + '1')}>1</button>
                      <button onClick={() => handleChangeKeyboard(inputValue + '2')}>2</button>
                      <button onClick={() => handleChangeKeyboard(inputValue + '3')}>3</button>
                      <button onClick={() => handleChangeKeyboard(inputValue + '4')}>4</button>
                      <button onClick={() => handleChangeKeyboard(inputValue + '5')}>5</button>
                      <button onClick={() => handleChangeKeyboard(inputValue + '6')}>6</button>
                      <button onClick={() => handleChangeKeyboard(inputValue + '7')}>7</button>
                      <button onClick={() => handleChangeKeyboard(inputValue + '8')}>8</button>
                      <button onClick={() => handleChangeKeyboard(inputValue + '9')}>9</button>
                  </div>
              </div>
          </div>
          <div className="answers">
              <h3 className="answer-header">Ответы:</h3>
              <ul className="answer-fields">
                  {outputValue.map((value,index) => {
                        return(
                            <li key={index} className="answer-field">{value}</li>
                      )
                  })}
              </ul>
          </div>
      </div>
  )
}

export default App
