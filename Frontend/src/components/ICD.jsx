import React, { useState, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

// ----- Token provider (customize as needed) -----
// Prefer a function so token lookup is always fresh.
function getToken() {
  // Examples:
  // return localStorage.getItem("access_token");
  // return sessionStorage.getItem("access_token");
  // return Cookies.get("access_token");
  return window.localStorage?.getItem("JWTS_TOKEN") || "";
}

// ----- Axios instance with interceptor -----
const api = axios.create({
  baseURL: "/", // keep relative; adjust if needed
});

// Attach Authorization: Bearer <token> to all requests made with `api`
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    // Use standard Bearer scheme per RFC 6750
    // https://datatracker.ietf.org/doc/html/rfc6750
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function EnhancedAutocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState({ icdSuggestions: [], wordSuggestions: [] });
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(
    debounce(async (q) => {
      if (!q || q.length < 2) return setSuggestions({ icdSuggestions: [], wordSuggestions: [] });
      setLoading(true);
      try {
        // Using the axios instance so the interceptor adds Authorization automatically
        const res = await api.get("/api/terminology/autocomplete", { params: { q, limit: 10 } });
        setSuggestions(res.data);
      } catch (e) {
        console.error("Autocomplete error:", e);
        setSuggestions({ icdSuggestions: [], wordSuggestions: [] });
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  function handleChange(e) {
    const q = e.target.value;
    setQuery(q);
    fetchSuggestions(q);
  }

  async function handleSelect(s) {
    setQuery(s.display);
    setSuggestions({ icdSuggestions: [], wordSuggestions: [] });
    if (s.entityId) {
      try {
        // Option A: rely on interceptor (recommended)
        const res = await api.get(`/api/terminology/entity/${s.entityId}`);

        // Option B: if a one-off token override is needed:
        // const token = getToken();
        // const res = await axios.get(`/api/terminology/entity/${s.entityId}`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });

        setSelectedEntity(res.data);
      } catch (e) {
        console.error("Entity details error:", e);
      }
    }
    onSelect && onSelect(s);
  }

  function handleWordClick(word) {
    setQuery(word);
    fetchSuggestions(word);
  }

  return (
    <div className="enhanced-autocomplete">
      <div className="search-input">
        <input
          type="text"
          placeholder="Search ICD-11..."
          value={query}
          onChange={handleChange}
        />
        {loading && <div className="spinner">⏳</div>}
      </div>

      {(suggestions.icdSuggestions.length > 0 || suggestions.wordSuggestions.length > 0) && (
        <div className="suggestions-container">
          {suggestions.icdSuggestions.length > 0 && (
            <div className="suggestion-group">
              <h6>ICD-11</h6>
              <ul className="suggestions">
                {suggestions.icdSuggestions.map((s, i) => (
                  <li key={s.entityId || `${s.code}-${i}`} onClick={() => handleSelect(s)}>
                    <span className="code">{s.code}</span>
                    <span className="display">{s.display}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.wordSuggestions.length > 0 && (
            <div className="suggestion-group">
              <h6>Word Suggestions</h6>
              <div className="word-suggestions">
                {suggestions.wordSuggestions.map((w, i) => (
                  <span key={`${w}-${i}`} className="word-chip" onClick={() => handleWordClick(w)}>
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedEntity && (
        <div className="entity-details">
          <h5>
            {selectedEntity.title} {selectedEntity.code ? `(${selectedEntity.code})` : ""}
          </h5>
          {selectedEntity.definition && (
            <p><strong>Definition:</strong> {selectedEntity.definition}</p>
          )}
          {selectedEntity.codingNote && (
            <p><strong>Coding Note:</strong> {selectedEntity.codingNote}</p>
          )}
        </div>
      )}
    </div>
  );
}
