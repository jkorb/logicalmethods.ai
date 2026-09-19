import { toSvg } from 'html-to-image';

// Capture the rendered state without changing the live diagram or its controls.
export function mountImageExport(root) {
  const controls = root.querySelector('.boolean-app__utilities') || root.appendChild(document.createElement('div'));
  controls.classList.add('logic-app__export-controls');
  const button = document.createElement('button');
  button.type = 'button';
  button.title = 'Download PNG';
  button.setAttribute('aria-label', 'Download PNG');
  button.dataset.exportImage = '';
  button.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/></svg>';
  const notice = document.createElement('span');
  notice.className = 'logic-app__export-notice';
  notice.setAttribute('aria-live', 'polite');
  controls.append(button, notice);
  button.addEventListener('click', async () => {
    button.disabled = true;
    notice.textContent = 'Preparing PNG…';
    try {
      await document.fonts.ready;
      const capture = root.querySelector('[data-picture]') || root.querySelector('.logic-app__tree') || root;
      const snapshot = await toSvg(capture, {
        pixelRatio: 2,
        backgroundColor: getComputedStyle(root).getPropertyValue('--paper').trim() || '#fff',
        style: { margin: '0', animation: 'none', transition: 'none' },
        filter: node => !node.matches?.('script, template, noscript, [hidden], .visually-hidden, .logic-app__export-controls, .logic-app__confetti'),
      });
      // html-to-image deep-clones SVGs without their descendants' CSS.
      // Inline presentation properties only in the serialized copy, preserving
      // the original artwork's groups, transforms, clip paths and paint order.
      const documentCopy = new DOMParser().parseFromString(decodeURIComponent(snapshot.split(',')[1]), 'image/svg+xml');
      const copyRoot = documentCopy.querySelector('foreignObject').firstElementChild;
      const originals = [...capture.querySelectorAll('svg')].filter(n => !n.closest('.logic-app__export-controls, [hidden], template'));
      const copies = [...copyRoot.querySelectorAll('svg')];
      const presentation = ['fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset', 'opacity', 'visibility', 'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor', 'dominant-baseline', 'paint-order'];
      originals.forEach((original, i) => {
        const source = [original, ...original.querySelectorAll('*')];
        const target = [copies[i], ...copies[i].querySelectorAll('*')];
        source.forEach((node, j) => {
          const css = getComputedStyle(node);
          for (const property of presentation) target[j].style?.setProperty(property, css.getPropertyValue(property));
          target[j].style?.setProperty('animation', 'none');
          target[j].style?.setProperty('transition', 'none');
        });
      });
      copyRoot.querySelectorAll('[data-export-omit]').forEach(n=>n.remove());
      const image = new Image();
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(documentCopy))}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width * 2;
      canvas.height = image.height * 2;
      const context = canvas.getContext('2d');
      context.fillStyle = getComputedStyle(root).getPropertyValue('--paper').trim() || '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve));
      if (!blob) throw new Error('Empty image');
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `${root.dataset.logicApp}-${root.dataset.preset || root.dataset.kind || 'work'}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      notice.textContent = 'PNG downloaded.';
    } catch (error) {
      notice.textContent = 'Could not create the PNG. Please try again.';
      console.error('App image export failed:', error);
    } finally {
      button.disabled = false;
    }
  });
}
