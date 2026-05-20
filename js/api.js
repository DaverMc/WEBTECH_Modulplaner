export async function loadModuleList() {
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

export function writeSlot(slot, module, overwrite) {
    const tableData = document.querySelector("#block" + slot.block + " ." + slot.tag.toLowerCase());
    if(overwrite) tableData.innerHTML = "";

    const newHeader = module.name + "-" + slot.typ;
    for(const header of tableData.querySelectorAll("h4")) {
        if(header.textContent == newHeader) return;
    }

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