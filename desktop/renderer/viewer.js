import "./polyfills.js";
import { getDocument, GlobalWorkerOptions } from "./pdfjs/pdf.mjs";

const worker = new Worker(new URL("./pdf-worker.mjs", import.meta.url), { type: "module" });
GlobalWorkerOptions.workerPort = worker;

const PAGE_PAD = 24;
const THUMB_MAX = 150;
const ZOOM_PRESETS = [0.25, 0.33, 0.5, 0.67, 0.75, 0.83, 1, 1.25, 1.5, 2, 2.5, 3, 4];
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 4;

const state = {
  doc: null,
  loadingTask: null,
  name: "",
  layoutMode: "fit-width",
  zoom: 1,
  pages: [],
  passwordCallback: null,
  passwordValue: null,
  currentPage: 1,
  renderSeq: 0,
  renderQueue: [],
  renderBusy: false,
  currentTheme: null,
};

const el = {
  btnOpen: document.getElementById("btn-open"),
  btnPrint: document.getElementById("btn-print"),
  btnPrev: document.getElementById("btn-prev"),
  btnNext: document.getElementById("btn-next"),
  btnZoomOut: document.getElementById("btn-zoom-out"),
  btnZoomIn: document.getElementById("btn-zoom-in"),
  btnFitWidth: document.getElementById("btn-fit-width"),
  btnFitPage: document.getElementById("btn-fit-page"),
  btnThumbs: document.getElementById("btn-thumbs"),
  btnTheme: document.getElementById("btn-theme"),
  zoomSelect: document.getElementById("zoom-select"),
  docName: document.getElementById("doc-name"),
  pageIndicator: document.getElementById("page-indicator"),
  thumbnails: document.getElementById("thumbnails"),
  thumbList: document.getElementById("thumb-list"),
  pageHost: document.getElementById("page-host"),
  emptyState: document.getElementById("empty-state"),
  btnOpenEmpty: document.getElementById("btn-open-empty"),
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
  printHost: document.getElementById("print-host"),
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

function availableSpace() {
  const w = el.pageHost.clientWidth - PAGE_PAD * 2;
  const h = el.pageHost.clientHeight - PAGE_PAD * 2;
  return { w: Math.max(40, w), h: Math.max(40, h) };
}

function effectiveScale() {
  if (state.layoutMode === "fixed") return state.zoom;
  const first = state.pages[0];
  if (!first) return state.zoom;
  const { w, h } = availableSpace();
  const w1 = first.vp1.width;
  const h1 = first.vp1.height;
  if (state.layoutMode === "fit-width") return Math.max(MIN_ZOOM, w / w1);
  return Math.max(MIN_ZOOM, Math.min(w / w1, h / h1));
}

function updateControls() {
  const hasDoc = Boolean(state.doc);
  for (const btn of [el.btnPrint, el.btnPrev, el.btnNext, el.btnZoomIn, el.btnZoomOut, el.btnFitWidth, el.btnFitPage]) {
    btn.disabled = !hasDoc;
  }
  el.zoomSelect.disabled = !hasDoc;
  el.pageIndicator.textContent = hasDoc ? `${state.currentPage} of ${state.pages.length}` : "— of —";
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
    const w1 = p.vp1.width;
    const h1 = p.vp1.height;
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
  const viewport = p.page.getViewport({ scale: p.scale * dpr });
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
  queueThumbRenders();
  setTimeout(layoutPages, 0);
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

function queueThumbRenders() {
  if (!state.doc) return;
  requestAnimationFrame(renderVisibleThumbs);
}

function renderVisibleThumbs() {
  if (!state.doc) return;
  const list = el.thumbList;
  if (el.thumbnails.hidden) return;
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
      const scale = THUMB_MAX / Math.max(p.vp1.width, p.vp1.height);
      const viewport = p.page.getViewport({ scale });
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
    const canvas = document.createElement("canvas");
    canvas.className = "pdf-canvas";
    section.appendChild(canvas);
    el.pageHost.appendChild(section);
    state.pages.push({
      n,
      page,
      vp1,
      div: section,
      canvas,
      scale: 1,
      width: vp1.width,
      height: vp1.height,
      rendered: false,
      prevTask: null,
      renderKey: 0,
      thumbDiv: null,
      thumbCanvas: null,
      thumbRendered: false,
    });
  }
}

async function destroyDocument() {
  for (const p of state.pages) {
    if (p.prevTask) {
      try {
        p.prevTask.cancel();
      } catch {
        // ignore
      }
    }
  }
  state.pages = [];
  el.pageHost.textContent = "";
  el.thumbList.textContent = "";
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
}

function showError(err) {
  const msg = err && err.message ? err.message : "The file could not be read or is not a valid PDF.";
  window.__pdfViewerError = msg;
  el.errorTitle.textContent = "Couldn't open this file";
  el.errorMessage.textContent = msg;
  el.errorState.hidden = false;
  el.emptyState.hidden = true;
  el.pageIndicator.textContent = "— of —";
}

function hideAllOverlays() {
  el.passwordModal.hidden = true;
  el.dropOverlay.hidden = true;
}

async function openDocument(data, name) {
  hideAllOverlays();
  setLoading(true);
  el.errorState.hidden = true;
  el.emptyState.hidden = true;
  el.pageHost.textContent = "";
  state.passwordValue = null;
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
    await buildPages(state.doc);
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

async function openFromDialog() {
  const res = await window.pdfViewer.openDialog();
  if (res && !res.canceled) openDocument(res.data, res.name);
}

async function printDocument() {
  if (!state.doc) return;
  el.printHost.textContent = "";
  const maxW = 2000;
  for (const p of state.pages) {
    const scale = Math.min(2, maxW / p.vp1.width);
    const viewport = p.page.getViewport({ scale });
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

let dragDepth = 0;

function bindEvents() {
  el.btnOpen.addEventListener("click", openFromDialog);
  el.btnOpenEmpty.addEventListener("click", openFromDialog);
  el.btnErrorOpen.addEventListener("click", openFromDialog);
  el.btnErrorDismiss.addEventListener("click", showEmpty);
  el.btnPrint.addEventListener("click", printDocument);
  el.btnPrev.addEventListener("click", prevPage);
  el.btnNext.addEventListener("click", () => nextPage());
  el.btnZoomIn.addEventListener("click", zoomIn);
  el.btnZoomOut.addEventListener("click", zoomOut);
  el.btnFitWidth.addEventListener("click", () => setFit("fit-width"));
  el.btnFitPage.addEventListener("click", () => setFit("fit-page"));
  el.btnThumbs.addEventListener("click", toggleThumbnails);
  el.btnTheme.addEventListener("click", toggleTheme);

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
    const buffer = new Uint8Array(await file.arrayBuffer());
    openDocument(buffer, file.name);
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

  window.pdfViewer.onOpenFile((payload) => openDocument(payload.data, payload.name));
  window.pdfViewer.onCommand((cmd) => {
    switch (cmd) {
      case "open":
        openFromDialog();
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
  bindEvents();
  updateControls();
  updateZoomSelect();
  window.__pdfViewerReady = true;
  document.body.dataset.ready = "1";
}

init();