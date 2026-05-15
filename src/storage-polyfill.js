// Polyfill window.storage API to use localStorage
// This replicates the API used in Claude artifacts so the same code works in deployment.
//
// API: window.storage.get(key), set(key, value), delete(key), list(prefix)

(function() {
  if (typeof window === 'undefined') return;
  if (window.storage) return; // Already exists (Claude artifact context)

  const storage = {
    async get(key, shared = false) {
      try {
        const v = localStorage.getItem(key);
        if (v === null) return null;
        return { key, value: v, shared };
      } catch (e) {
        console.warn('storage.get failed', e);
        return null;
      }
    },
    async set(key, value, shared = false) {
      try {
        localStorage.setItem(key, value);
        return { key, value, shared };
      } catch (e) {
        console.warn('storage.set failed', e);
        return null;
      }
    },
    async delete(key, shared = false) {
      try {
        localStorage.removeItem(key);
        return { key, deleted: true, shared };
      } catch (e) {
        console.warn('storage.delete failed', e);
        return null;
      }
    },
    async list(prefix = '', shared = false) {
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(prefix)) keys.push(k);
        }
        return { keys, prefix, shared };
      } catch (e) {
        console.warn('storage.list failed', e);
        return { keys: [], prefix, shared };
      }
    },
  };

  window.storage = storage;
})();
