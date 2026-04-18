// Fuse.js wrapper. Fuse ships as a UMD bundle via CDN (see index.html
// <script>), so we access it off `window.Fuse`.

export function makeIndex(indicators) {
  if (!window.Fuse) throw new Error("Fuse.js not loaded");
  return new window.Fuse(indicators, {
    includeScore: true,
    threshold: 0.4,       // generous — typos should still match
    ignoreLocation: true,
    keys: [
      { name: "name",     weight: 3 },
      { name: "tags",     weight: 2 },
      { name: "category", weight: 1.5 },
      { name: "code",     weight: 1 },
    ],
  });
}

export function search(index, query, limit = 50) {
  if (!query || !query.trim()) return [];
  return index.search(query, { limit }).map(r => r.item);
}
