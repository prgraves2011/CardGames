
// card rank values
const rank_val = {
    A: 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    J: 11,
    Q: 12,
    K: 13,
};

// suit colours
const suitColor = {
    C: 'B',
    S: 'B',
    D: 'R',
    H: 'R',
};

// extract moving stack from column
function getMovingStack(cardEl) {
    const container = cardEl.parentElement;
    const cards = [...container.querySelectorAll('.card')];
    const index = cards.indexOf(cardEl);
    return cards.slice(index);
}

// validate stack integrity
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

// column acceptance - stack aware
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

// card identity parsing
function parseCard(cardEl) {
    const id = cardEl.alt; // e.g.: '10H'
    const suit = id.slice(-1);
    const rank = id.slice(0, -1);
    return { rank, suit };
}

// foundation acceptance check
function canPlaceOnFoundation (cardEl, foundationEl) {
    const { rank, suit} = parseCard(cardEl);
    const cards = [...foundationEl.children].filter(el => el.classList.contains('card'));

    // TEMP - LOG CHECK
    console.log('Foundation check:', parseCard(cardEl), foundationEl.children.length);

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

// ...validation function
function canMoveStack(stack) {
    return stack.length <= maxMoveableStckSize();
}

// create cards
const suits = ['H', 'D', 'C', 'S'];
const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

// identify columns
const columns = [];
for (let i = 0; i < 8; i++) {
    columns.push(document.getElementById(`col-${i}`));
}

// deal initial game
dealNewGame();

function initFreecell() {

    // NOW get the columns (they exist now)
    const columns = [];
    for (let i = 0; i < 8; i++) {
        columns.push(document.getElementById(`col-${i}`));
    }
    
    // Store globally so dealNewGame can access it
    window.freecellColumns = columns;

    // deal the game
    dealNewGame();
}

// deal new game
function dealNewGame() {
    // clear containers
    [...document.querySelectorAll('.column, .freecell, .foundation')].forEach(container => {
        container.innerHTML = '';
    });

    // build a deck
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            //create a suit-rank pair and append to deck
            deck.push(`${rank}${suit}`);
        }
    }

    // shuffle the deck (Fisher-Yates)
    for ( let i = deck.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
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
}

// calculate stack positions
function updateStackIndices(container) {
    const cards = [...container.querySelectorAll('.card')];
    cards.forEach((card, index) => {
        card.style.setProperty('--stack-index', index);
    });
}

// prevent drag native behaviour
document.addEventListener('dragstart', e => e.preventDefault());

// drag state variables
let draggedStack = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let sourceContainer = null;

// mouse down events
document.addEventListener('mousedown', (e) => {

    const card = e.target.closest('.card');
    if (!card) return;

    // prevent drags from foundations
    if (card.closest('.foundation')) return;

    sourceContainer = card.parentElement;
    draggedStack = getMovingStack(card);

    const rect = card.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

draggedStack.forEach((c,i) => {
    const r = c.getBoundingClientRect();

        c.style.left = `${r.left}px`;
        c.style.top  = `${r.top}px`;
        c.style.zIndex = 1000 + i;
        c.style.pointerEvents = 'none';

        document.body.appendChild(c);
    });
});

// mouse move
document.addEventListener('mousemove', (e) => {
    if (draggedStack.length === 0) return;

    draggedStack.forEach((card, i) => {
        card.style.left = `${e.clientX - dragOffsetX}px`;
        card.style.top  = `${e.clientY - dragOffsetY + i * 25}px`;
    });
});

// freecell occupancy check
function isFreeCellEmpty(cell) {
    return cell.querySelectorAll('.card').length === 0;
}

// drop card - mouse up
document.addEventListener('mouseup', (e) => {
    if (draggedStack.length === 0) return;

    const dropTarget = e.target.closest('.foundation, .freecell, .column');
    let target = dropTarget || sourceContainer;

    const leadCard = draggedStack[0];

    // ── Freecell rule ─────────────────────────────
    if (
        dropTarget &&
        dropTarget.classList.contains('freecell') &&
        !isFreeCellEmpty(dropTarget)
    ) {
        target = sourceContainer;
    }

    // ── Foundation rule (single card only) ─────────
    if (
        dropTarget &&
        dropTarget.classList.contains('foundation') &&
        (
            draggedStack.length !== 1 ||
            !canPlaceOnFoundation(leadCard, dropTarget)
        )
    ) {
        target = sourceContainer;
    }

    // ── Column rule (stack-aware) ──────────────────
    if (
        dropTarget &&
        dropTarget.classList.contains('column') &&
        !canPlaceStackOnColumn(draggedStack, dropTarget)
    ) {
        target = sourceContainer;
    }

    // Max moveable stack rule
    if (
        dropTarget &&
        dropTarget.classList.contains('column') &&
        !canMoveStack(draggedStack)
    ) {
        target = sourceContainer;
    }

    // ── Commit move (atomic stack append) ──────────
    draggedStack.forEach(card => target.appendChild(card));

    // ── Cleanup dragged styles ─────────────────────
    draggedStack.forEach(card => {
        card.style.left = '';
        card.style.top = '';
        card.style.zIndex = '';
        card.style.pointerEvents = '';
    });

    // ── Recalculate visual stacks ──────────────────
    updateStackIndices(target);
    if (target !== sourceContainer) {
        updateStackIndices(sourceContainer);
    }

    // ── Freecell stack index reset ─────────────────
    if (target.classList.contains('freecell')) {
        draggedStack[0].style.setProperty('--stack-index', 0);
    }

    // ── Reset drag state ───────────────────────────
    draggedStack = [];
    sourceContainer = null;
});

// reset game button
document.getElementById('reset-btn').addEventListener('click', () => {
    dealNewGame();
});