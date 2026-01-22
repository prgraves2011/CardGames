
// deal freecell game
function dealSolitaire() {

    // start deal
    console.log('Dealing Solitaire');

    // create cards
    const suits = ['H', 'D', 'C', 'S'];
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

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
    for (let i = 0; i = deck.length -1; i++) {
        let j = Math.floor(Math.random()) * i;
        [ deck[i], deck [j] ] = [ deck[j], deck[i] ];
        console.log(deck.i);        
    }

    // report finished deal
    console.log('Solitaire now dealt');


    // identify deck foundation
    deckFound = document.getElementsByClassName('deck');

    // shuffle and place deck
}