// import React, { useEffect } from "react";
// import countries from "./data.js";


// const Translate = () => {
// 	useEffect(() => {
// 		const fromText = document.querySelector(".from-text");
// 		const toText = document.querySelector(".to-text");
// 		const exchageIcon = document.querySelector(".exchange");
// 		const selectTag = document.querySelectorAll("select");
// 		const translateBtn = document.querySelector("button");
// 		selectTag.forEach((tag, id) => {
// 			for (let country_code in countries) {
// 				let selected =
// 					id === 0 ? country_code === "en-GB" ? "selected" : "" : country_code === "hi-IN" ? "selected" : "";
// 				let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
// 				tag.insertAdjacentHTML("beforeend", option);
// 			}
// 		});

// 		exchageIcon.addEventListener("click", () => {
// 			console.log("helo");
// 			let tempText = fromText.value;
// 			let tempLang = selectTag[0].value;
// 			console.log(tempText);
// 			console.log(tempLang);
// 			fromText.value = toText.value;
// 			toText.value = tempText;
// 			selectTag[0].value = selectTag[1].value;
// 			selectTag[1].value = tempLang;
// 		});

// 		fromText.addEventListener("keyup", () => {
// 			if (!fromText.value) {
// 				toText.value = "";
// 			}
// 		});

// 		translateBtn.addEventListener("click", async () => {
// 			let text = fromText.value.trim();
// 			let translateFrom = selectTag[0].value;
// 			let translateTo = selectTag[1].value;
// 			if (!text) return;
// 			toText.setAttribute("placeholder", "Translating...");
// 			try {
// 				const response = await
// 					fetch(`http://localhost:5000/?text=${text}&source=${translateFrom}&target=${translateTo}`);
// 				if (!response.ok) {
// 					throw new Error(`HTTP error! status: ${response.status}`);
// 				}
// 				const translatedText = await response.text();
// 				toText.value = translatedText;
// 				toText.setAttribute("placeholder", "Translation");
// 			} catch (error) {
// 				console.error("Fetch error:", error);
// 				toText.setAttribute("placeholder", "Error in translation");
// 			}
// 		});

// 	}, []);
// 	return (
// 		<>
// 			<div className="above-container ">
// 				<h1 className="above-container-content">Translate</h1>
// 			</div>

// 			<div className="container">
// 				<div className="wrapper">
// 					<div className="text-input">
// 						<textarea
// 							spellCheck="false"
// 							className="from-text"
// 							placeholder="Enter text"
// 						></textarea>
// 						<textarea
// 							spellCheck="false"
// 							readOnly
// 							disabled
// 							className="to-text"
// 							placeholder="Translation"
// 						></textarea>
// 					</div>
// 					<ul className="controls">
// 						<li className="row from">
// 							<div className="icons">
// 								<i id="from" className="fas fa-volume-up"></i>
// 								<i id="from" className="fas fa-copy"></i>
// 							</div>
// 							<select></select>
// 						</li>
// 						<li className="exchange">
// 							<i className="fas fa-exchange-alt"></i>
// 						</li>
// 						<li className="row to">
// 							<select></select>
// 							<div className="icons">
// 								<i id="to" className="fas fa-volume-up"></i>
// 								<i id="to" className="fas fa-copy"></i>
// 							</div>
// 						</li>
// 					</ul>
// 				</div>
// 				<button>Translate Text</button>
// 			</div>
// 		</>
// 	);
// };

// export default Translate;



import React, { useState, useRef, useEffect } from "react";
import countries from "./data.js";

const Translate = () => {
    const [fromText, setFromText] = useState("");
    const [toText, setToText] = useState("");
    const [fromLang, setFromLang] = useState("en-GB");
    const [toLang, setToLang] = useState("hi-IN");

    const fromTextRef = useRef(null);
    const toTextRef = useRef(null);
    const exchangeIconRef = useRef(null);

    useEffect(() => {
        // Handle language options
        const populateSelectOptions = () => {
            const options = Object.keys(countries).map((country_code) => (
                <option key={country_code} value={country_code}>
                    {countries[country_code]}
                </option>
            ));
            return options;
        };

        // Focus on the 'from' textarea when component mounts
        fromTextRef.current.focus();
    }, []);

    const handleExchange = () => {
        setFromText(toText);
        setToText(fromText);
        setFromLang(toLang);
        setToLang(fromLang);
    };

    const handleTranslate = async () => {
        if (!fromText.trim()) return;

        setToText("Translating...");

        try {
            const encodedText = encodeURIComponent(fromText);
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${fromLang}|${toLang}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setToText(data.responseData.translatedText);
        } catch (error) {
            console.error("Fetch error:", error);
            setToText("Error in translation");
        }
    };

    return (
        <>
            <div className="above-container ">
                <h1 className="above-container-content">Translate</h1>
            </div>

            <div className="container">
                <div className="wrapper">
                    <div className="text-input">
                        <textarea
                            spellCheck="false"
                            className="from-text"
                            placeholder="Enter text"
                            value={fromText}
                            onChange={(e) => setFromText(e.target.value)}
                            ref={fromTextRef}
                        ></textarea>
                        <textarea
                            spellCheck="false"
                            readOnly
                            disabled
                            className="to-text"
                            placeholder="Translation"
                            value={toText}
                            ref={toTextRef}
                        ></textarea>
                    </div>
                    <ul className="controls">
                        <li className="row from">
                            <div className="icons">
                                <i id="from" className="fas fa-volume-up"></i>
                                <i id="from" className="fas fa-copy"></i>
                            </div>
                            <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
                                {Object.keys(countries).map((country_code) => (
                                    <option key={country_code} value={country_code}>
                                        {countries[country_code]}
                                    </option>
                                ))}
                            </select>
                        </li>
                        <li className="exchange" ref={exchangeIconRef} onClick={handleExchange}>
                            <i className="fas fa-exchange-alt"></i>
                        </li>
                        <li className="row to">
                            <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
                                {Object.keys(countries).map((country_code) => (
                                    <option key={country_code} value={country_code}>
                                        {countries[country_code]}
                                    </option>
                                ))}
                            </select>
                            <div className="icons">
                                <i id="to" className="fas fa-volume-up"></i>
                                <i id="to" className="fas fa-copy"></i>
                            </div>
                        </li>
                    </ul>
                </div>
                <button onClick={handleTranslate}>Translate Text</button>
            </div>
        </>
    );
};

export default Translate;

