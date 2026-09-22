import "./polyfills.js";
import { getDocument, GlobalWorkerOptions, TextLayer } from "./pdfjs/pdf.mjs";

const worker = new Worker(new URL("./pdf-worker.mjs", import.meta.url), { type: "module" });
GlobalWorkerOptions.workerPort = worker;

const PAGE_PAD = 24;
const THUMB_MAX = 150;
const ZOOM_PRESETS = [0.25, 0.33, 0.5, 0.67, 0.75, 0.83, 1, 1.25, 1.5, 2, 2.5, 3, 4];
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 4;
const RECENT_KEY = "pdfforge-recent-files";

const state = {
  doc: null,
  loadingTask: null,
  name: "",
  filePath: null,
  layoutMode: "fit-width",
  zoom: 1,
  rotation: 0,
  pages: [],
  outline: [],
  passwordCallback: null,
  passwordValue: null,
  currentPage: 1,
  renderSeq: 0,
  renderQueue: [],
  renderBusy: false,
  currentTheme: null,
  activeSidebarTab: "thumbs",
  search: {
    isOpen: false,
    query: "",
    matches: [],
    currentMatchIndex: -1,
  },
};

const el = {
  btnOpen: document.getElementById("btn-open"),
  btnPrint: document.getElementById("btn-print"),
  btnFind: document.getElementById("btn-find"),
  btnInfo: document.getElementById("btn-info"),
  btnShortcuts: document.getElementById("btn-shortcuts"),
  btnPrev: document.getElementById("btn-prev"),
  btnNext: document.getElementById("btn-next"),
  btnZoomOut: document.getElementById("btn-zoom-out"),
  btnZoomIn: document.getElementById("btn-zoom-in"),
  btnRotate: document.getElementById("btn-rotate"),
  btnFitWidth: document.getElementById("btn-fit-width"),
  btnFitPage: document.getElementById("btn-fit-page"),
  btnThumbs: document.getElementById("btn-thumbs"),
  btnTheme: document.getElementById("btn-theme"),
  zoomSelect: document.getElementById("zoom-select"),
  docName: document.getElementById("doc-name"),
  pageJumpInput: document.getElementById("page-jump-input"),
  pageIndicator: document.getElementById("page-indicator"),
  thumbnails: document.getElementById("thumbnails"),
  tabThumbs: document.getElementById("tab-thumbs"),
  tabOutline: document.getElementById("tab-outline"),
  thumbList: document.getElementById("thumb-list"),
  outlineList: document.getElementById("outline-list"),
  pageHost: document.getElementById("page-host"),
  emptyState: document.getElementById("empty-state"),
  btnOpenEmpty: document.getElementById("btn-open-empty"),
  recentContainer: document.getElementById("recent-container"),
  recentList: document.getElementById("recent-list"),
  btnClearRecent: document.getElementById("btn-clear-recent"),
  errorState: document.getElementById("error-state"),
  errorTitle: document.getElementById("error-title"),
  errorMessage: document.getElementById("error-message"),
  btnErrorOpen: document.getElementById("btn-error-open"),
  btnErrorDismiss: document.getElementById("btn-error-dismiss"),
  loadingBar: document.getElementById("loading-bar"),
  dropOverlay: document.getElementById("drop-overlay"),
  passwordModal: document.getElementById("password-modal"),
  passwordNote: document.getElementById("password-note"),
  passwordError: document.getElementById("password-error"),
  passwordInput: document.getElementById("password-input"),
  btnPasswordCancel: document.getElementById("btn-password-cancel"),
  btnPasswordOk: document.getElementById("btn-password-ok"),
  propertiesModal: document.getElementById("properties-modal"),
  propertiesContent: document.getElementById("properties-content"),
  btnPropertiesClose: document.getElementById("btn-properties-close"),
  shortcutsModal: document.getElementById("shortcuts-modal"),
  btnShortcutsClose: document.getElementById("btn-shortcuts-close"),
  printHost: document.getElementById("print-host"),
  findBar: document.getElementById("find-bar"),
  findInput: document.getElementById("find-input"),
  findPrev: document.getElementById("find-prev"),
  findNext: document.getElementById("find-next"),
  findResults: document.getElementById("find-results"),
  findClose: document.getElementById("find-close"),
};

for (const preset of ZOOM_PRESETS) {
  const option = document.createElement("option");
  option.value = String(Math.round(preset * 100));
  option.textContent = `${Math.round(preset * 100)}%`;
  el.zoomSelect.appendChild(option);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = String(str || "");
  return d.innerHTML;
}

function availableSpace() {
  const w = el.pageHost.clientWidth - PAGE_PAD * 2;
  const h = el.pageHost.clientHeight - PAGE_PAD * 2;
  return { w: Math.max(40, w), h: Math.max(40, h) };
}

function effectiveScale() {
  if (state.layoutMode === "fixed") return state.zoom;
  const first = state.pages[0];
  if (!first) return state.zoom;
  const rot = (first.page.rotate + state.rotation) % 360;
  const vp1 = first.page.getViewport({ scale: 1, rotation: rot });
  const { w, h } = availableSpace();
  const w1 = vp1.width;
  const h1 = vp1.height;
  if (state.layoutMode === "fit-width") return Math.max(MIN_ZOOM, w / w1);
  return Math.max(MIN_ZOOM, Math.min(w / w1, h / h1));
}

