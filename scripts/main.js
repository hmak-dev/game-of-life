const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const config = {
    interval: 50,

    liveEdit: false,
    loopEdges: true,

    cellSize: 20,
    cellGap: 1,

    colors: {
        background: '#444',
        deadCell: '#222',
        aliveCell: '#fd0',
    },
};

const state = {
    generation: null,

    count: null,
    offset: null,

    isPlaying: false,
    intervalId: null,
};

function makeGeneration(xCount, yCount) {
    return new Array(yCount).fill(null).map(() => new Array(xCount).fill(false));
}

function getAliveNeighboursCount(i, j) {
    let aliveNeighbours = 0;

    const { generation, count } = state;

    for (let n = i - 1; n <= i + 1; n++) {
        for (let m = j - 1; m <= j + 1; m++) {
            if (!(n === i && m === j)) {
                let tn = n;
                let tm = m;

                if (config.loopEdges) {
                    tn = n < 0 ? count.y + n : n >= count.y ? n - count.y : n;
                    tm = m < 0 ? count.x + m : m >= count.x ? m - count.x : m;
                } else if (n < 0 || n >= count.y || m < 0 || m >= count.x) {
                    continue;
                }

                if (generation[tn][tm]) {
                    aliveNeighbours++;
                }
            }
        }
    }

    return aliveNeighbours;
}

function processGeneration() {
    const { generation, count } = state;

    const newGeneration = makeGeneration(count.x, count.y);

    for (let i = 0; i < count.y; i++) {
        for (let j = 0; j < count.x; j++) {
            const cell = generation[i][j];
            const alive = getAliveNeighboursCount(i, j);

            // Any live cell with fewer than two live neighbors dies, as if by underpopulation.
            // Any live cell with two or three live neighbors lives on to the next generation.
            // Any live cell with more than three live neighbors dies, as if by overpopulation.
            // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
            if (cell) {
                newGeneration[i][j] = !(alive < 2 || alive > 3);
            } else if (alive === 3) {
                newGeneration[i][j] = true;
            }
        }
    }

    state.generation = newGeneration;
}

function checkIndex(i, j) {
    const { count } = state;

    return i >= 0 && i < count.y && j >= 0 && j < count.x;
}

function drawCell(i, j, alive) {
    const { offset } = state;

    const x = offset.x + j * (config.cellSize + config.cellGap);
    const y = offset.y + i * (config.cellSize + config.cellGap);

    ctx.fillStyle = alive ? config.colors.aliveCell : config.colors.deadCell;

    ctx.beginPath();
    ctx.rect(x, y, config.cellSize, config.cellSize);
    ctx.closePath();

    ctx.fill();
}

function drawCells() {
    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { generation, count } = state;

    for (let i = 0; i < count.y; i++) {
        for (let j = 0; j < count.x; j++) {
            drawCell(i, j, generation[i][j]);
        }
    }
}

function handleSwitchCell(i, j, alive) {
    const cell = state.generation[i][j];

    if (cell !== alive) {
        state.generation[i][j] = alive;

        drawCells();
    }
}

function handleMouse(e) {
    if (!state.isPlaying || config.liveEdit) {
        if (e.buttons === 1 || e.buttons === 2) {
            const x = e.pageX;
            const y = e.pageY;

            const { offset } = state;

            const j = Math.floor((x - offset.x) / (config.cellSize + config.cellGap));
            const i = Math.floor((y - offset.y) / (config.cellSize + config.cellGap));

            if (checkIndex(i, j)) {
                handleSwitchCell(i, j, e.buttons === 1);
            }
        }
    }
}

function handlePlayPause() {
    if (state.isPlaying) {
        clearInterval(state.intervalId);
        state.isPlaying = false;
    } else {
        state.intervalId = setInterval(() => {
            processGeneration();
            drawCells();
        }, config.interval);
        state.isPlaying = true;
    }
}

function handleStep() {
    if (!state.isPlaying) {
        processGeneration();
        drawCells();
    }
}

function handleReset() {
    if (!state.isPlaying) {
        state.generation = makeGeneration(state.count.x, state.count.y);
        drawCells();
    }
}

function handleKeyboard(e) {
    if (e.code === 'Enter') {
        handlePlayPause();
    } else if (e.code === 'Space') {
        handleStep();
    } else if (e.code === 'KeyR') {
        handleReset();
    } else if (e.code === 'KeyL') {
        config.loopEdges = !config.loopEdges;
    } else if (e.code === 'KeyE') {
        config.liveEdit = !config.liveEdit;
    }
}

function initGeneration() {
    const xCount = Math.floor((window.innerWidth - config.cellGap) / (config.cellSize + config.cellGap));
    const yCount = Math.floor((window.innerHeight - config.cellGap) / (config.cellSize + config.cellGap));

    const xOffset = (window.innerWidth - Math.floor(xCount * (config.cellSize + config.cellGap)) + config.cellGap) / 2;
    const yOffset = (window.innerHeight - Math.floor(yCount * (config.cellSize + config.cellGap)) + config.cellGap) / 2;

    state.generation = makeGeneration(xCount, yCount);

    state.count = {
        x: xCount,
        y: yCount,
    };

    state.offset = {
        x: xOffset,
        y: yOffset,
    };
}

function init() {
    function remake() {
        if (state.intervalId) {
            clearInterval(state.intervalId);
        }

        initGeneration();
        drawCells();
    }
    function playPause() {
        if (state.isPlaying) {
            state.intervalId = setInterval(() => {
                processGeneration();
                drawCells();
            }, config.interval);
        } else {
            clearInterval(state.intervalId);
        }
    }
    function rerun() {
        if (state.isPlaying) {
            clearInterval(state.intervalId);
            state.intervalId = setInterval(() => {
                processGeneration();
                drawCells();
            }, config.interval);
        }
    }

    const gui = new dat.GUI();

    gui.add(state, 'isPlaying').name('Play').onChange(playPause).listen();
    gui.add(config, 'interval', 10, 1000, 10).name('Interval').onFinishChange(rerun);

    gui.add(config, 'cellSize', 10, 50).name('Cell Size').onChange(remake);
    gui.add(config, 'cellGap', 1, 10).name('Cell Gap').onChange(remake);

    gui.add(config, 'loopEdges').name('Loop Edges').listen();
    gui.add(config, 'liveEdit').name('Live Edit').listen();

    const guides = gui.addFolder('Guides')
    const guidesList = guides.domElement.querySelector('ul');
    guidesList.appendChild(Object.assign(document.createElement('li'), { className: 'cr string', innerHTML: 'Reset [R]' }));
    guidesList.appendChild(Object.assign(document.createElement('li'), { className: 'cr string', innerHTML: 'Step [Space]' }));
    guidesList.appendChild(Object.assign(document.createElement('li'), { className: 'cr string', innerHTML: 'Live Edit [E]' }));
    guidesList.appendChild(Object.assign(document.createElement('li'), { className: 'cr string', innerHTML: 'Loop Edges [L]' }));
    guidesList.appendChild(Object.assign(document.createElement('li'), { className: 'cr string', innerHTML: 'Play/Pause [Enter]' }));
    guidesList.appendChild(Object.assign(document.createElement('li'), { className: 'cr string', innerHTML: 'Hide Controls [H]' }));

    canvas.addEventListener('mousedown', handleMouse);
    canvas.addEventListener('mousemove', handleMouse);
    document.addEventListener('keydown', handleKeyboard);

    document.addEventListener('contextmenu', (e) => e.preventDefault());

    remake();
}

init();