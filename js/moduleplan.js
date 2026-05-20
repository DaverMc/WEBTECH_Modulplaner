"use strict";

document.addEventListener("DOMContentLoaded", function () {
    fillModuleList();

    const dialog = document.getElementById("slot_popup");

    const slotSubmit = document.getElementById("slot_submit");
    slotSubmit.addEventListener("click", function () {
        bookSlots();
        dialog.close();
    });

    const slotCancel = document.getElementById("slot_cancel");
    slotCancel.addEventListener("click", function () {
        dialog.close();
    });

    const doubleDialog = document.getElementById("doubled_slot_popup");
    document.getElementById("doubled_overwrite").addEventListener("click", function() {
        onDoubledSlotOverwrite(doubleDialog);
    });

    document.getElementById("doubled_add").addEventListener("click", function() {
        doubleDialog.close();
    });

    document.getElementById("doubled_cancel").addEventListener("click", function() {
        doubleDialog.close();
    });
});

async function onDoubledSlotOverwrite(doubleDialog) {
    const data = await loadModuleList();
    const moduleId = doubleDialog.dataset.module;
    const slotId = doubleDialog.dataset.slot;
    console.log("M: " + moduleId + " S: " + slotId);
    const module = data[moduleId];
    const slot = module.termine[slotId];
    overwriteSlot(slot, module);
    doubleDialog.close();
}

async function loadModuleList() {
    const url = `/api/kurse`;
    console.log("GET FROM " + url);
    try {
        const response = await fetch(url);
        if (response.ok) return await response.json();
        else throw new Error("HTTP-Error Status: " + response.status);
    } catch (error) {
        console.error("Fehler beim laden der Moduldaten", error);
    }
}

async function fillModuleList() {
    const selector = document.getElementById("module_selector");
    const json = await loadModuleList();
    for (const module of json) {
        const li = createModuleEntry(module);
        selector.appendChild(li);
    }
}

function createModuleEntry(module) {
    const li = document.createElement("li");
    li.dataset.id = module.id;
    li.classList.add("module");

    const span = document.createElement("h3");
    span.textContent = module.name;
    
    const details = createModuleDescription(module);

    const button = document.createElement("button");
    button.classList.add("module_register");
    button.textContent = "Anmelden";
    button.addEventListener("click", event => {
        openModuleDialog(module);
    });

    li.appendChild(span);
    li.appendChild(details);
    li.appendChild(button);

    return li;
}

function createModuleDescription(module) {
    const details = document.createElement("details");

    const div = document.createElement("div");
    div.classList.add("module_description");

    const summary = document.createElement("summary");
    summary.textContent = "Beschreibung";

    const teacherP = document.createElement("p");
    teacherP.textContent = "Dozent: " + module.dozent;

    const ectsP = document.createElement("p");
    ectsP.textContent = "ECTS: " + module.ects;

    const intervallP = document.createElement("p");
    intervallP.textContent = "Zeitraum: " + module.starttermin + " - " + module.endtermin;

    const descriptionP = document.createElement("p");
    descriptionP.textContent = module.beschreibung

    div.appendChild(teacherP);
    div.appendChild(ectsP)
    div.appendChild(intervallP);
    div.appendChild(descriptionP);

    details.appendChild(summary);
    details.appendChild(div);

    return details;
}

async function openModuleDialog(module) {
    const slots = document.getElementById("module_slots");
    slots.innerHTML = "";

    let i = 0;
    for (const slot of module.termine) {
        const li = document.createElement("li");
        li.classList.add("module_slot");
        li.dataset.id = i;
        li.dataset.module = module.id - 1;

        const h4 = document.createElement("h4");
        h4.textContent = slot.typ;
        setClassForSlotType(slot, h4);

        const pDay = document.createElement("p");
        pDay.textContent = "Tag: " + slot.tag;

        const pBlock = document.createElement("p");
        pBlock.textContent = "Uhrzeit: " + getTimeByBlockId(slot.block)

        const pRoom = document.createElement("p");
        pRoom.textContent = "Raum: " + slot.raum;

        const pIteration = document.createElement("p");
        pIteration.textContent = slot.wiederholung;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        if (slot.typ == "Vorlesung") checkbox.checked = true;

        li.appendChild(h4);
        li.appendChild(pDay);
        li.appendChild(pBlock);
        li.appendChild(pRoom);
        li.appendChild(pIteration);
        li.appendChild(checkbox);

        slots.appendChild(li);
        i++;
    }

    const dialog = document.getElementById("slot_popup");
    dialog.showModal()
}

function getTimeByBlockId(block) {
    const tr = document.querySelector("#block" + block);
    const th = tr.querySelector("th");
    return th.textContent;
}

async function bookSlots() {
    const data = await loadModuleList();
    for (const element of document.querySelectorAll("#slot_popup .module_slot")) {
        const module = data[element.dataset.module];
        const slot = module.termine[element.dataset.id];

        const checkbox = element.querySelector("input[type='checkbox']");
        if (!checkbox) continue;
        if (!checkbox.checked) continue;

        const tableData = document.querySelector("#block" + slot.block + " ." + slot.tag.toLowerCase());
        const existingH4 = tableData.querySelector("h4");
        const newHeader = module.name + "-" + slot.typ;

        if(existingH4 && existingH4.textContent != "") {
            openDoubledSlotDialog(slot, module);
        } else {
            overwriteSlot(slot, module);
        }

        
    }
}

function openDoubledSlotDialog(slot, module) {
    const doubledDiaglog = document.getElementById("doubled_slot_popup");
    doubledDiaglog.dataset.module = module.id - 1;
    let i = 0;
    for(const s of module.termine) {
        if(s.id == slot.id) break;
        i++;
    }
    doubledDiaglog.dataset.slot = i;
    doubledDiaglog.showModal();
}

function overwriteSlot(slot, module) {
    const tableData = document.querySelector("#block" + slot.block + " ." + slot.tag.toLowerCase());
    const div = document.createElement("div");
    setClassForSlotType(slot, tableData);
    tableData.innerHTML = "";
    const h4 = document.createElement("h4");
    h4.textContent = module.name + "-" + slot.typ;

    const roomP = document.createElement("p");
    roomP.textContent = slot.raum;

    const profP = document.createElement("p");
    profP.textContent = module.dozent;

    div.appendChild(h4);
    div.appendChild(roomP);
    div.appendChild(profP);

    tableData.appendChild(div);
}

function setClassForSlotType(slot, tableData) {
    tableData.classList.remove("vorlesung");
    tableData.classList.remove("uebung");
    tableData.classList.remove("tutorium");

    switch (slot.typ) {
        case "Vorlesung":
            tableData.classList.add("vorlesung");
            break;
        case "Übung":
            tableData.classList.add("uebung");
            break;
        case "Tutorium":
            tableData.classList.add("tutorium");
            break;
        default:
            break;
    }
}