function updateControls() {
  const hasDoc = Boolean(state.doc);
  for (const btn of [
    el.btnPrint,
    el.btnFind,
    el.btnInfo,
    el.btnPrev,
    el.btnNext,
    el.btnZoomIn,
    el.btnZoomOut,
    el.btnRotate,
    el.btnFitWidth,
    el.btnFitPage,
  ]) {
    if (btn) btn.disabled = !hasDoc;
  }
  if (el.zoomSelect) el.zoomSelect.disabled = !hasDoc;
  if (el.pageJumpInput) {
    el.pageJumpInput.disabled = !hasDoc;
    el.pageJumpInput.max = String(hasDoc ? state.pages.length : 1);
    el.pageJumpInput.value = String(hasDoc ? state.currentPage : 1);
  }
  if (el.pageIndicator) {
    el.pageIndicator.textContent = hasDoc ? `of ${state.pages.length}` : "— of —";
  }
}

function updateZoomSelect() {
  const percent = Math.round(effectiveScale() * 100);
  const preset = ZOOM_PRESETS.find((p) => Math.abs(p - percent / 100) < 0.02);
  el.zoomSelect.value = preset ? String(Math.round(preset * 100)) : "";
  el.zoomSelect.title = `${percent}%`;
}

function layoutPages() {
  if (!state.doc) return;
  const { w: availW, h: availH } = availableSpace();
  for (const p of state.pages) {
    const rot = (p.page.rotate + state.rotation) % 360;
    const vp1 = p.page.getViewport({ scale: 1, rotation: rot });
    const w1 = vp1.width;
    const h1 = vp1.height;
    let scale;
    if (state.layoutMode === "fit-width") {
      scale = availW / w1;
    } else if (state.layoutMode === "fit-page") {
      scale = Math.min(availW / w1, availH / h1);
    } else {
      scale = state.zoom;
    }
    p.scale = clamp(scale, MIN_ZOOM, 8);
    p.width = Math.round(w1 * p.scale);
    p.height = Math.round(h1 * p.scale);
    p.div.style.width = `${p.width}px`;
    p.div.style.height = `${p.height}px`;
    p.div.style.setProperty("--scale-factor", String(p.scale));
    p.rendered = false;
    p.renderKey = 0;
    if (p.prevTask) {
      try {
        p.prevTask.cancel();
      } catch {
        // ignore
      }
      p.prevTask = null;
    }
    if (p.textTask) {
      try {
        p.textTask.cancel();
      } catch {
        // ignore
      }
      p.textTask = null;
    }
    if (p.textDiv) {
      p.textDiv.textContent = "";
    }
  }
  queueVisibleRender();
}

function computeVisibleRange() {
  const first = state.pages[0];
  if (!first) return [-1, -1];
  const top = el.pageHost.scrollTop - PAGE_PAD;
  const bottom = top + el.pageHost.clientHeight + PAGE_PAD;
  let start = -1;
  let end = -1;
  for (let i = 0; i < state.pages.length; i++) {
    const p = state.pages[i];
    const y = p.div.offsetTop;
    if (start < 0 && y + p.height >= top) start = i;
    if (y <= bottom) end = i;
    if (y > bottom) break;
  }
  return [start, end];
}

function computeCurrentPage() {
  if (!state.pages.length) return;
  const mid = el.pageHost.scrollTop + el.pageHost.clientHeight / 2;
  let current = 0;
  for (let i = 0; i < state.pages.length; i++) {
    if (state.pages[i].div.offsetTop <= mid) current = i;
    else break;
  }
  if (current + 1 !== state.currentPage) {
    state.currentPage = current + 1;
    if (el.pageJumpInput && document.activeElement !== el.pageJumpInput) {
      el.pageJumpInput.value = String(state.currentPage);
    }
    updateControls();
    updateActiveThumb();
  }
}

function queueVisibleRender() {
  if (!state.doc) return;
  state.renderSeq++;
  const seq = state.renderSeq;
  requestAnimationFrame(() => {
    if (seq !== state.renderSeq) return;
    collectVisiblePages();
  });
}

function collectVisiblePages() {
  if (!state.doc) return;
  computeCurrentPage();
  const [start, end] = computeVisibleRange();
  for (let i = start - 3; i < end + 3; i++) {
    const p = state.pages[i];
    if (p && !p.rendered) enqueueRender(p);
  }
  pumpRender();
}

function enqueueRender(p) {
  if (!state.renderQueue.includes(p)) state.renderQueue.push(p);
}

async function pumpRender() {
  if (state.renderBusy) return;
  state.renderBusy = true;
  try {
    while (state.renderQueue.length) {
      const p = state.renderQueue.shift();
      await renderPage(p);
    }
  } catch {
    // keep going
  } finally {
    state.renderBusy = false;
  }
}

