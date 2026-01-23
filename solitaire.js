//________// --- VARIABLES --- //________

/* - COMMENTED OUT: DECLARED IN MULTIPLE JS FILES !
let draggedStack = [];
let dragOffsetX = 0;
let dragOffsetY = 0;
let sourceContainer = null;
*/


//________// --- LOAD SOLITAIRE --- //________

function dealSolitaire() {

    // start deal
    console.log('Dealing Solitaire');

    // create cards
    const suits = ['H', 'D', 'C', 'S'];
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

    // identify columns
    const columns = [];
    for (let i = 0; i < 7; i++) {
        columns.push(document.getElementById(`col-${i}`));
    }

    // clear containers
    [...document.querySelectorAll('.column, .freecell, .deck, .discard')].forEach(container => {
        container.innerHTML = '';
    });

    // build a deck
    const deck = [];
    for (const rank of ranks) {
        for (const suit of suits) {
            deck.push(`${rank}${suit}`);
        }
    }

    // shuffle the deck (Fischer-Yates)
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [ deck[i], deck[j] ] = [ deck[j], deck[i] ];
    }
    const cardString = deck.join(', ');
    console.log(`Shuffled cards: ${cardString}`);

    // deal cards to tableu
    let deckIndex = 0;
    for(let col = 0; col < 7; col++) {
        for(let row = 0; row <= col; row++) {
            const cardId = deck[deckIndex++];

            // last card in each column is facing up
            const state = (row === col) ? 'up' : 'down';

            const card = createCard(cardId, state);
            card.style.setProperty('--stack-index', row);
            columns[col].appendChild(card);
        }
    }

    // report finished deal
    console.log('Solitaire now dealt');
}


//________// --- FUNCTIONS --- //________

// create cards
function createCard(cardID, state = 'down'){
    const card = document.createElement('img');
    card.className = 'card';
    card.alt = cardID;
    card.dataset.state = state;

    //image based on state
    if(state === 'down') {
        card.src = 'cards/rear.png';
    } else {
        card.src = `cards/${cardID}.png`;
    }

    card.draggable = false;
    return card;
}

// flip a card
function flipCard(card) {
    if(card.dataset.state === 'down') {
        card.dataset.state = 'up';
        card.src = `cards/${card.alt}.png`
    } else {
        card.dataset.state = 'down';
        card.src = 'cards/rear.png';
    }
}

function autoFlipCard(column) {
    const cards = column.querySelectorAll('.card');
    if(cards.length === 0) return;

    const topCard = cards[cards.length - 1];
    if(topCard.dataset.state === 'down') {
        flipCard(topCard);
    }
}

//calculate stack positions
function updateStackIndices(container) {
    const cards = [...container.querySelectorAll('.card')];
    cards.forEach((card, index) => {
        card.style.setProperty('--stack-index', index);
    });
}

//________// --- MOUSE EVENTS --- //________

// prevent drag native behaviour
document.addEventListener('dragstart', e => e.preventDefault());