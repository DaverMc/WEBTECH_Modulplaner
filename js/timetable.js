import { loadModuleList, setClassForSlotType, getSlot, getDate } from "./api.js";

export async function initTimeTable() {

    changeWeek(0);
    updateTimeTable();

    document.getElementById("prev_week_button").addEventListener("click", async function() {
        changeWeek(-1);
        updateTimeTable();
    });
    

    document.getElementById("next_week_button").addEventListener("click", async function() {
        changeWeek(1);
        updateTimeTable();
    });
}

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

        if(slot.wiederholung == "zweiwöchentlich" && getWeek() % 2 != 0) continue;
        createSlotElement(slot, module);
    }

    const heading = document.getElementById("timetable_heading");
    heading.textContent = "Stundenplan - KW-" + getWeek();

    setDayDates(getWeek());
}

function setDayDates(week) {
    let i = 0;
    for(const th of document.querySelectorAll("thead tr th")) {
        let day = th.textContent;
        const oI = day.indexOf(" ");
        if(oI != -1) day = day.substring(0, oI);
        const date = getDate(week, i);
        th.textContent = day + " " + date.toLocaleDateString("de-DE");
        i++;
    }
}

function createSlotElement(slot, module) {
    const tableData = document.querySelector("#block" + slot.block + " ." + slot.tag.toLowerCase());
    const div = document.createElement("div");
    div.dataset.module = module.id - 1;
    div.dataset.slot = slot.id;
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
        if(b.slot == slot.id && b.module == module.id - 1) return;
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
        if(b.slot == slot.id && b.module == module.id -1) break;
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

export function setBookingNotes(slot, module, notes) {
    const json = getBookingsJSON();
    let i = 0;
    for(const b of json) {
        if(b.slot == slot.id && b.module == module.id - 1) {
            json.splice(i, 1);
            b.notes = notes;
            json.push(b);
            setBookingsJSON(json);
            break;
        }
        i++;
    }
}

export function getBooking(slot, module) {
    const json = getBookingsJSON();
    for(const b of json)
        if(b.slot == slot.id && b.module == module.id - 1) return b;
    return []
}

function setBookingsJSON(json) {
    localStorage.setItem("bookings", JSON.stringify(json));
}

function createBookingEntry(slot, module) {
    return {
        module: module.id - 1,
        slot: slot.id,
        notes: ""
    };
}

function changeWeek(delta) {
    const raw = localStorage.getItem("week");
    let json = {week: 1};
    if(raw) json = JSON.parse(raw);
    json.week = json.week + delta;
    if(json.week > 52) json.week = 52;
    else if(json.week <= 1) json.week = 1;
    localStorage.setItem("week", JSON.stringify(json));
}

function getWeek() {
    const raw = localStorage.getItem("week");
    if(!raw) return 0;
    return JSON.parse(raw).week;
}