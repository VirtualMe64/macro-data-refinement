const MAX_SCALE = 2.5
const INFLUENCE_RADIUS = 100
const NUM_DENSITY = 35

let cursorHighlight = null;
let container = null;
let containerChildren = null;
let loaded = false

function randNum() {
    return Math.floor(Math.random() * 10)
}

function loadGrid() {
    cursorHighlight = document.getElementById('cursor-highlight');

    document.addEventListener('mousemove', (event) => {
        cursorHighlight.style.left = `${event.clientX}px`;
        cursorHighlight.style.top = `${event.clientY}px`;
    });
    container = document.querySelector('.container');
    width = container.clientWidth
    height = container.clientHeight

    x = Math.floor(width / NUM_DENSITY)
    y = Math.floor(height / NUM_DENSITY)
    container.style.gridTemplateColumns = `repeat(${x}, 1fr)`
    container.style.gridTemplateRows = `repeat(${y}, 1fr)`

    for (let i = 1; i <= x * y; i++) {
        const p = document.createElement('p');
        p.textContent = randNum(); // Number each cell
        container.appendChild(p);
    }
    containerChildren = container.children
    loaded = true
}

function handlemousemove(event) {
    if (loaded) {
        cursorHighlight.style.left = `${event.clientX}px`;
        cursorHighlight.style.top = `${event.clientY}px`;
        updateFontSizes(event.clientX, event.clientY)
    }
}

function updateFontSizes(mouseX, mouseY) {
    for (let i = 0; i < containerChildren.length; i++) {
        let child = containerChildren[i]
        let x = (child.getBoundingClientRect().left + child.getBoundingClientRect().right) / 2
        let y = (child.getBoundingClientRect().top + child.getBoundingClientRect().bottom) / 2
        let dist = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2))
        if (dist > INFLUENCE_RADIUS) {
            child.style.transform = `scale(1)`
        } else {
            child.style.transform = `scale(${computeScale(dist)})`
        }
    }
}

function computeScale(dist) {
    norm = Math.exp((-Math.pow(dist, 2)) / (2 * Math.pow(INFLUENCE_RADIUS / 2.5, 2)))
    return 1 + norm * (MAX_SCALE - 1)
}

document.onmousemove = handlemousemove
window.onload = loadGrid