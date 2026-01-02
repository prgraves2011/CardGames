// open listener
document.addEventListener('DOMContentLoaded', () => {

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

// create cards
const suits = ['H', 'D', 'C', 'S'];
const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

// identify columns
const columns = [];
for (let i = 0; i < 8; i++) {
    columns.push(document.getElementById(`col-${i}`));
}

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
let draggedCard = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let sourceContainer = null;

// mouse down events
document.addEventListener('mousedown', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;

    draggedCard = card;
    sourceContainer = card.parentElement;

    const rect = card.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    card.style.left = `${rect.left}px`;
    card.style.top  = `${rect.top}px`;
    card.style.zIndex = 1000;
    card.style.pointerEvents = 'none';

    document.body.appendChild(card);
});

// mouse move
document.addEventListener('mousemove', (e) => {
    if (!draggedCard) return;

    draggedCard.style.left = `${e.clientX - dragOffsetX}px`;
    draggedCard.style.top  = `${e.clientY - dragOffsetY}px`;
});

// freecell occupancy check
function isFreeCellEmpty(cell) {
    return cell.querySelectorAll('.card').length === 0;
}


// drop card - mouse up
document.addEventListener('mouseup', (e) => {
    if (!draggedCard) return;

    // TEMP - LOG CHECK
    console.log('mouseup target:', e.target);
    console.log('mouseup target classes:', e.target.className);

    const dropTarget = e.target.closest('.foundation, .freecell, .column');
    let target = dropTarget || sourceContainer;

    // reject occupied freecell
    if (
        dropTarget &&
        dropTarget.classList.contains('freecell') &&
        !isFreeCellEmpty(dropTarget)
    ) {
        target = sourceContainer;
    }

    // reject invalid foundation move
    if (
        dropTarget &&
        dropTarget.classList.contains('foundation') &&
        !canPlaceOnFoundation(draggedCard, dropTarget)
    ) {
        target = sourceContainer;
    }

    target.appendChild(draggedCard);

    draggedCard.style.left = '';
    draggedCard.style.top = '';
    draggedCard.style.zIndex = '';
    draggedCard.style.pointerEvents = '';

    updateStackIndices(target);
    if (target !== sourceContainer) {
        updateStackIndices(sourceContainer);
    }

    // freecell stack index reset
    if (target.classList.contains('freecell')) {
        draggedCard.style.setProperty('--stack-index', 0);
    }

    draggedCard = null;
    sourceContainer = null;

});


// close listener
});