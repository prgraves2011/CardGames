
// deal solitaire game
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

    // create cards
    function createCard(cardID, states = 'down'){
        
    }


    // report finished deal
    console.log('Solitaire now dealt');
}



________// --- VARIABLES --- //________

let draggedStack = [];
let dragOffsetX = 0;
let dragOffsetY = 0;
let sourceContainer = null;



________// --- FUNCTIONS --- //________

//calculate stack positions
function updateStackIndices(container) {
    const cards = [...container.querySelectorAll('.card')];
    cards.forEach((card, index) => {
        card.style.setProperty('--stack-index', index);
    });
}


________// --- MOUSE EVENTS --- //________

// prevent drag native behaviour
document.addEventListener('dragstart', e => e.preventDefault());