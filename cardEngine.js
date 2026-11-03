"use strict";

// CARD UTILITIES
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

const suitColor = {
    C: 'B',
    S: 'B',
    D: 'R',
    H: 'R',
};

const rankToWord = {
    A: 'Ace',
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine',
    '10': 'Ten',
    J: 'Jack',
    Q: 'Queen',
    K: 'King'
};

const suitToWord = {
    H: 'Hearts',
    C: 'Clubs',
    D: 'Diamonds',
    S: 'Spades'
};

function parseCard(card){
    const name = card.dataset.card;
    return parseCardData(name);
}

function parseCardData(name){
    const suit = name.charAt(name.length-1);
    const rank = name.substring(0,name.length-1);
    return {rank,suit};
}


// DECK UTILITIES

function createDeck(){
    // create cards
    const suits = ['H', 'D', 'C', 'S'];
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

    // build a deck
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            //create a suit-rank pair and append to deck
            deck.push(`${rank}${suit}`);
        }
    }
    return deck;
}

function shuffleDeck(deck){
    for ( let i = deck.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function clearContainers(selector){
    [...document.querySelectorAll('.column, .freecell, .foundation')].forEach(container => {
        container.innerHTML = '';
    });
}

function getMovingStack(cardEl) {
    const container = cardEl.parentElement;
    const cards = [...container.querySelectorAll('.card')];
    const index = cards.indexOf(cardEl);
    return cards.slice(index);
}


// VISUAL UTILITIES

function updateStackIndices(container) {
    const cards = [...container.querySelectorAll('.card')];
    cards.forEach((card, index) => {
        card.style.setProperty('--stack-index', index);
    });
}

function animateMove(card,target){
    const first = card.getBoundingClientRect();
    target.appendChild(card);
    updateStackIndices(target);

    card.style.left = '';
    card.style.top = '';
    const last = card.getBoundingClientRect();

    const dx = first.left - last.left;
    const dy = first.top - last.top;
    card.style.transition = 'none';
    card.style.transform = `translate(${dx}px,${dy}px)`;

    requestAnimationFrame( () => {
        card.style.zIndex = '1000';
        card.style.transition = `transform 150ms ease-out`;
        card.style.transform = '';
    });

    card.addEventListener('transitionend',() => {
        card.style.transition = '';
        card.style.zIndex = '';
    }, {once:true});
}