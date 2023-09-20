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
};

const board = [
    ["blackRook", "blackKnight", "blackBishop", "blackQueen", "blackKing", "blackBishop", "blackKnight", "blackRook"],
    ["blackPawn", "", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn"],
    ["whiteRook", "whiteKnight", "whiteBishop", "whiteQueen", "whiteKing", "whiteBishop", "whiteKnight", "whiteRook"],
];

let selectedPeice;

function getPeice (notation) {
    const x = ['a','b','c','d','e','f','g','h'].indexOf(notation.split('')[0]);
    const y = (7 - notation.split('')[1]) + 1;
    return board[y][x] || null;
}

function getLetter (i) {
    return ['a','b','c','d','e','f','g','h'][i]
}

function reverseLetter (i) {
    return  ['a','b','c','d','e','f','g','h'].indexOf(i)
}

function getLegalMoves (notation) {

    const x = notation.split('')[0];
    const y = parseInt(notation.split('')[1]);

    const peices = getPeice(notation);

    if (peices == null) {
        return;
    }

    const legalMoves = [];

    if (peices.includes("Pawn")) {
        if (peices.includes("white")) {

            // If theres a no peice infront of it
            if (!getPeice(`${x}${y+1}`)) {
                legalMoves.push(`${x}${y + 1}`)
                // Move twice if first move
                if (y === 2) legalMoves.push(`${x}${y + 2}`);
            }

            console.log({
                front: getPeice(`${x}${y + 1}`),
                back: getPeice(`${x}${y - 1}`),
                left: getPeice(`${getLetter(reverseLetter(x) - 1)}${y}`),
                right: getPeice(`${getLetter(reverseLetter(x) + 1)}${y}`),
            })

        } else {

            // If theres a no peice infront of it
            if (!getPeice(`${x}${y-1}`)) {
                legalMoves.push(`${x}${y - 1}`)
                // Move twice if first move
                if (y === 7) legalMoves.push(`${x}${y - 2}`);
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
    

    board[toCoor[0]][toCoor[1]] = board[fromCoor[0]][fromCoor[1]]
    board[fromCoor[0]][fromCoor[1]] = ""
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
        const marker = document.createElement("div");
        marker.classList.add("bg-red-500", "marker", 'w-full', 'h-full', 'opacity-50', 'absolute', 'top-0', 'left-0');
        square.appendChild(marker);
        square.classList.add("cursor-pointer");

        square.addEventListener("click", () => {
            movePeice(selectedPeice, move);
        });

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
                    getPeice(`${xx}${yy}`);
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