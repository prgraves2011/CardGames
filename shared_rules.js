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

function canGoOnFoundation(foundationCard, newCard) {   // foundationCard = {rank, suit} or null, RETURN true/false
    if (!foundationCard) return newCard.rank === 'A';
    const foundRank = rank_val[foundationCard.rank];
    const newRank   = rank_val[newCard.rank];
    return newCard.suit === foundationCard.suit && newRank === foundRank + 1;
}