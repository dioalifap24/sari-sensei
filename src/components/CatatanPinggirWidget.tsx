import React, { useState, useEffect } from 'react';
import { JLPTLevel } from '../types';
import { storageService } from '../services/storageService';
import { Plus, Trash2, Edit3, Pin, StickyNote, Check } from 'lucide-react';

export interface SideNote {
  id: string;
  level: JLPTLevel;
  title: string;
  content: string;
  color: 'yellow' | 'pink' | 'blue' | 'green';
  rotation: string;
  createdAt: number;
}

interface CatatanPinggirWidgetProps {
  activeLevel: JLPTLevel;
}

const POST_IT_COLORS = [
  { name: 'yellow', bg: 'bg-[#fef08a]', border: 'border-[#fde047]', text: 'text-[#713f12]', pinColor: 'text-[#ca8a04]' },
  { name: 'pink', bg: 'bg-[#fbcfe8]', border: 'border-[#f472b6]', text: 'text-[#831843]', pinColor: 'text-[#db2777]' },
  { name: 'blue', bg: 'bg-[#bfdbfe]', border: 'border-[#60a5fa]', text: 'text-[#1e3a8a]', pinColor: 'text-[#2563eb]' },
  { name: 'green', bg: 'bg-[#bbf7d0]', border: 'border-[#4ade80]', text: 'text-[#14532d]', pinColor: 'text-[#16a34a]' },
];

const ROTATIONS = ['rotate-[-1.5deg]', 'rotate-[1deg]', 'rotate-[-0.5deg]', 'rotate-[2deg]', 'rotate-[-2deg]'];

