function isValidStack(stack) {
    for (let i = 0; i < stack.length - 1; i++) {
        const a = parseCard(stack[i]);
        const b = parseCard(stack[i + 1]);

        if (
            suitColor[a.suit] === suitColor[b.suit] ||
            rank_val[a.rank] !== rank_val[b.rank] + 1
        ) {
            return false;
        }
    }
    return true;
}

function canPlaceStackOnColumn(stack, columnEl) {
    // Rule 1: the moving stack itself must be valid
    if (!isValidStack(stack)) return false;

    const cards = columnEl.querySelectorAll('.card');

    // Rule 2: empty column accepts any valid stack
    if (cards.length === 0) return true;

    // Rule 3: otherwise compare against top card
    const movingTop = parseCard(stack[0]);
    const targetTop = parseCard(cards[cards.length - 1]);

    return (
        suitColor[movingTop.suit] !== suitColor[targetTop.suit] &&
        rank_val[movingTop.rank] === rank_val[targetTop.rank] - 1
    );
}

function canPlaceOnFoundation (cardEl, foundationEl) {
    const { rank, suit} = parseCard(cardEl);
    const cards = [...foundationEl.children].filter(el => el.classList.contains('card'));

    // empty foundation - ACE only
    if (cards.length === 0) {
        return rank === 'A';
    }

    const topCard = cards[cards.length - 1];
    const top = parseCard(topCard);

    return (
        suit === top.suit &&
        rank_val[rank] === rank_val[top.rank] +1
    );
}

function isFreeCellEmpty(cell) {
    return cell.querySelectorAll('.card').length === 0;
}

// helper functions for 'max-move-stack' rule
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
    clearContainers('.column, .freecell, .foundation');
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
        card.alt = deck[i];
        card.draggable = false;

        card.style.setProperty('--stack-index', stackIndex);
        columns[columnIndex].appendChild(card);
    }

    // report finished deal
    console.log('Freecell now dealt');
}

// prevent drag native behaviour
document.addEventListener('dragstart', e => e.preventDefault());

// drag state variables
let draggedStack = [];
let dragOffsetX = 0;
let dragOffsetY = 0;
let sourceContainer = null;

// pointer-down
document.addEventListener('pointerdown',startDrag);
function startDrag(e) {

    const card = e.target.closest('.card');
    if (!card) return;

    // prevent drags from foundations
    if (card.closest('.foundation')) return;

    // prevent invalid stacks moving
    const stack = getMovingStack(card);
    if(!isValidStack(stack)) return;
    
    sourceContainer = card.parentElement;    
    draggedStack = stack;

    const rect = card.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    // prepareDraggedCards(draggedStack); // REPLACED
    dragStartX = e.clientX;
    dragstartY = e.clientY;
    dragStarted = false;
};

function prepareDraggedCards(stack){
    stack.forEach((c,i) => {
        const r = c.getBoundingClientRect();
            c.style.left = `${r.left}px`;
            c.style.top  = `${r.top}px`;
            c.style.zIndex = 1000 + i;
            console.log(`${c.alt} index: ${c.style.zIndex}`);
            c.style.pointerEvents = 'none';
            document.body.appendChild(c);
        });    
}

// pointer-move
const dragSpacing = 25;
document.addEventListener('pointermove',dragStack);

const dragThreshold = 4;
let dragStartX = 0;
let dragStartY = 0;
let dragStarted = false;

function dragStack(e){
    // no stack selected
    if (draggedStack.length === 0) return;

    // lift cards once pointer has moved far enough
    if(!dragStarted) {
        const moved = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
        if(moved < dragThreshold) return;
        dragStarted = true;
        prepareDraggedCards(draggedStack);
    }

    // move the cards
    draggedStack.forEach((card, i) => {
        card.style.left = `${e.clientX - dragOffsetX}px`;
        card.style.top  = `${e.clientY - dragOffsetY + i * dragSpacing}px`;
    });
}

// pointer-up
document.addEventListener('pointerup',dropStack);
function dropStack(e){
    if (draggedStack.length === 0) return;

    // pressed and released without moving
    if(!dragStarted) {
        draggedStack = [];
        sourceContainer = null;
        return;
    }

    const dropTarget = e.target.closest('.foundation, .freecell, .column');
    const leadCard = draggedStack[0];
    const target = validateMove(dropTarget,leadCard);

    // Commit move
    moveStack(target);
    updateStackIndices(target);    

    // Freecell stack index reset
    if (target.classList.contains('freecell')) {
        draggedStack[0].style.setProperty('--stack-index', 0);
    }

    cleanupDrag();
}
function validateMove(dropTarget,leadCard){
    let target = dropTarget || sourceContainer;

    // Freecell must be empty
    if (
        dropTarget &&
        dropTarget.classList.contains('freecell') &&
        !isFreeCellEmpty(dropTarget)
    ) {
        console.log('Freecell not empty');
        return sourceContainer;
    }

    // Freecell only accepts one card
    if (
        dropTarget &&
        dropTarget.classList.contains('freecell') &&
        draggedStack.length !== 1
    ) {
        console.log('No more than one card in a freecell');
        return sourceContainer;
    }

    // Foundation rule (single card only)
    if (
        dropTarget &&
        dropTarget.classList.contains('foundation') &&
        (
            draggedStack.length !== 1 ||
            !canPlaceOnFoundation(leadCard, dropTarget)
        )
    ) {
        console.log('No more than one card to a foundation at a time');
        return sourceContainer;
    }

    // Column rule (stack-aware)
    if (
        dropTarget &&
        dropTarget.classList.contains('column') &&
        !canPlaceStackOnColumn(draggedStack, dropTarget)
    ) {
        return sourceContainer;
    }

    // Max moveable stack rule
    if (
        dropTarget &&
        dropTarget.classList.contains('column') &&
        !canMoveStack(draggedStack)
    ) {
        console.log('Stack too large');
        return sourceContainer;
    }

    // Valid target
    return target;
}
function moveStack(target){
    draggedStack.forEach(card => {
        animateMove(card,target);
    });        
}
function cleanupDrag(){
    draggedStack.forEach(card => {
        card.style.pointerEvents = '';
    });
    draggedStack = [];
    sourceContainer = null;    
}

// Double-click events
document.addEventListener('dblclick', e => {
    const card = e.target.closest('.card');
    if(!card) return;
    autoMove(card);
});

function autoMove(card) {
    console.log(`Card ${card.alt} has been double-clicked`);

    // Check valid foundation
    const foundation = findValidFoundation(card);
    if (foundation){
    console.log('Foundation found!');
        animateMove(card,foundation);
        return;
    }

    // Check freecells
    const freecell = findEmptyFreecell();
    if(freecell){
        console.log('Freecell found!');
        animateMove(card,freecell);
        return;
    }
}

// Double-click helpers
function findEmptyFreecell() {
    const freecells = document.querySelectorAll('.freecell');
    return [...freecells].find(cell => isFreeCellEmpty(cell));
}
function findValidFoundation(card){
    const foundations = document.querySelectorAll('.foundation');
    return [...foundations].find(foundation => canPlaceOnFoundation(card,foundation));
}