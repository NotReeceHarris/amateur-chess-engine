const pieces = {
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

let selectedPeice,
whosMove = 'white';

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

function onBoard (x,y) {
    return x < 8 && x >= 0 && y <= 8 && y > 0 
}

function getLegalMoves (notation) {

    const pieces = getPiece(notation);
    if (pieces == null) return [];

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
    },

    color = pieces.includes("white") ? "white" : "black",
    opponentColor = color === "white" ? "black" : "white";

    if (color != whosMove) return [];

    // ===============
    //      LOGIC
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
        for (let yy = y+1; yy < 9; yy++) { // Above
            const piece = getPiece(`${x}${yy}`)
            if (piece && piece.includes(color)) break;

            legalMoves.push(`${x}${yy}`)
            if (piece && piece.includes(opponentColor)) {
                legalMoves.push(`${x}${yy}`)
                break;
            }
        } for (let yy = y-1; yy > 0; yy--) { // Below
            const piece = getPiece(`${x}${yy}`)
            if (piece && piece.includes(color)) break;

            legalMoves.push(`${x}${yy}`)
            if (piece && piece.includes(opponentColor)) {
                legalMoves.push(`${x}${yy}`)
                break;
            }
        } for (let xx = reverseLetter(x)-1; xx > -1; xx--) { // Left
            const piece = getPiece(`${getLetter(xx)}${y}`)
            if (piece && piece.includes(color)) break;

            legalMoves.push(`${getLetter(xx)}${y}`)
            if (piece && piece.includes(opponentColor)) {
                legalMoves.push(`${getLetter(xx)}${y}`)
                break;
            }

        } for (let xx = reverseLetter(x)+1; xx < 8; xx++) { // Right
            const piece = getPiece(`${getLetter(xx)}${y}`)
            if (piece && piece.includes(color)) break;

            legalMoves.push(`${getLetter(xx)}${y}`)
            if (piece && piece.includes(opponentColor)) {
                legalMoves.push(`${getLetter(xx)}${y}`)
                break;
            }
        }
    }

    if (pieces.includes('Knight')) {

        const tl = `${getLetter(reverseLetter(x)+1)}${y + 2}`
        const tr = `${getLetter(reverseLetter(x)-1)}${y + 2}`
        const rt = `${getLetter(reverseLetter(x)+2)}${y + 1}`
        const rb = `${getLetter(reverseLetter(x)+2)}${y - 1}`
        const bl = `${getLetter(reverseLetter(x)+1)}${y - 2}`
        const br = `${getLetter(reverseLetter(x)-1)}${y - 2}`
        const lt = `${getLetter(reverseLetter(x)-2)}${y + 1}`
        const lb = `${getLetter(reverseLetter(x)-2)}${y - 1}`

        if (onBoard(reverseLetter(x)+1, y+2)) {
            const piece = getPiece(tl)
            if (!piece || piece && !isOccupiedByColor(piece, color)) legalMoves.push(tl);
        } if (onBoard(reverseLetter(x)-1, y+2)) {
            const piece = getPiece(tr)
            if (!piece || piece && !isOccupiedByColor(piece, color)) legalMoves.push(tr);
        } if (onBoard(reverseLetter(x)+2, y+1)) {
            const piece = getPiece(rt)
            if (!piece || piece && !isOccupiedByColor(piece, color)) legalMoves.push(rt);
        } if (onBoard(reverseLetter(x)+2, y-1)) {
            const piece = getPiece(rb)
            if (!piece || piece && !isOccupiedByColor(piece, color)) legalMoves.push(rb);
        } if (onBoard(reverseLetter(x)+1, y-2)) {
            const piece = getPiece(bl)
            if (!piece || piece && !isOccupiedByColor(piece, color)) legalMoves.push(bl);
        } if (onBoard(reverseLetter(x)-1, y-2)) {
            const piece = getPiece(br)
            if (!piece || piece && !isOccupiedByColor(piece, color)) legalMoves.push(br);
        } if (onBoard(reverseLetter(x)-2, y+1)) {
            const piece = getPiece(lt)
            if (!piece || piece && !isOccupiedByColor(piece, color)) legalMoves.push(lt);
        } if (onBoard(reverseLetter(x)-2, y-1)) {
            const piece = getPiece(lb)
            if (!piece || piece && !isOccupiedByColor(piece, color)) legalMoves.push(lb);
        }
    }

    if (pieces.includes('Bishop')) {

        let nw = true, sw = true, se = true, ne = true

        for (let d = 1; d < 8; d++) {
            const yy = [y+d, y-d]
            const xx = [reverseLetter(x)+d, reverseLetter(x)-d]

            if (onBoard(xx[0], yy[0]) && nw) {
                const piece = getPiece(`${getLetter(xx[0])}${yy[0]}`)

                if (!piece) {
                    legalMoves.push(`${getLetter(xx[0])}${yy[0]}`);
                } else if (piece && !isOccupiedByColor(piece, color)) {
                    legalMoves.push(`${getLetter(xx[0])}${yy[0]}`);
                    nw = false
                } else {
                    nw = false
                }
            } 

            if (onBoard(xx[1], yy[1]) && se) {
                const piece = getPiece(`${getLetter(xx[1])}${yy[1]}`)

                if (!piece) {
                    legalMoves.push(`${getLetter(xx[1])}${yy[1]}`);
                } else if (piece && !isOccupiedByColor(piece, color)) {
                    legalMoves.push(`${getLetter(xx[1])}${yy[1]}`);
                    se = false
                } else {
                    se = false
                }
            } 

            if (onBoard(xx[1], yy[0]) && ne) {
                const piece = getPiece(`${getLetter(xx[1])}${yy[0]}`)

                if (!piece) {
                    legalMoves.push(`${getLetter(xx[1])}${yy[0]}`);
                } else if (piece && !isOccupiedByColor(piece, color)) {
                    legalMoves.push(`${getLetter(xx[1])}${yy[0]}`);
                    ne = false
                } else {
                    ne = false
                }
            } 

            if (onBoard(xx[0], yy[1]) && sw) {
                const piece = getPiece(`${getLetter(xx[0])}${yy[1]}`)

                if (!piece) {
                    legalMoves.push(`${getLetter(xx[0])}${yy[1]}`);
                } else if (piece && !isOccupiedByColor(piece, color)) {
                    legalMoves.push(`${getLetter(xx[0])}${yy[1]}`);
                    sw = false
                } else {
                    sw = false
                }
            } 

        }

    }
    
    return legalMoves;
}

