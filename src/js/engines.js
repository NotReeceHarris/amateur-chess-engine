async function stockfish () {

    if (!chess.isCheckmate()) {
        if (whosMove === 'white' && whitePlayer === 'stockfish' || whosMove === 'black' && blackPlayer === 'stockfish') {

    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log(whosMove, 'Stockfishes move')

        const fen = pgn2fen()

        fetch(evaluationAPI + `?fen=${fen[fen.length-2]}&depth=5&mode=bestmove`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {

            console.log(data)

            if (data.success) {

                let move = data.data.replace('bestmove ','')
                if (move.includes('ponder')) move = move.split(' ponder ')[0];

                console.log(move)

                const positions = {
                    from: move.substring(0, 2),
                    to: move.substring(2)
                }

                selectedPeice = positions.from
                movePeice(positions.from, positions.to)

            }
        }).catch((error) => {
            console.log(error)
        })
    }
}
}