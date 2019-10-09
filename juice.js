let w = 0, h = 0;
const image = new Image();

function fixSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const canvas = document.getElementById('kaleidoscopeCanvas');
    canvas.width = w;
    canvas.height = h;
}

function pageLoad() {

    window.addEventListener("resize", fixSize);
    fixSize();

    image.src = "interstellar.jpg";
    image.onload = () => window.requestAnimationFrame(redraw);

}

const opp = 240, adj = 416, hyp = 480;

const triangleCanvas = new OffscreenCanvas(opp, adj);
const hexagonCanvas = new OffscreenCanvas(2*hyp, 2*adj);

let lastTimestamp = 0;
let angle = 0;

function redraw(timestamp) {

    if (lastTimestamp === 0) lastTimestamp = timestamp;
    const frameLength = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    angle += frameLength / 4;

    renderTriangle();
//    const canvas = document.getElementById('kaleidoscopeCanvas');
//const context = canvas.getContext('2d');


//context.drawImage(triangleCanvas, 0, 0);

    renderHexagon();

    renderKaleidoscope();

        const canvas = document.getElementById('kaleidoscopeCanvas');
        const context = canvas.getContext('2d');


        context.drawImage(kaleidoscopeCanvas, 0, 0);
    window.requestAnimationFrame(redraw);

}

function renderTriangle() {

    const context = triangleCanvas.getContext('2d');

    context.clearRect(0,0,opp,adj);

    context.fillStyle = 'white';
    context.globalCompositeOperation="source-over";

    context.beginPath();
    context.moveTo(50, 50);
    context.lineTo(50, adj);
    context.lineTo(opp, adj);
    context.lineTo(100, 100);
    context.fill();

    context.globalCompositeOperation="source-in";

    context.save();
    context.translate(opp/4, adj/10)
    context.rotate(angle);
    context.drawImage(image, -image.width/1.5, -image.height/2);
    context.restore();

}

function renderHexagon() {

    const context = hexagonCanvas.getContext('2d');

    context.save();

    context.translate(hyp,adj);

    for (let j = 0; j < 1000; j ++) {

        context.drawImage(triangleCanvas,0,0);

        context.scale(-1,1);
        context.drawImage(triangleCanvas,0,0);
        context.scale(-1,1);

        context.rotate(Math.PI/500);

    }

    context.restore();

}

function renderKaleidoscope() {

    const canvas = document.getElementById('kaleidoscopeCanvas');
    const context = canvas.getContext('2d');

    context.fillStyle = 'black';
    context.fillRect(0,0,w,h);

    context.save();
    context.translate(w/2-hyp, h/2-adj);

    context.globalAlpha = 1;
    context.drawImage(hexagonCanvas, 0,0);

    context.globalAlpha = 0.5;
    for (let i = 0; i < 6; i++) {
        context.drawImage(hexagonCanvas, 2*adj*Math.sin(i*Math.PI/3),2*adj*Math.cos(i*Math.PI/3));
    }

    context.restore();

}
