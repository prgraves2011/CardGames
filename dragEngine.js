"use strict";

let currentGameRules = null;

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