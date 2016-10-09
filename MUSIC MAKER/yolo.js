var context = new AudioContext(),
    gainNode = context.createGain(),
    circle = document.querySelector('#circle'),
    mousedown = false,
    oscillator = null;

gainNode.connect(context.destination);

var calculateFrequency = function (mouseXPosition) {
    var minFrequency = 20,
        maxFrequency = 2000;

    return ((mouseXPosition / window.innerWidth) * maxFrequency) + minFrequency;
};

var calculateGain = function (mouseYPosition) {
    var minGain = 0,
        maxGain = 1;

    return 1 - ((mouseYPosition / window.innerHeight) * maxGain) + minGain;
};

var drawCircle = function (x, y) {
    circle.style.background = '#f2ed63';
    circle.style.display = 'block';
    circle.style.left = x + 'px';
    circle.style.top = y + 'px';
    circle.style.position = 'absolute';
    circle.style.width = '10px';
    circle.style.height = '10px';
    circle.style.borderRadius = '50%';
};

var createOscillator = function (e) {
    var xPos = e.clientX,
        yPos = e.clientY;

    if (e.touches) {
        xPos = e.touches[0].clientX;
        yPos = e.touches[0].clientY;
    }

    mousedown = true;

    drawCircle(xPos, yPos);
    oscillator = context.createOscillator();
    oscillator.frequency.setTargetAtTime(calculateFrequency(xPos), context.currentTime, 0.001);
    gainNode.gain.setTargetAtTime(calculateGain(yPos), context.currentTime, 0.001);
    oscillator.connect(gainNode);
    oscillator.start(context.currentTime);
};

var stopOscillator = function () {
    mousedown = false;

    if (oscillator) {
        oscillator.stop(context.currentTime);
        oscillator.disconnect();
    }
};

var changeFrequency = function (e) {
    var xPos = e.clientX,
        yPos = e.clientY;

    if (e.touches) {
        xPos = e.touches[0].clientX;
        yPos = e.touches[0].clientY;
    }

    if (mousedown && oscillator) {
         oscillator.frequency.setTargetAtTime(calculateFrequency(xPos), context.currentTime , 0.001);
         gainNode.gain.setTargetAtTime(calculateGain(yPos), context.currentTime, 0.001);

        drawCircle(xPos, yPos);
    }
};

document.body.addEventListener('mousedown', function (e) {
    createOscillator(e);
});

document.body.addEventListener('touchstart', function (e) {
    createOscillator(e);
});

document.body.addEventListener('mouseup', function () {
    stopOscillator();
});

document.body.addEventListener('touchend', function () {
    stopOscillator();
});

document.body.addEventListener('mousemove', function (e) {
    changeFrequency(e);
});

document.body.addEventListener('touchmove', function (e) {
    changeFrequency(e);
});