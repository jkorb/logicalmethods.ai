import { exportToSvg } from '@excalidraw/excalidraw';
window.exportSlide = async ({ scene, frame }) => {
  const elements = scene.elements.filter(e => !e.isDeleted && (e.id === frame.id || e.frameId === frame.id));
  const svg = await exportToSvg({
    elements, files: scene.files, exportingFrame: frame, exportPadding: 0,
    appState: { ...scene.appState, exportBackground: true, exportWithDarkMode: false, exportEmbedScene: false },
  });
  // SVGs are displayed as images. Preserve link labels visually and expose
  // their destinations as ordinary links in the viewer instead.
  for (const anchor of svg.querySelectorAll('a')) anchor.replaceWith(...anchor.childNodes);
  return svg.outerHTML;
};
