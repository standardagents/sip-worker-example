import { collect, inspect, ready, transform } from '@standardagents/sip';
import LOGO_SVG from './sip-logo.svg';

const HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ultra low memory WASM image processing for Cloudflare Workers.</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5140 3870'%3E%3Cpath fill='%23fff' d='M3270 3649c-260-28-661-116-934-205-289-95-575-213-866-359-564-282-937-566-1063-809-27-53-31-71-32-141 0-74 4-91 59-230 119-306 305-632 502-881 157-200 422-450 604-570 165-110 445-252 590-301 85-28 348-25 495 6 549 116 1166 452 1303 709 75 141 187 471 231 683 16 80 35 158 41 173 17 44 51 81 178 186 134 111 284 265 373 382 33 45 89 140 124 212 101 206 135 380 109 553-25 173-67 264-172 375-108 114-216 159-382 159-144 0-253-35-380-121-34-23-65-39-68-35-4 3-21 30-38 58-39 67-97 111-182 138-56 18-95 22-237 25-93 1-208-2-255-7z'/%3E%3C/svg%3E">
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Inter, system-ui, sans-serif; background: #000; color: #fff; min-height: 100vh; }
    main { width: min(680px, calc(100vw - 2rem)); margin: 0 auto; padding: 3rem 0 4rem; }
    h1 { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 0.5rem; }
    .hero-logo { display: block; width: min(360px, 60vw); height: auto; margin: 0 0 1.5rem; filter: invert(1); opacity: 0.9; }
    .sub { color: #888; line-height: 1.6; margin-bottom: 1.5rem; font-size: 0.95rem; }
    .sub a { color: #f6821f; text-decoration: none; }

    .card { border: 1px solid #222; border-radius: 12px; overflow: hidden; background: #0a0a0a; }

    .preview { position: relative; min-height: 120px; display: flex; align-items: center; justify-content: center;
      background: repeating-conic-gradient(#151515 0% 25%, #0a0a0a 0% 50%) 0 0 / 16px 16px;
      border-bottom: 1px solid #222; padding: 1rem; cursor: pointer; }
    .preview img { max-width: 100%; max-height: 300px; border-radius: 6px; display: block; }
    .preview-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.6); opacity: 0; transition: opacity 0.15s; }
    .preview:hover .preview-overlay { opacity: 1; }
    .preview-overlay span { font-size: 0.85rem; font-weight: 600; padding: 0.5rem 1rem;
      border: 1px solid #333; border-radius: 8px; background: #111; }
    .preview-empty { color: #555; font-size: 0.9rem; }
    #file-input { display: none; }

    .fields { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid #222; }
    .field { padding: 0.75rem 1rem; border-right: 1px solid #222; }
    .field:last-child { border-right: none; }
    .field-label { display: block; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em;
      text-transform: uppercase; color: #666; margin-bottom: 0.35rem; }
    .field input { width: 100%; border: 1px solid #222; border-radius: 6px; background: #000;
      color: #fff; padding: 0.45rem 0.6rem; font: inherit; font-size: 0.88rem; }
    .field input:focus { border-color: rgba(246,130,31,0.4); outline: none; }

    .actions { display: flex; gap: 0.6rem; align-items: center; padding: 0.75rem 1rem; }
    .btn { border: none; border-radius: 8px; padding: 0.6rem 1rem; font: inherit; font-size: 0.88rem;
      font-weight: 700; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem; }
    .btn-primary { background: #fff; color: #000; }
    .btn-primary:hover { background: #ddd; }
    .btn-secondary { background: #111; color: #ccc; border: 1px solid #333; }
    .btn-secondary:hover { background: #1a1a1a; }
    .btn-secondary:disabled { opacity: 0.4; cursor: default; }
    .btn svg { width: 14px; height: 14px; }
    #status { color: #666; font-size: 0.85rem; margin-left: auto; }

    .statusbar { padding: 0.4rem 0.85rem; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem;
      color: #555; background: #0a0a0a; border-top: 1px solid #222; min-height: 1.6rem; }

    .output-area { min-height: 100px; display: flex; align-items: center; justify-content: center;
      background: repeating-conic-gradient(#151515 0% 25%, #0a0a0a 0% 50%) 0 0 / 16px 16px;
      padding: 1rem; }
    .output-area img { max-width: 100%; max-height: 400px; border-radius: 6px; display: block; }
    .output-empty { color: #333; font-size: 0.85rem; }

    .spinner { width: 20px; height: 20px; border: 2px solid #222; border-top-color: #f6821f;
      border-radius: 50%; animation: spin 0.6s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .result-card { margin-top: 1.5rem; }

    @media (max-width: 600px) {
      .fields { grid-template-columns: 1fr; }
      .field { border-right: none; border-bottom: 1px solid #222; }
      .field:last-child { border-bottom: none; }
    }
  </style>
</head>
<body>
  <main>
    <img src="/logo.svg" alt="sip" class="hero-logo">
    <h1>Ultra low memory WASM image processing for Cloudflare Workers.</h1>
    <p class="sub">Upload an image and this Cloudflare Worker will resize it using <a href="https://github.com/standardagents/sip">sip</a>.</p>

    <div class="card">
      <div class="preview" id="input-preview" onclick="document.getElementById('file-input').click()">
        <span class="preview-empty">Click to select an image</span>
        <div class="preview-overlay"><span>Select an image</span></div>
      </div>
      <input id="file-input" type="file" accept="image/jpeg,image/png,image/webp,image/avif">
      <div class="statusbar" id="input-info"></div>
      <div class="fields">
        <div class="field"><span class="field-label">Max width</span><input id="w" type="number" min="1" value="1024"></div>
        <div class="field"><span class="field-label">Max height</span><input id="h" type="number" min="1" value="1024"></div>
        <div class="field"><span class="field-label">Quality</span><input id="q" type="number" min="1" max="100" value="82"></div>
      </div>
      <div class="actions">
        <button class="btn btn-primary" id="submit-btn" disabled>Resize</button>
        <a class="btn btn-secondary" id="download-btn" style="display:none" download="sip-output.jpg">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download
        </a>
        <span id="status"></span>
      </div>
    </div>

    <div class="card result-card" id="result-card" style="display:none">
      <div class="output-area" id="output-area">
        <span class="output-empty">Result will appear here</span>
      </div>
      <div class="statusbar" id="output-info"></div>
    </div>
  </main>
  <script>
    const fileInput = document.getElementById('file-input');
    const inputPreview = document.getElementById('input-preview');
    const inputInfo = document.getElementById('input-info');
    const submitBtn = document.getElementById('submit-btn');
    const downloadBtn = document.getElementById('download-btn');
    const status = document.getElementById('status');
    const resultCard = document.getElementById('result-card');
    const outputArea = document.getElementById('output-area');
    const outputInfo = document.getElementById('output-info');
    let outputUrl = '';

    function formatBytes(b) {
      if (b < 1024) return b + ' B';
      if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
      return (b / (1024 * 1024)).toFixed(2) + ' MB';
    }

    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      submitBtn.disabled = false;

      // Show input preview
      const url = URL.createObjectURL(file);
      inputPreview.innerHTML = '<img src="' + url + '" alt="Input"><div class="preview-overlay"><span>Select an image</span></div>';
      inputInfo.textContent = file.type.replace('image/', '').toUpperCase() + ' — ' + formatBytes(file.size);

      // Clear previous result
      if (outputUrl) { URL.revokeObjectURL(outputUrl); outputUrl = ''; }
      resultCard.style.display = 'none';
      downloadBtn.style.display = 'none';
      status.textContent = '';
      outputInfo.textContent = '';
    });

    submitBtn.addEventListener('click', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      if (outputUrl) { URL.revokeObjectURL(outputUrl); outputUrl = ''; }
      resultCard.style.display = '';
      outputArea.innerHTML = '<div class="spinner"></div>';
      outputInfo.textContent = '';
      downloadBtn.style.display = 'none';
      status.textContent = 'Processing...';

      const params = new URLSearchParams({
        width: document.getElementById('w').value,
        height: document.getElementById('h').value,
        quality: document.getElementById('q').value,
      });

      try {
        const res = await fetch('/api/process?' + params, {
          method: 'POST',
          headers: { 'content-type': file.type || 'application/octet-stream' },
          body: file,
        });

        if (!res.ok) throw new Error(await res.text() || 'Processing failed');

        const blob = await res.blob();
        outputUrl = URL.createObjectURL(blob);
        outputArea.innerHTML = '<img src="' + outputUrl + '" alt="Output">';

        const outW = res.headers.get('X-Output-Width');
        const outH = res.headers.get('X-Output-Height');
        const outBytes = Number(res.headers.get('X-Output-Bytes'));
        const peak = Number(res.headers.get('X-Peak-Pipeline-Bytes'));
        outputInfo.textContent = 'Output: JPEG ' + outW + '×' + outH + ' — ' + formatBytes(outBytes) + ' — peak sip memory ' + formatBytes(peak);

        downloadBtn.href = outputUrl;
        downloadBtn.style.display = '';
        status.textContent = 'Done.';
      } catch (err) {
        outputArea.innerHTML = '<span class="output-empty">' + (err.message || 'Processing failed') + '</span>';
        status.textContent = '';
      }
    });
  </script>
</body>
</html>`;

function getOptions(url: URL) {
  return {
    width: Number(url.searchParams.get('width')) || undefined,
    height: Number(url.searchParams.get('height')) || undefined,
    quality: Number(url.searchParams.get('quality')) || undefined,
  };
}

export default {
  async fetch(request: Request): Promise<Response> {
    await ready();

    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/logo.svg') {
      return new Response(LOGO_SVG, {
        headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' },
      });
    }
    if (request.method === 'GET' && url.pathname === '/') {
      return new Response(HTML, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }

    if (request.method !== 'POST' || url.pathname !== '/api/process') {
      return new Response('Not found', { status: 404 });
    }

    try {
      const { info, source } = await inspect(request);
      if (info.format !== 'jpeg' && info.format !== 'png') {
        return new Response('This example worker accepts JPEG and PNG inputs only.', {
          status: 415,
        });
      }
      const image = transform(source, getOptions(url));
      const result = await collect(image);
      return new Response(result.data, {
        headers: {
          'Content-Type': result.info.mimeType,
          'Cache-Control': 'no-store',
          'X-Input-Format': info.format,
          'X-Input-Width': String(info.width),
          'X-Input-Height': String(info.height),
          'X-Output-Width': String(result.info.width),
          'X-Output-Height': String(result.info.height),
          'X-Output-Bytes': String(result.stats.bytesOut),
          'X-Peak-Pipeline-Bytes': String(result.stats.peakPipelineBytes),
          'X-Peak-Codec-Bytes': String(result.stats.peakCodecBytes),
          'X-Peak-Buffered-Input-Bytes': String(result.stats.peakBufferedInputBytes),
          'X-Peak-Buffered-Output-Bytes': String(result.stats.peakBufferedOutputBytes),
        },
      });
    } catch (error) {
      return new Response(
        error instanceof Error ? error.message : 'Processing failed',
        { status: 500 }
      );
    }
  },
};
