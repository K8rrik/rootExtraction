import "./answers.css"
import './App.css'
import {useState} from "react";
import {complex, sqrt} from "mathjs"
import {simplify,sqrt as sqrtAlgebrite} from "algebrite"
import {useTranslation} from "react-i18next"
import Ilanguage from "../public/locales/images/language.svg"


function App() {
    const {t, i18n} = useTranslation();
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        setLanguageBlock(false)
    }


    const [languageBlock, setLanguageBlock] = useState(true)

    const changeLanguageBlock = () => {
        setLanguageBlock(!languageBlock)
    }
    const [inputValue, setInputValue] = useState('')
    const [outputValue, setOutputValue] = useState([])
    const [decimalPlaces, setDecimalPlaces] = useState(2)



    const extraction = () => {
        try {
            const trigPattern = /(sin|cos|tan|cot|sec|csc)\s*\(\s*[^)\s][^)]*\s*\)/i;
            const cleanedInput = inputValue.trim();
            if (trigPattern.test(cleanedInput)) {
                const trigonomNumber = simplify(inputValue)
                setOutputValue([sqrtAlgebrite(trigonomNumber).toString()])
            }
            else{
                const complexNumber = complex(inputValue);
                const roots = sqrt(complexNumber);

                if (roots.im === 0) {
                    setOutputValue([`${formatNumber(roots.re)}`, `${-formatNumber(roots.re)}`]);

                }

                else{
                    setOutputValue([
                        `${formatNumber(roots.re)} ${formatSignImaginaryP(formatNumber(roots.im))}`,
                        `${-formatNumber(roots.re)} ${formatSignImaginaryM(formatNumber(roots.im))}`
                    ])
                    console.log(roots.re.toFixed(decimalPlaces))
                }
            }

        } catch (error) {
            console.log(error);
            setOutputValue(['Ошибка: введите корректное число']);
        }
    }

    const formatNumber = (num) => {
        return Number.isInteger(num) ? num : num.toFixed(decimalPlaces);
    }
    const formatSignImaginaryP = (num) => {
        return num > 0 ? `+ ${num}i` : `- ${-num}i`
    }
    const formatSignImaginaryM = (num) => {
        return num > 0 ? `- ${num}i` : `+ ${-num}i`
    }

    const handleDecimalPlacesChange = (e) => {
        setDecimalPlaces(prev => Math.max(0, Math.min(15, prev + e)))
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
      <div className="container">
          <h1>{t('programNameHeader')}</h1>
          <div className="main-container">


              <div className="calculator">
                  <button onClick={changeLanguageBlock} className="settings"><img className="settings" src={Ilanguage}/>
                  </button>
                  <ul className={`languageCahnger ${languageBlock ? "language-menu-active" : "language-menu"}`}>
                      <li>
                          <button onClick={() => changeLanguage('ru')}>RU</button>
                      </li>
                      <li>
                          <button onClick={() => changeLanguage('en')}>ENG</button>
                      </li>
                      <li>
                          <button onClick={() => changeLanguage('chn')}>CHN</button>
                      </li>
                  </ul>
                  <div className="graphic-input">
                      <input
                          type="text"
                          placeholder={t('inputPlaceholder')}
                          value={inputValue}
                          onChange={handleChange}
                      />

                  </div>
                  <div className="buttons">
                      <div className="buttons-operators">


                          <button onClick={() => handleChangeKeyboard(inputValue + ' - ')}>-</button>
                          <button onClick={() => handleChangeKeyboard(inputValue + ' + ')}>+</button>
                          <button onClick={() => handleChangeKeyboard(inputValue + '0')}>0</button>
                          <button onClick={() => extraction()}>√</button>
                          <button onClick={() => {
                              handleChangeKeyboard(''), setOutputValue([], setDecimalPlaces(2))
                          }}>c
                          </button>
                          <button onClick={() => handleChangeKeyboard(inputValue + 'i')}>i</button>
                          <button onClick={() => handleDecimalPlacesChange(-1)}>&lt;</button>
                          <div className="decimal-places">{decimalPlaces}</div>
                          <button onClick={() => handleDecimalPlacesChange(1)}>&gt;</button>

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
                  <h3 className="answer-header">{t('answersHeader')}</h3>
                  <ul className="answer-fields">
                      {outputValue.map((value, index) => {
                          return (
                              <li key={index} className="answer-field">{value}</li>
                          )
                      })}
                  </ul>
              </div>
          </div>
      </div>

  )
}

export default App
