"use strict";

let currentGameRules = null;

// Move History
class MoveHistory {
    #moves = [];
    #undone = [];
    push(source,dest,stack){
        if(source === dest) return;
        console.log('push called:', source?.id, '→', dest?.id);
        this.#moves.push({source,dest,stack:[...stack]});
        this.#undone.length = 0;
    }
    undo(){
        const move = this.#moves.pop();
        if(move) this.#undone.push(move);
        return move;
    }
    redo(){
        const move = this.#undone.pop();
        if(move) this.#moves.push(move);
        return move;
    }
    clear(){
        this.#moves.length = 0;
        this.#undone.length = 0;
    }
    peek(){
        return this.#moves.at(-1);
    }
}
let moveHistory = new MoveHistory();

document.addEventListener('keydown', e => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const key = e.key.toLowerCase();
    if (key === 'z' && !e.shiftKey){
        e.preventDefault();
        undo();
    } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault();
        redo();
        }
    }
);
function undo() {
    const move = moveHistory.undo();
    if (!move) {console.log('Nothing to undo.'); return;}
        commitMove(move.dest,move.source,move.stack,false);
}
function redo() {
    const move = moveHistory.redo();
    if (!move) {console.log('Nothing to redo.'); return;}
        commitMove(move.source,move.dest,move.stack,false);
}

// Shared Commit Move Function
function commitMove(sourceCon,destCon,stack,record=true) {
    stack.forEach(card => {
        animateMove(card,destCon);        
    });
    updateStackIndices(sourceCon);
    updateStackIndices(destCon);
    if(record){
        moveHistory.push(sourceCon,destCon,stack);
    }
}

// prevent drag native behaviour
document.addEventListener('dragstart', e => e.preventDefault());

// Global variables
let draggedStack = [];
let dragOffsetX = 0;
let dragOffsetY = 0;
let stackOffsets = [];
let sourceContainer = null;
const dragThreshold = 4;
let dragStartX = 0;
let dragStartY = 0;
let dragStarted = false;

// pointer-down
document.addEventListener('pointerdown',startDrag);
function startDrag(e) {

    const card = e.target.closest('.card');
    if (!card) return;

    // prevent drags from foundations
    if (card.closest('.foundation')) return;

    // prevent invalid stacks moving
    const stack = getMovingStack(card);
    if(!isValidStack(stack)) return;
    
    sourceContainer = card.parentElement;    
    draggedStack = stack;

    const rect = card.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStarted = false;
};
function prepareDraggedCards(stack){
    const leadTop = stack[0].getBoundingClientRect().top;
    stackOffsets = stack.map(c => c.getBoundingClientRect().top - leadTop);
    stack.forEach((c,i) => {
        const r = c.getBoundingClientRect();
            c.style.left = `${r.left}px`;
            c.style.top  = `${r.top}px`;
            c.style.zIndex = 1000 + i;
            c.style.pointerEvents = 'none';
            document.body.appendChild(c);
        });    
}

// pointer-move
document.addEventListener('pointermove',dragStack);
function dragStack(e){
    // no stack selected
    if (draggedStack.length === 0) return;

    // lift cards once pointer has moved far enough
    if(!dragStarted) {
        const moved = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
        if(moved < dragThreshold) return;
        dragStarted = true;
        prepareDraggedCards(draggedStack);
    }

    // move the cards
    draggedStack.forEach((card, i) => {
        card.style.left = `${e.clientX - dragOffsetX}px`;
        card.style.top  = `${e.clientY - dragOffsetY + stackOffsets[i]}px`;
    });
}

// pointer-up
document.addEventListener('pointerup',dropStack);
function dropStack(e){
    if (draggedStack.length === 0) return;
    if(!dragStarted) {
        draggedStack = [];
        sourceContainer = null;
        return;
    }
    const dropTarget = e.target.closest('.foundation, .freecell, .column');
    const leadCard = draggedStack[0];
    const target = validateMove(dropTarget,leadCard);
    commitMove(sourceContainer,target,draggedStack);
    cleanupDrag();
}
function validateMove(dropTarget,leadCard){
    let target = dropTarget || sourceContainer;

    // Freecell must be empty
    if (
        dropTarget &&
        dropTarget.classList.contains('freecell') &&
        !isFreeCellEmpty(dropTarget)
    ) {
        console.log('Freecell not empty');
        return sourceContainer;
    }

    // Freecell only accepts one card
    if (
        dropTarget &&
        dropTarget.classList.contains('freecell') &&
        draggedStack.length !== 1
    ) {
        console.log('No more than one card in a freecell');
        return sourceContainer;
    }

    // Foundation rule (single card only)
    if (
        dropTarget &&
        dropTarget.classList.contains('foundation') &&
        (
            draggedStack.length !== 1 ||
            !canPlaceOnFoundation(leadCard, dropTarget)
        )
    ) {
        console.log('No more than one card to a foundation at a time');
        return sourceContainer;
    }

    // Column rule (stack-aware)
    if (
        dropTarget &&
        dropTarget.classList.contains('column') &&
        !canPlaceStackOnColumn(draggedStack, dropTarget)
    ) {
        return sourceContainer;
    }

    // Max moveable stack rule
    if (
        dropTarget &&
        dropTarget.classList.contains('column') &&
        !canMoveStack(draggedStack)
    ) {
        console.log('Stack too large');
        return sourceContainer;
    }

    // Valid target
    return target;
}
function cleanupDrag(){
    draggedStack.forEach(card => {
        card.style.pointerEvents = '';
    });
    draggedStack = [];
    sourceContainer = null;    
}

// Double-click helpers
document.addEventListener('dblclick', e => {
    const card = e.target.closest('.card');
    if(!card) return;
    autoMove(card);
});
function autoMove(card) {
    let source = card.parentElement;
    if(card !== source.lastElementChild) return; // Cannot move a card from mid-stack
    if(source.classList.contains('foundation')) return; // Nothing moves from foundations

    // Check valid foundation
    const foundation = findValidFoundation(card);
    if (foundation){
        commitMove(source,foundation,[card]);
        return;
    }

    // Check freecells
    const freecell = findEmptyFreecell();
    if(freecell && !source.classList.contains('freecell')){
        commitMove(source,freecell,[card]);
        return;
    }
}
function findEmptyFreecell() {
    const freecells = document.querySelectorAll('.freecell');
    return [...freecells].find(cell => isFreeCellEmpty(cell));
}
function findValidFoundation(card){
    const foundations = document.querySelectorAll('.foundation');
    return [...foundations].find(foundation => canPlaceOnFoundation(card,foundation));
}