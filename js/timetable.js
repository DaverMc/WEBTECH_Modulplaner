import { loadModuleList, setClassForSlotType } from "./api.js";

export async function updateTimeTable() {
    const json = getBookingsJSON();
    if(!json) return;
    const modulesData = await loadModuleList();

    const table = document.getElementById("timetable");
    for(const td of table.querySelectorAll("td")) {
        td.innerHTML = "";
    }

    for(const booking of json) {
        const moduleID = booking.module;
        const slotId = booking.slot;
        const module = modulesData[moduleID];
        let slot = getSlot(module, slotId);

        createSlotElement(slot, module);
    }

}

function getSlot(module, slotId) {
    for(const s of module.termine) 
        if(s.id == slotId) return s; 
}

function createSlotElement(slot, module) {
    const tableData = document.querySelector("#block" + slot.block + " ." + slot.tag.toLowerCase());
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

export async function addSlot(slot, module) {
    let json = getBookingsJSON();
    for(const b of json) {
        if(b.slot == slot.id && b.module + 1 == module.id) return;
    }
    json.push(createBookingEntry(slot, module));
    console.log(json);
    setBookingsJSON(json);
}

export async function removeSlot(slot, module) {
    let json = getBookingsJSON();
    if(!json) return;

    let i = 0;
    for(const b of json) {
        if(b.slot == slot.id && b.module == module.id) break;
        else i++;
    }

    json.splice(i, 1);
    setBookingsJSON(json);
}

function getBookingsJSON() {
    const jsonS = localStorage.getItem("bookings");
    if(jsonS == null) return [];
    return JSON.parse(jsonS);
}

function setBookingsJSON(json) {
    localStorage.setItem("bookings", JSON.stringify(json));
}

function createBookingEntry(slot, module) {
    return {
        module: module.id - 1,
        slot: slot.id
    };
}