const peices = {
    whiteKing: "/src/png/w_king.png",
    whiteQueen: "/src/png/w_queen.png",
    whiteBishop: "/src/png/w_bishop.png",
    whiteKnight: "/src/png/w_knight.png",
    whiteRook: "/src/png/w_rook.png",
    whitePawn: "/src/png/w_pawn.png",
    blackKing: "/src/png/b_king.png",
    blackQueen: "/src/png/b_queen.png",
    blackBishop: "/src/png/b_bishop.png",
    blackKnight: "/src/png/b_knight.png",
    blackRook: "/src/png/b_rook.png",
    blackPawn: "/src/png/b_pawn.png",
}, board = [
    ["blackRook", "blackKnight", "blackBishop", "blackQueen", "blackKing", "blackBishop", "blackKnight", "blackRook"],
    ["blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn"],
    ["whiteRook", "whiteKnight", "whiteBishop", "whiteQueen", "whiteKing", "whiteBishop", "whiteKnight", "whiteRook"],
], taken = [];

let selectedPeice;

function getPiece(notation) {
    const x = ['a','b','c','d','e','f','g','h'].indexOf(notation.split('')[0]);
    const y = (7 - notation.split('')[1]) + 1;
    return board[y][x] || null;
}

function getLetter (i) {
    return ['a','b','c','d','e','f','g','h'][i];
}

function reverseLetter (i) {
    return  ['a','b','c','d','e','f','g','h'].indexOf(i);
}

function isOccupiedByColor (cell, color) { 
    return cell.includes(color);
}

function getLegalMoves (notation) {

    const pieces = getPiece(notation);
    if (pieces == null) return;

    const legalMoves = [],

    x = notation.split('')[0],
    y = parseInt(notation.split('')[1]),

    north = `${x}${y + 1}`,
    east = `${getLetter(reverseLetter(x) + 1)}${y}`,
    south = `${x}${y - 1}`,
    west = `${getLetter(reverseLetter(x) - 1)}${y}`,

    nw = `${getLetter(reverseLetter(x) - 1)}${y+1}`,
    sw = `${getLetter(reverseLetter(x) - 1)}${y-1}`,
    ne = `${getLetter(reverseLetter(x) + 1)}${y+1}`,
    se = `${getLetter(reverseLetter(x) + 1)}${y-1}`,

    surroundings = {
        north: y != 8 ? getPiece(north) : null,
        east: x != 'h' ? getPiece(east) : null,
        south: y != 1 ? getPiece(south) : null,
        west: x != 'a' ? getPiece(west) : null,
        nw: x != 'a' && y != 8 ? getPiece(nw) : null,
        sw: x != 'a' && y != 1 ? getPiece(sw) : null,
        ne: x != 'h' && y != 8 ? getPiece(ne) : null,
        se: x != 'h' && y != 1 ? getPiece(se) : null,
    }

    const color = pieces.includes("white") ? "white" : "black";
    const opponentColor = color === "white" ? "black" : "white";

    // ===============
    //     LOGIC
    // ===============

    if (pieces.includes("Pawn")) {

        if (color === 'white') {

            if (!surroundings.north) {
                legalMoves.push(north)
                if (y === 2 && !getPiece(`${x}${y + 2}`)) legalMoves.push(`${x}${y + 2}`);
            }

            if (surroundings.nw && isOccupiedByColor(surroundings.nw, opponentColor)) legalMoves.push(nw);
            if (surroundings.ne && isOccupiedByColor(surroundings.ne, opponentColor)) legalMoves.push(ne);
        
        } else {

            if (!surroundings.south) {
                legalMoves.push(south)
                if (y === 7  && !getPiece(`${x}${y - 2}`)) legalMoves.push(`${x}${y - 2}`);
            }

            if (surroundings.sw && isOccupiedByColor(surroundings.sw, 'white')) legalMoves.push(sw);
            if (surroundings.se && isOccupiedByColor(surroundings.se, 'white')) legalMoves.push(se);
        
        }

    }

    if (pieces.includes('Rook')) {
        if (color === 'white') {

             // Above
             for (let yy = y+1; yy < 9; yy++) {
                const peice = getPiece(`${x}${yy}`)
                if (peice && peice.includes('white')) break;

                legalMoves.push(`${x}${yy}`)
                if (peice && peice.includes('black')) {
                    legalMoves.push(`${x}${yy}`)
                    break;
                }
            }

            // Below
            for (let yy = y-1; yy > 0; yy--) {
                const peice = getPiece(`${x}${yy}`)
                if (peice && peice.includes('white')) break;

                legalMoves.push(`${x}${yy}`)
                if (peice && peice.includes('black')) {
                    legalMoves.push(`${x}${yy}`)
                    break;
                }
            }

            // Left
            for (let xx = reverseLetter(x)-1; xx > -1; xx--) {
                const peice = getPiece(`${getLetter(xx)}${y}`)
                if (peice && peice.includes('white')) break;

                legalMoves.push(`${getLetter(xx)}${y}`)
                if (peice && peice.includes('black')) {
                    legalMoves.push(`${getLetter(xx)}${y}`)
                    break;
                }

            }

            // Right
            for (let xx = reverseLetter(x)+1; xx < 8; xx++) {
                const peice = getPiece(`${getLetter(xx)}${y}`)
                if (peice && peice.includes('white')) break;

                legalMoves.push(`${getLetter(xx)}${y}`)
                if (peice && peice.includes('black')) {
                    legalMoves.push(`${getLetter(xx)}${y}`)
                    break;
                }
            }

        } else {

            // Above
            for (let yy = y+1; yy < 9; yy++) {
                const peice = getPiece(`${x}${yy}`)
                if (peice && peice.includes('black')) break;

                legalMoves.push(`${x}${yy}`)
                if (peice && peice.includes('white')) {
                    legalMoves.push(`${x}${yy}`)
                    break;
                }
            }

            // Below
            for (let yy = y-1; yy > 0; yy--) {
                const peice = getPiece(`${x}${yy}`)
                if (peice && peice.includes('black')) break;

                legalMoves.push(`${x}${yy}`)
                if (peice && peice.includes('white')) {
                    legalMoves.push(`${x}${yy}`)
                    break;
                }
            }

            // Left
            for (let xx = reverseLetter(x)-1; xx > -1; xx--) {
                const peice = getPiece(`${getLetter(xx)}${y}`)
                if (peice && peice.includes('black')) break;

                legalMoves.push(`${getLetter(xx)}${y}`)
                if (peice && peice.includes('white')) {
                    legalMoves.push(`${getLetter(xx)}${y}`)
                    break;
                }

            }

            // Right
            for (let xx = reverseLetter(x)+1; xx < 8; xx++) {
                const peice = getPiece(`${getLetter(xx)}${y}`)
                if (peice && peice.includes('black')) break;

                legalMoves.push(`${getLetter(xx)}${y}`)
                if (peice && peice.includes('white')) {
                    legalMoves.push(`${getLetter(xx)}${y}`)
                    break;
                }
            }

        }
    }
    
    return legalMoves;
}

