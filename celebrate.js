"use strict";

let winDialog = null;

function buildWinDialog() { //nothing => element
    const dialog = document.createElement('dialog');
    dialog.className = 'win-dialog';

    const heading = document.createElement('h2');
    heading.textContent = 'You Won!';

    const message = document.createElement('p');
    message.textContent = 'Every card is home!';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'win-btn';
    button.textContent = 'Play Again';
    button.addEventListener('click', () => {
        dialog.close();
        resetCurrentGame();
    });

    dialog.append(heading,message,button);
    document.body.appendChild(dialog);
    return  dialog;
}

function showWinMessage() { //nothing => nothing - opens message
    if(!winDialog) winDialog = buildWinDialog();
    if(winDialog.open) return;
    winDialog.showModal();
}

function createCanvas (){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '2000',
        pointerEvents: 'none'
    });

    document.body.appendChild(canvas);

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);
}