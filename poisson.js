var canvas;
var width;
var height;
var r;
var k = 30; 
var grid = [];
var w;
var active = [];
var cols, rows;

function init() {
    console.log("Starting");

    width = window.innerWidth;
    height = window.innerHeight;

    canvas = document.querySelector('canvas')

    canvas.width = width;
    canvas.height = height;

    grid = [];
    active = [];

    if (document.getElementById('radius')) {
        r = parseInt(document.getElementById("radius").value);
    } else {
        r = 50;
    }

    w = r / Math.sqrt(2);

    // STEP 0
    cols = Math.floor(width / w);
    rows = Math.floor(height / w);  
    for (let i = 0; i < cols * rows; i++) {
        grid[i] = -1;
    }

    // STEP 1
    var x = Math.floor(Math.random() * width);
    var y = Math.floor(Math.random() * height);
    var i = Math.floor(x / w);
    var j = Math.floor(y / w);
    var pos = [x, y];
    grid[i + j * cols] = pos;
    active.push(pos);

    window.requestAnimationFrame(draw);
}

function drawGrid() {
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;

    for (let i = 1; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(w * i, 0);
        ctx.lineTo(w * i, height);
        ctx.stroke();
    }

    for (let i = 1; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, w * i);
        ctx.lineTo(width, w * i);
        ctx.stroke();
    }
}

function draw() {
    var ctx = canvas.getContext('2d');

    // STEP 2
    if (active.length > 0) {
        var randIndex = Math.floor(Math.random() * active.length);
        var pos = active[randIndex];
        var found = false;
        for (let n = 0; n < k; n++) {
            var a = Math.random() * Math.PI * 2;                // Get random angle
            var m = (Math.random() * r) + r;                    // Get random magnitude between r and 2r
            var sample = [(Math.cos(a) * m) + pos[0], (Math.sin(a) * m) + pos[1]];    // Create vector of a * m

            var col = Math.floor(sample[0] / w);
            var row = Math.floor(sample[1] / w);

            if (col >= 0 && row >= 0 && col <= cols && row <= rows && grid[col + row * cols] == -1) {
                var ok = true;
                for (let i = -1; i <= 1; i++) {                
                    for (let j = -1; j <= 1; j++) {      
                        var index = col + i + (row + j) * cols;
                        var neighbor = grid[index];

                        if (neighbor != undefined && neighbor != -1) {
                            var d = Math.sqrt(
                                (neighbor[0] - sample[0]) * (neighbor[0] - sample[0]) +
                                (neighbor[1] - sample[1]) * (neighbor[1] - sample[1]));      // Distance between neighbor and sample

                            if (d < r) {
                                ok = false;
                            }
                        }
                    }
                }
                if (ok) {
                    found = true;
                    grid[col + row * cols] = sample;
                    active.push(sample);

                    break;

                }
            }
        }

        if (!found) {
            active.splice(randIndex, 1);
        }
    }

    // Actually draw stuff
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000000';

    if (document.getElementById('showGrid').checked) {
        drawGrid();
    }

    for (let i = 0; i < grid.length; i++) {
        if (grid[i]) {
            // Draw small black square
            ctx.fillRect(grid[i][0] - 3, grid[i][1] - 3, 6, 6);
        }
    }

    ctx.fillStyle = '#FF0000';

    for (let i = 0; i < active.length; i++) {
        // Draw larger red square on top of black square
        ctx.fillRect(active[i][0] - 4, active[i][1] - 4, 8, 8);
    }

    window.requestAnimationFrame(draw);
}

document.onload = init();

// document.getElementById("generate").addEventListener("click", function() {
//     init();
// });