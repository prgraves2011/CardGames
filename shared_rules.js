"use strict";

function isValidChild(colObj,newObj) { // {obj},{obj} => Y/N
    return (
        suitColor[colObj.suit] !== suitColor[newObj.suit] &&
        rank_val[colObj.rank] -1 === rank_val[newObj.rank]
    );
}

function isValidRun([...cardObj]) { //Accepts [card objects]. Returns true/false
    return (
        cardObj.every(
            (c,i) => i === 0 || isValidChild(cardObj[i - 1] , c)
        )
    );
}

function canGoOnFoundation(foundationCard, newCard) {   // {obj},{obj} => true/false
    if (!foundationCard) return newCard.rank === 'A';
    const foundRank = rank_val[foundationCard.rank];
    const newRank   = rank_val[newCard.rank];
    return newCard.suit === foundationCard.suit && newRank === foundRank + 1;
}