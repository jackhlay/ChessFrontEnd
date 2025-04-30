const socket = io();

const chessBoard = document.querySelector('chess-board');
const fenElement = document.getElementById('fen');
const evalSource1Element = document.getElementById('evalSource1');
const evalSource2Element = document.getElementById('evalSource2');

socket.on('chess-update', ({ fen, evalSource1, evalSource2}) => {
    chessBoard.setPosition(fen);
    fenElement.textContent = fen;
    evalSource1Element.textContent = evalSource1;
    evalSource2Element.textContent = evalSource2;

});

// Request initial state
socket.emit('request-initial-state');