// UAT Checkers GAME

// Creates a single checker piece and places it on a chosen square.
function createPiece(pieceId, pieceClass, divSquare) {
    let divPiece = document.createElement("div"); // Creates a <div> element to represent the piece.
    divPiece.setAttribute("id", pieceId); // Gives the piece its unique ID.
    divPiece.classList.add("checkerPiece"); // Adds the generic "checkerPiece" style.
    divPiece.classList.add(pieceClass); // Adds the specific piece color (redPiece or grayPiece).
    divPiece.setAttribute("draggable", "true"); // Makes the piece draggable with HTML5 drag-and-drop

    // Saves piece's current square location in a dataset.
    divPiece.dataset.squareId = divSquare.dataset.position;

    // Drag events.
    divPiece.addEventListener("dragstart", dragStart);
    divPiece.addEventListener("dragend", dragEnd);

    // Place the piece inside the given board square.
    divSquare.appendChild(divPiece);
}

// Drag start handler.
function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id); // Stores the piece's ID so we know which one is being moved.
    event.target.classList.add("dragging"); // Adds a visual effect (lower opacity) while dragging.
}

// Drag end handler.
function dragEnd(event) {
    event.target.classList.remove("dragging");
}

// Allows drop handler for squares.
function allowDrop(event) {
    event.preventDefault();
}

// Drop handler — this moves the piece only if it’s one square diagonally.
function dropPiece(event) {
    event.preventDefault();

    let pieceId = event.dataTransfer.getData("text/plain");
    let piece = document.getElementById(pieceId);

    // Gets the source square coordinates.
    let fromPos = piece.dataset.squareId.split("-").map(Number); // [row, col]

    // Gets the target square.
    let targetSquare = event.target.classList.contains("checkerSquareAlt")
        ? event.target
        : event.target.closest(".checkerSquareAlt"); // In case it's dropped on piece margin.

    // If target square is invalid or already has a piece it will be rejected.
    if (!targetSquare || targetSquare.children.length > 0) return;

    // Gets the target coordinates.
    let toPos = targetSquare.dataset.position.split("-").map(Number); // [row, col].

    // Calculates row and col differences.
    let rowDiff = toPos[0] - fromPos[0];
    let colDiff = Math.abs(toPos[1] - fromPos[1]);

    // Determines the allowed direction: red moves down (+1), gray moves up (-1).
    let allowedRowDiff = piece.classList.contains("redPiece") ? 1 : -1;

    // Check: must move 1 row in allowed direction and 1 column diagonally.
    if (rowDiff === allowedRowDiff && colDiff === 1) {
        // Updates the piece location data.
        piece.dataset.squareId = targetSquare.dataset.position;

        // Moves the piece to new square.
        targetSquare.appendChild(piece);
    }
    // Otherwise, invalid move it will ignore drop.
}

// Builds the checkers board with starting pieces.
function initBoard() {
    let board = document.getElementById("divCheckersBoard"); // Gets the main board container
    let pieceIdCounter = 1; // Keeps track of piece IDs for uniqueness.

    for (let row = 0; row < 8; row++) { // Loops through 8 rows.
        for (let col = 0; col < 8; col++) { // Loops through 8 columns.
            let square = document.createElement("div"); // Creates a square (div)
            square.classList.add("checkerSquare"); // Adds default square style
            square.dataset.position = `${row}-${col}`; // Stores coordinates.

            if ((row + col) % 2 !== 0) { // If row+col is odd, dark square.
                square.classList.add("checkerSquareAlt"); // Applies dark square style.
                square.addEventListener("dragover", allowDrop); // Allows pieces to be dragged over.
                square.addEventListener("drop", dropPiece); // Handles piece dropping.

                if (row < 3) { // First 3 rows, red pieces.
                    createPiece("piece" + pieceIdCounter, "redPiece", square);
                    pieceIdCounter++;
                } else if (row > 4) { // Last 3 rows, gray pieces.
                    createPiece("piece" + pieceIdCounter, "grayPiece", square);
                    pieceIdCounter++;
                }
            }
            board.appendChild(square); // Adds the square to the board.
        }
    }
}

// Initialize the game.
initBoard();
