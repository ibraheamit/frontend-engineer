let tiers = [
    { id: 1, name: "خرافي", color: "#FF4444", items: [] },
    { id: 2, name: "ممتاز", color: "#FF8C00", items: [] },
    { id: 3, name: "نص نص", color: "#FFD700", items: [] },
    { id: 4, name: "لا بأس", color: "#FFEB3B", items: [] },
    { id: 5, name: "ألاقل", color: "#4CAF50", items: [] },
];

let unrankedItems = [];
let currentEditingTierId = null;
let draggedElement = null;
let nextItemId = 1;
let nextTierId = 6;

function init() {
    loadFromMemory();
    renderTiers();
    renderUnranked();
}

function renderTiers() {
    const tierList = document.getElementById("tierList");
    tierList.innerHTML = "";

    tiers.forEach((tier, index) => {
        const tierRow = document.createElement("div");
        tierRow.className = "tier-row";
        tierRow.innerHTML = `
                    <div class="tier-label" style="background: ${tier.color
            };" onclick="editTierName(${tier.id})">
                        ${tier.name}
                    </div>
                    <div class="tier-content" data-tier-id="${tier.id}">
                        ${tier.items
                .map(
                    (item) =>
                        `<img src="${item.src}" class="tier-item" data-item-id="${item.id}" draggable="true">`
                )
                .join("")}
                    </div>
                    <div class="tier-controls">
                        <button class="tier-btn" onclick="moveTierUp(${tier.id
            })" ${index === 0 ? "disabled" : ""}>🔼</button>
                        <button class="tier-btn" onclick="openSettings(${tier.id
            })">⚙️</button>
                        <button class="tier-btn" onclick="moveTierDown(${tier.id
            })" ${index === tiers.length - 1 ? "disabled" : ""
            }>🔽</button>
                    </div>
                `;
        tierList.appendChild(tierRow);
    });

    setupDragAndDrop();
}

function renderUnranked() {
    const unrankedArea = document.getElementById("unrankedArea");
    unrankedArea.innerHTML = unrankedItems
        .map(
            (item) =>
                `<img src="${item.src}" class="tier-item" data-item-id="${item.id}" draggable="true">`
        )
        .join("");
    setupDragAndDrop();
}

function setupDragAndDrop() {
    const items = document.querySelectorAll(".tier-item");
    items.forEach((item) => {
        item.addEventListener("dragstart", handleDragStart);
        item.addEventListener("dragend", handleDragEnd);
    });

    const dropZones = document.querySelectorAll(
        ".tier-content, .unranked-content"
    );
    dropZones.forEach((zone) => {
        zone.addEventListener("dragover", handleDragOver);
        zone.addEventListener("drop", handleDrop);
        zone.addEventListener("dragleave", handleDragLeave);
        zone.addEventListener("dragenter", handleDragEnter);
    });
}

function handleDragEnter(e) {
    e.preventDefault();
}

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
}

function handleDragEnd(e) {
    e.target.classList.remove("dragging");
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
    e.dataTransfer.dropEffect = "move";
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove("drag-over");
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");

    if (!draggedElement) return;

    const itemId = parseInt(draggedElement.dataset.itemId);
    const targetTierId = e.currentTarget.dataset.tierId;

    // البحث عن العنصر قبل الحذف
    const item = findItem(itemId);
    if (!item) return;

    // حذف العنصر من جميع الصفوف
    removeItemFromAllTiers(itemId);

    // إضافة العنصر للموقع الجديد
    if (targetTierId) {
        const tier = tiers.find((t) => t.id === parseInt(targetTierId));
        if (tier) {
            tier.items.push({ ...item });
        }
    } else {
        unrankedItems.push({ ...item });
    }

    saveToMemory();
    renderTiers();
    renderUnranked();
    draggedElement = null;
}

function findItem(itemId) {
    for (let tier of tiers) {
        const item = tier.items.find((i) => i.id === itemId);
        if (item) return item;
    }
    return unrankedItems.find((i) => i.id === itemId);
}

function removeItemFromAllTiers(itemId) {
    tiers.forEach((tier) => {
        tier.items = tier.items.filter((item) => item.id !== itemId);
    });
    unrankedItems = unrankedItems.filter((item) => item.id !== itemId);
}