function movePeice(from, to) {

    fromCoor = [];
    toCoor = [];

    from = from.split('');
    to = to.split('');

    fromCoor[0] = 7 - (parseInt(from[1]) -1)
    toCoor[0] = 7 - (parseInt(to[1]) -1)

    fromCoor[1] = ['a','b','c','d','e','f','g','h'].indexOf(from[0])
    toCoor[1] =  ['a','b','c','d','e','f','g','h'].indexOf(to[0])
    
    fromBoard = board[fromCoor[0]][fromCoor[1]]
    toBoard = board[toCoor[0]][toCoor[1]]

    console.log([fromCoor[0], fromCoor[1]], [toCoor[0], toCoor[1]])
    console.log(fromBoard, toBoard)

    if (toBoard) {
        taken.push(toBoard)
        board[toCoor[0]][toCoor[1]] = ""
    }

    board[fromCoor[0]][fromCoor[1]] = ""    
    board[toCoor[0]][toCoor[1]] = fromBoard
    
    displayBoard()
}

function displayLegalMoves (legalMoves) {
    displayBoard()
    const markers = document.querySelectorAll(".marker");
    markers.forEach(marker => {
        marker.parentNode.classList.remove("cursor-pointer");
        if (marker) {
            marker.remove();
        }
    });

    legalMoves.forEach((move) => {
        const square = document.querySelector("." + move);

        const clone = square.cloneNode(true);

        const marker = document.createElement("div");
        marker.classList.add("bg-red-500", "marker", 'w-full', 'h-full', 'opacity-50', 'absolute', 'top-0', 'left-0');
        clone.appendChild(marker);
        clone.classList.add("cursor-pointer");

        clone.addEventListener("click", () => {
            movePeice(selectedPeice, move);
        });

        square.replaceWith(clone);
    });
}

function displayBoard () {

    for (let y = 0; y < 8; y++) {
        const yy = (7 - y) + 1;
        for (let x = 0; x < 8; x++) {
            const xx = ['a','b','c','d','e','f','g','h'][x]

            const square = document.getElementById(`${xx}${yy}`);
            square.classList.remove("square");
            square.classList.remove("cursor-pointer");
            square.innerHTML = "";

            const clone = square.cloneNode(true);
            square.replaceWith(clone);
        }
    }

    for (let y = 0; y < 8; y++) {
        const yy = (7 - y) + 1;
        for (let x = 0; x < 8; x++) {
            const xx = ['a','b','c','d','e','f','g','h'][x]
    
            const square = document.getElementById(`${xx}${yy}`);
            square.classList.add("square");
            square.classList.add(`${xx}${yy}`);
    
            if (board[y][x]) {

                square.addEventListener("click", (e) => {
                    selectedPeice = `${xx}${yy}`
                    getPiece(`${xx}${yy}`);
                    const legalMoves = getLegalMoves(`${xx}${yy}`);
                    displayLegalMoves(legalMoves);
                });

                square.innerHTML = `<img src="${peices[board[y][x]]}" alt="${board[y][x]}">`;
                square.classList.add("cursor-pointer");
            }
            
            if (board[y][x] != "") {
                square.classList.add("cursor-pointer");
            }
    
        }
        
    }
}

displayBoard();