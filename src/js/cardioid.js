class point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}


//==================================//
//             Variables            //
//==================================//

var p = {
    nb_point: 300,
    color: 'rgba(255,255,255,0.3)',
    maxSpeed: 200,
    speedUI: 110
}

var factor = 0
var stats;
var point_array = []

var width = 1000

var canvas
var canvasPoint
var ctx
var ctxPoint
var speedDivided = 1000000;

var savedCanvas;
var savedCtx;

p.speedUI = p.maxSpeed / 2
var speed = p.speedUI / speedDivided


var gui = new dat.GUI();
const parametersFolder = gui.addFolder("Parameters")


parametersFolder.add(p, 'nb_point', 10, 300).name("Points Number").onChange(function() {
    setupCardioid()
})



gui.__folders["Parameters"].open()

var grd

//==================================//
//            Functions             //
//==================================//

init()

function init() {
    point_array = []
    statsSetup()
    setupCanvas()
    setupGradient()
    setupSlider()
    setupCardioid()
    animate()
    updateSpeed()
    togglePlay(true)
}

function statsSetup() {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.left = '0px';
    stats.domElement.style.zIndex = '2';
    document.body.appendChild(stats.domElement);
}

function setupGradient() {
    grd = ctx.createLinearGradient(-width / 2, -width / 2, width / 2, width / 2);
    grd.addColorStop(0.044, 'rgba(245, 162, 149, 1)');
    grd.addColorStop(0.978, 'rgba(245, 213, 149, 1)');
}


function animate() {

    requestAnimationFrame(animate)
        // ctx.clearRect(-width / 2, -width / 2, width, width)

    // ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = "#393939";
    ctx.fillRect(-width / 2, -width / 2, width, width)

    draw_Line()
        // ctx.globalCompositeOperation = 'source-in';
        // ctx.fillStyle = grd;
        // ctx.fillRect(-width / 2, -width / 2, width, width)

    $('#multiplier').text("Factor : " + factor.toFixed(2))
    stats.update();
}


function setupCanvas() {
    canvas = document.getElementById('canvas')
    canvasPoint = document.getElementById('canvasPoint')
    savedCanvas = document.createElement("canvas");

    canvas.width = width
    canvas.height = width

    canvasPoint.width = width
    canvasPoint.height = width

    savedCanvas.width = width
    savedCanvas.height = width

    ctx = canvas.getContext('2d')
    ctx.translate(width / 2, width / 2)
    savedCtx = savedCanvas.getContext('2d')

    ctxPoint = canvasPoint.getContext('2d')
    ctxPoint.translate(width / 2, width / 2)
}


function setupSlider() {
    $("#minSpeed").text(-p.maxSpeed / 2)
    $("#maxSpeed").text(p.maxSpeed / 2)

    $("#speedSlider").slider({
        range: "min",
        value: p.speedUI,
        min: 0,
        max: p.maxSpeed,
        step: 1,
        slide: function(event, ui) {
            togglePlay(true)
            updateSpeed()
        }
    });
    $("#speedSlider").slider("value", (p.maxSpeed / 2) * 1.1)
}

function updateSpeed() {
    p.speedUI = $("#speedSlider").slider("value");
    speed = (p.speedUI - (p.maxSpeed / 2)) / speedDivided
}



function setupCardioid() {
    total = p.nb_point
    ctxPoint.clearRect(-width / 2, -width / 2, width, width)

    for (var i = 0; i < total; i++) {
        angle = map(i, 0, total, 0, Math.PI * 2)
        x = width / 2 * Math.cos(angle)
        y = width / 2 * Math.sin(angle)

        point_array[i] = new point(x, y)




        ctxPoint.beginPath()
        ctxPoint.arc(x * 0.99, y * 0.99, 4, 0, Math.PI * 2)
        ctxPoint.fillStyle = "rgba(245, 213, 149, 1)"

        ctxPoint.fill()
        ctxPoint.closePath()




    }
}





var a
var b

function draw_Line() {
    for (var i = 0; i < total; i++) {
        factor += speed
        if (factor < 0) {
            factor = 0
        }

        a = point_array[i]
        tmp = Math.floor(i * factor % total)
        b = point_array[tmp]

        ctx.beginPath()
        ctx.lineWidth = 1

        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = grd
        ctx.stroke()

        ctx.closePath()

    }
}


function map(n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}


//==================================//
//            Control               //
//==================================//
var isPlaying = true;

function togglePlay(state) {
    if (state != null)
        isPlaying = state
    else
        isPlaying = !isPlaying;

    if (isPlaying) {
        updateSpeed()
        $("#button_pause").show()
        $("#button_play").hide()

    } else {
        speed = 0
        $("#button_play").show()
        $("#button_pause").hide()
    }
}

function controlUp(control) {
    speed = 0;
    console.log("Up" + control)
}

function controlDown(control) {
    togglePlay(false)
    var speedControl = 1 / speedDivided
    if (control == "backward")
        speed = -speedControl
    else
        speed = speedControl
}


function saveImageToList() {

    savedCtx.drawImage(canvas, 0, 0);
    savedCtx.drawImage(canvasPoint, 0, 0);

    var savedImg = savedCanvas.toDataURL("image/png");


    let li = document.createElement("li")
    let img = document.createElement("img")
    img.src = savedImg

    let iconDownload = document.createElement("i")
    iconDownload.className = "fa fa-download icons"

    let iconTrash = document.createElement("i")
    iconTrash.className = "fa fa-trash icons";



    let link = document.createElement('a');
    link.href = window.location.href = savedImg;
    link.download = factor + '.jpg';
    iconDownload.appendChild(link);


    iconDownload.onclick = function() {
        link.click();
    };

    iconTrash.onclick = function() {
        this.parentElement.remove();
    };

    li.append(img)
    li.append(iconDownload)
    li.append(iconTrash)

    $("#savedImageList").append(li)
}

function deleteSavedImage(parent) {
    console.log(parent);
}

function factorControl(offset) {
    togglePlay(false)
    offset = parseInt(offset)
    factor = Math.round(factor + offset)


}