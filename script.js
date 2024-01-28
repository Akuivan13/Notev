document.addEventListener("DOMContentLoaded", function () {
    loadNotes();
});

function addNote() {
    var noteInput = document.getElementById("noteInput");

    if (noteInput.value.trim() !== "") {
        var noteText = noteInput.value;
        var cleanText = sanitizeHTML(noteText);

        var note = {
            text: cleanText,
            timestamp: new Date().toISOString(),
            deleted: false  // Tambahkan atribut deleted dan setel ke false
        };

        addNoteToList(note);
        saveNoteToLocalStorage(note);

        noteInput.value = "";
    }
}

function editNote(btn) {
    var li = btn.parentNode;
    var noteText = li.firstChild.nodeValue.trim();

    var editedNoteText = prompt("Edit catatan:", noteText);

    if (editedNoteText !== null) {
        var cleanText = sanitizeHTML(editedNoteText);

        li.firstChild.nodeValue = cleanText;

        // Update catatan di local storage
        updateNoteInLocalStorage(noteText, cleanText);
    }
}

function copyNote(btn) {
    var li = btn.parentNode;
    var noteText = li.firstChild.nodeValue.trim();

    navigator.clipboard.writeText(noteText)
        .then(function () {
            alert("Catatan telah disalin ke clipboard!");
        })
        .catch(function (err) {
            console.error('Tidak dapat menyalin ke clipboard: ', err);
        });
}

function deleteNote(btn) {
    var li = btn.parentNode;
    var noteText = li.firstChild.nodeValue.trim();

    // Tandai catatan sebagai dihapus
    markNoteAsDeleted(noteText);

    li.parentNode.removeChild(li);
}

function addNoteToList(note) {
    if (!note.deleted) {
        var notesList = document.getElementById("notesList");
        var li = document.createElement("li");
        li.className = "note";
        li.innerHTML = sanitizeHTML(note.text) +
            ' <button class="editNoteBtn" onclick="editNote(this)">Edit</button>' +
            ' <button class="copyNoteBtn" onclick="copyNote(this)">Salin</button>' +
            ' <button class="deleteNoteBtn" onclick="deleteNote(this)">Hapus</button>';
        notesList.appendChild(li);
    }
}


function saveNoteToLocalStorage(note) {
    var notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
}

function markNoteAsDeleted(noteText) {
    var notes = JSON.parse(localStorage.getItem("notes")) || [];

    for (var i = 0; i < notes.length; i++) {
        if (notes[i].text === noteText) {
            notes[i].deleted = true;
            localStorage.setItem("notes", JSON.stringify(notes));
            break;
        }
    }
}

function updateNoteInLocalStorage(oldText, newText) {
    var notes = JSON.parse(localStorage.getItem("notes")) || [];

    for (var i = 0; i < notes.length; i++) {
        if (notes[i].text === oldText) {
            notes[i].text = newText;
            localStorage.setItem("notes", JSON.stringify(notes));
            break;
        }
    }
}

function loadNotes() {
    var notes = JSON.parse(localStorage.getItem("notes")) || [];
    var notesList = document.getElementById("notesList");

    notes.forEach(function (note) {
        addNoteToList(note);
    });
}

function sanitizeHTML(text) {
    var temp = document.createElement("div");
    temp.textContent = text;
    return temp.innerHTML;
}
