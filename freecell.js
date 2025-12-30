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


// close listener
});