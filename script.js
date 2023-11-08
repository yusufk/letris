document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");

    // Define your grid size and initialize it with empty cells
    const numRows = 5; // Adjust as needed
    const numCols = 10; // Adjust as needed
    const gridArray = Array.from({ length: numRows }, () => Array(numCols).fill(null));
    const sizeOfWord = 5;

    // Define a boolean variable to track if a collision is detected
    let gameIsOver = false;
    let gridHasSettled = false;
    let letterPosRow = 0;
    let letterPosCol = Math.floor(numCols / 2);;
    let moveBy = 0;
    let score = 0;
    const resetButton = document.getElementById('reset-button');
    const scoreElement = document.getElementById('score');

    resetButton.addEventListener('click', resetGame);

    function resetGame() {
        // Reset the game state
        gameIsOver = false;
        gridHasSettled = false;
        letterPosRow = 0;
        letterPosCol = Math.floor(numCols / 2);
        moveBy = 0;
        score = 0;
        // Reset the grid
        gridArray.forEach(row => row.fill(null));

        // Hide the reset button
        resetButton.style.display = 'none';

        // Reset the score
        score = 0;
        updateScore();

        // Restart the game loop
        gameLoop();
    }

    function updateScore() {
        scoreElement.textContent = 'Score: ' + score;
    }

    // Call updateScore whenever the score changes
    // ...

    function generateRandomLetter() {
        // Check if loadedWords is empty
        if (loadedWords.length === 0) {
            console.error('loadedWords is empty');
            return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1); // Return a random letter
        }

        // Create an array of letters with the frequency of each letter
        const letters = [];
        for (let i = 0; i < loadedWords.length; i++) {
            for (let j = 0; j < loadedWords[i].length; j++) {
                // Exclude spaces and special characters
                if (loadedWords[i][j] === ' ' || loadedWords[i][j] === '-' || loadedWords[i][j] === '\'') continue;
                letters.push(loadedWords[i][j]);
            }
        }

        // Generate a random letter weighted by the frequency of letters in the word list
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        console.log("Random letter: " + randomLetter);
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
        // Show the reset button
        resetButton.style.display = 'block';
    }

    function checkGameOver() {
        // Check if the game is over
        // If the center of the 2nd row is not empty, the game is over
        if (gridArray[0][Math.floor(numCols / 2)] !== null) {
            gameOver();
        }
    }


    function checkAndRemoveWords() {
        // Find any words in the grid and remove them
        // Check each row
        for (let row = 0; row < numRows; row++) {
            let word = '';
            for (let col = 0; col < numCols; col++) {
                word += gridArray[row][col] || ''; // Add the letter or an empty string
            }
            if (isValidWord(word)) {
                // Remove the word from the grid
                removeWord(row, 0, row, numCols - 1);
                noWordsLeft = false;
            }
        }
        // Check each column
        for (let col = 0; col < numCols; col++) {
            let word = '';
            for (let row = 0; row < numRows; row++) {
                word += gridArray[row][col] || ''; // Add the letter or an empty string
            }
            if (isValidWord(word)) {
                // Remove the word from the grid
                removeWord(0, col, numRows - 1, col);
                noWordsLeft = false;
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
                                // Check again if the letter can move further down with the moveby included
                                if (gridArray[row + 1][col + moveBy] === null) {
                                    x += moveBy;
                                    moveBy = 0;
                                    letterPosCol += x;
                                    letterPosRow += y;
                                }
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
        checkAndRemoveWords();

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
