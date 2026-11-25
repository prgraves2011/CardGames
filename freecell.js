"use strict";

// Helper functions
function isValidStack(stack) { // [elements] => Y/N
    return isValidRun(
        stack.map(
            parseCard
        )
    );
}
function canPlaceStackOnColumn(stack, columnEl) { // [elements], element => Y/N
    // Rule 1: the moving stack itself must be valid
    if (!isValidStack(stack)) return false;

    const cards = columnEl.querySelectorAll('.card');

    // Rule 2: empty column accepts any valid stack
    if (cards.length === 0) return true;

    // Rule 3: otherwise compare against top card
    const movingLead = parseCard(stack[0]);
    const targetTop = parseCard(cards[cards.length - 1]);


    return (
        isValidChild(targetTop,movingLead)
    );
}
function canPlaceOnFoundation(newCard,foundation) { // element, element => Y/N
    const topCard = foundation.lastElementChild;
    return canGoOnFoundation(topCard && parseCard(topCard),parseCard(newCard));
}
function isFreeCellEmpty(cell) {
    return cell.querySelectorAll('.card').length === 0;
}
function countEmptyFreeCells () {
    return document.querySelectorAll('.freecell:empty').length;
}
function countEmptyFreeColumns () {
    return document.querySelectorAll('.column:empty').length;
}
function maxMoveableStackSize() {
    const freeCells = countEmptyFreeCells();
    const emptyCols = countEmptyFreeColumns();
    return (freeCells +1) * Math.pow(2, emptyCols);
}
function canMoveStack(stack) {
    return stack.length <= maxMoveableStackSize();
}

const freecellRules = {
    canPickup(stack){
        return isValidStack(stack);
    },
    canDropOnColumn(stack,column){
        return canPlaceStackOnColumn(stack,column) && canMoveStack(stack);
    },
    canDropOnFreecell(stack,cell){
        return stack.length === 1 && isFreeCellEmpty(cell);
    },
    canDropOnFoundation(stack,foundation){
        return stack.length === 1 && canPlaceOnFoundation(stack[0],foundation);
    },
    detectWin(){
      const total = [...document.getElementsByClassName('column')].reduce((sum, column) => sum + column.childElementCount, 0);
    },
};

// FREECELL loader
function loadFreecell(container) {
    // Scope Freecell's CSS to container
    container.className = 'game-freecell';

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

    // Create deck
    const deckSpace = document.createElement('div');
    deckSpace.className = 'deckSpace';
    deckSpace.id = 'deckSpace';
    container.appendChild(deckSpace);

    // deal freecell after DOM is built
    currentGameRules = freecellRules;
    dealFreecell();
}
async function dealFreecell() {
    // Reset win flag
    won = false;
    
    //stop any deal or drag in progress
    abortDrag();
    cancelDeal();
    const myDeal = dealCounter;

    // prepare board and deck
    clearContainers();
    moveHistory.clear();
    const deck = new Deck().shuffle();
    const deckEl = document.getElementById('deckSpace');
    updateDeckPicture(deck,deckEl);

    // identify columns
    const columns = [];
    for (let i = 0; i < 8; i++) {
        columns.push(document.getElementById(`col-${i}`));
    }

    // deal cards
    isDealing = true;
    try {
       for(let i = 0; i < 52; i++) {
        await dealCards(deck, deckEl, columns[i % 8]);
        if(myDeal !== dealCounter) return;
       }
        console.log('Freecell now dealt'); 
    } finally {
        if(myDeal === dealCounter) isDealing = false;
    }
}