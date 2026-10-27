let currentGame = null;

function loadGame(gameName) {

    //check chosen game is active ==> if so, do nothing, else, load new game
    if (currentGame === gameName) {
        console.log('Selected game is currently loaded.');
        return;
        
    } else{

        // assign active game
        currentGame = gameName;
        
        // update active button
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`btn-${gameName}`).classList.add('active');

        // clear game container
        const container = document.getElementById('game-container');
        container.innerHTML = '';

        //report game selection
        console.log(`${gameName} selected`);        

        //load selected game
        if (gameName === 'freecell') {
            console.log('Loading Freecell...');
            loadFreecell(container);
        } else if (gameName === 'solitaire') {
            console.log('Loading Solitaire...');
            loadSolitaire(container);
        }
    }
}

// reset current game
function resetCurrentGame() {
    if (currentGame === 'freecell') {
        dealFreecell();
        console.log('Freecell reset');
    } else if (currentGame === 'solitaire') {
        dealSolitaire();
        console.log('Solitaire reset');
    }
}

// zoom control
let zoomLevel = 1;
let autoFit = false;
function zoomIn() {
    zoomLevel += 0.1;
    if (zoomLevel > 1.5) zoomLevel = 1.5; // Max zoom
    applyZoom();
    setAutoFit(false);
}
function zoomOut() {
    zoomLevel -= 0.1;
    if (zoomLevel < 0.8) zoomLevel = 0.8; // Min zoom
    applyZoom();
    setAutoFit(false);
}
function applyZoom() {
    document.documentElement.style.setProperty('--zoom', zoomLevel);
}
function fitToWindow() {
    const board = document.getElementById('game-container');
    const menu  = document.querySelector('.bottom-menu');
    const current = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom'));
    const baseW = board.offsetWidth  / current;      // size at zoom 1
    const baseH = board.offsetHeight / current;
    zoomLevel = Math.min(window.innerWidth / baseW, (window.innerHeight - menu.offsetHeight) / baseH);
    applyZoom();
}
function setAutoFit(on) {
    autoFit = on;
    document.querySelector('.zoom-control').classList.toggle('auto', on);
    document.getElementById('fit-btn').setAttribute('aria-pressed', on);
    if (on) fitToWindow();
}

function toggleAutoFit() { setAutoFit(!autoFit); }
window.addEventListener('resize', () => { if (autoFit) fitToWindow(); });

// theme switcher
document.addEventListener(
    'DOMContentLoaded',
    initialiseThemeSwitcher
);
function initialiseThemeSwitcher(){

    const themeButtons =
    document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        button.addEventListener('click',handleThemeClick);
    })
}
function handleThemeClick(e){
    const button = e.currentTarget;
    setActiveThemeButton(button);
    applyTheme(button.dataset.theme);
}
function setActiveThemeButton(activeButton){
    document.querySelectorAll('.theme-btn').forEach(button => {
        button.classList.remove('active');
    })
    activeButton.classList.add('active');
}
function applyTheme(themeName){
    document.documentElement.setAttribute('data-theme',themeName);
}