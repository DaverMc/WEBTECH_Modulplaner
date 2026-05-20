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