async function renderPage(p) {
  if (p.rendered) return;
  const key = ++p.renderKey;
  const dpr = window.devicePixelRatio || 1;
  const rot = (p.page.rotate + state.rotation) % 360;
  const viewport = p.page.getViewport({ scale: p.scale * dpr, rotation: rot });
  const width = Math.ceil(viewport.width);
  const height = Math.ceil(viewport.height);
  if (p.canvas.width !== width) p.canvas.width = width;
  if (p.canvas.height !== height) p.canvas.height = height;
  p.canvas.style.width = `${p.width}px`;
  p.canvas.style.height = `${p.height}px`;

  if (p.prevTask) {
    try {
      p.prevTask.cancel();
    } catch {
      // ignore
    }
  }
  const task = p.page.render({ canvas: p.canvas, viewport });
  p.prevTask = task;
  try {
    await task.promise;
  } catch {
    // cancelled or failed
  }
  if (key !== p.renderKey) return;
  p.rendered = true;
  p.prevTask = null;

  renderTextLayerForPage(p, key);
}

async function renderTextLayerForPage(p, key) {
  if (p.textTask) {
    try {
      p.textTask.cancel();
    } catch {
      // ignore
    }
    p.textTask = null;
  }
  p.textDiv.textContent = "";

  const rot = (p.page.rotate + state.rotation) % 360;
  const textViewport = p.page.getViewport({ scale: p.scale, rotation: rot });
  try {
    if (!p.textContent) {
      p.textContent = await p.page.getTextContent();
    }
    if (key !== p.renderKey) return;

    const textLayer = new TextLayer({
      textContentSource: p.textContent,
      container: p.textDiv,
      viewport: textViewport,
    });
    p.textTask = textLayer;
    await textLayer.render();
    if (key !== p.renderKey) return;
    p.textTask = null;

    if (state.search.query) {
      highlightPage(p);
      const active = p.textDiv.querySelector(".highlight.selected");
      if (active) {
        active.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      }
    }
  } catch (err) {
    if (err && err.name === "AbortException") return;
    // ignore
  }
}

function scrollToPage(index) {
  const p = state.pages[index];
  if (!p) return;
  const target = Math.max(0, p.div.offsetTop - Math.max(24, (el.pageHost.clientHeight - p.height) / 2));
  el.pageHost.scrollTo({ top: target, behavior: "smooth" });
}

function prevPage() {
  if (state.currentPage > 1) scrollToPage(state.currentPage - 2);
}

function nextPage() {
  if (state.doc && state.currentPage < state.pages.length) scrollToPage(state.currentPage);
}

function setFit(mode) {
  state.layoutMode = mode;
  layoutPages();
  updateZoomSelect();
  syncFitButtons();
}

function zoomIn() {
  zoomBy(1.25);
}

function zoomOut() {
  zoomBy(0.8);
}

function zoomBy(factor) {
  if (!state.doc) return;
  if (state.layoutMode !== "fixed") {
    state.zoom = effectiveScale();
    state.layoutMode = "fixed";
  }
  state.zoom = clamp(state.zoom * factor, MIN_ZOOM, MAX_ZOOM);
  layoutPages();
  updateZoomSelect();
  syncFitButtons();
}

function actualSize() {
  if (!state.doc) return;
  state.zoom = 1;
  state.layoutMode = "fixed";
  layoutPages();
  updateZoomSelect();
  syncFitButtons();
}

function rotateClockwise() {
  if (!state.doc) return;
  state.rotation = (state.rotation + 90) % 360;
  for (const p of state.pages) {
    p.thumbRendered = false;
  }
  layoutPages();
  queueThumbRenders();
}

function syncFitButtons() {
  el.btnFitWidth.classList.toggle("active", state.layoutMode === "fit-width");
  el.btnFitPage.classList.toggle("active", state.layoutMode === "fit-page");
}

function updateActiveThumb() {
  for (let i = 0; i < state.pages.length; i++) {
    state.pages[i].thumbDiv.classList.toggle("active", i === state.currentPage - 1);
  }
}

let thumbsVisible = true;

function toggleThumbnails() {
  thumbsVisible = !thumbsVisible;
  applyThumbnails();
}

function applyThumbnails() {
  el.thumbnails.hidden = !thumbsVisible;
  el.btnThumbs.classList.toggle("active", thumbsVisible);
  if (thumbsVisible && state.activeSidebarTab === "thumbs") {
    queueThumbRenders();
  }
  setTimeout(layoutPages, 0);
}

function switchSidebarTab(tab) {
  state.activeSidebarTab = tab;
  el.tabThumbs.classList.toggle("active", tab === "thumbs");
  el.tabOutline.classList.toggle("active", tab === "outline");
  el.thumbList.hidden = tab !== "thumbs";
  el.outlineList.hidden = tab !== "outline";
  if (tab === "thumbs") {
    queueThumbRenders();
  }
}

function buildThumbnails() {
  el.thumbList.textContent = "";
  for (let i = 0; i < state.pages.length; i++) {
    const p = state.pages[i];
    const div = document.createElement("div");
    div.className = "thumb";
    div.dataset.index = String(i);
    const canvas = document.createElement("canvas");
    const label = document.createElement("span");
    label.className = "thumb-label";
    label.textContent = String(p.n);
    div.append(canvas, label);
    p.thumbDiv = div;
    p.thumbCanvas = canvas;
    el.thumbList.appendChild(div);
  }
  applyThumbnails();
}

