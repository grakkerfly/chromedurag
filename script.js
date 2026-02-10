// DOM Elements
const duragImg = document.getElementById('durag-img');
const logoImg = document.querySelector('.logo-img');
const pfpModal = document.getElementById('pfp-modal');
const closeModalBtn = document.getElementById('close-modal');
const canvas = document.getElementById('pfp-canvas');
const ctx = canvas.getContext('2d');
const canvasPlaceholder = document.getElementById('canvas-placeholder');
const imageUpload = document.getElementById('image-upload');
const uploadBtn = document.getElementById('upload-btn');
const saveBtn = document.getElementById('save-btn');
const duragOptions = document.querySelectorAll('.durag-option');
const scaleControl = document.getElementById('scale-control');
const rotateControl = document.getElementById('rotate-control');
const xControl = document.getElementById('x-control');
const yControl = document.getElementById('y-control');
const scaleValue = document.getElementById('scale-value');
const rotateValue = document.getElementById('rotate-value');
const xValue = document.getElementById('x-value');
const yValue = document.getElementById('y-value');
const musicPlayer = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const copyContractBtn = document.getElementById('copy-contract');
const contractAddress = document.getElementById('contract-address');

// State variables
let uploadedImage = null;
let currentDurag = 'images/durag.png';
let duragImage = new Image();
duragImage.src = currentDurag;

let duragTransform = {
    scale: 1.0,
    rotation: 0,
    x: 200,
    y: 50
};

// Initialize music player
musicPlayer.volume = 0.5;
let isPlaying = false;

// Initialize with a default background
ctx.fillStyle = '#111';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Apply vibration effect to body on intervals
function applyVibration() {
    if (Math.random() > 0.7) {
        document.body.classList.add('vibrate');
        setTimeout(() => {
            document.body.classList.remove('vibrate');
        }, 100);
    }
}

// Apply vibration to various elements
function applyElementVibration(element) {
    if (Math.random() > 0.5) {
        element.style.transform = `translateX(${Math.random() * 2 - 1}px) translateY(${Math.random() * 2 - 1}px)`;
        setTimeout(() => {
            element.style.transform = 'translateX(0) translateY(0)';
        }, 50);
    }
}

// Durag click to open modal
duragImg.addEventListener('click', () => {
    pfpModal.style.display = 'flex';
    // Random vibration on modal open
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            applyElementVibration(pfpModal);
        }, i * 50);
    }
});

// Close modal
closeModalBtn.addEventListener('click', () => {
    pfpModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === pfpModal) {
        pfpModal.style.display = 'none';
    }
});

// Handle image upload
uploadBtn.addEventListener('click', () => {
    imageUpload.click();
});

canvasPlaceholder.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedImage = new Image();
            uploadedImage.onload = () => {
                // Draw the uploaded image on canvas
                drawCanvas();
                // Hide placeholder
                canvasPlaceholder.style.display = 'none';
                canvas.style.display = 'block';
                
                // Apply vibration effect
                applyElementVibration(canvas);
            };
            uploadedImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Handle durag selection
duragOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove active class from all options
        duragOptions.forEach(opt => opt.classList.remove('active'));
        // Add active class to clicked option
        option.classList.add('active');
        // Update current durag
        currentDurag = `images/${option.dataset.durag}`;
        duragImage.src = currentDurag;
        
        // Apply vibration effect
        applyElementVibration(option);
        
        // Redraw canvas
        duragImage.onload = () => {
            drawCanvas();
        };
    });
});

// Handle transform controls
scaleControl.addEventListener('input', (e) => {
    duragTransform.scale = e.target.value / 100;
    scaleValue.textContent = `${e.target.value}%`;
    drawCanvas();
    applyElementVibration(scaleControl);
});

rotateControl.addEventListener('input', (e) => {
    duragTransform.rotation = e.target.value;
    rotateValue.textContent = `${e.target.value}°`;
    drawCanvas();
    applyElementVibration(rotateControl);
});

xControl.addEventListener('input', (e) => {
    duragTransform.x = parseInt(e.target.value);
    xValue.textContent = `${e.target.value}px`;
    drawCanvas();
    applyElementVibration(xControl);
});

yControl.addEventListener('input', (e) => {
    duragTransform.y = parseInt(e.target.value);
    yValue.textContent = `${e.target.value}px`;
    drawCanvas();
    applyElementVibration(yControl);
});

// Draw everything on canvas
function drawCanvas() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw uploaded image if exists
    if (uploadedImage) {
        // Calculate dimensions to fit canvas while maintaining aspect ratio
        const ratio = Math.min(canvas.width / uploadedImage.width, canvas.height / uploadedImage.height);
        const width = uploadedImage.width * ratio;
        const height = uploadedImage.height * ratio;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;
        
        ctx.drawImage(uploadedImage, x, y, width, height);
    } else {
        // Draw default background
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw durag if image is loaded
    if (duragImage.complete) {
        ctx.save();
        
        // Move to durag position
        ctx.translate(duragTransform.x, duragTransform.y);
        
        // Rotate durag
        ctx.rotate(duragTransform.rotation * Math.PI / 180);
        
        // Scale durag
        const scaledWidth = duragImage.width * duragTransform.scale;
        const scaledHeight = duragImage.height * duragTransform.scale;
        
        // Draw durag centered
        ctx.drawImage(duragImage, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
        
        ctx.restore();
    }
}

// Handle save PFP
saveBtn.addEventListener('click', () => {
    // Create a temporary link to download the canvas image
    const link = document.createElement('a');
    link.download = 'chrome-durag-pfp.png';
    link.href = canvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Apply vibration effect
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            applyElementVibration(saveBtn);
        }, i * 100);
    }
});

// Music player controls
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        musicPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        musicPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        
        // Apply vibration on play
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                applyVibration();
            }, i * 200);
        }
    }
    isPlaying = !isPlaying;
    
    // Apply vibration effect to button
    applyElementVibration(playPauseBtn);
});

// Copy contract address
copyContractBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(contractAddress.textContent)
        .then(() => {
            // Change icon to checkmark temporarily
            const icon = copyContractBtn.querySelector('i');
            const originalClass = icon.className;
            icon.className = 'fas fa-check';
            
            // Apply vibration effect
            applyElementVibration(copyContractBtn);
            
            setTimeout(() => {
                icon.className = originalClass;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
});

// Apply random vibrations to various elements periodically
function applyRandomVibrations() {
    // Randomly vibrate logo
    if (Math.random() > 0.8) {
        applyElementVibration(logoImg);
    }
    
    // Randomly vibrate navbar elements
    if (Math.random() > 0.9) {
        const navLinks = document.querySelectorAll('.nav-link');
        const randomLink = navLinks[Math.floor(Math.random() * navLinks.length)];
        applyElementVibration(randomLink);
    }
    
    // Randomly vibrate music button
    if (Math.random() > 0.85 && isPlaying) {
        applyElementVibration(playPauseBtn);
    }
}

// Initialize with some vibration
setTimeout(() => {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            applyVibration();
        }, i * 300);
    }
}, 1000);

// Set up periodic vibrations
setInterval(applyVibration, 3000);
setInterval(applyRandomVibrations, 1500);

// Apply initial vibration to durag for effect
setTimeout(() => {
    applyElementVibration(duragImg);
}, 500);

// Initialize durag image
duragImage.onload = () => {
    drawCanvas();
};