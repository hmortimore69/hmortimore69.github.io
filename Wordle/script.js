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
            tile.type = "text"; // Use input type="text" for character input
            tile.maxLength = 1; // Restrict input to 1 character
            tile.dataset.row = row;
            tile.dataset.col = col;
            tile.addEventListener('input', handleInput);  // Event listener for input
            grid.appendChild(tile);
        }
        container.appendChild(grid);
    }
}

function enableCurrentRow() {
    // Disable all tiles first
    const allTiles = document.querySelectorAll(".tile");
    allTiles.forEach(tile => tile.disabled = true);

    // Enable tiles for the current row
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
        if (tile.classList.contains("correct")) return 'g';
        if (tile.classList.contains("present")) return 'y';
        return 'b';
    }).join("");
}

function filterWords(guess, feedback, words) {
    return words.filter(word => {
        for (let i = 0; i < 5; i++) {
            const letter = guess[i];
            if (feedback[i] === 'g' && word[i] !== letter) {
                return false;
            } else if (feedback[i] === 'y') {
                if (!word.includes(letter) || word[i] === letter) {
                    return false;
                }
            } else if (feedback[i] === 'b') {
                if (word.includes(letter)) {
                    return false;
                }
            }
        }
        return true;
    });
}

let currentRow = 0;

function submitGuess() {
    const guess = getGuess();
    
    // Check if the guess is in the word list
    if (!wordList.includes(guess)) {
        alert("Invalid word! Please enter a valid word from the word list.");
        return;  // Prevent submission
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
    const currentValue = currentTile.value.trim();

    // If the tile has a value, move to the next tile in the row
    if (currentValue.length === 1) {
        // Find the next tile in the row
        const row = parseInt(currentTile.dataset.row);
        const col = parseInt(currentTile.dataset.col);
        const nextTile = document.querySelector(`[data-row="${row}"][data-col="${col + 1}"]`);
        
        // If there is a next tile, move the focus there
        if (nextTile) {
            nextTile.focus();
        }
    }
}

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("tile")) {
        const row = parseInt(e.target.dataset.row);
        if (row === currentRow) {
            const currentClass = e.target.classList;
            if (currentClass.contains("correct")) {
                currentClass.remove("correct");
                currentClass.add("present");
            } else if (currentClass.contains("present")) {
                currentClass.remove("present");
                currentClass.add("absent");
            } else {
                currentClass.remove("absent");
                currentClass.add("correct");
            }
        }
    }
});

loadWordList();
createGrid();
enableCurrentRow();
