class WaveNoise {
	constructor (requiredWaves, speed) {
		this.wavesSet = [];
		this.speed = speed || 1;

		for (let i = 0; i < requiredWaves; i++) {
			this.wavesSet.push(Math.random() * 360);
		}
	};

	//получить текущее значение
	getValue () {
		let blendedWave = 0;

		//считаем сумму синус волн
		this.wavesSet.forEach(e => {
			blendedWave += Math.sin(e / 180 * Math.PI);
		});

		//результат масштабируем до диапозона от 0 до 1
		return (blendedWave / this.wavesSet.length + 1) / 2;
	};

	//обновить значения
	update () {
		this.wavesSet.forEach((e, i) => {
			this.wavesSet[i] = (e + (Math.random() * (i + 1) * this.speed)) % 360;
		});
	};
};

//поиск и настройка холста
const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

//адаптация холста
const resize = function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
};

resize();

window.onresize = resize;

//эффект снега
const configSnow = {
	maxParticleSize: 7,
	swingSpeed: 2.3,
	fallSpeed: 3,
	spawn: 4,
};

//случайное число
const random = (min, max) => {return Math.random() * (max - min) + min};

//нарисовать круг
const circle = function (x, y, radius) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, true);
	ctx.fill();
};

//частичка снега
class SnowParticle {
	constructor () {
		this.x = Math.random() * canvas.width;
		this.y = -configSnow.maxParticleSize;
		this.z = random(0.3, 1);
		this.size = this.z * configSnow.maxParticleSize;
		this.noise = new WaveNoise(10, 0.7);
	};

	//нарисовать частицу
	draw () {
		ctx.globalAlpha = this.z;
		circle(this.x, this.y, this.size);
	};

	//передвинуть частицу
	move () {
		let c = this.noise.getValue() * 2 - 1;

		this.x += c * configSnow.swingSpeed * this.z + (this.z - 0.65) * configSnow.swingSpeed * 0.4;
		this.y += (1 - Math.abs(c)) * configSnow.fallSpeed * this.z;

		this.noise.update();
	};
};


class Snow {
	constructor () {
		this.particles = [];
		this.spawn = 0;
	};


	addParticle () {
		this.spawn++;
		if (this.spawn >= configSnow.spawn) {
			this.spawn = 0;
			this.particles.push(new SnowParticle());
		}
	};

	
	deleteParicles () {
		for (let i in this.particles) {
			if (this.particles[i].y > canvas.height + configSnow.maxParticleSize) {
				this.particles.splice(i, 1);
			}
		}
	};

	//инициализация
	init () {
		this.addParticle();
		this.deleteParicles();

		ctx.save();

		ctx.fillStyle = "white";

		this.particles.map(e => {
			e.move();
			e.draw();
		});

		ctx.restore();
	};
};

const snow = new Snow();

//анимация
const loop = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    snow.init();
    requestAnimationFrame(loop);
};

//при загрузке
window.onload = loop;