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