/**
 * Itheereum GAIA OS - RAG Retrieval & Augmentation
 * Diese Datei implementiert Punkt 3.iii (Retrieval und Augmentation).
 * Dies ist das "Langzeitgedächtnis" im Einsatz.
 */

/**
 * Wandelt die neue Benutzeranfrage in einen Vektor um.
 * @param {string} query - Die Anfrage des Benutzers.
 * @returns {Array<number>} Ein Vektor (simuliert).
 */
async function getQueryVector(query) {
    // Nutzt denselben Embedding-Prozess wie in rag-embedding.js
    console.log("Erstelle Vektor für Anfrage...");
    // Simulierter Vektor
    return [Math.random(), Math.random(), Math.random(), Math.random()];
}

/**
 * Durchsucht die Vektordatenbank nach den ähnlichsten Chunks.
 * @param {Array<number>} queryVector - Der Vektor der Benutzeranfrage.
 * @param {Array<Object>} vectorDatabase - Die Vektordatenbank.
 * @returns {Array<string>} Die relevantesten Text-Chunks.
 */
function queryVectorDB(queryVector, vectorDatabase) {
    console.log("Durchsuche Vektordatenbank (Langzeitgedächtnis)...");
    // Platzhalter-Logik: In der Realität wäre dies eine
    // "Cosinus-Ähnlichkeitssuche". Wir nehmen hier einfach die ersten 3.
    const relevantChunks = vectorDatabase
       .slice(0, 3)
       .map(item => item.text);

    return relevantChunks;
}

/**
 * Baut den finalen, angereicherten Prompt für das LLM (Gemini).
 * @param {string} originalQuery - Die ursprüngliche Benutzeranfrage.
 * @param {Array<string>} relevantChunks - Die abgerufenen Chunks.
 * @returns {string} Der angereicherte Prompt.
 */
function augmentPromptWithContext(originalQuery, relevantChunks) {
    console.log("Reichere Prompt mit Kontext an...");

    const context = relevantChunks.join("\n\n");

    const augmentedPrompt = `
        Beantworte die folgende Benutzeranfrage: "${originalQuery}"

        Nutze dabei den folgenden relevanten Kontext aus unserem "Langzeitgedächtnis" (frühere Konversationen), um eine präzise und nicht-repetitive Antwort zu geben:

        --- ---
        ${context}
        --- ---

        Antwort:
    `;

    return augmentedPrompt;
}