function uploadImages() {
    document.getElementById("fileInput").click();
}

function handleFileSelect(event) {
    const files = event.target.files;
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            unrankedItems.push({
                id: nextItemId++,
                src: e.target.result,
            });
            renderUnranked();
            saveToMemory();
        };
        reader.readAsDataURL(file);
    }
    event.target.value = "";
}

function openSettings(tierId) {
    currentEditingTierId = tierId;
    const tier = tiers.find((t) => t.id === tierId);
    document.getElementById("tierNameInput").value = tier.name;
    document.getElementById("tierColorInput").value = tier.color;
    document.getElementById("settingsModal").classList.add("active");
}

function closeModal() {
    document.getElementById("settingsModal").classList.remove("active");
    currentEditingTierId = null;
}

function saveTierSettings() {
    const tier = tiers.find((t) => t.id === currentEditingTierId);
    tier.name = document.getElementById("tierNameInput").value;
    tier.color = document.getElementById("tierColorInput").value;
    saveToMemory();
    renderTiers();
    closeModal();
}

function deleteTier() {
    if (confirm("هل أنت متأكد من حذف هذا الصف؟")) {
        const tier = tiers.find((t) => t.id === currentEditingTierId);
        unrankedItems.push(...tier.items);
        tiers = tiers.filter((t) => t.id !== currentEditingTierId);
        saveToMemory();
        renderTiers();
        renderUnranked();
        closeModal();
    }
}

function editTierName(tierId) {
    const tier = tiers.find((t) => t.id === tierId);
    const newName = prompt("أدخل الاسم الجديد:", tier.name);
    if (newName) {
        tier.name = newName;
        saveToMemory();
        renderTiers();
    }
}

function moveTierUp(tierId) {
    const index = tiers.findIndex((t) => t.id === tierId);
    if (index > 0) {
        [tiers[index], tiers[index - 1]] = [tiers[index - 1], tiers[index]];
        saveToMemory();
        renderTiers();
    }
}

function moveTierDown(tierId) {
    const index = tiers.findIndex((t) => t.id === tierId);
    if (index < tiers.length - 1) {
        [tiers[index], tiers[index + 1]] = [tiers[index + 1], tiers[index]];
        saveToMemory();
        renderTiers();
    }
}

function addNewTier() {
    const name = prompt("أدخل اسم الصف الجديد:", "صف جديد");
    if (name) {
        tiers.push({
            id: nextTierId++,
            name: name,
            color: "#" + Math.floor(Math.random() * 16777215).toString(16),
            items: [],
        });
        saveToMemory();
        renderTiers();
    }
}

function resetAll() {
    if (confirm("هل أنت متأكد من إعادة تعيين كل شيء؟")) {
        tiers = [
            { id: 1, name: "خرافي", color: "#FF4444", items: [] },
            { id: 2, name: "ممتاز", color: "#FF8C00", items: [] },
            { id: 3, name: "نص نص", color: "#FFD700", items: [] },
            { id: 4, name: "لا بأس", color: "#FFEB3B", items: [] },
            { id: 5, name: "ألاقل", color: "#4CAF50", items: [] },
        ];
        unrankedItems = [];
        nextItemId = 1;
        nextTierId = 6;
        saveToMemory();
        renderTiers();
        renderUnranked();
    }
}

function saveToMemory() {
    const data = {
        tiers: tiers,
        unrankedItems: unrankedItems,
        nextItemId: nextItemId,
        nextTierId: nextTierId,
    };
    try {
        sessionStorage.setItem("tierListData", JSON.stringify(data));
    } catch (e) {
        console.log("حفظ البيانات في الذاكرة");
    }
}

function loadFromMemory() {
    try {
        const saved = sessionStorage.getItem("tierListData");
        if (saved) {
            const data = JSON.parse(saved);
            tiers = data.tiers || tiers;
            unrankedItems = data.unrankedItems || [];
            nextItemId = data.nextItemId || 1;
            nextTierId = data.nextTierId || 6;
        }
    } catch (e) {
        console.log("تحميل البيانات من الذاكرة");
    }
}

init();
