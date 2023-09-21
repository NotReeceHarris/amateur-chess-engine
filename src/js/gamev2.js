// https://github.com/jhlywa/chess.js/blob/master/README.md#board

const chess = new Chess()

const pieces = {

    r: {
        w: "/src/png/w_rook.png",
        b: "/src/png/b_rook.png"
    },
    n: {
        w: "/src/png/w_knight.png",
        b: "/src/png/b_knight.png",
    },
    b: {
        w: "/src/png/w_bishop.png",
        b: "/src/png/b_bishop.png",
    },
    q: {
        w: "/src/png/w_queen.png",
        b: "/src/png/b_queen.png",
    },
    k: {
        w: "/src/png/w_king.png",
        b: "/src/png/b_king.png",
    },
    p: {
        w: "/src/png/w_pawn.png",
        b: "/src/png/b_pawn.png",
    }
}

let whitePlayer = 'human', blackPlayer = 'human', whosMove = 'white';

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

        console.log(move)

        const square = document.querySelector("." + move);

        const clone = square.cloneNode(true);

        const marker = document.createElement("div");
        marker.classList.add("bg-red-500", "marker", 'w-full', 'h-full', 'opacity-40', 'absolute', 'top-0', 'left-0');
        clone.appendChild(marker);
        clone.classList.add("cursor-pointer");

        clone.addEventListener("click", () => {
            chess.move({ from: selectedPeice, to: move })
            whosMove = whosMove === 'white' ? 'black' : 'white';
            displayBoard()
        });

        square.replaceWith(clone);
    });
}

function displayBoard() {

    const board = chess.board()

    for (let y = 0; y < 8; y++) {
        const yy = (7 - y) + 1;
        for (let x = 0; x < 8; x++) {
            const xx = ['a','b','c','d','e','f','g','h'][x]

            const square = document.getElementById(`${xx}${yy}`);
            square.innerHTML = "";

            const clone = square.cloneNode(true);
            square.replaceWith(clone);
        }
    }

    for (let y = 0; y < 8; y++) {
        const yy = (7 - y) + 1;
        for (let x = 0; x < 8; x++) {
            const xx = ['a','b','c','d','e','f','g','h'][x]

            const piece = board[y][x];
    
            const square = document.getElementById(`${xx}${yy}`);
            square.classList.add(`${xx}${yy}`);
            square.classList.remove('cursor-pointer')
    
            if (piece) {

                square.innerHTML = `<img src="${pieces[piece.type][piece.color]}"  alt="${piece.type}">`;

                if (!chess.isCheckmate()) {
                    if (piece.color === 'w' && whitePlayer === 'human' || piece.color === 'b' && blackPlayer === 'human') {
                        square.addEventListener("click", (e) => {
                            selectedPeice = `${xx}${yy}`
                            const legalMoves = chess.moves({ square: selectedPeice });
                            displayLegalMoves(legalMoves);
                        });
    
                        if (piece.color === 'w' && whosMove === 'white' || piece.color === 'b' && whosMove === 'black') {
                            square.classList.add('cursor-pointer')
                        }
                    }
                }
            }
    
        }
        
    }
}