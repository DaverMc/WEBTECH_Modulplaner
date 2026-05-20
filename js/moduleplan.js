"use strict";

document.addEventListener("DOMContentLoaded", function () {
    fillModuleList();

    const dialog = document.getElementById("slot_popup");

    const popupSubmit = document.getElementById("popup_submit");
    popupSubmit.addEventListener("click", function () {
        bookSlots();
        dialog.close();
    });

    const popup_cancel = document.getElementById("popup_cancel");
    popup_cancel.addEventListener("click", function () {
        dialog.close();
    });
});

async function loadModuleList() {
    const url = `/api/kurse`;
    console.log("GET FROM " + url);
    try {
        const response = await fetch(url);
        if(response.ok) return await response.json();
        else throw new Error("HTTP-Error Status: " + response.status);
    } catch (error) {
        console.error("Fehler beim laden der Moduldaten", error);
    }
}

async function fillModuleList() {
    const selector = document.getElementById("module_selector");
    const json = await loadModuleList();
    for(const module of json) {
        const li = createModuleEntry(module);
        selector.appendChild(li);
    }
}

function createModuleEntry(module) {
    const button = document.createElement("button");
        button.classList.add("module_register");
        button.textContent= "Anmelden";
        button.addEventListener("click", event => {
            openModuleDialog(module);
        });

        const span = document.createElement("span");
        span.textContent = module.name;

        const li = document.createElement("li");
        li.dataset.id = module.id;
        li.classList.add("module");
        
        const details = document.createElement("details");
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

        details.appendChild(summary);
        details.appendChild(teacherP);
        details.appendChild(ectsP)
        details.appendChild(intervallP);
        details.appendChild(descriptionP);

        li.appendChild(span);
        li.appendChild(details);
        li.appendChild(button);

        return li;
}

async function openModuleDialog(module) {
    const slots = document.getElementById("module_slots");
    slots.innerHTML = "";

    let i = 0;
    for(const slot of module.termine) {
        const li = document.createElement("li");
        li.classList.add("module_slot");
        li.dataset.id = i;
        li.dataset.module = module.id - 1;
        
        const h4 = document.createElement("h4");
        h4.textContent = slot.typ;

        const pDay = document.createElement("p");
        pDay.textContent = "Tag: " + slot.tag;

        const pBlock = document.createElement("p");
        pBlock.textContent = "Block: " + slot.block;

        const pRoom = document.createElement("p");
        pRoom.textContent = "Raum: " + slot.raum;

        const pIteration = document.createElement("p");
        pIteration.textContent = slot.wiederholung;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        if(slot.typ == "Vorlesung") checkbox.checked = true;

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

async function bookSlots() {
    const data = await loadModuleList();
    for(const element of document.querySelectorAll("#slot_popup .module_slot")) {
        const module = data[element.dataset.module];
        const slot = module.termine[element.dataset.id];

        const checkbox = element.querySelector("input[type='checkbox']");
        if(!checkbox) continue;
        if(!checkbox.checked) continue;
    
        const tableData = document.querySelector("#block" + slot.block + " ." + slot.tag.toLowerCase());
        tableData.textContent = module.name + "-" + slot.typ;
    }
}