import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Image, FileText, BookOpen, ArrowLeft, Lock, LogOut } from "lucide-react";
import { Link } from "wouter";
import type { GalleryItem, Note, Page } from "@shared/schema";
import RichTextEditor from "@/components/RichTextEditor";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onLogin();
      } else {
        setError("Password salah");
      }
    } catch {
      setError("Terjadi kesalahan");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-serif font-bold">Panel Admin</h1>
            <p className="text-muted-foreground mt-2">Masukkan password untuk mengakses panel admin</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                data-testid="input-admin-password"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-destructive" data-testid="text-login-error">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || !password} data-testid="button-admin-login">
              {loading ? "Memverifikasi..." : "Masuk"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-back-from-login">
              ← Kembali ke Situs
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GalleryManager() {
  const { toast } = useToast();
  const { data: items, isLoading } = useQuery<GalleryItem[]>({ queryKey: ["/api/gallery"] });
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: async (data: { image: string; caption: string }) => {
      await apiRequest("POST", "/api/gallery", { ...data, colSpan: "col-span-1" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      setCaption("");
      setImageUrl("");
      setDialogOpen(false);
      toast({ title: "Berhasil", description: "Item galeri berhasil ditambahkan" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Berhasil", description: "Item galeri berhasil dihapus" });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      setImageUrl(data.url);
    } catch {
      toast({ title: "Gagal", description: "Gagal mengunggah gambar", variant: "destructive" });
    }
    setUploading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold">Kelola Galeri</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-gallery"><Plus className="w-4 h-4 mr-2" /> Tambah Gambar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Item Galeri</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Unggah Gambar</Label>
                <Input type="file" accept="image/*" onChange={handleFileUpload} data-testid="input-gallery-file" />
                {uploading && <p className="text-sm text-muted-foreground mt-1">Mengunggah...</p>}
                {imageUrl && (
                  <div className="mt-2">
                    <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded" />
                  </div>
                )}
              </div>
              <div>
                <Label>Atau URL Gambar</Label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  data-testid="input-gallery-url"
                />
              </div>
              <div>
                <Label>Keterangan</Label>
                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Keterangan gambar"
                  data-testid="input-gallery-caption"
                />
              </div>
              <Button
                onClick={() => createMutation.mutate({ image: imageUrl, caption })}
                disabled={!imageUrl || !caption || createMutation.isPending}
                className="w-full"
                data-testid="button-submit-gallery"
              >
                {createMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Memuat...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items?.map((item) => (
            <Card key={item.id} className="overflow-hidden group relative" data-testid={`card-gallery-${item.id}`}>
              <div className="aspect-square relative">
                <img src={item.image} alt={item.caption} className="w-full h-full object-cover" />
                <button
                  onClick={() => deleteMutation.mutate(item.id)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  data-testid={`button-delete-gallery-${item.id}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <CardContent className="p-3">
                <p className="text-sm text-muted-foreground truncate">{item.caption}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function NotesManager() {
  const { toast } = useToast();
  const { data: items, isLoading } = useQuery<Note[]>({ queryKey: ["/api/notes"] });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", tag: "", date: "", coverImage: "", sourceUrl: "", sourceName: "" });
  const [coverUploading, setCoverUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      await apiRequest("POST", "/api/notes", { ...data, coverImage: data.coverImage || null, sourceUrl: data.sourceUrl || null, sourceName: data.sourceName || null });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      resetForm();
      toast({ title: "Berhasil", description: "Catatan berhasil ditambahkan" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof form }) => {
      await apiRequest("PUT", `/api/notes/${id}`, { ...data, coverImage: data.coverImage || null, sourceUrl: data.sourceUrl || null, sourceName: data.sourceName || null });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      resetForm();
      toast({ title: "Berhasil", description: "Catatan berhasil diperbarui" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({ title: "Berhasil", description: "Catatan berhasil dihapus" });
    },
  });

  const resetForm = () => {
    setForm({ title: "", slug: "", excerpt: "", content: "", tag: "", date: "", coverImage: "", sourceUrl: "", sourceName: "" });
    setEditingNote(null);
    setDialogOpen(false);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setForm({
      title: note.title,
      slug: note.slug,
      excerpt: note.excerpt,
      content: note.content,
      tag: note.tag,
      date: note.date,
      coverImage: note.coverImage || "",
      sourceUrl: note.sourceUrl ?? "",
      sourceName: note.sourceName ?? "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingNote) {
      updateMutation.mutate({ id: editingNote.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      setForm(prev => ({ ...prev, coverImage: data.url }));
    } catch {
      toast({ title: "Gagal", description: "Gagal mengunggah gambar", variant: "destructive" });
    }
    setCoverUploading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold">Kelola Pemikiran & Catatan</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setDialogOpen(open); }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-note"><Plus className="w-4 h-4 mr-2" /> Tambah Catatan</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingNote ? "Edit Catatan" : "Tambah Catatan Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Judul</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value, slug: editingNote ? form.slug : generateSlug(e.target.value) });
                  }}
                  placeholder="Judul catatan"
                  data-testid="input-note-title"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="slug-catatan"
                  data-testid="input-note-slug"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tag</Label>
                  <Input
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    placeholder="DESAIN"
                    data-testid="input-note-tag"
                  />
                </div>
                <div>
                  <Label>Tanggal</Label>
                  <Input
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="OKT 2023"
                    data-testid="input-note-date"
                  />
                </div>
              </div>
              <div>
                <Label>Ringkasan</Label>
                <Input
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Ringkasan singkat catatan"
                  data-testid="input-note-excerpt"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tautan Sumber (opsional)</Label>
                  <Input
                    value={form.sourceUrl}
                    onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                    placeholder="https://..."
                    data-testid="input-note-source-url"
                  />
                </div>
                <div>
                  <Label>Nama Media (opsional)</Label>
                  <Input
                    value={form.sourceName}
                    onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
                    placeholder="Kumparan"
                    data-testid="input-note-source-name"
                  />
                </div>
              </div>
              <div>
                <Label>Konten</Label>
                <RichTextEditor
                  content={form.content}
                  onChange={(html: string) => setForm(prev => ({ ...prev, content: html }))}
                />
              </div>
              <div>
                <Label>Gambar Sampul (opsional)</Label>
                <Input type="file" accept="image/*" onChange={handleCoverUpload} data-testid="input-note-cover-file" />
                {coverUploading && <p className="text-sm text-muted-foreground mt-1">Mengunggah...</p>}
                {form.coverImage && (
                  <div className="mt-2 relative">
                    <img src={form.coverImage} alt="Cover" className="w-full h-40 object-cover rounded" />
                    <button
                      onClick={() => setForm(prev => ({ ...prev, coverImage: "" }))}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <Input
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="Atau masukkan URL gambar"
                  className="mt-2"
                  data-testid="input-note-cover"
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!form.title || !form.slug || !form.content || createMutation.isPending || updateMutation.isPending}
                className="w-full"
                data-testid="button-submit-note"
              >
                {(createMutation.isPending || updateMutation.isPending) ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Memuat...</p>
      ) : (
        <div className="space-y-3">
          {items?.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow" data-testid={`card-note-${note.id}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-[0.14em] text-primary">{note.tag}</span>
                    <span className="text-xs text-muted-foreground">{note.date}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg truncate">{note.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{note.excerpt}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => openEdit(note)} data-testid={`button-edit-note-${note.id}`}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(note.id)} data-testid={`button-delete-note-${note.id}`}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {items?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Belum ada catatan. Tambahkan catatan pertama Anda!</p>
          )}
        </div>
      )}
    </div>
  );
}

function PageEditor() {
  const { toast } = useToast();
  const { data: page, isLoading } = useQuery<Page>({ queryKey: ["/api/pages", "pemikiran-ide"] });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (page && !initialized) {
    setTitle(page.title);
    setContent(page.content);
    setInitialized(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PUT", "/api/pages/pemikiran-ide", { title, content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages", "pemikiran-ide"] });
      toast({ title: "Berhasil", description: "Halaman berhasil disimpan" });
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Memuat...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold">Halaman Pemikiran</h2>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} data-testid="button-save-page">
          {saveMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Judul Halaman</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} data-testid="input-page-title" />
        </div>
        <div>
          <Label>Konten Halaman</Label>
          <RichTextEditor
            content={content}
            onChange={(html: string) => setContent(html)}
          />
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((res) => res.json())
      .then((data) => setAuthenticated(data.isAdmin))
      .catch(() => setAuthenticated(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-back-home">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-serif font-bold">Panel Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors" data-testid="link-view-site">
              Lihat Situs →
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" /> Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="gallery">
          <TabsList className="mb-8" data-testid="tabs-admin">
            <TabsTrigger value="gallery" className="gap-2" data-testid="tab-gallery">
              <Image className="w-4 h-4" /> Galeri
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2" data-testid="tab-notes">
              <FileText className="w-4 h-4" /> Pemikiran & Catatan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery">
            <GalleryManager />
          </TabsContent>
          <TabsContent value="notes">
            <NotesManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
