import { $, $$ } from '../core/dom.js';
import { toast } from '../core/notifications.js';
import { downloadBlob } from '../core/storage.js';

export function initializePaintApp() {
  const canvas = $('#paintCanvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) {
    toast('The drawing canvas is not available in this browser.');
    return;
  }
  let drawing = false;
  let paintColor = '#f5a9c8';
  let tool = 'pen';
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = paintColor;
  context.lineWidth = 7;
  context.lineCap = 'round';
  const canvasPoint = event => {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
  };
  canvas.addEventListener('pointerdown', event => {
    drawing = true;
    canvas.setPointerCapture(event.pointerId);
    const point = canvasPoint(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
  });
  canvas.addEventListener('pointermove', event => {
    if (!drawing) return;
    const point = canvasPoint(event);
    context.strokeStyle = tool === 'erase' ? '#ffffff' : paintColor;
    context.lineWidth = tool === 'brush' ? 17 : (tool === 'erase' ? 26 : 7);
    context.lineTo(point.x, point.y);
    context.stroke();
  });
  const stopDrawing = () => { drawing = false; };
  canvas.addEventListener('pointerup', stopDrawing);
  canvas.addEventListener('pointercancel', stopDrawing);
  canvas.addEventListener('lostpointercapture', stopDrawing);
  $$('[data-color]').forEach(button => {
    button.addEventListener('click', () => {
      $$('[data-color]').forEach(item => item.classList.remove('selected'));
      button.classList.add('selected');
      paintColor = button.dataset.color;
      tool = 'pen';
    });
  });
  $$('[data-tool]').forEach(button => {
    button.addEventListener('click', () => {
      tool = button.dataset.tool;
      toast(`Tool: ${tool}`);
    });
  });
  $('#clearCanvas')?.addEventListener('click', () => {
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  });
  $('#downloadArt')?.addEventListener('click', () => downloadBlob(canvas.toDataURL('image/png'), 'picatsso-art.png', 'image/png'));
}
