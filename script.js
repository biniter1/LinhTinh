const textarea = document.querySelector("textarea"),
    voiceList = document.querySelector("select"),
    speechBtn = document.querySelector("button");

let synth = window.speechSynthesis,
    isSpeaking = true;


function voices() {
    voiceList.innerHTML = ""; 
    const availableVoices = synth.getVoices();
    for (let voice of availableVoices) {
        let selected = (voice.lang === "vi-VN") ? "selected" : ""; // Select Vietnamese voice
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);
    }
}


synth.addEventListener("voiceschanged", voices);


function textToSpeech(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    for (let voice of synth.getVoices()) {
        if (voice.name === voiceList.value) {
            utterance.voice = voice;
        }
    }
    synth.speak(utterance);
}


speechBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (textarea.value !== "") {
        if (!synth.speaking) {
            textToSpeech(textarea.value);
        }
        if (textarea.value.length > 80) {
            setInterval(() => {
                if (!synth.speaking && !isSpeaking) {
                    isSpeaking = true;
                    speechBtn.innerText = "Convert To Speech";
                }
            }, 500);
            if (isSpeaking) {
                synth.resume();
                isSpeaking = false;
                speechBtn.innerText = "Pause Speech";
            } else {
                synth.pause();
                isSpeaking = true;
                speechBtn.innerText = "Resume Speech";
            }
        } else {
            speechBtn.innerText = "Convert To Speech";
        }
    }
});

voices();