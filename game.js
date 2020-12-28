var canvas = document.getElementById('main');
var ctx = canvas.getContext('2d');
var jump = canvas.height - 20;
var click = score = colorRandom = 0;
var storageName = "highscore";
var highScore = localStorage.getItem(storageName) == null ? 0 : localStorage.getItem(storageName);
var pipeX = canvas.width;
var randomH = (Math.random() * (2 - 0.5) + 0.5).toFixed(3);
var pipeHeight = 45;
var jumpHeight = 50;
var startPipe = pipeHeight * randomH;
var scoreSpeed = 65;
var startGame = restartGame = pressed = false;
var random, up, g, s;

var circle = {
	x: 20,
	y: 0,
	r: 10,
	colour: 'lightslategrey'
}

var pipe = {
	x: 0,
	y: canvas.height - startPipe,
	w: 10,
	h: startPipe,
	colour: ['skyblue', 'lightcoral', 'lightseagreen', 'orchid']
}

var txt = {
	instructHeader: "Instructions:",
	instructTxt: "Click or press space bar to jump",
	startTxt: "(Click or press space bar to start)",
	startBtn: "START",
	restart: "RESTART",
	currentS: "Current score: ",
	highS: "High score: "
}

function startPage() {
	ctx.textAlign = "center";
	ctx.font = "15px Verdana";
	ctx.fillText(txt.instructHeader, canvas.width / 2, 40);
	ctx.fillText(txt.instructTxt, canvas.width / 2, 70);
	ctx.font = "italic 50px Verdana";
	ctx.lineWidth = 1.5;
	ctx.strokeText(txt.startBtn, canvas.width / 2, 150);
	ctx.font = "normal 10px Verdana";
	ctx.fillText(txt.startTxt, canvas.width / 2, 170);
};

startPage();

function drawCircle() {
	ctx.fillStyle = circle.colour;
	ctx.beginPath();
	ctx.arc(circle.x, jump, circle.r, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fill();
}

var loop = function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "black";
	ctx.font = "12px Verdana";
	ctx.fillText(score, 20, 20);

	jump < canvas.height - 20 ? jump += 5 : jump = canvas.height - 20;

	// if (jump < canvas.height - 20) {
	// 	jump += 5;
	// } else {
	// 	jump = canvas.height - 20;
	// }

	circle.y = jump;
	pipeX -= 6;
	if (pipeX < canvas.width && pipeX < -pipe.w * 3) {
		pipeX = canvas.width;
		random = Math.floor(Math.random() * Math.floor(3));
		randomH = (Math.random() * (2 - 0.5) + 0.5).toFixed(3);
		colorRandom = Math.floor(Math.random() * Math.floor(pipe.colour.length));
	}

	ctx.fillStyle = pipe.colour[colorRandom];
	ctx.beginPath();
	for (var i = 0; i <= random; i++) {
		pipe.h = pipeHeight * randomH;
		pipe.y = canvas.height - pipe.h;
		ctx.fillRect(pipeX + (pipe.w * i), pipe.y, pipe.w, pipe.h);
	}
	ctx.fillRect(pipeX, pipe.y, pipe.w, pipe.h);
	ctx.closePath();
	ctx.fill();
	pipe.x = pipeX;

	drawCircle();

	if (jump > canvas.height - 30) {
		click = 0;
	} else if (jump < canvas.height - 20 && jump > jumpHeight) {
		click = 1;
	}

	if (colliding(circle, pipe)) {
		finalScore();
	}
}

function start() {
	var levelSpeed = 25;
	s = setInterval(function() {
		score++;
		if (score % 100 == 0) {
			levelSpeed -= 2;
			clearInterval(g);
			g = setInterval(loop, levelSpeed);
		}
	}, scoreSpeed);
	g = setInterval(loop, levelSpeed);

	startGame = true;
	restartGame = false;
}

function jumpUp() {
	up = setInterval(function() {
		jump < jumpHeight ? (jump = 50, clearInterval(up)) : jump -= 8;
	}, 10);
}

function colliding(circle, rect) {
	var distX = Math.abs(circle.x - rect.x - rect.w / 2);
	var distY = Math.abs(circle.y - rect.y - rect.h / 2);

	if (distX > (rect.w / 2 + circle.r) || distY > (rect.h / 2 + circle.r)) {
		return false;
	}

	if (distX <= (rect.w / 2) || distY <= (rect.h / 2)) {
		return true;
	}

	var dx = distX - rect.w / 2;
	var dy = distY - rect.h / 2;
	return (dx * dx + dy * dy <= (circle.r * circle.r));
}

function finalScore() {
	if (score > highScore) {
		highScore = score;
		localStorage.setItem(storageName, highScore);
	}
	ctx.fillStyle = "black";
	ctx.font = "15px Verdana";
	ctx.fillText(txt.currentS + score, canvas.width / 2, 40);
	ctx.fillText(txt.highS + localStorage.getItem(storageName), canvas.width / 2, 70);
	ctx.font = "italic 50px Verdana";
	ctx.lineWidth = 1.5;
	ctx.strokeText(txt.restart, canvas.width / 2, 150);
	ctx.font = "10px Verdana";
	ctx.fillText(txt.startTxt, canvas.width / 2, 170);

	reset();
}

function reset() {
	clearInterval(g);
	clearInterval(up);
	clearInterval(s);
	jump = canvas.height - 20;
	click = 0;
	score = 0;
	pipeX = canvas.width;
	startGame = false;
	restartGame = true;
}

canvas.addEventListener('click', function(e) {
	if (startGame == false && restartGame == false || restartGame == true) {
		restartGame = false;
		start();
		// e.preventDefault();
		e.stopPropagation();
	}
});

document.addEventListener('click', function(e) {
	if (startGame == true) {
		click === 1 ? e.preventDefault() : jumpUp();
	}
});

window.addEventListener('keydown', function(e) {
	if (e.code === 'Space' && e.target == document.body) {
		e.preventDefault();
	}
});

document.addEventListener('keydown', function(e) {
	if (pressed) {
		return;
	}
	pressed = true;
	if (e.code === 'Space') {
		if (startGame == false && restartGame == false || restartGame == true) {
			restartGame = false;
			start();
		} else {
			click === 1 ? e.preventDefault() : jumpUp();
		}
	}
});

document.addEventListener('keyup', function(e) {
	pressed = false;
	// if (e.code === 'Space') {
	// 	e.preventDefault();
	// }
});
