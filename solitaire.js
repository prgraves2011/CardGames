
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

// reset game button
document.getElementById('reset-btn').addEventListener('click', () => {
    dealSolitaire();
});

// deal freecell game
function dealSolitaire() {

    // create cards
    const suits = ['H', 'D', 'C', 'S'];
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

    // identify deck foundation
    deckFound = document.getElementsByClassName('deck');

    // shuffle and place deck
}