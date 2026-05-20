"use strict";
import "./api.js";
import { loadModuleList } from "./api.js";
import "./slotdialog.js";
import { initSlotDialog, openModuleDialog } from "./slotdialog.js";
import "./doubledslotdialog.js"
import { initDoubledSlotDialog } from "./doubledslotdialog.js";
import "./timetable.js"
import { updateTimeTable, addSlot, initTimeTable } from "./timetable.js";
import "./editslotdialog.js"
import { initEditDialog } from "./editslotdialog.js";

document.addEventListener("DOMContentLoaded", function () {
    fillModuleList();

    initSlotDialog();

    initDoubledSlotDialog();

    initEditDialog();

    initTimeTable();
});

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

