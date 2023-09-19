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
    ["blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn", "blackPawn"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn", "whitePawn"],
    ["whiteRook", "whiteKnight", "whiteBishop", "whiteQueen", "whiteKing", "whiteBishop", "whiteKnight", "whiteRook"],
];

function getPeice (notation) {
    const x = ['a','b','c','d','e','f','g','h'].indexOf(notation.split('')[0]);
    const y = (7 - notation.split('')[1]) + 1;
    return board[y][x] || null;
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
            legalMoves.push(`${x}${y + 1}`, `${x}${y + 2}`)
        } else {
            legalMoves.push(`${x}${y - 1}`, `${x}${y - 2}`)
        }
    }
    
    return legalMoves;
}

function movePeice(from, to) {

    from = from.split('');
    to = to.split('');

    console.log(from, to)
    
}

function displayLegalMoves (legalMoves) {
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
            movePeice(document.querySelector(".selected").id, move);
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
                    square.classList.add("selected");

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