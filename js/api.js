export async function loadModuleList() {
    const url = "/api/kurse";
    console.log("GET FROM " + url);
    try {
        const response = await fetch(url);
        if (response.ok) return await response.json();
        else throw new Error("HTTP-Error Status: " + response.status);
    } catch (error) {
        console.error("Fehler beim laden der Moduldaten", error);
    }
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

export function getSlot(module, slotId) {
    for(const s of module.termine) 
        if(s.id == slotId) return s; 
}

export function getDate(week, day) {
    const d = (week - 1) * 7 + day;
    const date = new Date(2025, 11, 29);
    date.setDate(date.getDate() + d);
    return date;
}