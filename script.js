document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");

    // Define your grid size and initialize it with empty cells
    const numRows = 10; // Adjust as needed
    const numCols = 10; // Adjust as needed
    const gridArray = Array.from({ length: numRows }, () => Array(numCols).fill(null));
    const sizeOfWord = 5;

    // Define a boolean variable to track if a collision is detected
    let gameIsOver = false;
    let noWordsLeft = true;
    let gridHasSettled = false;
    let letterPosRow = 0;
    let letterPosCol = Math.floor(numCols / 2);;
    let moveBy = 0;

    function generateRandomLetter() {
        // Generate a random letter (A-Z)
        const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        return randomLetter;
    }

    function addLetterToGrid() {
        const letter = generateRandomLetter();
        // Add the letter to the top row of the grid
        gridArray[0][Math.floor(numCols / 2)] = letter;
        gridHasSettled = false;
        letterPosRow = 0;
        letterPosCol = Math.floor(numCols / 2);
        moveBy = 0;
    }

    function renderGrid() {
        grid.innerHTML = ''; // Clear the grid

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.innerText = gridArray[row][col] || ''; // Display the letter or an empty string

                grid.appendChild(cell);
            }
        }
    }


    // Handle user input for moving letters left and right
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            // Move last dropped letter left in the array
            moveBy += -1;
        } else if (event.key === "ArrowRight") {
            // Move last dropped letter right in the array
            moveBy += 1;
        }
    });

    function gameOver() {
        // Implement the game over logic here
        // This can include displaying a "Game Over" message or other actions.
        alert("Game Over"); // You can customize this to your liking.
        gameIsOver = true; // Set this to true to stop the game loop
    }

    function checkGameOver() {
        // Check if the game is over
        // If the center of the 2nd row is not empty, the game is over
        if (gridArray[0][Math.floor(numCols / 2)] !== null) {
            gameOver();
        }
    }


    function checkAndRemoveWords() {
        // Loop through the grid from the bottom row to the top row
        // Check words by starting with the current letter and looking at the next 5 consecutive letters as the word
        // If the word is valid, remove the letters from the grid
        // If the word is not valid, move on to the next letter
        // Then iterated over each column and check for words going down
        // If a word is found, remove the letters from the grid
        // Conintue iterating through horizontal and vertical scans for words until there are no words found in two consecutive scans
        noWordsLeft = false; // Set this to false if a word is found
        // Main loop
        while (!noWordsLeft) {
            // Loop through hortizontally and vertically twice and if no words foudn, set noWordsLeft to true
            for (let j = 0; j < 2; j++) {
                // Check horizontally
                for (let row = numRows - 1; row >= 0; row--) {
                    for (let col = 0; col < numCols; col++) {
                        //iterate over size of word
                        let word = "";
                        for (let i = 0; i < sizeOfWord; i++) {
                            word += gridArray[row][col + i];
                        }
                        if (isValidWord(word)) {
                            // Remove the word
                            removeWord(row, col, row, col + sizeOfWord - 1);
                        }
                    }
                }
                // Check vertically
                for (let col = 0; col < numCols; col++) {
                    for (let row = numRows - 1; row >= 0; row--) {
                        //iterate over size of word
                        let word = "";
                        for (let i = 0; i < sizeOfWord; i++) {
                            word += gridArray[row + i][col];
                        }
                        if (isValidWord(word)) {
                            // Remove the word
                            removeWord(row, col, row + sizeOfWord - 1, col);
                        }
                    }
                }
            }
        }
    }

    function removeWord(startRow, startCol, endRow, endCol) {
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                gridArray[row][col] = null;
            }
        }
    }

    // Define an array to store the loaded word list
    let loadedWords = [];

    // Function to load the word list from a JSON file
    function loadWordList(callback) {
        fetch('wordlist.json')
            .then(response => response.json())
            .then(data => {
                loadedWords = data.words; // Assuming your JSON structure has an array of words under the key 'words'
                callback(); // Call the callback function when the word list is loaded
            })
            .catch(error => {
                console.error('Error loading word list:', error);
            });
    }

    loadWordList(function () {
        // The word list is now loaded, you can start your game logic here
        console.log('Word list loaded');
        // Implement the rest of your game logic here
    });

    function isValidWord(word) {
        // Check if the word is in the loadedWords array
        return loadedWords.includes(word.toLowerCase());
    }

    function letterDrops() {
        //Consider the grid settled if no letters move after a full loop through the grid
        // Main loop

        // Loop through the grid from the bottom row to the top row
        gridHasSettled = true;
        for (let row = numRows - 1; row >= 0; row--) {
            for (let col = 0; col < numCols; col++) {
                if (gridArray[row][col] !== null) {
                    console.log("made it here");
                    // Check if the letter can move further down
                    if (row === numRows - 1 || gridArray[row + 1][col] !== null) {
                        continue; // Can't move further down, skip to the next letter
                    } else {
                        // Check if the letter is the last dropped letter
                        x = 0;
                        y = 1;
                        if (row === letterPosRow && col === letterPosCol) {
                            // Move the letter down if it can move further right or left
                            if (col + moveBy < 0 || col + moveBy > numCols - 1) {
                                // Can't move further right or left, so don't move the letter
                                moveBy = 0;
                            } else {
                                x += moveBy;
                                moveBy = 0;
                                letterPosCol += x;
                                letterPosRow += y;
                            }
                        }
                        // Move the letter down
                        gridArray[row + y][col + x] = gridArray[row][col];
                        gridArray[row][col] = null;
                        gridHasSettled = false;
                    }
                }
            }
        }
    }

    function gameLoop() {
        // Implement your game loop logic here
        // Check for letters that can move and do all moves
        letterDrops();

        // Check if the game is over
        checkGameOver();

        // Now that moves have been done, check for any words and remove them
        //checkAndRemoveWords();

        // Add a new letter to the grid
        if (gridHasSettled) addLetterToGrid();

        // Render the grid
        renderGrid();

        if (!gameIsOver) { setTimeout(gameLoop, 1000); } // Adjust the interval (in milliseconds) as needed
        console.log("Main loop");
    }


    // Start the game loop
    gameLoop();
});
