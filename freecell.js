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
function maxMoveableStckSize() {
    const freeCells = countEmptyFreeCells();
    const emptyCols = countEmptyFreeColumns();
    return (freeCells +1) * Math.pow(2, emptyCols);
}
function canMoveStack(stack) {
    return stack.length <= maxMoveableStckSize();
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
function dealFreecell() {

    // prepare board and deck
    moveHistory.clear();
    const deck = createDeck();
    shuffleDeck(deck);

    // identify columns
    const columns = [];
    for (let i = 0; i < 8; i++) {
        columns.push(document.getElementById(`col-${i}`));
    }

    // deal cards
    for (let i = 0; i < 52; i++) {
        const columnIndex = i % 8;
        const stackIndex = Math.floor(i / 8);

        const card = document.createElement('img');
        card.className = 'card';
        card.src = `cards/${deck[i]}.png`;
        card.dataset.card = deck[i];
        const {rank,suit} = parseCard(card);
        card.alt = `${rankToWord[rank]} of ${suitToWord[suit]}`;
        card.draggable = false;

        card.style.setProperty('--stack-index', stackIndex);
        columns[columnIndex].appendChild(card);
    }

    // report finished deal
    console.log('Freecell now dealt');
}