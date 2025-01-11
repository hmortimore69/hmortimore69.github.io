async function loadWordList() {
    const response = await fetch('words.txt');
    const text = await response.text();
    wordList = text.split('\n').map(word => word.trim()).filter(word => word.length === 5);
    possibleWords = [...wordList];
}

function createGrid() {
    const container = document.getElementById("gridContainer");
    for (let row = 0; row < 6; row++) {
        const grid = document.createElement("div");
        grid.classList.add("grid");
        for (let col = 0; col < 5; col++) {
            const tile = document.createElement("input");
            tile.classList.add("tile");
            tile.type = "text"; 
            tile.maxLength = 2;
            tile.dataset.row = row;
            tile.dataset.col = col;
            tile.addEventListener('input', handleInput);
            grid.appendChild(tile);
        }
        container.appendChild(grid);
    }
}

function enableCurrentRow() {
    const allTiles = document.querySelectorAll(".tile");
    allTiles.forEach(tile => tile.disabled = true);

    const tiles = document.querySelectorAll(`.grid:nth-child(${currentRow + 1}) .tile`);
    tiles.forEach(tile => tile.disabled = false);
}

function getGuess() {
    const tiles = document.querySelectorAll(`.grid:nth-child(${currentRow + 1}) .tile`);
    return Array.from(tiles).map(tile => tile.value.toLowerCase()).join("");
}

function getFeedback() {
    const tiles = document.querySelectorAll(`.grid:nth-child(${currentRow + 1}) .tile`);
    return Array.from(tiles).map(tile => {
        if (tile.classList.contains("correct")) return 'G';
        if (tile.classList.contains("present")) return 'Y';
        return 'B';
    }).join("");
}

function filterWords(guess, feedback, words) {
    return words.filter(word => {
        let valid = true;

        // Check if word is the same length as the guess
        if (word.length !== guess.length) {
            return false;
        }

        // Create arrays to track feedback conditions
        let guessArray = [...guess];
        let wordArray = [...word];
        let feedbackUsed = new Array(guess.length).fill(false);

        // First pass: Check for exact matches (Green - G)
        for (let i = 0; i < guess.length; i++) {
            if (feedback[i] === 'G') {
                if (guessArray[i] !== wordArray[i]) {
                    valid = false;
                    break;
                }
                // Mark this letter as used in both guess and word
                feedbackUsed[i] = true;
                guessArray[i] = null;
                wordArray[i] = null;
            }
        }

        if (!valid) return false;

        // Second pass: Check for misplaced letters (Yellow - Y)
        for (let i = 0; i < guess.length; i++) {
            if (feedback[i] === 'Y') {
                const indexInWord = wordArray.indexOf(guessArray[i]);
                if (indexInWord === -1 || feedbackUsed[indexInWord]) {
                    valid = false;
                    break;
                }
                // Remove the character from wordArray to prevent reuse
                wordArray[indexInWord] = null;
                feedbackUsed[i] = true;
            }
        }

        if (!valid) return false;

        // Third pass: Check for incorrect letters (Black - B)
        for (let i = 0; i < guess.length; i++) {
            if (feedback[i] === 'B') {
                // If the letter exists anywhere else in the word or in the wrong position
                if (wordArray.includes(guessArray[i])) {
                    valid = false;
                    break;
                }
            }
        }

        return valid;
    });
}

let currentRow = 0;
function submitGuess() {
    const guess = getGuess();
    
    if (!wordList.includes(guess)) {
        alert("Invalid word! Please enter a valid word.");
        return; 
    }

    const feedback = getFeedback();
    const logDiv = document.getElementById("log");

    if (guess.length !== 5) {
        alert("Please enter a full 5-letter word.");
        return;
    }

    possibleWords = filterWords(guess, feedback, possibleWords);

    if (possibleWords.length > 0) {
        logDiv.innerHTML += `<p>Next suggested word: <strong>${possibleWords[0]}</strong></p>`;
    } else {
        logDiv.innerHTML += `<p><strong>No possible words left. Please check your inputs.</strong></p>`;
    }

    if (currentRow < 5) {
        currentRow++;
        enableCurrentRow();
    }
}

// Handle input event to ensure only one character and move to next cell
function handleInput(e) {
    const currentTile = e.target;
    const inputChar = e.data;  // Captures the latest character input
    const row = parseInt(currentTile.dataset.row);
    const col = parseInt(currentTile.dataset.col);

    if (e.inputType === "deleteContentBackward") {
        if (currentTile.value === "") {
            const prevTile = document.querySelector(`[data-row="${row}"][data-col="${col - 1}"]`);
            if (prevTile) {
                prevTile.focus();

                const backspaceEvent = new InputEvent("input", {
                    inputType: "deleteContentBackward",
                    data: null,
                    bubbles: true,
                });
                prevTile.dispatchEvent(backspaceEvent);
            }
        }
    } else if (inputChar) {
        if (currentTile.value.length > 1) {
            currentTile.value = currentTile.value.charAt(0); 
            const nextTile = document.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`);

            if (nextTile) {
                nextTile.focus();
                nextTile.value = inputChar; 
            }
        } else {
            currentTile.value = inputChar;  

            const nextTile = document.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`);
            if (nextTile) {
                nextTile.focus();

                if (!(
                    nextTile.classList.contains("present") ||
                    nextTile.classList.contains("correct") ||
                    nextTile.classList.contains("absent")
                )) {
                    nextTile.classList.add("absent");
                }
            }
        }
    }
}

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("tile")) {
        const row = parseInt(e.target.dataset.row);
        if (row === currentRow) {
            const currentClass = e.target.classList;
            if (currentClass.contains("absent")) {
                currentClass.remove("absent");
                currentClass.add("present");
            } else if (currentClass.contains("present")) {
                currentClass.remove("present");
                currentClass.add("correct");
            } else {
                currentClass.remove("correct");
                currentClass.add("absent");
            }
        }
    }
});

loadWordList();
createGrid();
enableCurrentRow();
