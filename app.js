// ============================================
// LKP 3A - To-Do List pada Portofolio
// JavaScript murni: manipulasi DOM + localStorage
// ============================================

const STORAGE_KEY = "todos";

// ===== STATE =====
let todos = muat();

// ===== DOM ELEMENTS =====
const form = document.querySelector("#form-todo");
const input = document.querySelector("#input-todo");
const list = document.querySelector("#list-todo");
const stats = document.querySelector("#stats");

// ===== FUNCTIONS =====
function muat() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(data) ? data : [];
    } catch (err) {
        // Data rusak atau localStorage diblokir: mulai dari kosong
        return [];
    }
}

function simpan() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (err) {
        console.warn("localStorage tidak dapat dipakai:", err);
    }
}

function render() {
    list.innerHTML = "";

    if (todos.length === 0) {
        const kosong = document.createElement("li");
        kosong.className = "kosong";
        kosong.textContent = "Belum ada tugas. Tambahkan!";
        list.appendChild(kosong);
        stats.textContent = "0 tugas belum selesai";
        return;
    }

    todos.forEach((todo) => {
        const li = document.createElement("li");
        if (todo.selesai) li.classList.add("selesai");

        const cek = document.createElement("input");
        cek.type = "checkbox";
        cek.checked = todo.selesai;
        cek.dataset.id = todo.id;
        cek.setAttribute("aria-label", "Tandai selesai: " + todo.teks);

        const teks = document.createElement("span");
        teks.className = "teks";
        teks.textContent = todo.teks; // textContent: aman dari injeksi HTML

        const hapus = document.createElement("button");
        hapus.type = "button";
        hapus.className = "hapus";
        hapus.dataset.id = todo.id;
        hapus.textContent = "Hapus";

        li.append(cek, teks, hapus);
        list.appendChild(li);
    });

    const belum = todos.filter((t) => !t.selesai).length;
    stats.textContent = `${belum} tugas belum selesai`;
}

function tambahTodo(teks) {
    todos.push({
        id: Date.now(),
        teks: teks.trim(),
        selesai: false
    });
    simpan();
    render();
}

function hapusTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    simpan();
    render();
}

function toggleSelesai(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
        todo.selesai = !todo.selesai;
        simpan();
        render();
    }
}

// ===== EVENTS =====
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim()) {
        tambahTodo(input.value);
        input.value = "";
        input.focus();
    }
});

list.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
        toggleSelesai(Number(e.target.dataset.id));
    }
});

list.addEventListener("click", (e) => {
    if (e.target.classList.contains("hapus")) {
        hapusTodo(Number(e.target.dataset.id));
    }
});

// ===== INIT =====
render();
