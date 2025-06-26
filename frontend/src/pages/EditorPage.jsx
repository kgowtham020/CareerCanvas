// src/pages/EditorPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2,
  Save,
  Download,
  Undo,
  Redo,
  Trash2,
  GripVertical
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import profileService from '../services/profile.service.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Page fade-in/out variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

// Generate a short, unique ID
const genId = () => Math.random().toString(36).substring(2, 9);

// Define the block types we support
const BLOCK_TYPES = [
  'personal',
  'summary',
  'experience',
  'education',
  'projects',
  'skills'
];

export default function EditorPage() {
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const historyRef = useRef([]);
  const historyIdxRef = useRef(-1);
  const isRedoingRef = useRef(false);

  // ⚙️ Load profile data on mount
  useEffect(() => {
    (async function load() {
      setLoading(true);
      try {
        const { data: p } = await profileService.getProfile();
        const initial = buildInitialBlocks(p);
        setBlocks(initial);
        pushHistory(initial);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, [resumeId]);

  // Build initial structured blocks
  const buildInitialBlocks = (p) => [
    {
      id: genId(),
      type: 'personal',
      collapsed: false,
      data: {
        name: p.user.name || '',
        email: p.user.email || '',
        phone: p.phone || '',
        linkedin: p.linkedin || '',
        github: p.github || '',
        website: p.website || ''
      }
    },
    {
      id: genId(),
      type: 'summary',
      collapsed: false,
      data: { text: p.summary || '' }
    },
    {
      id: genId(),
      type: 'experience',
      collapsed: false,
      data: (p.experience || []).map(e => ({ id: genId(), ...e }))
    },
    {
      id: genId(),
      type: 'education',
      collapsed: false,
      data: (p.education || []).map(e => ({ id: genId(), ...e }))
    },
    {
      id: genId(),
      type: 'projects',
      collapsed: false,
      data: (p.projects || []).map(pr => ({ id: genId(), ...pr }))
    },
    {
      id: genId(),
      type: 'skills',
      collapsed: false,
      data: p.skills || []
    }
  ];

  // 📚 History (Undo/Redo)
  const pushHistory = (snapshot) => {
    if (isRedoingRef.current) return;
    historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
    historyRef.current.push(JSON.parse(JSON.stringify(snapshot)));
    historyIdxRef.current++;
  };

  const undo = () => {
    if (historyIdxRef.current > 0) {
      isRedoingRef.current = true;
      historyIdxRef.current--;
      setBlocks(JSON.parse(JSON.stringify(historyRef.current[historyIdxRef.current])));
      isRedoingRef.current = false;
    }
  };

  const redo = () => {
    if (historyIdxRef.current < historyRef.current.length - 1) {
      isRedoingRef.current = true;
      historyIdxRef.current++;
      setBlocks(JSON.parse(JSON.stringify(historyRef.current[historyIdxRef.current])));
      isRedoingRef.current = false;
    }
  };

  // ⏳ Autosave after 5 seconds of inactivity
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => handleSave(true), 5000);
    return () => clearTimeout(t);
  }, [blocks]);

  // ✍️ Save function (autosave/manual)
  const handleSave = async (isAuto = false) => {
    if (saving) return;
    setSaving(true);
    let payload = {};

    blocks.forEach((b) => {
      const type = b.type;
      if (type === 'personal') {
        payload = { ...payload, ...b.data };
      } else if (type === 'summary') {
        payload.summary = b.data.text;
      } else {
        payload[type] = b.data.map(({ id, ...rest }) => rest);
      }
    });

    try {
      await profileService.updateProfile(payload);
      if (!isAuto) toast.success('Saved!');
      pushHistory(blocks);
    } catch (e) {
      console.error(e);
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  // 📄 PDF Export
  const downloadPDF = async () => {
    const el = document.getElementById('resume-preview');
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2 });
    const img = canvas.toDataURL('image/png');
    const doc = new jsPDF({
      unit: 'px',
      format: [canvas.width, canvas.height],
      orientation: 'portrait'
    });
    doc.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height);
    doc.save('resume.pdf');
  };

  // Dirty-check for manual Save
  const isDirty = () =>
    historyIdxRef.current >= 0 &&
    JSON.stringify(blocks) !== JSON.stringify(historyRef.current[historyIdxRef.current]);

  // Update one block
  const updateBlock = (id, newBlock) => {
    setBlocks((old) => {
      const updated = old.map((b) => (b.id === id ? newBlock : b));
      pushHistory(updated);
      return updated;
    });
  };

  // Add new block
  const addBlock = (type) => {
    const newBlock = buildEmptyBlock(type);
    setBlocks((old) => {
      const arr = [...old, newBlock];
      pushHistory(arr);
      return arr;
    });
  };

  // Remove a block
  const deleteBlock = (id) => {
    setBlocks((old) => {
      const arr = old.filter((b) => b.id !== id);
      pushHistory(arr);
      return arr;
    });
  };

  // Move block position
  const moveBlock = (index, direction) => {
    setBlocks((old) => {
      const arr = [...old];
      [arr[index], arr[index + direction]] = [arr[index + direction], arr[index]];
      pushHistory(arr);
      return arr;
    });
  };

  // Create an empty block structure
  const buildEmptyBlock = (type) => {
    if (type === 'personal') {
      return {
        id: genId(),
        type: 'personal',
        collapsed: false,
        data: { name: '', email: '', phone: '', linkedin: '', github: '', website: '' }
      };
    } else if (type === 'summary') {
      return { id: genId(), type: 'summary', collapsed: false, data: { text: '' } };
    }
    return { id: genId(), type, collapsed: false, data: [] };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Loader2 className="text-accent animate-spin h-12 w-12" />
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="min-h-screen bg-gray-900 text-gray-100 p-6"
    >
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <BlockAdder onAdd={addBlock} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={undo} disabled={historyIdxRef.current <= 0} className="p-2 disabled:opacity-50">
            <Undo size={20} />
          </button>
          <button
            onClick={redo}
            disabled={historyIdxRef.current >= historyRef.current.length - 1}
            className="p-2 disabled:opacity-50"
          >
            <Redo size={20} />
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            <Download size={18} /> PDF
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={!isDirty() || saving}
            className={`flex items-center gap-1 bg-accent px-3 py-1 rounded ${
              saving ? 'opacity-60' : ''
            } ${
              !isDirty() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={18} />} Save
          </button>
        </div>
      </div>

      {/* Editor / Preview Flex */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ✍️ Editor */}
        <div className="flex-1 overflow-auto p-4 bg-gray-800 rounded">
          {blocks.map((b, idx) => (
            <BlockEditor
              key={b.id}
              block={b}
              index={idx}
              total={blocks.length}
              update={updateBlock}
              deleteBlock={deleteBlock}
              moveBlock={moveBlock}
            />
          ))}
        </div>

        {/* 👁️ Live Preview */}
        <div
          id="resume-preview"
          className="flex-1 overflow-auto p-6 bg-gray-800 rounded"
        >
          <ResumePreview blocks={blocks} />
        </div>
      </div>
    </motion.div>
  );
}

/* 🌱 Component: Block Adder Buttons */
const BlockAdder = ({ onAdd }) => (
  <>
    <button
      onClick={() => onAdd('personal')}
      className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
    >
      + Personal
    </button>
    <button
      onClick={() => onAdd('summary')}
      className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
    >
      + Summary
    </button>
    <button
      onClick={() => onAdd('experience')}
      className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded"
    >
      + Experience
    </button>
    <button
      onClick={() => onAdd('education')}
      className="bg-green-700 hover:bg-green-600 px-3 py-1 rounded"
    >
      + Education
    </button>
    <button
      onClick={() => onAdd('projects')}
      className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded"
    >
      + Projects
    </button>
    <button
      onClick={() => onAdd('skills')}
      className="bg-yellow-700 hover:bg-yellow-600 px-3 py-1 rounded"
    >
      + Skills
    </button>
  </>
);

/* ✏️ Component: Single Block Editor */
const BlockEditor = ({ block, index, total, update, deleteBlock, moveBlock }) => {
  const { id, type, collapsed, data } = block;

  const handleToggle = () =>
    update(id, { ...block, collapsed: !collapsed });

  return (
    <div className="mb-4 bg-gray-700 rounded p-3 group">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <GripVertical size={18} className="invisible group-hover:visible cursor-grab" />
          <strong className="capitalize">{type}</strong>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => moveBlock(index, -1)} disabled={index === 0}>
            ▲
          </button>
          <button onClick={() => moveBlock(index, 1)} disabled={index === total - 1}>
            ▼
          </button>
          <button onClick={handleToggle}>{collapsed ? '+' : '–'}</button>
          <button onClick={() => deleteBlock(id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="space-y-2">
          {renderEditorFields(block, update)}
        </div>
      )}
    </div>
  );
};

/* 📝 Renders form fields appropriate to each block type */
const renderEditorFields = (block, update) => {
  const { id, type, data } = block;

  const setBlockData = (newData) => update(id, { ...block, data: newData });

  switch (type) {
    case 'personal':
      return renderKeyValueFields(data, setBlockData);
    case 'summary':
      return [
        <textarea
          key="sum"
          className="w-full bg-gray-800 border border-gray-600 rounded p-2"
          rows={4}
          value={data.text}
          placeholder="Write a professional summary..."
          onChange={(e) => setBlockData({ text: e.target.value })}
        />
      ];
    case 'skills':
      return [
        <div key="skills-tags" className="flex flex-wrap gap-2 mb-2">
          {data.map((s, i) => (
            <span key={i} className="bg-gray-600 px-2 py-1 rounded flex items-center gap-1">
              {s}
              <button
                onClick={() =>
                  setBlockData(data.filter((_, j) => j !== i))
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>,
        <input
          key="skills-input"
          className="w-full bg-gray-800 border border-gray-600 rounded p-2"
          placeholder="New skill + enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              setBlockData([...data, e.target.value.trim()]);
              e.target.value = '';
            }
          }}
        />
      ];
    case 'experience':
    case 'education':
    case 'projects':
      return [
        ...data.map((entry, idx) => renderSubEntry(type, entry, (newEntry) => {
          const arr = [...data];
          arr[idx] = newEntry;
          setBlockData(arr);
        }, () => {
          setBlockData(data.filter((_, i) => i !== idx));
        })),
        <button
          key="add-entry"
          onClick={() =>
            setBlockData([
              ...data,
              buildEmptyEntry(type)
            ])
          }
          className="text-blue-400 text-sm"
        >
          + Add {type.slice(0, -1)}
        </button>
      ];
    default:
      return null;
  }
};

// Render a key/value form for personal fields
const renderKeyValueFields = (data, callback) => {
  return Object.keys(data).map((key) => (
    <div key={key}>
      <label className="block text-sm">
        {key.charAt(0).toUpperCase() + key.slice(1)}
      </label>
      <input
        className="w-full bg-gray-800 border border-gray-600 rounded p-2"
        value={data[key] || ''}
        onChange={(e) => callback({ ...data, [key]: e.target.value })}
      />
    </div>
  ));
};

// Build an empty sub-entry for experience/education/projects
const buildEmptyEntry = (type) => {
  const common = { id: genId(), description: '' };
  if (type === 'experience') {
    return { ...common, title: '', company: '', location: '', start: '', end: '' };
  }
  if (type === 'education') {
    return { ...common, school: '', degree: '', field: '', start: '', end: '' };
  }
  if (type === 'projects') {
    return { ...common, name: '', technologies: '', url: '' };
  }
  return common;
};

// Render form for a sub-entry
const renderSubEntry = (type, entry, onChange, onDelete) => (
  <div key={entry.id} className="p-2 border border-gray-600 rounded mb-2 bg-gray-800">
    <div className="flex justify-between items-center mb-2">
      <strong>{type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}</strong>
      <button onClick={onDelete}>
        <Trash2 size={16} />
      </button>
    </div>
    {Object.keys(entry)
      .filter(k => k !== 'id' && k !== 'description')
      .map((field) => (
        <div key={field} className="mb-1">
          <label className="block text-xs">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            className="w-full bg-gray-800 border border-gray-600 rounded p-1 text-sm"
            type={field === 'start' || field === 'end' ? 'date' : 'text'}
            value={entry[field] || ''}
            onChange={(e) => onChange({ ...entry, [field]: e.target.value })}
          />
        </div>
      ))}
    <textarea
      className="w-full bg-gray-800 border border-gray-600 rounded p-1 text-sm"
      rows={2}
      placeholder="Description..."
      value={entry.description}
      onChange={(e) => onChange({ ...entry, description: e.target.value })}
    />
  </div>
);

// 🖨️ Render the live resume preview
const ResumePreview = ({ blocks }) => (
  <>
    {blocks.map((b) => (
      <div key={b.id} className="mb-6">
        {b.type === 'personal' && (
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">{b.data.name}</h1>
            <p className="text-sm">{b.data.email} • {b.data.phone}</p>
            <p className="text-sm">{b.data.linkedin} • {b.data.github} • {b.data.website}</p>
          </div>
        )}
        {b.type === 'summary' && b.data.text && (
          <section className="mb-4">
            <h2 className="font-semibold mb-1">Summary</h2>
            <p className="leading-tight text-sm">{b.data.text}</p>
          </section>
        )}
        {['experience', 'education', 'projects'].includes(b.type) &&
          b.data.length > 0 && (
            <section className="mb-4">
              <h2 className="font-semibold mb-1 capitalize">{b.type}</h2>
              {b.data.map((e) => (
                <div key={e.id} className="mb-2">
                  {(e.title || e.degree || e.name) && (
                    <h3 className="font-medium">
                      {e.title || e.degree || e.name}{' '}
                      {e.company ? `@ ${e.company}` : ''}
                    </h3>
                  )}
                  <p className="italic text-xs">
                    {e.start} – {e.end || 'Present'}
                  </p>
                  {e.description && <p className="text-sm">{e.description}</p>}
                  {'technologies' in e && e.technologies && (
                    <p className="text-xs font-mono">{e.technologies}</p>
                  )}
                  {'url' in e && e.url && (
                    <a
                      href={e.url}
                      className="text-blue-300 text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {e.url}
                    </a>
                  )}
                </div>
              ))}
            </section>
          )}
        {b.type === 'skills' && b.data.length > 0 && (
          <section>
            <h2 className="font-semibold mb-1">Skills</h2>
            <p className="flex flex-wrap gap-2 text-xs">
              {b.data.map((s, i) => (
                <span key={i} className="bg-gray-600 px-2 py-1 rounded">
                  {s}
                </span>
              ))}
            </p>
          </section>
        )}
      </div>
    ))}
  </>
);
