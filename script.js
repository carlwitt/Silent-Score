let currentChallenge = 1;
const totalChallenges = 7;
let showingSolution = false;
const notes = {}; // Object to store notes for each challenge

// Add links to the solution images
const solutionLinks= {
    1: 'https://imslp.org/wiki/Brandenburg_Concerto_No.1_in_F_major,_BWV_1046_(Bach,_Johann_Sebastian)',
    2: 'https://imslp.org/wiki/Water_Music,_HWV_348-350_(Handel,_George_Frideric)',
    3: 'https://imslp.org/wiki/Violin_Concerto_in_G_minor,_RV_315_(Vivaldi,_Antonio)',
    4: 'https://imslp.org/wiki/Symphony_No.5,_Op.67_(Beethoven,_Ludwig_van)',
    5: 'https://imslp.org/wiki/Die_Schöpfung%2C_Hob.XXI:2_(Haydn%2C_Joseph)',
    6: 'https://imslp.org/wiki/Symphony_No.1%2C_Op.68_(Brahms%2C_Johannes)',
    7: 'https://imslp.org/wiki/Die_Walküre,_WWV_86B_(Wagner,_Richard)'
};

document.getElementById('toggleSolution').addEventListener('click', () => {
    showingSolution = !showingSolution;
    updateImage();
});

document.getElementById('prev').addEventListener('click', () => {
    if (currentChallenge > 1) {
        currentChallenge--;
        showingSolution = false;
        updateImage();
    }
});

document.getElementById('next').addEventListener('click', () => {
    if (currentChallenge < totalChallenges) {
        currentChallenge++;
        showingSolution = false;
        updateImage();
    }
});

// Add a click event to place notes on the image container
document.getElementById('imageContainer').addEventListener('click', function (event) {
    // Prevent adding notes if clicking on an existing note
    if (event.target.tagName === 'TEXTAREA') return;

    const x = event.offsetX;
    const y = event.offsetY;
    addNote(x, y);
});

// Function to update the displayed image and load notes
function updateImage() {
    const imageElement = document.getElementById('displayImage');
    const toggleButton = document.getElementById('toggleSolution');
    const linkContainer = document.getElementById('linkContainer');
    const solutionLink = document.getElementById('solutionLink');

    if (showingSolution) {
        imageElement.src = `images/s-${currentChallenge}.png`;
        toggleButton.textContent = 'Show Challenge';
        linkContainer.style.display = 'block';
        solutionLink.href = solutionLinks[currentChallenge];
        solutionLink.textContent = solutionLinks[currentChallenge];
    } else {
        imageElement.src = `images/c-${currentChallenge}.png`;
        toggleButton.textContent = 'Show Solution';
        linkContainer.style.display = 'none';
    }

    // Clear existing notes and load saved notes
    document.querySelectorAll('.note').forEach(note => note.remove());
    if (notes[currentChallenge]) {
        notes[currentChallenge].forEach(note => {
            addNote(note.x, note.y, note.text);
        });
    }

    document.getElementById('prev').disabled = currentChallenge === 1;
    document.getElementById('next').disabled = currentChallenge === totalChallenges;
}

// Function to add a note at the specified coordinates
function addNote(x, y, text = '') {
    const note = document.createElement('textarea');
    note.className = 'note';
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
    note.value = text;
    note.addEventListener('input', saveNotes);

    // Make the note draggable
    note.addEventListener('mousedown', startDrag);

    document.getElementById('imageContainer').appendChild(note);
    note.focus();
}

// Function to save all notes for the current challenge
function saveNotes() {
    const noteElements = document.querySelectorAll('.note');
    notes[currentChallenge] = Array.from(noteElements).map(note => ({
        x: note.offsetLeft,
        y: note.offsetTop,
        text: note.value
    }));
}

// Dragging functionality
let dragNote = null;
let offsetX, offsetY;

function startDrag(event) {
    dragNote = event.target;
    offsetX = event.offsetX;
    offsetY = event.offsetY;

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
}

function drag(event) {
    if (!dragNote) return;
    dragNote.style.left = `${event.pageX - offsetX - dragNote.parentElement.offsetLeft}px`;
    dragNote.style.top = `${event.pageY - offsetY - dragNote.parentElement.offsetTop}px`;
}

function endDrag() {
    if (dragNote) saveNotes();
    dragNote = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', endDrag);
}
