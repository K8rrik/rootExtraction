import "./answers.css";
import "./App.css";
import { useState } from "react";
import { complex, sqrt } from "mathjs";
import { simplify, sqrt as sqrtAlgebrite } from "algebrite";
import { useTranslation } from "react-i18next";
import Ilanguage from "./images/language.svg";
import IuserManual from "./images/userManual.svg";
import IsupportPhone from "./images/supportPhone.svg";
import Isupport from "./images/support.svg";
import IsupportTelegram from "./images/supportTelegram.svg";

function App() {
    const { t, i18n } = useTranslation();

    // Функция для смены языка и скрытия блока выбора языка
    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        setLanguageBlock(false);
    };

    // Состояния
    const [languageBlock, setLanguageBlock] = useState(false);
    const [supportBlock, setSupportBlock] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [outputValue, setOutputValue] = useState([]);
    const [decimalPlaces, setDecimalPlaces] = useState(2);
    const [isError, setIsError] = useState(false);
    const [errorContent, setErrorContent] = useState("");

    // Переключение блока выбора языка
    const changeLanguageBlock = () => {
        setLanguageBlock(!languageBlock);
    };

    // Переключение блока поддержки
    const changeSupportBlock = () => {
        setSupportBlock(!supportBlock);
    };

    /**
     * Функция для извлечения и вычисления квадратного корня или обработки выражений
     */
    const extraction = () => {
        try {
            const normalizedInput = inputValue.replace(/,/g, ".").trim();

            // Регулярные выражения для обнаружения паттернов
            const trigPattern = /(sin|cos|tan|cot|sec|csc)\s*\(\s*([^)\s][^)]*)\s*\)/i;
            const exponentPattern = /^([a-zA-Z0-9]+)\^(\d+)$/; // Совпадает с буквами/цифрами и степенью, например, a^2 или 2^3

            if (normalizedInput === "") {
                setIsError(true);
                setErrorContent(`Ошибка: ${t("error1empty")}`);
                setOutputValue([]);
            } else if (normalizedInput === "0") {
                setIsError(false);
                setOutputValue(["0"]);
            } else if (trigPattern.test(normalizedInput)) {
                // Обработка тригонометрических функций
                const match = trigPattern.exec(normalizedInput);
                const trigFunction = match[1].toLowerCase();
                const trigArgument = parseFloat(match[2]);

                // Проверка аргументов тригонометрических функций sin и cos
                if (
                    (trigFunction === "sin" || trigFunction === "cos") &&
                    (trigArgument < -1 || trigArgument > 1)
                ) {
                    setIsError(true);
                    setErrorContent(`Ошибка: ${t("error2Trig")}`);
                    setOutputValue([]);
                } else {
                    setIsError(false);
                    const trigonomNumber = simplify(normalizedInput);
                    setOutputValue([sqrtAlgebrite(trigonomNumber).toString()]);
                }
            } else if (exponentPattern.test(normalizedInput)) {
                // Обработка выражений с переменными/числами и степенью, например, a^2 или 2^3
                const match = exponentPattern.exec(normalizedInput);
                const base = match[1];
                const exponent = parseInt(match[2], 10);

                if (isNaN(exponent) || exponent < 1) {
                    // Неверный формат экспоненты
                    setIsError(true);
                    setErrorContent(`${t("error3All")}`);
                    setOutputValue([]);
                } else if (/^[a-zA-Z]$/.test(base)) {
                    // Буквенная переменная
                    if (exponent === 2) {
                        // Квадратный корень из a^2 равен |a|
                        setIsError(false);
                        setOutputValue([`abs(${base})`]);
                    } else if (exponent === 1)  {
                        // Квадратный корень из a равен sqrt(a)
                        setIsError(false);
                        setOutputValue([`(${base})^(1/2)`]);
                    } else {
                        // Для экспонент >1 отображаем корень соответствующей степени
                        setIsError(false);
                        setOutputValue([`(${normalizedInput})^(1/2)`]);
                    }
                } else if (/^\d+$/.test(base)) {
                    // Числовая база
                    const baseNumber = parseFloat(base);
                    if (isNaN(baseNumber)) {
                        setIsError(true);
                        setErrorContent(`${t("error3All")}`);
                        setOutputValue([]);
                    } else {
                        if (exponent === 2) {
                            // Квадратный корень из base^2 равен base и -base
                            setIsError(false);
                            setOutputValue([`${baseNumber}`, `${-baseNumber}`]);
                        } else {
                            // Для других степеней, вычисляем sqrt(base^exponent)
                            const result = Math.pow(baseNumber, exponent);
                            const roots = sqrt(result);
                            if (isNaN(roots)) {
                                setIsError(true);
                                setErrorContent(`${t("error3All")}`);
                                setOutputValue([]);
                            } else if (roots === 0) {
                                setIsError(false);
                                setOutputValue(["0"]);
                            } else {
                                setIsError(false);
                                setOutputValue([`${formatNumber(roots)}`, `${-formatNumber(roots)}`]);
                            }
                        }
                    }
                }
            } else if (/^[a-zA-Z]$/.test(normalizedInput)) {
                // Обработка одиночной буквы, например "a"
                setIsError(false);
                setOutputValue([`(${normalizedInput})^(1/2)`]);
            } else if (/^[a-zA-Z]+$/.test(normalizedInput)) {
                // Ввод содержит несколько букв, что неверно
                setIsError(true);
                setErrorContent(`${t("error3All")}`);
                setOutputValue([]);
            } else {
                // Обработка комплексных чисел или других выражений
                const complexNumber = complex(normalizedInput);
                const roots = sqrt(complexNumber);

                if (roots.im === 0) {
                    setIsError(false);
                    setOutputValue([`${formatNumber(roots.re)}`, `${-formatNumber(roots.re)}`]);
                } else {
                    setIsError(false);
                    setOutputValue([
                        `${formatNumber(roots.re)} ${formatSignImaginaryP(formatNumber(roots.im))}`,
                        `${-formatNumber(roots.re)} ${formatSignImaginaryM(formatNumber(roots.im))}`,
                    ]);
                }

            }
        } catch (error) {
            console.error(error);
            setIsError(true);
            setErrorContent(`${t("error3All")}`);
            setOutputValue([]);
        }
    };

    /**
     * Форматирует число до указанного количества десятичных знаков
     */
    const formatNumber = (num) => {
        return Number.isInteger(num) ? num.toString() : num.toFixed(decimalPlaces);
    };

    /**
     * Форматирует мнимую часть с положительным знаком
     */
    const formatSignImaginaryP = (num) => {
        return num > 0 ? `+ ${num}i` : `- ${-num}i`;
    };

    /**
     * Форматирует мнимую часть с отрицательным знаком
     */
    const formatSignImaginaryM = (num) => {
        return num > 0 ? `- ${num}i` : `+ ${-num}i`;
    };

    /**
     * Обрабатывает изменения количества десятичных знаков, обеспечивая диапазон от 0 до 15
     */
    const handleDecimalPlacesChange = (delta) => {
        setDecimalPlaces((prev) => Math.max(0, Math.min(15, prev + delta)));
    };


    const handleChange = (e) => {
        let newValue = e.target.value;
        // Предотвращение ведущих нулей, если за ними не следует десятичная точка
        if (newValue.length > 1 && newValue[0] === "0" && newValue[1] !== ".") {
            newValue = newValue.substring(1);
        }
        setInputValue(newValue);
    };


    const handleChangeKeyboard = (newInput) => {
        let updatedValue = newInput;
        // Предотвращение ведущих нулей, если за ними не следует десятичная точка
        if (updatedValue.length > 1 && updatedValue[0] === "0" && updatedValue[1] !== ".") {
            updatedValue = updatedValue.substring(1);
        }
        setInputValue(updatedValue);
    };

    return (
        <div className="container">
            {/* Кнопка поддержки и блок поддержки */}
            <button onClick={changeSupportBlock} className="support">
                <img src={Isupport} alt="Поддержка" />
            </button>
            <div className={`supportBlock ${supportBlock ? "support-block-active" : "support-block"}`}>
                <h2>{t("supportHeader")}</h2>
                <ul className="support-user">
                    <li>
                        <div>
                            <h3>{t("supportDocuments")}:</h3>
                        </div>
                        <div>
                            <img src={IuserManual} alt="Руководство пользователя" />
                        </div>
                        <div>{t("supportManualUser")}</div>
                    </li>
                    <li>
                        <div>
                            <h3>{t("supportFeedback")}</h3>
                        </div>
                        <a href="tel:+79124869347">
                            <div>
                                <img src={IsupportPhone} alt="Телефон поддержки" />
                            </div>
                            <div>+7 912 486-93-47</div>
                        </a>
                    </li>
                    <li>
                        <div>
                            <img src={IsupportTelegram} alt="Поддержка в Telegram" />
                        </div>
                        <div>{t("supportTelegram")}</div>
                    </li>
                </ul>
            </div>

            {/* Кнопка выбора языка и блок выбора языка */}
            <button onClick={changeLanguageBlock} className="language">
                <img src={Ilanguage} alt="Язык" />
            </button>
            <div className={`languageBlock ${languageBlock ? "language-block-active" : "language-block"}`}>
                <h2>{t("languageHeader")}</h2>
                <ul>
                    {/* Список поддерживаемых языков */}
                    <li>
                        <button onClick={() => changeLanguage("ru")}>Русский</button>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage("en")}>English</button>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage("ge")}>Deutsch</button>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage("sp")}>Español</button>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage("port")}>Português</button>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage("frnc")}>Français</button>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage("it")}>Italiano</button>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage("greec")}>ελληνικά</button>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage("jpn")}>日本語</button>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage("chn")}>中文</button>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage("arab")}>عربي</button>
                    </li>
                    <li>
                        <button onClick={() => changeLanguage("hindi")}>हिंदी</button>
                    </li>
                </ul>
            </div>

            {/* Заголовок приложения */}
            <h1>{t("programNameHeader")}</h1>

            {/* Основной контейнер */}
            <div className="main-container">
                {/* Раздел калькулятора */}
                <div className="calculator">
                    <div className="graphic-input">
                        <input
                            type="text"
                            placeholder={t("inputPlaceholder")}
                            value={inputValue}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="buttons">
                        <div className="buttons-operators">
                            {/* Кнопки операторов */}
                            <button onClick={() => handleChangeKeyboard(inputValue + " - ")}>-</button>
                            <button onClick={() => handleChangeKeyboard(inputValue + " + ")}>+</button>
                            <button onClick={() => handleChangeKeyboard(inputValue + "0")}>0</button>
                            <button onClick={() => handleChangeKeyboard(inputValue + ".")}>.</button>
                            <button
                                onClick={() => {
                                    handleChangeKeyboard("");
                                    setOutputValue([]);
                                    setDecimalPlaces(2);
                                    setIsError(false);
                                }}
                            >
                                C
                            </button>
                            <button onClick={() => handleChangeKeyboard(inputValue + "i")}>i</button>
                            <button onClick={() => handleDecimalPlacesChange(-1)}>&lt;</button>
                            <div className="decimal-places">{decimalPlaces}</div>
                            <button onClick={() => handleDecimalPlacesChange(1)}>&gt;</button>
                        </div>
                        <div className="buttons-nums">
                            {/* Кнопки чисел */}
                            <button onClick={() => handleChangeKeyboard(inputValue + "1")}>1</button>
                            <button onClick={() => handleChangeKeyboard(inputValue + "2")}>2</button>
                            <button onClick={() => handleChangeKeyboard(inputValue + "3")}>3</button>
                            <button onClick={() => handleChangeKeyboard(inputValue + "4")}>4</button>
                            <button onClick={() => handleChangeKeyboard(inputValue + "5")}>5</button>
                            <button onClick={() => handleChangeKeyboard(inputValue + "6")}>6</button>
                            <button onClick={() => handleChangeKeyboard(inputValue + "7")}>7</button>
                            <button onClick={() => handleChangeKeyboard(inputValue + "8")}>8</button>
                            <button onClick={() => handleChangeKeyboard(inputValue + "9")}>9</button>
                        </div>
                    </div>
                    {/* Кнопка извлечения корня */}
                    <button className="enterRoot" onClick={extraction}>
                        {t("extarctRoot")} √
                    </button>
                </div>

                {/* Раздел ответов */}
                <div className="answers">
                    <h3 className="answer-header">{t("answersHeader")}</h3>
                    <ul className="answer-fields">
                        {isError && <div className="error-message">{errorContent}</div>}
                        {!isError &&
                            outputValue.map((value, index) => (
                                <li key={index} className="answer-field">
                                    {value}
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;