import "./answers.css"
import './App.css'
import {useState} from "react";
import {complex, sqrt} from "mathjs"
import {simplify,sqrt as sqrtAlgebrite} from "algebrite"
import {useTranslation} from "react-i18next"
import Ilanguage from "./images/language.svg"
import IuserManual from "./images/userManual.svg"
import IsupportPhone from "./images/supportPhone.svg"
import Isupport from "./images/support.svg"
import IsupportTelegram from "./images/supportTelegram.svg"

function App() {
    const {t, i18n} = useTranslation();
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        setLanguageBlock(false)
    }


    const [languageBlock, setLanguageBlock] = useState(false)
    const [supportBlock, setSupportBlock] = useState(false)
    const changeLanguageBlock = () => {
        setLanguageBlock(!languageBlock)
    }
    const changeSupportBlock = () => {
        setSupportBlock(!supportBlock)
    }
    const [inputValue, setInputValue] = useState('')
    const [outputValue, setOutputValue] = useState([])
    const [decimalPlaces, setDecimalPlaces] = useState(2)
    const [isError,setIsError] = useState(false)
    const [errorContent, setErrorContent] = useState("")


    const extraction = () => {
        try {
            const normalizedInput = inputValue.replace(/,/g, ".");

            const trigPattern = /(sin|cos|tan|cot|sec|csc)\s*\(\s*([^)\s][^)]*)\s*\)/i;
            const cleanedInput = normalizedInput.trim();
            if (cleanedInput == ""){
                setIsError(true)
                setErrorContent(`Error: ${t('error1empty')}`);
            }
            else if (cleanedInput === "0"){
                setOutputValue(["0"])
            }
            else if (trigPattern.test(cleanedInput)) {
                const match = trigPattern.exec(cleanedInput);
                const trigFunction = match[1];
                const trigArgument = parseFloat(match[2]);
                if ((trigFunction.toLowerCase() === "sin" || trigFunction.toLowerCase() === "cos") && (trigArgument < -1 || trigArgument > 1)) {
                    setIsError(true);
                    setErrorContent(`Error: ${t('error2Trig')}`);
                    setOutputValue([]);
                } else {
                setIsError(false)
                const trigonomNumber = simplify(normalizedInput)
                setOutputValue([sqrtAlgebrite(trigonomNumber).toString()])
                }
            } else{
                const complexNumber = complex(normalizedInput);
                const roots = sqrt(complexNumber);

                if (roots.im === 0) {
                    setIsError(false)
                    setOutputValue([`${formatNumber(roots.re)}`, `${-formatNumber(roots.re)}`]);
                }
                else{
                    setIsError(false)
                    setOutputValue([
                        `${formatNumber(roots.re)} ${formatSignImaginaryP(formatNumber(roots.im))}`,
                        `${-formatNumber(roots.re)} ${formatSignImaginaryM(formatNumber(roots.im))}`
                    ])
                }
            }

        } catch (error) {
            console.log(error)
            setIsError(true)
            setErrorContent(`Error: ${t('error3All')}`)
            setOutputValue([])


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

          <button onClick={changeSupportBlock} className="support"><img src={Isupport}/></button>
          <div className={` supportBlock ${supportBlock ? "support-block-active" : "support-block"}`}>
              <h2>{t('supportHeader')}</h2>
              <ul className="support-user">
                  <li>
                      <div><h3>{t('supportDocuments')}:</h3></div>
                      <div><img src={IuserManual}/></div>
                      <div>{t('supportManualUser')}</div>
                  </li>
                  <li>
                      <div><h3>{t('supportFeedback')}</h3></div>
                      <a href="tel:+79124869347">
                          <div><img src={IsupportPhone}/></div>
                          <div>+7 912 486-93-47</div>
                      </a>
                  </li>
                  <li>
                  <div><img src={IsupportTelegram}/></div>
                      <div>{t('supportTelegram')}</div>
                  </li>
              </ul>
          </div>



          <button onClick={changeLanguageBlock} className="language"><img src={Ilanguage}/></button>
          <div className={`languageBlock ${languageBlock ? "language-block-active" : "language-block"}`}>
              <h2>{t('languageHeader')}</h2>
              <ul>
                  <li>
                      <button onClick={() => changeLanguage('ru')}>Русский</button>
                  </li>
                  <li>
                      <button onClick={() => changeLanguage('en')}>English</button>
                  </li>
                  <li>
                      <button onClick={() => changeLanguage('ge')}>Deutsch</button>
                  </li>
                  <li>
                      <button onClick={() => changeLanguage('sp')}>Español</button>
                  </li>
                  <li>
                      <button onClick={() => changeLanguage('port')}>Português</button>
                  </li>
                  <li>
                      <button onClick={() => changeLanguage('frnc')}>Français</button>
                  </li>
                  <li>
                      <button onClick={() => changeLanguage('it')}>Italiano</button>
                  </li>
                  <li>
                      <button onClick={() => changeLanguage('greec')}>ελληνικά</button>
                  </li>
                  <li>
                      <button onClick={() => changeLanguage('jpn')}>日本語</button>
                  </li>
                  <li>
                      <button onClick={() => changeLanguage('chn')}>中文</button>
                  </li>
                  <li>
                      <button onClick={() => changeLanguage('arab')}>عربي</button>
                  </li>
                  <li>
                      <button onClick={() => changeLanguage('hindi')}>हिंदी</button>
                  </li>
              </ul>
          </div>


          <h1>{t('programNameHeader')}</h1>
          <div className="main-container">


              <div className="calculator">
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
                          <button onClick={() => handleChangeKeyboard(inputValue + '.')}>.</button>
                          <button onClick={() => {
                              handleChangeKeyboard(''), setOutputValue([], setDecimalPlaces(2), setIsError(false))
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
                  <button className="enterRoot" onClick={() => extraction()}>{t("extarctRoot")}  √</button>
              </div>
              <div className="answers">
                  <h3 className="answer-header">{t('answersHeader')}</h3>
                  <ul className="answer-fields">
                      {isError ?
                          <div className="error-message">
                              {errorContent}
                          </div> :
                          null}
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
