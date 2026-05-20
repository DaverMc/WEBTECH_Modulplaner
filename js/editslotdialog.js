import { getSlot, loadModuleList } from "./api.js";
import { removeSlot, updateTimeTable, setBookingNotes, getBooking } from "./timetable.js";

export function initEditDialog() {
    for(const td of document.querySelectorAll("#timetable td")) {
        td.addEventListener("click", event => {
            const div = td.querySelector("div");
            if(!div) return;
            const moduleId = div.dataset.module;
            const slotId = div.dataset.slot;
            openEditDialog(moduleId, slotId);
        });
    }

    const dialog = document.getElementById("edit_slot_popup");
    document.getElementById("edit_submit").addEventListener("click", async function () {
        const data = await loadModuleList();
        const module = data[dialog.dataset.module];
        const slot = getSlot(module, dialog.dataset.slot);
        const notes = dialog.querySelector("textarea");
        const booking = setBookingNotes(slot, module, notes.value);
        dialog.close();
    });
    
    document.getElementById("edit_drop").addEventListener("click", async function () {
        const data = await loadModuleList();
        const module = data[dialog.dataset.module];
        const slot = getSlot(module, dialog.dataset.slot);
        removeSlot(slot, module);
        updateTimeTable();
        dialog.close();
    });
    
    document.getElementById("edit_cancel").addEventListener("click", function () {
        dialog.close();
    });
}

async function openEditDialog(moduleIndex, slotId) {
    const dialog = document.getElementById("edit_slot_popup");
    const form = dialog.querySelector("form");
    form.innerHTML = "";

    const data = await loadModuleList();
    const module = data[moduleIndex];
    const slot = getSlot(module, slotId);
    const booking = getBooking(slot, module);
    
    const h3 = document.createElement("h3");
    h3.textContent = module.name + "-" + slot.typ;

    const pTime = document.createElement("p");
    pTime.textContent = document.querySelector("#block" + slot.block + " th").textContent;

    const notesLabel = document.createElement("label");
    notesLabel.textContent = "Notizen: ";

    const notesField = document.createElement("textarea");
    notesField.id = "notes_field";
    notesField.value = booking.notes;

    form.appendChild(h3);
    form.appendChild(pTime);
    form.appendChild(notesLabel);
    form.appendChild(notesField);

    dialog.dataset.module = moduleIndex;
    dialog.dataset.slot = slotId;
    dialog.showModal();
}