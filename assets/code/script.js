const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Mouse Position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 100) * (canvas.width / 100)
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.baseDirectionX = directionX; // Grundrichtung
        this.baseDirectionY = directionY;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        
        ctx.shadowColor = '#EBDDE3';
        ctx.shadowBlur = 10;

        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    update() {
        // Kollision mit Rand
        if (this.x > canvas.width - this.size) {
            this.x = canvas.width - this.size;
            this.baseDirectionX = -this.baseDirectionX;
        }
        if (this.x < this.size) {
            this.x = this.size;
            this.baseDirectionX = -this.baseDirectionX;
        }
        if (this.y > canvas.height - this.size) {
            this.y = canvas.height - this.size;
            this.baseDirectionY = -this.baseDirectionY;
        }
        if (this.y < this.size) {
            this.y = this.size;
            this.baseDirectionY = -this.baseDirectionY;
        }

        // Mausabstoßung
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let forceX = 0;
        let forceY = 0;

        if (distance < mouse.radius + this.size) {
            let angle = Math.atan2(dy, dx);
            let force = (mouse.radius + this.size - distance) / (mouse.radius + this.size);
            forceX = Math.cos(angle) * force * 10;
            forceY = Math.sin(angle) * force * 10;
        }

        // Neue Richtung = Grundbewegung - Mausabstoßung
        this.directionX = this.baseDirectionX - forceX;
        this.directionY = this.baseDirectionY - forceY;

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

// Initialisierung
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = Math.random() * (innerWidth - size * 2) + size * 2;
        let y = Math.random() * (innerHeight - size * 2) + size * 2;
        let directionX = (Math.random() * 2) - 1;  // etwas sanfter
        let directionY = (Math.random() * 2) - 1;
        let color = '#EBDDE3';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Animation
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

// Resize
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.height / 100) * (canvas.width / 100);
    init();
});

init();
animate();