function movePeice(from, to) {

    from = from.split('');
    to = to.split('');

    fromCoor = [7 - (parseInt(from[1]) -1), ['a','b','c','d','e','f','g','h'].indexOf(from[0])];
    toCoor = [7 - (parseInt(to[1]) -1), ['a','b','c','d','e','f','g','h'].indexOf(to[0])];
    
    fromBoard = board[fromCoor[0]][fromCoor[1]]
    toBoard = board[toCoor[0]][toCoor[1]]

    if (toBoard) {
        console.log('Taken')
        
        const img = document.createElement("img");
        img.src = pieces[board[toCoor[0]][toCoor[1]]]
        img.classList.add('w-[18.75px]', 'md:w-[25px]')

        if (board[toCoor[0]][toCoor[1]].includes('white')) {
            document.getElementById('taken-pieces-black').append(img)
        } else {
            document.getElementById('taken-pieces-white').append(img)
        }

        taken.push(toBoard)
        board[toCoor[0]][toCoor[1]] = ""
    }

    if (fromBoard.includes('white')) whosMove = 'black';
    if (fromBoard.includes('black')) whosMove = 'white';

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
        marker.classList.add("bg-red-500", "marker", 'w-full', 'h-full', 'opacity-40', 'absolute', 'top-0', 'left-0');
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
                    const legalMoves = getLegalMoves(selectedPeice);
                    displayLegalMoves(legalMoves);
                });

                square.innerHTML = `<img src="${pieces[board[y][x]]}"  alt="${board[y][x]}">`;
                square.classList.add("cursor-pointer");
            }
            
            if (board[y][x] != "") {
                square.classList.add("cursor-pointer");
            }
    
        }
        
    }
}

displayBoard();