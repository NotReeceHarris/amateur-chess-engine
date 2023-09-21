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
}, evaluationAPI = "https://stockfish.online/api/stockfish.php";

let whitePlayer = 'human', blackPlayer = 'human', whosMove = 'w', selectedPeice;

function extractPosition(moves) {

    console.log(moves)
    let positions = [];

    for (let i = 0; i < moves.length; i++) {
        const move = moves[i].replace("+", "").replace("#", "").replace("x", "");
        if (move === "O-O") {
            if (whosMove === 'w') positions.push("g1");
            if (whosMove === 'b') positions.push("g8");
            continue;
        } else if (move === "O-O-O") {
            if (whosMove === 'w') positions.push("c1");
            if (whosMove === 'b') positions.push("c8");
            continue;
        };

        if (move.includes('=')) {
            positions.push(move.split('=')[0].slice(-2));
            continue;
        }

        positions.push(move.slice(-2));
    }

    return positions;
}

function displayLegalMoves (legalMoves) {

    refreshBoard()
    document.querySelectorAll(".marker").forEach((marker) => {
        marker.parentNode.classList.remove("cursor-pointer");
        if (marker) marker.remove();
    });

    legalMoves.forEach((move) => {

        const square = document.querySelector("." + move);
        const clone = square.cloneNode(true);
        const marker = document.createElement("div");

        marker.classList.add("bg-red-500", "marker", 'w-full', 'h-full', 'opacity-40', 'absolute', 'top-0', 'left-0');
        clone.appendChild(marker);

        clone.addEventListener("click", () => {

            whosMove = whosMove === 'w' ? 'b' : 'w';
            const toCoor = [7 - (parseInt(move.split('')[1]) -1), ['a','b','c','d','e','f','g','h'].indexOf(move.split('')[0])]
            const fromCoor = [7 - (parseInt(selectedPeice.split('')[1]) -1), ['a','b','c','d','e','f','g','h'].indexOf(selectedPeice.split('')[0])]
            const piece = chess.board()[toCoor[0]][toCoor[1]];
            const selected = chess.board()[fromCoor[0]][fromCoor[1]];

            if (piece) {
                const img = document.createElement('img')
                img.src = pieces[piece.type][piece.color]
                img.classList.add('w-[18.75px]', 'md:w-[25px]')

                if (piece.color === 'w') document.getElementById('taken-pieces-black').append(img);
                if (piece.color === 'b') document.getElementById('taken-pieces-white').append(img);
            }

            if ([1,8].includes(parseInt(move.split('')[1])) && selected.type === 'p') {

                refreshBoard(false);

                const div = document.createElement("div");
                div.id = 'pawn-promotion';
                div.classList.add('drop-shadow-xl', 'w-full', 'h-[150px]', 'md:h-[200px]', 'absolute', `${whosMove === 'b' ? 'top' : 'bottom'}-0`, 'left-0', 'bg-[rgba(34,34,34,0.8)]', 'z-[11]', 'grid', 'grid-rows-[repeat(4,1fr)]', 'border', 'border-white');

                [`q`, `n`, `r`, `b`].forEach((piece) => {
                    const img = document.createElement("img");
                    img.id = piece
                    img.src = pieces[piece][whosMove]
                    img.classList.add('w-full', 'cursor-pointer', 'hover:scale-110', 'transition', 'duration-200', 'ease-in-out')

                    img.addEventListener('click', function() {
                        chess.move(
                            (chess.board()[toCoor[0]][toCoor[1]] ? selectedPeice.split('')[0] + 'x' : '') + move + '=' + piece.toUpperCase()
                        )

                        if (document.getElementById('show-evaluations').checked) {
                            const history = chess.history({ verbose: true })
            
                            fetch(evaluationAPI + `?fen=${history[history.length-1].after}&depth=1&mode=eval`)
                            .then(response => {
                                if (!response.ok) {
                                throw new Error("Network response was not ok");
                                }
                                return response.json();
                            })
                            .then(data => {
                                if (data.success) {
                                    document.getElementById('evaluation').innerText = data.data
                                } else {
                                    document.getElementById('evaluation').innerText = 'N/A'
                                }
                            })
                            .catch(error => {
                                console.log(error)
                            });
                        }
            
                        document.getElementById('notation').innerText = chess.pgn()
                        document.getElementById('fen-output').innerText = chess.history({ verbose: true }).map((history) => {return history.after}).join('\n')
                        document.getElementById('fen-output').parentElement.classList.remove('hidden')

                        refreshBoard();
                    })

                    div.append(img)
                });

                document.querySelector(`.${move}`).append(div)
                return;
            }

            chess.move({ from: selectedPeice, to: move })

            if (document.getElementById('show-evaluations').checked) {
                const history = chess.history({ verbose: true })

                fetch(evaluationAPI + `?fen=${history[history.length-1].after}&depth=1&mode=eval`)
                .then(response => {
                    if (!response.ok) {
                    throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        document.getElementById('evaluation').innerText = data.data
                    } else {
                        document.getElementById('evaluation').innerText = 'N/A'
                    }
                })
                .catch(error => {
                    console.log(error)
                });
            }

            document.getElementById('notation').innerText = chess.pgn()
            document.getElementById('fen-output').innerText = chess.history({ verbose: true }).map((history) => {return history.after}).join('\n')
            document.getElementById('fen-output').parentElement.classList.remove('hidden')

            refreshBoard();
        });

        clone.classList.add("cursor-pointer");
        square.replaceWith(clone);
    });
}

function refreshBoard(events=true) {

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

                const img = document.createElement('img')
                img.src = pieces[piece.type][piece.color]

                if (!chess.isCheckmate()) {
                    if (piece.color === 'w' && whitePlayer === 'human' || piece.color === 'b' && blackPlayer === 'human') {
                        if (events) {
                            square.addEventListener("click", (e) => {
                                selectedPeice = `${xx}${yy}`
                                displayLegalMoves(extractPosition(chess.moves({ square: selectedPeice })));
                            });
                            if (piece.color === 'w' && whosMove === 'w' || piece.color === 'b' && whosMove === 'b') img.classList.add('cursor-pointer', 'hover:scale-110', 'transition', 'duration-200', 'ease-in-out');
                        }
                    }
                }
                square.append(img)
            }
    
        }
        
    }

    if (chess.isGameOver()) {
        const chessboard = document.getElementById('chessboard')

        const div = document.createElement('div')
        div.classList.add('absolute', 'w-full', 'z-10', 'top-0', 'left-0', 'flex', 'h-full', 'bg-[rgba(0,0,0,0.5)]')

        div.innerHTML = `
            <div class="w-full bg-[rgba(0,0,0,0.8)] self-center text-center py-5 text-white">${whosMove === 'w' ? 'Black' : 'White'} ${chess.isCheckmate() ? 'wins' : (chess.isStalemate() ? 'stalemate' : 'draw' )}</div>
        `

        chessboard.append(div)

    }

}