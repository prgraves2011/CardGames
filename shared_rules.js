"use strict";

function isValidChild(colObj,newObj) {
    return (
        suitColor[colObj.suit] !== suitColor[newObj.suit] &&
        rank_val[colObj.rank] -1 === rank_val[newObj.rank]
    );
}

function isValidRun([...cardObj]) {
    return (
        cardObj.every(
            (c,i) => i === 0 || isValidChild(cardObj[i - 1] , c)
        )
    );
}

// Write a foundation function.
// It takes the card being placed and the foundation's top card,
// or nothing when the foundation is empty.
// Check the empty case first: only an Ace.
// Otherwise the card must be the same suit and exactly one rank higher.
function canGoOnFoundation(foundationCard,newCard) {
    return (
        
    );
}