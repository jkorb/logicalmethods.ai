import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Excalidraw, MainMenu, serializeAsJSON, convertToExcalidrawElements, CaptureUpdateAction } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import './editor.css';
import '../../assets/css/pickers.css';
import { slideEntries } from './model.mjs';

const signature = elements => elements.map(e => `${e.id}:${e.version}:${e.versionNonce}:${e.isDeleted}`).join('|');
function Editor() {
  const [stopped, setStopped] = useState(false);
  const [libraryError, setLibraryError] = useState('');
  const [library, setLibrary] = useState(null);
  const libraryItems = useRef([]);
  const [libraryDirty, setLibraryDirty] = useState(false);
  const [entries, setEntries] = useState([]);
  const [selected, setSelected] = useState('');
  const [decks, setDecks] = useState([]);
  const [id, setId] = useState('lecture-1');
  const [loaded, setLoaded] = useState(null);
  const [api, setApi] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('Loading…');
  const revision = useRef('');
  const baseline = useRef(null);
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty || libraryDirty;
  useEffect(() => {
    fetch('/api/library').then(async response => {
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.library?.libraryItems)) throw Error(data.error || 'Invalid library response');
      return data;
    }).then(data => { libraryItems.current = data.library.libraryItems; setLibrary(data); }).catch(error => {
      // A missing/broken library must not prevent lecture editing.
      setLibraryError(`Icon library could not load: ${error.message}. Restart the editor server and reload to retry.`);
      setLibrary({ library: { type: 'excalidrawlib', version: 2, libraryItems: [] }, revision: null });
    });
    fetch('/api/decks').then(r => r.json()).then(setDecks).catch(e => setStatus(e.message));
    const warn = e => { if (dirtyRef.current) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);
  useEffect(() => {
    let cancelled = false;
    setLoaded(null); setApi(null); baseline.current = null;
    fetch(`/api/decks/${id}`).then(async r => { if (!r.ok) throw Error((await r.json()).error); return r.json(); }).then(data => {
      if (cancelled) return;
      revision.current = data.revision;
      // Give each frame persistent presentation metadata. Native undo/redo now
      // treats order changes just like other edits to those frames.
      const ordered = slideEntries(data.scene, data.manifest);
      data.scene.elements = data.scene.elements.map(e => {
        const position = ordered.findIndex(s => s.frameId === e.id);
        return position < 0 ? e : { ...e, name: ordered[position].title, customData: { ...e.customData, courseSlideOrder: position } };
      });
      setEntries(ordered); setSelected(ordered[0]?.frameId || '');
      setLoaded(data); setDirty(false); setStatus('Ready. Changes stay local until you save.');
    }).catch(e => setStatus(e.message));
    return () => { cancelled = true; };
  }, [id]);
  function scene() {
    // serializeAsJSON strips transient editor state. Preserve original metadata
    // and all embedded files instead of its default unused-file pruning.
    const data = JSON.parse(serializeAsJSON(api.getSceneElementsIncludingDeleted(), api.getAppState(), api.getFiles(), 'local'));
    return { ...loaded.scene, ...data, metadata: loaded.scene.metadata, files: { ...loaded.scene.files, ...api.getFiles() } };
  }
  async function save() {
    if (!api || saving) return;
    setSaving(true);
    const value = scene(); const savedSignature = signature(api.getSceneElementsIncludingDeleted());
    try {
      const response = await fetch(`/api/decks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ revision: revision.current, scene: value }) });
      const result = await response.json();
      if (!response.ok) throw Error(result.error);
      revision.current = result.revision; baseline.current = savedSignature;
      setDirty(signature(api.getSceneElementsIncludingDeleted()) !== savedSignature);
      setStatus('Saved. A backup was kept. Run npm run slides:render to update the website.');
    } catch (error) { setStatus(`Save failed: ${error.message}`); }
    finally { setSaving(false); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(scene(), null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `${id}.excalidraw`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function goToSlide(frameId) {
    setSelected(frameId);
    const frame = api?.getSceneElements().find(e => e.id === frameId);
    if (frame) api.scrollToContent(frame, { fitToViewport: true, viewportZoomFactor: 0.85 });
  }
  useEffect(() => {
    if (api && loaded) {
      const frame = requestAnimationFrame(() => goToSlide(loaded.manifest.slides[0].frameId));
      return () => cancelAnimationFrame(frame);
    }
  }, [api, loaded]);
  function update(elements) {
    api.updateScene({ elements, captureUpdate: CaptureUpdateAction.IMMEDIATELY });
  }
  function changed(element, values) {
    return { ...element, ...values, version: element.version + 1, versionNonce: Math.floor(Math.random() * 2147483647), updated: Date.now() };
  }
  function moveSlide(direction) {
    const order = [...entries]; const from = order.findIndex(e => e.frameId === selected); const to = from + direction;
    if (from < 0 || to < 0 || to >= order.length) return;
    [order[from], order[to]] = [order[to], order[from]];
    update(api.getSceneElementsIncludingDeleted().map(e => {
      const index = order.findIndex(s => s.frameId === e.id);
      return index < 0 ? e : changed(e, { customData: { ...e.customData, courseSlideOrder: index } });
    }));
  }
  function addSlide() {
    const elements = api.getSceneElementsIncludingDeleted();
    const frames = elements.filter(e => e.type === 'frame' && !e.isDeleted);
    const template = frames[0]; const x = template?.x || 0;
    const y = Math.max(0, ...frames.map(e => e.y + e.height)) + 350;
    const width = template?.width || 1171; const height = template?.height || 693;
    const frameId = crypto.randomUUID(); const titleId = crypto.randomUUID();
    const additions = convertToExcalidrawElements([
      { type: 'frame', id: frameId, children: [titleId], x, y, width, height, name: 'Untitled slide', customData: { courseSlideOrder: entries.length } },
      { type: 'text', id: titleId, x: x + 60, y: y + 50, text: 'Untitled slide', fontSize: 40, fontFamily: 5, frameId },
    ], { regenerateIds: false });
    Object.assign(additions.find(e => e.id === frameId), { x, y, width, height });
    update([...elements, ...additions]);
    requestAnimationFrame(() => goToSlide(frameId));
  }
  function renameSlide() {
    const entry = entries.find(e => e.frameId === selected);
    if (!entry) return;
    const title = window.prompt('Slide title (used in navigation):', entry.title);
    if (!title?.trim()) return;
    update(api.getSceneElementsIncludingDeleted().map(e => e.id === selected ? changed(e, { name: title.trim() }) : e));
  }
  function removeSlide() {
    if (entries.length < 2 || !entries.some(e => e.frameId === selected)) return;
    if (!window.confirm('Remove this slide and its contents? You can undo this in the canvas. Saved versions are backed up.')) return;
    update(api.getSceneElementsIncludingDeleted().map(e => e.id === selected || e.frameId === selected ? changed(e, { isDeleted: true }) : e));
    goToSlide(entries.find(e => e.frameId !== selected).frameId);
  }
  function renumber() {
    const elements = api.getSceneElementsIncludingDeleted();
    const replacements = new Map(); const additions = [];
    entries.forEach((entry, index) => {
      const frame = elements.find(e => e.id === entry.frameId);
      // Only footer numbers at the bottom right, never numerals in diagrams.
      const candidates = elements.filter(e => !e.isDeleted && e.type === 'text' && e.frameId === frame.id &&
        (e.customData?.courseSlideNumber || (/^\d+$/.test(e.text.trim()) && e.x > frame.x + frame.width * .85 && e.y > frame.y + frame.height * .88)));
      const text = String(index + 1);
      if (candidates.length === 1) {
        const element = candidates[0];
        replacements.set(element.id, changed(element, { text, originalText: text, width: Math.max(element.width, text.length * element.fontSize * .7), customData: { ...element.customData, courseSlideNumber: true } }));
      } else if (!candidates.length) additions.push(...convertToExcalidrawElements([{ type: 'text', x: frame.x + frame.width - 130, y: frame.y + frame.height - 65, text, fontSize: 24, fontFamily: 5, frameId: frame.id, customData: { courseSlideNumber: true } }]));
    });
    update([...elements.map(e => replacements.get(e.id) || e), ...additions]);
    setStatus('Footers follow presentation order. Ambiguous existing footers are left unchanged. Save source, then render.');
  }
  async function importLibrary(event) {
    const file = event.target.files[0]; event.target.value = '';
    if (!file || !api) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.type !== 'excalidrawlib' || !Array.isArray(data.libraryItems)) throw Error('Choose an Excalidraw library file.');
      const merged = new Map(libraryItems.current.map(item => [item.id, item]));
      data.libraryItems.forEach(item => { if (!item.id || !Array.isArray(item.elements)) throw Error('Invalid library item'); merged.set(item.id, item); });
      await api.updateLibrary({ libraryItems: [...merged.values()], openLibraryMenu: true });
      setStatus('Icons imported. Save library to keep this update.');
    } catch (error) { setStatus(error.message); }
  }
  async function saveLibrary() {
    setSaving(true);
    const value = { ...library.library, libraryItems: libraryItems.current };
    try {
      const response = await fetch('/api/library', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ library: value, revision: library.revision }) });
      const result = await response.json(); if (!response.ok) throw Error(result.error);
      setLibrary({ library: value, revision: result.revision });
      setLibraryDirty(JSON.stringify(libraryItems.current) !== JSON.stringify(value.libraryItems));
      setStatus('Library saved. A backup was kept.');
    } catch (error) { setStatus(`Library save failed: ${error.message}`); }
    finally { setSaving(false); }
  }
  async function stopEditor() {
    if (saving) return;
    if (dirtyRef.current && !window.confirm('Stop the editor and discard unsaved source or library changes? Cancel to save or download them first. No rendering will run.')) return;
    try {
      const response = await fetch('/api/stop', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw Error(result.error);
      dirtyRef.current = false; setDirty(false); setLibraryDirty(false); setStopped(true);
    } catch (error) { setStatus(`Could not stop: ${error.message}. You can also press Ctrl+C in the editor terminal.`); }
  }
  if (stopped) return <main className="local-editor__stopped"><h1>Editor stopped</h1><p>No rendering was run. Saved source files and the library remain on disk.</p><p>To edit again, run <code>npm run slides:edit</code> in your terminal, then reload this page.</p><p>Render separately with <code>npm run slides:render</code> when you want to update the website.</p></main>;
  return <div className="local-editor">
    <header className="local-editor__bar">
      <strong>Logical methods · Excalidraw</strong>
      <details className="course-picker local-editor__lecture" onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary').focus(); } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}>
        <summary aria-label="Choose lecture"><span>{decks.find(deck => deck.id === id)?.title || 'Choose lecture'}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></summary>
        <div className="course-picker__options" role="group" aria-label="Lectures">{decks.map(deck => <button key={deck.id} disabled={saving} aria-current={deck.id === id ? 'page' : undefined} onClick={event => {
          if (!dirty || window.confirm('Discard unsaved changes? Download or save them first if you need to keep them.')) setId(deck.id);
          const picker = event.currentTarget.closest('details'); picker.open = false; picker.querySelector('summary').focus();
        }}>{deck.title}</button>)}</div>
      </details>
      <button onClick={save} disabled={!api || saving}>{saving ? 'Saving…' : 'Save source'}</button>
      <button onClick={download} disabled={!api}>Download copy</button>
      <button onClick={stopEditor} disabled={saving}>Stop editor</button>
      <span aria-label="Save state">{dirty ? 'Unsaved changes' : 'Saved / unchanged'}</span>
    </header>
    <p className="local-editor__status" role="status">{status}</p>
    {libraryError && <p className="local-editor__error" role="alert">{libraryError} Lecture editing is still available; library saving is disabled.</p>}
    <div className="local-editor__workspace">
    <aside className="local-editor__slides" aria-label="Slide manager">
      <div className="local-editor__actions"><strong>Slides · {entries.length}</strong><button onClick={addSlide} disabled={!api}>＋ Add slide</button></div>
      <ol>{entries.map((entry, i) => <li key={entry.frameId}><button aria-current={selected === entry.frameId ? 'page' : undefined} onClick={() => goToSlide(entry.frameId)}><span>{i + 1}</span>{entry.title}</button></li>)}</ol>
      <div className="local-editor__actions">
        <button onClick={() => moveSlide(-1)} disabled={!api || entries.findIndex(e => e.frameId === selected) <= 0}>↑ Move up</button>
        <button onClick={() => moveSlide(1)} disabled={!api || entries.findIndex(e => e.frameId === selected) >= entries.length - 1}>↓ Move down</button>
        <button onClick={renameSlide} disabled={!api || !selected}>Rename</button>
        <button onClick={removeSlide} disabled={!api || entries.length < 2}>Remove slide</button>
        <button onClick={renumber} disabled={!api}>Renumber footers</button>
      </div>
      <p>Order here is the presentation order. Ctrl/Cmd Z undoes slide changes in the canvas.</p>
      <div className="local-editor__actions"><button disabled={!api} onClick={() => api.updateLibrary({ libraryItems: libraryItems.current, openLibraryMenu: true })}>Open icon library</button><button disabled={!libraryDirty || saving || !library?.revision} onClick={saveLibrary}>Save library</button></div>
      <label className="local-editor__import">Import / update icons<input type="file" accept=".excalidrawlib,.excalidraw,application/json" onChange={importLibrary}/></label>
      <p>{libraryDirty ? 'Library has unsaved changes.' : 'Library saved locally.'} Import merges icons by ID. Use the Library panel to add or remove icons, then save.</p>
    </aside>
    <div className="local-editor__canvas">
      {loaded && library && <Excalidraw key={id} excalidrawAPI={setApi}
        initialData={{ ...loaded.scene, libraryItems: libraryItems.current, appState: { ...loaded.scene.appState, theme: 'light', currentItemFontFamily: 5 }, scrollToContent: true }}
        onLibraryChange={items => {
          libraryItems.current = items;
          setLibraryDirty(JSON.stringify(items) !== JSON.stringify(library.library.libraryItems));
        }}
        onChange={elements => {
          const nextEntries = slideEntries({ elements }, loaded.manifest);
          setEntries(previous => JSON.stringify(previous) === JSON.stringify(nextEntries) ? previous : nextEntries);
          const next = signature(elements);
          if (baseline.current === null) baseline.current = next;
          setDirty(next !== baseline.current);
        }}
        UIOptions={{ canvasActions: { loadScene: false, saveToActiveFile: false, saveAsImage: true, export: { saveFileToDisk: true }, toggleTheme: false } }}>
        <MainMenu><MainMenu.DefaultItems.Export/><MainMenu.DefaultItems.SaveAsImage/><MainMenu.DefaultItems.ClearCanvas/></MainMenu>
      </Excalidraw>}
    </div>
    </div>
  </div>;
}
createRoot(document.getElementById('root')).render(<Editor/>);