async function buildOutline(doc) {
  el.outlineList.textContent = "";
  try {
    const outline = await doc.getOutline();
    state.outline = outline || [];
    if (!outline || !outline.length) {
      el.outlineList.innerHTML = '<div class="empty-outline">No outline in this document</div>';
      return;
    }
    const container = document.createElement("div");
    container.className = "outline-tree";
    renderOutlineItems(outline, container, 0);
    el.outlineList.appendChild(container);
  } catch {
    el.outlineList.innerHTML = '<div class="empty-outline">Could not load outline</div>';
  }
}

function renderOutlineItems(items, container, depth) {
  for (const item of items) {
    const link = document.createElement("div");
    link.className = "outline-item";
    link.style.paddingLeft = `${depth * 14 + 8}px`;
    link.textContent = item.title;
    link.addEventListener("click", async () => {
      if (item.dest) {
        try {
          const dest = typeof item.dest === "string" ? await state.doc.getDestination(item.dest) : item.dest;
          if (Array.isArray(dest) && dest[0]) {
            const pageIndex = await state.doc.getPageIndex(dest[0]);
            scrollToPage(pageIndex);
          }
        } catch {
          // destination could not be navigated
        }
      }
    });
    container.appendChild(link);
    if (item.items && item.items.length) {
      renderOutlineItems(item.items, container, depth + 1);
    }
  }
}

function queueThumbRenders() {
  if (!state.doc || state.activeSidebarTab !== "thumbs") return;
  requestAnimationFrame(renderVisibleThumbs);
}

function renderVisibleThumbs() {
  if (!state.doc || el.thumbnails.hidden || state.activeSidebarTab !== "thumbs") return;
  const list = el.thumbList;
  const top = list.scrollTop - 60;
  const bottom = top + list.clientHeight + 120;
  for (const p of state.pages) {
    if (p.thumbRendered) continue;
    const y = p.thumbDiv.offsetTop;
    if (y >= top - 60 && y <= bottom) {
      void renderThumb(p);
    }
  }
}

let thumbRenderChain = Promise.resolve();
function renderThumb(p) {
  if (p.thumbRendered) return;
  thumbRenderChain = thumbRenderChain
    .then(async () => {
      if (p.thumbRendered) return;
      const rot = (p.page.rotate + state.rotation) % 360;
      const vp1 = p.page.getViewport({ scale: 1, rotation: rot });
      const scale = THUMB_MAX / Math.max(vp1.width, vp1.height);
      const viewport = p.page.getViewport({ scale, rotation: rot });
      const c = p.thumbCanvas;
      c.width = Math.ceil(viewport.width);
      c.height = Math.ceil(viewport.height);
      c.style.width = `${c.width}px`;
      c.style.height = `${c.height}px`;
      p.thumbDiv.style.width = `${c.width}px`;
      try {
        await p.page.render({ canvas: c, viewport }).promise;
        p.thumbRendered = true;
      } catch {
        // cancelled
      }
    })
    .catch(() => {});
}

async function buildPages(doc) {
  el.pageHost.textContent = "";
  state.pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const vp1 = page.getViewport({ scale: 1 });
    const section = document.createElement("section");
    section.className = "pdf-page";
    section.dataset.pageNumber = String(n);
    const canvas = document.createElement("canvas");
    canvas.className = "pdf-canvas";
    const textDiv = document.createElement("div");
    textDiv.className = "textLayer";
    section.append(canvas, textDiv);
    el.pageHost.appendChild(section);
    state.pages.push({
      n,
      page,
      vp1,
      div: section,
      canvas,
      textDiv,
      textContent: null,
      scale: 1,
      width: vp1.width,
      height: vp1.height,
      rendered: false,
      prevTask: null,
      textTask: null,
      renderKey: 0,
      thumbDiv: null,
      thumbCanvas: null,
      thumbRendered: false,
    });
  }
}

async function destroyDocument() {
  toggleFindBar(false);
  for (const p of state.pages) {
    if (p.prevTask) {
      try {
        p.prevTask.cancel();
      } catch {
        // ignore
      }
    }
    if (p.textTask) {
      try {
        p.textTask.cancel();
      } catch {
        // ignore
      }
    }
  }
  state.pages = [];
  state.outline = [];
  el.pageHost.textContent = "";
  el.thumbList.textContent = "";
  el.outlineList.textContent = "";
  if (state.loadingTask) {
    try {
      await state.loadingTask.destroy();
    } catch {
      // ignore
    }
    state.loadingTask = null;
  }
  if (state.doc) {
    try {
      await state.doc.destroy();
    } catch {
      // ignore
    }
  }
  state.doc = null;
  state.passwordCallback = null;
}

function setLoading(on) {
  el.loadingBar.hidden = !on;
}

function showEmpty() {
  el.emptyState.hidden = false;
  el.errorState.hidden = true;
  el.docName.textContent = "PDFForge Viewer";
  el.docName.title = "No document opened";
  document.title = "PDFForge Viewer";
  renderRecentFiles();
  updateControls();
}

function showError(err) {
  const msg = err && err.message ? err.message : "The file could not be read or is not a valid PDF.";
  window.__pdfViewerError = msg;
  el.errorTitle.textContent = "Couldn't open this file";
  el.errorMessage.textContent = msg;
  el.errorState.hidden = false;
  el.emptyState.hidden = true;
  updateControls();
}

