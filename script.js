const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const results = document.getElementById("results");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const word = input.value.trim();
  if (!word) return;

  results.innerHTML = "";
  errorMessage.textContent = "";

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) throw new Error("Word not found");

    const data = await res.json();
    displayResults(data[0]);
  } catch (error) {
    errorMessage.textContent = `Error: ${error.message}`;
  }
});

function displayResults(entry) {
  const word = document.createElement("h2");
  word.textContent = entry.word;

  const phonetic = entry.phonetics.find(p => p.audio);
  if (phonetic && phonetic.audio) {
    const audioBtn = document.createElement("button");
    audioBtn.textContent = "🔊";
    audioBtn.className = "audio-btn";
    audioBtn.onclick = () => new Audio(phonetic.audio).play();
    word.appendChild(audioBtn);
  }

  results.appendChild(word);

  entry.meanings.forEach(meaning => {
    const partOfSpeech = document.createElement("h3");
    partOfSpeech.textContent = meaning.partOfSpeech;
    results.appendChild(partOfSpeech);

    meaning.definitions.forEach(def => {
      const defEl = document.createElement("p");
      defEl.innerHTML = `<strong>Definition:</strong> ${def.definition}`;
      results.appendChild(defEl);

      if (def.example) {
        const exEl = document.createElement("p");
        exEl.innerHTML = `<em>Example:</em> ${def.example}`;
        results.appendChild(exEl);
      }

      if (def.synonyms && def.synonyms.length > 0) {
        const synEl = document.createElement("p");
        synEl.innerHTML = `<em>Synonyms:</em> ${def.synonyms.join(", ")}`;
        results.appendChild(synEl);
      }
    });
  });
}
