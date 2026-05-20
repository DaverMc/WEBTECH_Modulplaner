import { loadModuleList } from "./api.js";
import { openDoubledSlotDialog } from "./doubledslotdialog.js";

export function initSlotDialog() {
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
            overwriteSlot(slot, module, false);
        }
    }
}

export function overwriteSlot(slot, module, overwrite) {
    const tableData = document.querySelector("#block" + slot.block + " ." + slot.tag.toLowerCase());
    if(overwrite) tableData.innerHTML = "";

    const div = document.createElement("div");
    setClassForSlotType(slot, div);
    
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

export function setClassForSlotType(slot, div) {
    div.classList.remove("vorlesung");
    div.classList.remove("uebung");
    div.classList.remove("tutorium");

    switch (slot.typ) {
        case "Vorlesung":
            div.classList.add("vorlesung");
            break;
        case "Übung":
            div.classList.add("uebung");
            break;
        case "Tutorium":
            div.classList.add("tutorium");
            break;
        default:
            break;
    }
}

export async function openModuleDialog(module) {
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
