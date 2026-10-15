// SOLITAIRE loader
function loadSolitaire(container) {

    //  create top row
    const topRow = document.createElement('div');
    topRow.className = 'top-row';
    container.appendChild(topRow);

    // create deck/discard SET
    const deckSet = document.createElement('div');
    deckSet.className = 'deck-set';
    topRow.appendChild(deckSet);

    // create deck foundation
    const deckFoundation = document.createElement('div');
    deckFoundation.className = 'deck';
    deckSet.appendChild(deckFoundation);

    // create discard
    const discardFoundation = document.createElement('div');
    discardFoundation.className = 'discard';
    deckSet.appendChild(discardFoundation);

    // create foundation-set
    const foundationSet = document.createElement ('div');
    foundationSet.className = 'foundations';
    topRow.appendChild(foundationSet);

    // create FOUR foundations
    for (let i = 0; i < 4; i++) {
        const cell = document.createElement ('div');
        cell.className = 'foundation';
        cell.id = `foundation-${i}`;
        foundationSet.appendChild(cell);
    }

    // create tableau
    const tableau = document.createElement ('div');
    tableau.className = 'solitaire-tableau';
    container.appendChild(tableau);

    // create columns
    for (let i = 0; i < 7; i++) {
        const column = document.createElement ('div');
        column.className = 'column';
        column.id = `col-${i}`;
        tableau.appendChild(column);
    }

    // deal solitare after DOM is built
    dealSolitaire();
}