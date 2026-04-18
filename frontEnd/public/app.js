const socket = io();

const chessBoard = document.querySelector('chess-board');
const fenElement = document.getElementById('fen');
const evalSource1Element = document.getElementById('evalSource1');
const evalSource2Element = document.getElementById('evalSource2');

// Graph setup
const evalGraph = document.getElementById('evalGraph');
const ctx = evalGraph.getContext('2d');
const MAX_EVALS = 50; // Change x to desired number
let recentEvals1 = [];
let recentEvals2 = [];


function drawEvalGraph() {
    ctx.clearRect(0, 0, evalGraph.width, evalGraph.height);
    
    // Draw axes
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, evalGraph.height / 2);
    ctx.lineTo(evalGraph.width, evalGraph.height / 2);
    ctx.stroke();
    
    // Helper function to draw a line
    function drawLine(evals, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < evals.length; i++) {
            const x = (i / (MAX_EVALS - 1)) * evalGraph.width;
            // Map eval to y: assume range -3500 to +3500
            const minY = -3500;
            const maxY = 3500;
            const y = evalGraph.height - ((evals[i] - minY) / (maxY - minY) * evalGraph.height);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    
    // Draw evalSource1 in blue
    if (recentEvals1.length > 0) {
        drawLine(recentEvals1, '#0ff');
    }
    
    // Draw evalSource2 in red
    if (recentEvals2.length > 0) {
        drawLine(recentEvals2, '#f00');
    }
}

function displayResults(resultsDict) {
    console.log('displayResults called with:', resultsDict);
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = '';
    
    for (const [outcome, count] of Object.entries(resultsDict)) {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-label">${outcome}</div>
            <div class="result-value">${count}</div>
        `;
        resultsGrid.appendChild(resultItem);
    }
}


socket.on('chess-update', ({ fen, evalSource1, evalSource2, results}) => {
    chessBoard.setPosition(fen);
    fenElement.textContent = fen;
    evalSource1Element.textContent = evalSource1;
    evalSource2Element.textContent = evalSource2;

    // Track evals for both sources
    let evalNum1 = parseFloat(evalSource1);
    if (!isNaN(evalNum1)) {
        recentEvals1.push(evalNum1);
        if (recentEvals1.length > MAX_EVALS) recentEvals1.shift();
    }
    
    let evalNum2 = parseFloat(evalSource2);
    if (!isNaN(evalNum2)) {
        recentEvals2.push(evalNum2);
        if (recentEvals2.length > MAX_EVALS) recentEvals2.shift();
    }

    drawEvalGraph();
    
    console.log('Results object:', results);
    console.log('Results truthy?', !!results);
    if (results) {
        console.log('Calling displayResults with:', results);
        displayResults(results);
    } else {
        console.log('No results received');
    }
});

// Request initial state
socket.emit('request-initial-state');