export const CatatanPinggirWidget: React.FC<CatatanPinggirWidgetProps> = ({ activeLevel }) => {
  const currentUser = storageService.getCurrentUser();
  const userKey = currentUser?.email || 'guest';

  const [notes, setNotes] = useState<SideNote[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState<'yellow' | 'pink' | 'blue' | 'green'>('yellow');
  const [editingId, setEditingId] = useState<string | null>(null);

  const storageKey = `sari_sensei_side_notes_${userKey}_${activeLevel}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setNotes(JSON.parse(saved));
      } else {
        const defaultNotes: SideNote[] = [
          {
            id: 'default-1',
            level: activeLevel,
            title: `Catatan Belajar ${activeLevel}`,
            content: `Semangat belajar materi JLPT ${activeLevel}! Tulis catatan kecil atau hafalan penting di sini ya!`,
            color: 'yellow',
            rotation: 'rotate-[-1deg]',
            createdAt: Date.now(),
          }
        ];
        setNotes(defaultNotes);
        localStorage.setItem(storageKey, JSON.stringify(defaultNotes));
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeLevel, userKey]);

  const saveNotesToStorage = (updatedNotes: SideNote[]) => {
    setNotes(updatedNotes);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddOrUpdateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (editingId) {
      const updated = notes.map(n => n.id === editingId ? {
        ...n,
        title: title.trim() || 'Catatan',
        content: content.trim(),
        color: selectedColor,
      } : n);
      saveNotesToStorage(updated);
      setEditingId(null);
    } else {
      const newNote: SideNote = {
        id: 'note-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        level: activeLevel,
        title: title.trim() || 'Memo Penting',
        content: content.trim(),
        color: selectedColor,
        rotation: ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)],
        createdAt: Date.now(),
      };
      saveNotesToStorage([newNote, ...notes]);
    }

    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  const handleEdit = (note: SideNote) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSelectedColor(note.color);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    saveNotesToStorage(updated);
  };

  const getColorObj = (colorName: string) => {
    return POST_IT_COLORS.find(c => c.name === colorName) || POST_IT_COLORS[0];
  };

  return (
    <div className="border-2 rounded-3xl p-5 shadow-xs bg-[#fffbf4] border-[#ebdccb] space-y-4">
      {/* Header Catatan Pinggir */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#ebdccb]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#fae8eb] text-[#881337]">
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#881337] flex items-center gap-2">
              <span>Catatan Pinggir (Post-it Memo)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fce7f3] text-[#be185d] font-bold">
                Manga Panel Note
              </span>
            </h3>
            <p className="text-xs text-[#735338]">
              Tulis catatan pribadi atau rumus penting selama mempelajari materi Level {activeLevel}.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isAdding) {
              setIsAdding(false);
              setEditingId(null);
              setTitle('');
              setContent('');
            } else {
              setIsAdding(true);
              setEditingId(null);
              setTitle('');
              setContent('');
            }
          }}
          className="px-4 py-2 rounded-xl bg-[#881337] hover:bg-[#70102d] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Tutup Form' : 'Tambah Post-it Baru'}</span>
        </button>
      </div>

      {/* Form Tambah / Edit Post-it */}
      {isAdding && (
        <form onSubmit={handleAddOrUpdateNote} className="p-4 rounded-2xl bg-white border-2 border-[#881337] shadow-md space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#881337]">
              {editingId ? 'Edit Catatan Post-it' : 'Buat Catatan Post-it Baru'}
            </span>
            <div className="flex items-center gap-1.5">
              {POST_IT_COLORS.map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name as any)}
                  className={`w-6 h-6 rounded-full ${c.bg} border-2 ${selectedColor === c.name ? 'border-[#881337] scale-110 shadow-xs' : 'border-transparent'} transition-all`}
                  title={`Warna ${c.name}`}
                />
              ))}
            </div>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul / Topik Catatan (cth: Rumus Te Form)..."
            className="w-full px-3 py-2 border rounded-xl text-xs outline-hidden border-[#ebdccb] focus:border-[#881337] bg-[#fffdfa] text-[#3d2a1b]"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis catatan atau memo kecil di sini..."
            rows={3}
            className="w-full px-3 py-2 border rounded-xl text-xs outline-hidden border-[#ebdccb] focus:border-[#881337] bg-[#fffdfa] text-[#3d2a1b] resize-none"
            required
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="px-3 py-1.5 rounded-lg border border-[#ebdccb] text-[#735338] text-xs font-bold hover:bg-[#f5ede1]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#881337] hover:bg-[#70102d] text-white text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingId ? 'Simpan Perubahan' : 'Tempel Post-it'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid Post-it Bergaya Panel Manga */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
        {notes.map((note) => {
          const colorObj = getColorObj(note.color);
          return (
            <div
              key={note.id}
              className={`relative p-4 rounded-xl shadow-md border-b-4 border-r-4 transition-transform hover:scale-[1.02] ${colorObj.bg} ${colorObj.border} ${colorObj.text} ${note.rotation} flex flex-col justify-between`}
              style={{ minHeight: '140px' }}
            >
              {/* Pin Manga Effect at Top Center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 drop-shadow-xs">
                <Pin className={`w-5 h-5 ${colorObj.pinColor} fill-current rotate-45`} />
              </div>

              {/* Tape visual effect top left */}
              <div className="absolute -top-2 left-4 w-12 h-4 bg-white/40 border border-white/60 rotate-[-3deg] pointer-events-none" />

              <div className="space-y-1 mt-1">
                <h4 className="font-extrabold text-xs tracking-wide uppercase border-b border-black/10 pb-1 flex items-center justify-between">
                  <span>{note.title || 'Memo'}</span>
                  <span className="text-[9px] opacity-70 font-mono">
                    {new Date(note.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </h4>
                <p className="text-xs leading-relaxed whitespace-pre-wrap font-medium pt-1">
                  {note.content}
                </p>
              </div>

              <div className="flex items-center justify-end gap-1 pt-3 mt-2 border-t border-black/10">
                <button
                  onClick={() => handleEdit(note)}
                  className="p-1 rounded-md hover:bg-black/10 transition-colors"
                  title="Edit Catatan"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-1 rounded-md hover:bg-red-500/20 text-red-800 transition-colors"
                  title="Hapus Catatan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-8 text-xs text-[#a88a70]">
          Belum ada catatan pinggir (post-it) untuk level {activeLevel}. Klik tombol "Tambah Post-it Baru" di atas untuk mulai mencatat!
        </div>
      )}
    </div>
  );
};
