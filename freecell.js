// open listener
document.addEventListener('DOMContentLoaded', () => {


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

// prevent drag defaults
document.addEventListener('dragstart', e => e.preventDefault());

// card movement setup
let dragCard = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let sourceContainer = null;

// mouse clicks
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

// mouse moves
document.addEventListener('mousemove', (e) => {
    if (!draggedCard) return;

    draggedCard.style.left = `${e.clientX - dragOffsetX}px`;
    draggedCard.style.top  = `${e.clientY - dragOffsetY}px`;
});

// drop card - mouse up
document.addEventListener('mouseup', (e) => {
    if (!draggedCard) return;

    const dropTarget = e.target.closest('.column, .cell');
    const target = dropTarget || sourceContainer;

    target.appendChild(draggedCard);
    draggedCard.style.left = '';
    draggedCard.style.top = '';
    draggedCard.style.zIndex = '';
    draggedCard.style.pointerEvents = '';

    updateStackIndices(target);
    if (target !== sourceContainer) {
        updateStackIndices(sourceContainer);
    }

    draggedCard = null;
    sourceContainer = null;
});


// close listener
});