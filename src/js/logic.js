function isMoveValid(board, fromRow, fromCol, toRow, toCol) {
    // Check if the source square is empty or out of bounds
    if (fromRow < 0 || fromRow >= 8 || fromCol < 0 || fromCol >= 8 || board[fromRow][fromCol] === "") {
        return false;
    }

    // Get the piece at the source square
    const piece = board[fromRow][fromCol];

    // Check if the destination square is out of bounds
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) {
        return false;
    }

    // Get the piece at the destination square
    const targetPiece = board[toRow][toCol];

    // Implement rules for each piece type
    switch (piece) {
        case "whitePawn":
            // Valid pawn move: one square forward (non-capturing) or one square diagonally (capturing)
            const isCapture = Math.abs(fromCol - toCol) === 1 && toRow === fromRow - 1;
            const isMoveForward = toCol === fromCol && toRow === fromRow - 1;
            return (isCapture || isMoveForward) && !targetPiece;

        case "blackPawn":
            // Valid pawn move for black pawns (similar to white pawns but in the opposite direction)
            const isBlackCapture = Math.abs(fromCol - toCol) === 1 && toRow === fromRow + 1;
            const isBlackMoveForward = toCol === fromCol && toRow === fromRow + 1;
            return (isBlackCapture || isBlackMoveForward) && !targetPiece;

        case "whiteRook":
        case "blackRook":
            // Valid rook move: horizontal or vertical movement without jumping over pieces
            return (fromRow === toRow || fromCol === toCol) && !isPathBlocked(board, fromRow, fromCol, toRow, toCol);

        case "whiteKnight":
        case "blackKnight":
            // Valid knight move: L-shaped movement (2 squares in one direction and 1 square perpendicular)
            const dx = Math.abs(fromCol - toCol);
            const dy = Math.abs(fromRow - toRow);
            return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);

        case "whiteBishop":
        case "blackBishop":
            // Valid bishop move: diagonal movement without jumping over pieces
            return Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol) && !isPathBlocked(board, fromRow, fromCol, toRow, toCol);

        case "whiteQueen":
        case "blackQueen":
            // Valid queen move: combines rook and bishop movement
            return ((fromRow === toRow || fromCol === toCol) || (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol))) && !isPathBlocked(board, fromRow, fromCol, toRow, toCol);

        case "whiteKing":
        case "blackKing":
            // Valid king move: one square in any direction
            return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;

        default:
            // Handle unknown piece types or errors
            return false;
    }
}

// Helper function to check if the path between two squares is blocked
function isPathBlocked(board, fromRow, fromCol, toRow, toCol) {
    const dx = Math.sign(toCol - fromCol);
    const dy = Math.sign(toRow - fromRow);

    for (let row = fromRow + dy, col = fromCol + dx; row !== toRow || col !== toCol; row += dy, col += dx) {
        if (board[row][col] !== "") {
            return true; // Path is blocked
        }
    }

    return false; // Path is clear
}
