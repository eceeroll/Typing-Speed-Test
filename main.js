// selecting required elements
const text = document.querySelector(".text p");
const input = document.querySelector("#input");
const mistake = document.getElementById("mistake");
const time = document.getElementById("time");
const wpmTag = document.getElementById("wpm");
const cpmTag = document.getElementById("cpm");
const resetButton = document.getElementById("button");

let CHAR_INDEX = 0; // global variable 
let mistakeCount = 0;

let timer;
let maxTime = 60;
let timeLeft = maxTime;
time.innerText = maxTime + " s";

let isTyping = false;

// focusing the input with key events or click events
document.addEventListener("keydown", () => input.focus());
input.addEventListener("click", () => input.focus())
input.addEventListener("input", initTyping)
resetButton.addEventListener("click", resetTest);

function randomParagraph() {
    let index = Math.floor(Math.random() * paragraphs.length);

    // clear text tag for reset function
    text.innerHTML = '';

    // getting a paragraph from array and split to the all characters, then put them each one in a span, then adding this spans inside paragraph 
    paragraphs[index].split("").forEach(span => {
        let spanElement = `<span>${span}</span>`
        text.innerHTML += spanElement;
    });
    
    // shows the blink on the first char by default
    document.querySelectorAll("span")[0].classList.add("active");
}

function initTyping() {
    const chars = document.querySelectorAll("span");
    let typedChar = input.value.split("")[CHAR_INDEX];

    // if user didnt input the all text and time left is greater than 0, user can continue typing
    if(CHAR_INDEX < chars.length - 1 && timeLeft > 0) {
        // once timer starts it wont restart again on every input
    if(!isTyping) {
        timer = setInterval(initTime,1000);
        isTyping = true;
    }
    
    // if user hasnt entered any char or press backspace
    if (typedChar == null) {
        CHAR_INDEX--; // decrement index by one each press

        // decrement mistakes if char is incorrect
        if(chars[CHAR_INDEX].classList.contains("incorrect")) {
            mistakeCount--;
        }

        chars[CHAR_INDEX].classList.remove("correct","incorrect");
    }
    else {
        if(chars[CHAR_INDEX].textContent.toLowerCase() === typedChar.toLowerCase() ) {
            chars[CHAR_INDEX].classList.add("correct");
        } else {
            mistakeCount++;
            chars[CHAR_INDEX].classList.add("incorrect");
        }
    
        CHAR_INDEX++;
    }
    // remove blink animation from past chars and add to the current char 
    chars.forEach(span => span.classList.remove("active"));
    chars[CHAR_INDEX].classList.add("active");

    // cpm doesnt counts the mistakes
    cpmTag.innerText = CHAR_INDEX - mistakeCount;

    // 5 means : avg one word contains 5 characters
    let wpm = Math.round(((CHAR_INDEX - mistakeCount)  / 5) / (maxTime - timeLeft) * 60);
    
    // if wpm value is null infinity or 0, set value to 0
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;    
    wpmTag.innerText = wpm;
    mistake.innerText = mistakeCount;
    wpmTag.innerText = wpm;
    }

    // if times out or theres no chars to input on text
    else {
        // user cant type to the input
        input.value = '';
        clearInterval(timer);
        alert(`Times Out!
               WPM: ${wpmTag.textContent}  
               CPM: ${cpmTag.textContent}
        `)
    }
}

// this function will execute each second and update the timer value 
function initTime() {
    // if timeLeft value is greater then 0 decrements by 1, else clears the timer
    if(timeLeft > 0) {
        timeLeft--;
        time.innerText = timeLeft;
    }
    else {
        clearInterval(timer);
    }
}

function resetTest() {
    // first calling random paragraph function then clears each variable and set to default
    randomParagraph();
    input.value = '';
    clearInterval(timer);
    timeLeft = maxTime;
    time.innerText = timeLeft + "s";
    CHAR_INDEX = 0; 
    mistakeCount = 0;
    maxTime = 60;
    isTyping = false;
    cpmTag.innerText = 0;
    wpmTag.innerText = 0;
    mistake.innerText = mistakeCount;
    wpmTag.innerText = 0;
}


randomParagraph();