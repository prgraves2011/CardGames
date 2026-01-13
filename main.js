let currentGame = null;

function loadGame(gameName) {

    //check chosen game is active ==> if so, do nothing, else, load new game
    if (currentGame === gameName) {
        return;
    } else{
        // assign active game
        currentGame = gameName;
        
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
    }
}

// reset current game
function resetCurrentGame() {
    if (currentGame === 'freecell') {
        dealFreecell();
    } else if (currentGame === 'solitaire') {
        dealSolitaire();
    }
}

// FREECELL loader
function loadFreecell(container) {

    //  create top row
    const topRow = document.createElement('div');
    topRow.className = 'top-row';
    container.appendChild(topRow);

    // create freecell-set
    const freecellSet = document.createElement ('div');
    freecellSet.className = 'freecells';
    topRow.appendChild(freecellSet);

    // create foundation-set
    const foundationSet = document.createElement ('div');
    foundationSet.className = 'foundations';
    topRow.appendChild(foundationSet);

    // create FOUR freecells
    for (let i = 0; i < 4; i++) {
        const cell = document.createElement ('div');
        cell.className = 'freecell';
        cell.id = `freecell-${i}`;
        freecellSet.appendChild(cell);
    }

    // create FOUR foundations
    for (let i = 0; i < 4; i++) {
        const cell = document.createElement ('div');
        cell.className = 'foundation';
        cell.id = `foundation-${i}`;
        foundationSet.appendChild(cell);
    }

    // create tableau
    const tableau = document.createElement ('div');
    tableau.className = 'tableau';
    container.appendChild(tableau);

    // create columns
    for (let i = 0; i < 8; i++) {
        const column = document.createElement ('div');
        column.className = 'column';
        column.id = `col-${i}`;
        tableau.appendChild(column);
    }

    // deal freecell after DOM is built
    dealFreecell();
}

// SOLITAIRE loader
function loadSolitaire(container) {
    // JS here
    // initSolitaire();
}

// open listener - for theme switcher
document.addEventListener('DOMContentLoaded', () => {

    // theme switching
    const themeButtons = document.querySelectorAll('.theme-btn');

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {

            // remove active class from all buttons
            themeButtons.forEach(b => b.classList.remove('active'));

            // add active class to clicked button
            btn.classList.add('active');

            // apply theme to root element
            const theme = btn.dataset.theme;
            document.documentElement.setAttribute('data-theme', theme);

        })
    })

// close listener
});