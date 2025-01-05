const socket = io();

const chessBoard = document.querySelector('chess-board');
const fenElement = document.getElementById('fen');
const evalSource1Element = document.getElementById('evalSource1');
const evalSource2Element = document.getElementById('evalSource2');
const evalIndicator1 = document.getElementById('evalIndicator1');
const evalIndicator2 = document.getElementById('evalIndicator2');

function updateEvalBar(evalValue, indicator) {
    // Convert eval from -1 to 1 range to 0 to 100% for positioning
    const percentage = (1 - (parseFloat(evalValue) + 1) / 2) * 100;
    indicator.style.top = `${percentage}%`;
}

socket.on('chess-update', ({ fen, evalSource1, evalSource2 }) => {
    chessBoard.setPosition(fen);
    fenElement.textContent = fen;
    evalSource1Element.textContent = evalSource1;
    evalSource2Element.textContent = evalSource2;
    
    updateEvalBar(evalSource1, evalIndicator1);
    updateEvalBar(evalSource2, evalIndicator2);
});

// Request initial state
socket.emit('request-initial-state');