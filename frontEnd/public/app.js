const socket = io();

const chessBoard = document.querySelector('chess-board');
const fenElement = document.getElementById('fen');
const evalSource1Element = document.getElementById('evalSource1');
const evalSource2Element = document.getElementById('evalSource2');

// Graph setup
const evalGraph = document.getElementById('evalGraph');
const ctx = evalGraph.getContext('2d');
const MAX_EVALS = 50; // Change x to desired number
let recentEvals = [];

function drawEvalGraph() {
    ctx.clearRect(0, 0, evalGraph.width, evalGraph.height);
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < recentEvals.length; i++) {
        const x = (i / (MAX_EVALS - 1)) * evalGraph.width;
        // Map eval to y: assume range -5 to +5
        const minY = -1500
        const maxY = 1500
        const y = evalGraph.height - ((recentEvals[i] - minY) / (maxY - minY) * evalGraph.height);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    // Draw axes
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, evalGraph.height / 2);
    ctx.lineTo(evalGraph.width, evalGraph.height / 2);
    ctx.stroke();
}

socket.on('chess-update', ({ fen, evalSource1, evalSource2}) => {
    chessBoard.setPosition(fen);
    fenElement.textContent = fen;
    evalSource1Element.textContent = evalSource1;
    evalSource2Element.textContent = evalSource2;

    // Track evals
    let evalNum = parseFloat(evalSource1);
    if (!isNaN(evalNum)) {
        recentEvals.push(evalNum);
        if (recentEvals.length > MAX_EVALS) recentEvals.shift();
        drawEvalGraph();
    }

});

// Request initial state
socket.emit('request-initial-state');