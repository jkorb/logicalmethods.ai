// Pure validation shared by the renderer, editor server and unit tests.
export function validateScene(scene) {
  if (scene?.type !== 'excalidraw' || !Array.isArray(scene.elements) || !scene.files || typeof scene.files !== 'object') {
    throw new Error('Expected an Excalidraw scene with elements and embedded files.');
  }
  const ids = new Set();
  for (const element of scene.elements) {
    if (!element.id || ids.has(element.id)) throw new Error(`Duplicate or missing element ID: ${element.id}`);
    ids.add(element.id);
    if (element.type === 'image' && !element.isDeleted && !scene.files[element.fileId]) {
      throw new Error(`Missing image ${element.fileId} for ${element.id}`);
    }
  }
  for (const [id, file] of Object.entries(scene.files)) {
    if (typeof file.dataURL !== 'string' || !/^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,/.test(file.dataURL)) {
      throw new Error(`Image ${id} must be embedded, not a remote URL.`);
    }
  }
}

export function orderedFrames(scene, manifest) {
  validateScene(scene);
  const frames = scene.elements.filter(e => !e.isDeleted && e.type === 'frame');
  const entries = slideEntries(scene, manifest);
  const ids = entries.map(s => s.frameId);
  if (new Set(ids).size !== ids.length || frames.length !== ids.length || frames.some(f => !ids.includes(f.id))) {
    throw new Error('The slide manifest must list every live frame exactly once. Update its explicit order after adding or deleting slides.');
  }
  const retained = new Set((manifest.nonSlideElements || []).map(e => e.id));
  const unframed = scene.elements.filter(e => !e.isDeleted && e.type !== 'frame' && !ids.includes(e.frameId) && !retained.has(e.id));
  if (unframed.length) throw new Error(`${unframed.length} elements are outside slide frames; assign them before exporting.`);
  return entries.map(slide => ({ ...slide, frame: frames.find(f => f.id === slide.frameId) }));
}

// Retain metadata, unused embedded files, and deleted elements during a save.
export function mergeScene(original, update) {
  validateScene(update);
  const ids = new Set(update.elements.map(e => e.id));
  return {
    ...original, ...update,
    metadata: original.metadata,
    appState: { ...original.appState, ...update.appState },
    elements: [...update.elements, ...original.elements.filter(e => !ids.has(e.id)).map(e => ({ ...e, isDeleted: true }))],
    files: { ...original.files, ...update.files },
  };
}

// Order lives on frames, so native Excalidraw undo and .excalidraw downloads
// retain it. Old scenes continue to use their explicit migration manifest.
export function slideEntries(scene, manifest) {
  const frames = scene.elements.filter(e => e.type === 'frame' && !e.isDeleted);
  if (!frames.some(f => Number.isFinite(f.customData?.courseSlideOrder))) return manifest.slides;
  return frames.map(frame => ({ frameId: frame.id,
    title: frame.name || manifest.slides.find(s => s.frameId === frame.id)?.title || 'Untitled slide',
    order: frame.customData?.courseSlideOrder ?? Infinity,
  })).sort((a, b) => a.order - b.order).map(({ frameId, title }) => ({ frameId, title }));
}
