import { useQuery } from "@tanstack/react-query";
import type { GalleryItem, Note, Page } from "@shared/schema";

export function useGallery() {
  return useQuery<GalleryItem[]>({
    queryKey: ["/api/gallery"],
  });
}

export function useNotes() {
  return useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });
}

export function useNote(slug: string) {
  return useQuery<Note>({
    queryKey: ["/api/notes", slug],
    enabled: !!slug,
  });
}

export function usePage(slug: string) {
  return useQuery<Page>({
    queryKey: ["/api/pages", slug],
    enabled: !!slug,
  });
}
