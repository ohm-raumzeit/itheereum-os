/* =================================
   Modul 3: sear-measuring.js
   Enthält die 'Measuring'-Logik (Aktion A+B),
   den 'Quer-Vergleich', die UI-Event-Listener
   und das 'Warp-Uhrwerk' (Uhr).
   ================================= */

document.addEventListener('DOMContentLoaded', () => {

  // --- DOM-Elemente referenzieren ---
  const searForm = document.getElementById('sear-form');
  const searchInput = document.getElementById('search-input');
  const transparencyToggle = document.getElementById('transparency-toggle');
  const transparencyLog = document.getElementById('transparency-log');
  const resultsContainer = document.getElementById('results-container');
  const resultsCount = document.getElementById('results-count');
  const clockElement = document.getElementById('warp-clock');

  // --- 1. 'Warp-Uhrwerk' (PTA-Synchronisations-Prototyp)  ---
  function updateDateTime() {
    if (!clockElement) return;
    const now = new Date();
    // Sekundengenaue Anzeige
    const options = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    };
    clockElement.textContent = now.toLocaleString('de-DE', options) + ' (PSR J0952-0607 Sync)';
  }
  // Startet die Uhr und aktualisiert sie jede Sekunde
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // --- 2. UI-Logik: Transparenz-Fenster  ---
  transparencyToggle.addEventListener('click', () => {
    const isHidden = transparencyLog.style.display === 'none' |

| transparencyLog.style.display === '';
    transparencyLog.style.display = isHidden? 'block' : 'none';
  });

  // --- 3. Such-Logik (Formular-Handling) ---
  searForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Standard-Formularabsendung verhindern
    const query = searchInput.value;
    if (query.trim() === '') return;

    performSearch(query);
  });

  // --- 4. 'Measuring'-Protokoll (Simulation)  ---
  async function performSearch(query) {
    // UI zurücksetzen und Loader starten
    logToTransparency('Suche gestartet für: "' + query + '"');
    resultsContainer.innerHTML = '';
    resultsCount.textContent = 'Suche läuft...';
    if (window.startSparkyLoader) window.startSparkyLoader();

    try {
      // ** PARALLELE ABFRAGE (Promise.all)  **
      // Startet Aktion A und B gleichzeitig und wartet auf beide
      logToTransparency('Starte Aktion A (Measuring)...');
      logToTransparency('Starte Aktion B (Grounding)...');

      const = await Promise.all(
        mockFetchB(query)  // Aktion B: Google Grounding );

      logToTransparency('Aktion A (Measuring) abgeschlossen.');
      logToTransparency('Aktion B (Grounding) abgeschlossen.');

      // ** DER 'QUER-VERGLEICH'  **
      logToTransparency('Führe Quer-Vergleich durch...');
      const combinedResults = performCrossReference(resultsA, resultsB);

      // Ergebnisse anzeigen
      renderResults(combinedResults, query);

    } catch (error) {
      console.error('Fehler im Measuring-Prozess:', error);
      resultsCount.textContent = 'Fehler bei der Suche.';
      logToTransparency('Fehler: ' + error.message);
    } finally {
      // Loader stoppen
      if (window.stopSparkyLoader) window.stopSparkyLoader();
    }
  }

  // Simuliert Aktion A (Measuring - DDG-Fork)
  function mockFetchA(query) {
    logToTransparency('Aktion A: Kontaktiere souveränen Index (DDG-Fork)...');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1500); // Simuliert eine langsamere, souveräne Suche
    });
  }

  // Simuliert Aktion B (Google Grounding)
  function mockFetchB(query) {
    logToTransparency('Aktion B: Kontaktiere Google Grounding API...');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000); // Simuliert eine schnellere Google-API
    });
  }

  // --- 5. Der 'Quer-Vergleich'-Algorithmus  ---
  function performCrossReference(resultsA, resultsB) {
    const map = new Map();
    const combined = {
      highConfidence:,
      measuringOnly:,
      groundingOnly:
    };

    // Aktion A (Measuring) verarbeiten
    resultsA.forEach(item => {
      map.set(item.url, {...item, source: 'A' });
    });

    // Aktion B (Grounding) verarbeiten und vergleichen
    resultsB.forEach(item => {
      if (map.has(item.url)) {
        // Hohe Konfidenz (Gekreuzt)
        const existing = map.get(item.url);
        // Wir nehmen das Snippet von A (Measuring) als Priorität
        combined.highConfidence.push(existing);
        map.delete(item.url); // Aus der Map entfernen
      } else {
        // Nur Google Grounding
        combined.groundingOnly.push(item);
      }
    });

    // Was in der Map übrig bleibt, ist Nur 'Measuring'
    map.forEach(item => {
      combined.measuringOnly.push(item);
    });

    logToTransparency('Quer-Vergleich abgeschlossen.');
    return combined;
  }

  // --- 6. Ergebnisse im DOM anzeigen ---
  function renderResults(results, query) {
    let html = '';
    let totalHits = 0;

    // Kategorie: Hohe Konfidenz
    if (results.highConfidence.length > 0) {
      html += '<h4>Hohe Konfidenz (Gekreuzt)</h4>';
      results.highConfidence.forEach(item => html += createResultItem(item));
      totalHits += results.highConfidence.length;
    }

    // Kategorie: Nur Measuring (Priorität)
    if (results.measuringOnly.length > 0) {
      html += '<h4>Nur \'Measuring\' (DDG-Fork)</h4>';
      results.measuringOnly.forEach(item => html += createResultItem(item));
      totalHits += results.measuringOnly.length;
    }

    // Kategorie: Nur Google Grounding
    if (results.groundingOnly.length > 0) {
      html += '<h4>Nur \'Google Grounding\'</h4>';
      results.groundingOnly.forEach(item => html += createResultItem(item));
      totalHits += results.groundingOnly.length;
    }

    resultsContainer.innerHTML = html;

    // Status-Text mit Trefferanzahl aktualisieren
    resultsCount.textContent = `Ergebnisse für "${query}": (${totalHits} Treffer gefunden)`;
    logToTransparency(`${totalHits} relevante Ergebnisse gefunden.`);
  }

  function createResultItem(item) {
    return `
      <div class="result-item">
        <a href="${item.url}" target="_blank">${item.title}</a>
        <span class="url">${item.url}</span>
        <p class="snippet">${item.snippet}</p>
      </div>
    `;
  }

  // Hilfsfunktion zum Loggen im Transparenz-Fenster
  function logToTransparency(message) {
    const now = new Date().toLocaleTimeString();
    transparencyLog.textContent += `[${now}] ${message}\n`;
    // Automatisch nach unten scrollen
    transparencyLog.scrollTop = transparencyLog.scrollHeight;
  }

});