function hideAllOverlays() {
  el.passwordModal.hidden = true;
  el.dropOverlay.hidden = true;
  if (el.propertiesModal) el.propertiesModal.hidden = true;
  if (el.shortcutsModal) el.shortcutsModal.hidden = true;
}

function getRecentFiles() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentFile(name, filePath) {
  if (!name) return;
  try {
    let list = getRecentFiles();
    list = list.filter((item) => item.path !== filePath && item.name !== name);
    list.unshift({ name, path: filePath || "", time: Date.now() });
    if (list.length > 5) list = list.slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    renderRecentFiles();
  } catch {}
}

function clearRecentFiles() {
  localStorage.removeItem(RECENT_KEY);
  renderRecentFiles();
}

function renderRecentFiles() {
  const list = getRecentFiles();
  if (!list.length) {
    el.recentContainer.hidden = true;
    return;
  }
  el.recentContainer.hidden = false;
  el.recentList.innerHTML = "";
  for (const item of list) {
    const row = document.createElement("div");
    row.className = "recent-item";
    row.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <path d="M14 2v6h6"/>
      </svg>
      <div class="recent-info">
        <span class="recent-name">${escapeHtml(item.name)}</span>
        <span class="recent-path">${escapeHtml(item.path || item.name)}</span>
      </div>
    `;
    row.addEventListener("click", () => {
      openRecentFile(item);
    });
    el.recentList.appendChild(row);
  }
}

async function openRecentFile(item) {
  if (item.path) {
    try {
      const res = await window.pdfViewer.readFile(item.path);
      if (res && res.data) {
        openDocument(res.data, res.name, item.path);
        return;
      }
    } catch {
      // file might have moved
    }
  }
  showError(new Error(`Could not open "${item.name}". The file may have been moved or deleted.`));
}

async function openDocument(data, name, filePath) {
  hideAllOverlays();
  setLoading(true);
  el.errorState.hidden = true;
  el.emptyState.hidden = true;
  el.pageHost.textContent = "";
  state.passwordValue = null;
  state.rotation = 0;
  state.filePath = filePath || null;
  await destroyDocument();
  try {
    const task = getDocument({ data, password: state.passwordValue });
    task.onPassword = (update, reason) => {
      state.passwordCallback = update;
      const prompt = reason === 2 ? "The password is incorrect. Try again." : "This PDF requires a password to open.";
      showPasswordModal(prompt);
    };
    state.loadingTask = task;
    state.doc = await task.promise;
    state.name = name;
    state.currentPage = 1;
    document.title = `${name} — PDFForge Viewer`;
    el.docName.textContent = name;
    el.docName.title = filePath ? `${name} (${filePath})` : name;
    saveRecentFile(name, filePath);
    await buildPages(state.doc);
    await buildOutline(state.doc);
    layoutPages();
    buildThumbnails();
    updateZoomSelect();
    syncFitButtons();
    updateControls();
    updateActiveThumb();
    el.pageHost.scrollTo({ top: 0 });
    state.renderSeq++;
  } catch (err) {
    if (err && err.name === "PasswordException") {
      showPasswordModal("This PDF requires a password to open.");
    } else {
      showError(err);
    }
  } finally {
    setLoading(false);
  }
}

function showPasswordModal(note) {
  el.passwordNote.textContent = note;
  el.passwordError.hidden = true;
  el.passwordModal.hidden = false;
  el.passwordInput.value = "";
  setTimeout(() => el.passwordInput.focus(), 0);
}

function hidePasswordModal() {
  el.passwordModal.hidden = true;
}

function submitPassword() {
  const value = el.passwordInput.value;
  if (!value) return;
  const update = state.passwordCallback;
  hidePasswordModal();
  if (update) {
    state.passwordValue = value;
    update(value);
  }
}

function showShortcutsModal() {
  hideAllOverlays();
  el.shortcutsModal.hidden = false;
}

async function showPropertiesModal() {
  if (!state.doc) return;
  hideAllOverlays();
  el.propertiesContent.innerHTML = "<span class='prop-label'>Loading…</span><span class='prop-val'>Reading document metadata…</span>";
  el.propertiesModal.hidden = false;

  try {
    const meta = await state.doc.getMetadata();
    const info = (meta && meta.info) || {};
    const first = state.pages[0];
    const dims = first ? `${Math.round((first.vp1.width * 72) / 96)} × ${Math.round((first.vp1.height * 72) / 96)} pt` : "—";

    const rows = [
      ["File Name", state.name || "—"],
      ["File Location", state.filePath || "Local Session"],
      ["Page Count", `${state.pages.length} pages`],
      ["Page Dimensions", dims],
      ["Title", info.Title || "—"],
      ["Author", info.Author || "—"],
      ["Subject", info.Subject || "—"],
      ["Creator Tool", info.Creator || "—"],
      ["PDF Producer", info.Producer || "—"],
      ["Creation Date", info.CreationDate ? String(info.CreationDate).replace(/^D:/, "") : "—"],
      ["PDF Version", info.PDFFormatVersion || "1.4+"],
    ];

    el.propertiesContent.innerHTML = rows
      .map(([label, val]) => `<span class="prop-label">${escapeHtml(label)}</span><span class="prop-val">${escapeHtml(val)}</span>`)
      .join("");
  } catch {
    el.propertiesContent.innerHTML = "<span class='prop-label'>Error</span><span class='prop-val'>Could not read document properties</span>";
  }
}

async function openFromDialog() {
  const res = await window.pdfViewer.openDialog();
  if (res && !res.canceled) openDocument(res.data, res.name, res.path);
}

async function printDocument() {
  if (!state.doc) return;
  el.printHost.textContent = "";
  const maxW = 2000;
  for (const p of state.pages) {
    const rot = (p.page.rotate + state.rotation) % 360;
    const vp1 = p.page.getViewport({ scale: 1, rotation: rot });
    const scale = Math.min(2, maxW / vp1.width);
    const viewport = p.page.getViewport({ scale, rotation: rot });
    const sheet = document.createElement("section");
    sheet.className = "print-sheet";
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    sheet.appendChild(canvas);
    el.printHost.appendChild(sheet);
    try {
      await p.page.render({ canvas, viewport }).promise;
    } catch {
      // ignore one page
    }
    await new Promise((r) => setTimeout(r, 0));
  }
  const cleanup = () => {
    el.printHost.textContent = "";
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  window.print();
  setTimeout(cleanup, 1500);
}

function applyTheme(theme, persist) {
  if (theme === state.currentTheme) return;
  state.currentTheme = theme;
  document.documentElement.dataset.theme = theme;
  window.pdfViewer.setTheme(theme);
  if (persist) localStorage.setItem("viewer-theme", theme);
}

function toggleTheme() {
  applyTheme(state.currentTheme === "dark" ? "light" : "dark", true);
}

let searchDebounceTimer = null;
function debounceSearch(query) {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    executeSearch(query);
  }, 150);
}

function toggleFindBar(force) {
  if (!state.doc && force) return;
  const show = typeof force === "boolean" ? force : el.findBar.hidden;
  state.search.isOpen = show;
  el.findBar.hidden = !show;
  if (el.btnFind) el.btnFind.classList.toggle("active", show);
  if (show) {
    el.findInput.focus();
    el.findInput.select();
    if (el.findInput.value) {
      executeSearch(el.findInput.value);
    }
  } else {
    clearAllHighlights();
    state.search.query = "";
    state.search.matches = [];
    state.search.currentMatchIndex = -1;
    el.findResults.textContent = "";
    el.pageHost.focus();
  }
}

async function executeSearch(query) {
  query = (query || "").trim();
  state.search.query = query;
  state.search.matches = [];
  state.search.currentMatchIndex = -1;

  if (!query || !state.doc) {
    el.findResults.textContent = "";
    clearAllHighlights();
    return;
  }

  el.findResults.textContent = "…";

  const lowerQuery = query.toLowerCase();
  const allMatches = [];

  for (let i = 0; i < state.pages.length; i++) {
    const p = state.pages[i];
    if (!p.textContent) {
      try {
        p.textContent = await p.page.getTextContent();
      } catch {
        continue;
      }
    }
    for (const item of p.textContent.items) {
      if (!item.str) continue;
      const strLower = item.str.toLowerCase();
      let pos = 0;
      while ((pos = strLower.indexOf(lowerQuery, pos)) !== -1) {
        allMatches.push({
          pageIndex: i,
        });
        pos += lowerQuery.length;
      }
    }
  }

  state.search.matches = allMatches;

  if (allMatches.length === 0) {
    el.findResults.textContent = "0 of 0";
    clearAllHighlights();
    return;
  }

  let targetIndex = allMatches.findIndex((m) => m.pageIndex >= state.currentPage - 1);
  if (targetIndex < 0) targetIndex = 0;

  goToMatch(targetIndex);
}

function goToMatch(index) {
  if (!state.search.matches.length) return;
  state.search.currentMatchIndex = (index + state.search.matches.length) % state.search.matches.length;
  const current = state.search.matches[state.search.currentMatchIndex];

  el.findResults.textContent = `${state.search.currentMatchIndex + 1} of ${state.search.matches.length}`;

  for (const p of state.pages) {
    if (p.rendered) {
      highlightPage(p);
    }
  }

  scrollToPage(current.pageIndex);

  setTimeout(() => {
    const active = el.pageHost.querySelector(".textLayer .highlight.selected");
    if (active) {
      active.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }, 100);
}

function findNext() {
  if (!state.search.matches.length) {
    if (el.findInput.value) executeSearch(el.findInput.value);
    return;
  }
  goToMatch(state.search.currentMatchIndex + 1);
}

function findPrev() {
  if (!state.search.matches.length) {
    if (el.findInput.value) executeSearch(el.findInput.value);
    return;
  }
  goToMatch(state.search.currentMatchIndex - 1);
}

function highlightPage(p) {
  const query = state.search.query;
  if (!query || !p.textDiv) return;
  clearHighlightsOnPage(p);

  const lowerQuery = query.toLowerCase();
  const pageMatches = state.search.matches.filter((m) => m.pageIndex === p.n - 1);
  if (!pageMatches.length) return;

  const spans = Array.from(p.textDiv.querySelectorAll("span"));
  if (!spans.length) return;

  const firstGlobalMatchIdx = state.search.matches.findIndex((m) => m.pageIndex === p.n - 1);
  let matchCounter = 0;

  for (const span of spans) {
    if (span.classList.contains("highlight")) continue;
    const rawText = span.textContent;
    const lower = rawText.toLowerCase();
    if (!lower.includes(lowerQuery)) continue;

    const fragment = document.createDocumentFragment();
    let lastIdx = 0;
    let idx = 0;
    while ((idx = lower.indexOf(lowerQuery, lastIdx)) !== -1) {
      if (idx > lastIdx) {
        fragment.appendChild(document.createTextNode(rawText.slice(lastIdx, idx)));
      }
      const matchSpan = document.createElement("span");
      matchSpan.className = "highlight";
      const globalIdx = firstGlobalMatchIdx + matchCounter;
      if (globalIdx === state.search.currentMatchIndex) {
        matchSpan.classList.add("selected");
      }
      matchSpan.textContent = rawText.slice(idx, idx + query.length);
      fragment.appendChild(matchSpan);
      matchCounter++;
      lastIdx = idx + query.length;
    }
    if (lastIdx < rawText.length) {
      fragment.appendChild(document.createTextNode(rawText.slice(lastIdx)));
    }
    span.textContent = "";
    span.appendChild(fragment);
  }
}

function clearHighlightsOnPage(p) {
  if (!p.textDiv) return;
  const highlights = p.textDiv.querySelectorAll(".highlight");
  for (const h of highlights) {
    const parent = h.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(h.textContent), h);
      parent.normalize();
    }
  }
}

function clearAllHighlights() {
  for (const p of state.pages) {
    clearHighlightsOnPage(p);
  }
}

let dragDepth = 0;

function bindEvents() {
  el.btnOpen.addEventListener("click", openFromDialog);
  el.btnOpenEmpty.addEventListener("click", openFromDialog);
  el.btnErrorOpen.addEventListener("click", openFromDialog);
  el.btnErrorDismiss.addEventListener("click", showEmpty);
  el.btnPrint.addEventListener("click", printDocument);
  if (el.btnClearRecent) el.btnClearRecent.addEventListener("click", clearRecentFiles);
  if (el.btnFind) el.btnFind.addEventListener("click", () => toggleFindBar());
  if (el.btnInfo) el.btnInfo.addEventListener("click", showPropertiesModal);
  if (el.btnShortcuts) el.btnShortcuts.addEventListener("click", showShortcutsModal);
  if (el.btnPropertiesClose) el.btnPropertiesClose.addEventListener("click", hideAllOverlays);
  if (el.btnShortcutsClose) el.btnShortcutsClose.addEventListener("click", hideAllOverlays);

  if (el.tabThumbs) el.tabThumbs.addEventListener("click", () => switchSidebarTab("thumbs"));
  if (el.tabOutline) el.tabOutline.addEventListener("click", () => switchSidebarTab("outline"));

  if (el.findClose) el.findClose.addEventListener("click", () => toggleFindBar(false));
  if (el.findPrev) el.findPrev.addEventListener("click", () => findPrev());
  if (el.findNext) el.findNext.addEventListener("click", () => findNext());
  if (el.findInput) {
    el.findInput.addEventListener("input", (e) => debounceSearch(e.target.value));
    el.findInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) findPrev();
        else findNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        toggleFindBar(false);
      }
    });
  }
  el.btnPrev.addEventListener("click", prevPage);
  el.btnNext.addEventListener("click", () => nextPage());
  el.btnZoomIn.addEventListener("click", zoomIn);
  el.btnZoomOut.addEventListener("click", zoomOut);
  if (el.btnRotate) el.btnRotate.addEventListener("click", rotateClockwise);
  el.btnFitWidth.addEventListener("click", () => setFit("fit-width"));
  el.btnFitPage.addEventListener("click", () => setFit("fit-page"));
  el.btnThumbs.addEventListener("click", toggleThumbnails);
  el.btnTheme.addEventListener("click", toggleTheme);

  if (el.pageJumpInput) {
    el.pageJumpInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = parseInt(el.pageJumpInput.value, 10);
        if (Number.isInteger(val) && val >= 1 && val <= state.pages.length) {
          scrollToPage(val - 1);
        } else {
          el.pageJumpInput.value = String(state.currentPage);
        }
        el.pageHost.focus();
      } else if (e.key === "Escape") {
        el.pageJumpInput.value = String(state.currentPage);
        el.pageHost.focus();
      }
    });
    el.pageJumpInput.addEventListener("blur", () => {
      el.pageJumpInput.value = String(state.currentPage);
    });
  }

  el.zoomSelect.addEventListener("change", () => {
    const value = Number(el.zoomSelect.value);
    if (!value) return;
    state.zoom = clamp(value / 100, MIN_ZOOM, MAX_ZOOM);
    state.layoutMode = "fixed";
    layoutPages();
    syncFitButtons();
  });

  el.btnPasswordOk.addEventListener("click", submitPassword);
  el.passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitPassword();
  });
  el.btnPasswordCancel.addEventListener("click", () => {
    hidePasswordModal();
    showError(new Error("This PDF requires a password. It was not opened."));
  });

  el.thumbList.addEventListener("click", (e) => {
    const item = e.target.closest(".thumb");
    if (!item) return;
    const index = Number(item.dataset.index);
    if (Number.isInteger(index)) scrollToPage(index);
  });

  let scrollFrame = null;
  el.pageHost.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = null;
        computeCurrentPage();
        collectVisiblePages();
      });
    },
    { passive: true }
  );

  el.thumbList.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = null;
        renderVisibleThumbs();
      });
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    layoutPages();
    requestAnimationFrame(renderVisibleThumbs);
  });

  // Ctrl + Mouse Wheel to zoom
  window.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) zoomIn();
        else if (e.deltaY > 0) zoomOut();
      }
    },
    { passive: false }
  );

  window.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dragDepth++;
    if (!state.doc && dragDepth > 0) el.dropOverlay.hidden = false;
  });
  window.addEventListener("dragover", (e) => e.preventDefault());
  window.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) el.dropOverlay.hidden = true;
  });
  window.addEventListener("drop", async (e) => {
    e.preventDefault();
    dragDepth = 0;
    el.dropOverlay.hidden = true;
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (!file) return;
    if (!/\.pdf$/i.test(file.name)) {
      showError(new Error("Only PDF files can be opened."));
      return;
    }
    const path = window.pdfViewer.getPathForFile ? window.pdfViewer.getPathForFile(file) : null;
    const buffer = new Uint8Array(await file.arrayBuffer());
    openDocument(buffer, file.name, path);
  });

  window.addEventListener("keydown", (e) => {
    const mod = e.ctrlKey || e.metaKey;
    const key = e.key;
    if (mod) {
      const k = key.toLowerCase();
      if (k === "o") {
        e.preventDefault();
        openFromDialog();
        return;
      }
      if (k === "p") {
        e.preventDefault();
        printDocument();
        return;
      }
      if (k === "d") {
        e.preventDefault();
        showPropertiesModal();
        return;
      }
      if (k === "=" || k === "+" || key === "Add") {
        e.preventDefault();
        zoomIn();
        return;
      }
      if (k === "-" || key === "Subtract") {
        e.preventDefault();
        zoomOut();
        return;
      }
      if (k === "0") {
        e.preventDefault();
        actualSize();
        return;
      }
      if (k === "r") {
        e.preventDefault();
        rotateClockwise();
        return;
      }
      if (k === "f") {
        e.preventDefault();
        toggleFindBar(true);
        return;
      }
    }
    if (key === "Escape") {
      if (state.search.isOpen) {
        e.preventDefault();
        toggleFindBar(false);
        return;
      }
      if (!el.propertiesModal.hidden || !el.shortcutsModal.hidden || !el.passwordModal.hidden) {
        e.preventDefault();
        hideAllOverlays();
        return;
      }
    }
    if (key === "?" || key === "F1") {
      const tag = e.target && e.target.tagName;
      if (tag !== "INPUT" && tag !== "SELECT" && tag !== "TEXTAREA") {
        e.preventDefault();
        showShortcutsModal();
        return;
      }
    }
    if (!state.doc) return;
    const tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    switch (key) {
      case "ArrowLeft":
        e.preventDefault();
        prevPage();
        break;
      case "ArrowRight":
        e.preventDefault();
        nextPage();
        break;
      case "PageUp":
        e.preventDefault();
        el.pageHost.scrollBy({ top: -el.pageHost.clientHeight });
        break;
      case "PageDown":
        e.preventDefault();
        el.pageHost.scrollBy({ top: el.pageHost.clientHeight });
        break;
      case "Home":
        e.preventDefault();
        el.pageHost.scrollTo({ top: 0 });
        break;
      case "End":
        e.preventDefault();
        el.pageHost.scrollTo({ top: el.pageHost.scrollHeight });
        break;
      case "t":
      case "T":
        toggleThumbnails();
        break;
      case "d":
      case "D":
        toggleTheme();
        break;
      default:
        break;
    }
  });

  window.pdfViewer.onOpenFile((payload) => openDocument(payload.data, payload.name, payload.path));
  window.pdfViewer.onCommand((cmd) => {
    switch (cmd) {
      case "open":
        openFromDialog();
        break;
      case "find":
        toggleFindBar(true);
        break;
      case "rotate":
        rotateClockwise();
        break;
      case "properties":
        showPropertiesModal();
        break;
      case "shortcuts":
        showShortcutsModal();
        break;
      case "print":
        printDocument();
        break;
      case "zoom-in":
        zoomIn();
        break;
      case "zoom-out":
        zoomOut();
        break;
      case "actual-size":
        actualSize();
        break;
      case "fit-width":
        setFit("fit-width");
        break;
      case "fit-page":
        setFit("fit-page");
        break;
      case "toggle-thumbnails":
        toggleThumbnails();
        break;
      case "toggle-theme":
        toggleTheme();
        break;
      default:
        break;
    }
  });
}

async function init() {
  const saved = localStorage.getItem("viewer-theme");
  const initial = saved || (await window.pdfViewer.getTheme());
  applyTheme(initial === "dark" ? "dark" : "light");
  showEmpty();
  bindEvents();
  updateControls();
  updateZoomSelect();
  window.__pdfViewerReady = true;
  document.body.dataset.ready = "1";
}

init();