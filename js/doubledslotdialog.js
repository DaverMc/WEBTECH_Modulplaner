import { loadModuleList, setClassForSlotType, writeSlot } from "./api.js";

export function initDoubledSlotDialog() {
     const doubleDialog = document.getElementById("doubled_slot_popup");
        document.getElementById("doubled_overwrite").addEventListener("click", function() {
            writeDoubledSlot(doubleDialog, true);
        });
    
        document.getElementById("doubled_add").addEventListener("click", function() {
            writeDoubledSlot(doubleDialog, false)
        });
    
        document.getElementById("doubled_cancel").addEventListener("click", function() {
            doubleDialog.close();
        });
}


export function openDoubledSlotDialog(slot, module) {
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

async function writeDoubledSlot(doubleDialog, overwrite) {
    const data = await loadModuleList();
    const moduleId = doubleDialog.dataset.module;
    const slotId = doubleDialog.dataset.slot;
    const module = data[moduleId];
    const slot = module.termine[slotId];
    writeSlot(slot, module, overwrite);
    doubleDialog.close();
}