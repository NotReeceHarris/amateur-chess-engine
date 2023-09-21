async function stockfish () {

    const makeRequest = async (fen, player) => {
        const depth = 7;
        
        const xhr = new XMLHttpRequest();
        const timeoutDuration = 3000;
        
        try {
            xhr.onreadystatechange = async function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const data = JSON.parse(xhr.responseText);
                            if (data.success) {
                                let move = data.data;
                                move = move.replace('bestmove ', '');
                                if (move.includes('ponder')) move = move.split('ponder')[0].trim();
    
                                console.log(move, '|', data.data, '|', whosMove, '|', fen);
    
                                chess.move(move);
                                updateStats();
    
                                whosMove = whosMove === 'w' ? 'b' : 'w';
                                refreshBoard();
                                engineMove();
                        } else {
                            console.log('Error in response:', data);
                        }
                    }
                }
            };
            
            xhr.open('GET', `${evaluationAPI}?fen=${fen}&depth=${depth}&mode=bestmove`, true);
            xhr.timeout = timeoutDuration;
            xhr.addEventListener('timeout', function () {
                makeRequest(fen, player);
                xhr.abort();
            });
            
            xhr.send();
        } catch (error) {
            console.log(error)
        }
    }

    if (!chess.isGameOver() && (whosMove === 'w' && whitePlayer === 'stockfish' || whosMove === 'b' && blackPlayer === 'stockfish')) {
        makeRequest(chess.fen(), whosMove);
    }
}

async function random() {
    if (!chess.isGameOver() && (whosMove === 'w' && whitePlayer === 'random' || whosMove === 'b' && blackPlayer === 'random')) {
        console.log('random')
        await new Promise(r => setTimeout(r, 100));

        const moves = chess.moves();
        const move = moves[Math.floor(Math.random() * moves.length)];
        chess.move(move);
        updateStats();
        whosMove = whosMove === 'w' ? 'b' : 'w';
        refreshBoard();
        engineMove();
    }
}