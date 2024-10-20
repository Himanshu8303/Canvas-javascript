const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const statusDiv = document.getElementById('status');

let isDragging = false;
let startX, startY;
let circles = [];

// Function to generate random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to draw a circle
function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// Handle mouse down event (start drawing)
canvas.addEventListener('mousedown', (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    isDragging = true;
});

// Handle mouse up event (finish drawing)
canvas.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    const endX = e.offsetX;
    const endY = e.offsetY;
    
    // Calculate radius based on mouse drag distance
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    
    if (radius > 0) {
        // Generate random color for the circle
        const color = getRandomColor();
        
        // Draw the circle
        drawCircle(startX, startY, radius, color);
        
        // Store circle data
        circles.push({
            x: startX,
            y: startY,
            radius,
            color
        });
    }
});

// Handle mouse click event for hit/miss detection
canvas.addEventListener('click', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Check if click is inside any circle
    let hit = false;
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        const distance = Math.sqrt(Math.pow(mouseX - circle.x, 2) + Math.pow(mouseY - circle.y, 2));
        if (distance <= circle.radius) {
            hit = true;
            break; // Stop checking once we know it's a hit
        }
    }
    
    // Update status based on whether a circle was hit or not
    if (hit) {
        statusDiv.innerText = 'Hit';
    } else {
        statusDiv.innerText = 'Miss';
    }
});

// Handle double click event to delete a circle
canvas.addEventListener('dblclick', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Find the circle to delete (if any)
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        const distance = Math.sqrt(Math.pow(mouseX - circle.x, 2) + Math.pow(mouseY - circle.y, 2));
        if (distance <= circle.radius) {
            // Remove the circle from the array
            circles.splice(i, 1);
            break;
        }
    }

    // Redraw canvas after deleting
    redrawCanvas();
});

// Function to redraw all circles
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => {
        drawCircle(circle.x, circle.y, circle.radius, circle.color);
    });
}

// Handle reset button click (clear canvas)
resetButton.addEventListener('click', () => {
    circles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    statusDiv.innerText = '';
});
