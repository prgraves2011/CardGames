let currentGame = null;

function loadGame(gameName) {
    // update active button
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn-${gameName}`).classList.add('active');

    // clear game container
    const container = document.getElementById('game-container');
    container.innerHTML = '';

    //load selected game
    if (gameName === 'freecell') {
        loadFreecell(container);
    } else if (gameName === 'solitaire') {
        loadSolitaire(container);
    }

    currentGame = gameName;
}

// load initial game - freecell
loadGame('freecell');

// FREECELL loader
function loadFreecell(container) {

    //  create top row
    const topRow = document.createElement('div');
    topRow.className = 'top-row';
    container.appendChild(topRow);

    // create freecell-set
    const freecellSet = document.createElement ('div');
    topRow.appendChild(freecellSet);

    // create foundation-set
    const foundationSet = document.createElement ('div');
    topRow.appendChild(foundationSet);

    // create FOUR freecells
    for (let i = 0; i < 4; i++) {
        const cell = document.createElement ('div');
        cell.className = 'freecell';
        cell.id = `freecell-${i}`;
        freecellSet.appendChild(cell);
    }

    // create foundations
    for (let i = 0; i < 4; i++) {
        const cell = document.createElement ('div');
        cell.className = 'foundation';
        cell.id = `foundation-${i}`;
        foundationSet.appendChild(cell);
    }

    // create tableau
    const tableau = document.createElement ('div');
    container.appendChild(tableau);

    // create columns
    for (let i = 0; i < 8; i++) {
        const column = document.createElement ('div');
        column.className = 'column';
        column.id = `col-${i}`;
        tableau.appendChild(column);
    }
}

// SOLITAIRE loader
function loadSolitaire(container) {
    // JS here
}