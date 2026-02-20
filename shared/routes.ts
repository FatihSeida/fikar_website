export const api = {
  gallery: {
    list: { method: 'GET' as const, path: '/api/gallery' as const },
    create: { method: 'POST' as const, path: '/api/gallery' as const },
    delete: { method: 'DELETE' as const, path: '/api/gallery/:id' as const },
  },
  notes: {
    list: { method: 'GET' as const, path: '/api/notes' as const },
    get: { method: 'GET' as const, path: '/api/notes/:slug' as const },
    create: { method: 'POST' as const, path: '/api/notes' as const },
    update: { method: 'PUT' as const, path: '/api/notes/:id' as const },
    delete: { method: 'DELETE' as const, path: '/api/notes/:id' as const },
  },
  pages: {
    get: { method: 'GET' as const, path: '/api/pages/:slug' as const },
    upsert: { method: 'PUT' as const, path: '/api/pages/:slug' as const },
  },
  upload: {
    image: { method: 'POST' as const, path: '/api/upload' as const },
  },
};
