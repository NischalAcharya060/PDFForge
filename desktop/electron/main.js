const { app, BrowserWindow, dialog, ipcMain, Menu, nativeTheme, net, protocol, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");
const { pathToFileURL } = require("node:url");

const SMOKE = process.env.PDFVIEWER_SMOKE === "1";

let mainWindow = null;
let pendingFile = null;

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

const RENDERER_DIR = path.join(__dirname, "..", "renderer");
const PDFJS_BUILD_DIR = path.join(__dirname, "..", "node_modules", "pdfjs-dist", "build");
const PDFJS_WEB_DIR = path.join(__dirname, "..", "node_modules", "pdfjs-dist", "web");

function looksLikePdf(p) {
  return typeof p === "string" && /\.pdf$/i.test(p) && !p.startsWith("-");
}

async function firstPdfArg(argv) {
  for (const raw of argv.slice(1)) {
    if (!looksLikePdf(raw)) continue;
    const resolved = path.resolve(raw);
    try {
      const st = await fs.stat(resolved);
      if (st.isFile()) return resolved;
    } catch {
      // skip
    }
  }
  return null;
}

function registerProtocol() {
  protocol.handle("app", async (request) => {
    const url = new URL(request.url);
    if (url.hostname !== "renderer") {
      return new Response("Not found", { status: 404 });
    }
    const pathname = decodeURIComponent(url.pathname);
    let filePath;
    if (pathname.startsWith("/pdfjs/")) {
      filePath = path.join(PDFJS_BUILD_DIR, path.basename(pathname));
    } else if (pathname.startsWith("/pdfjs-web/")) {
      filePath = path.join(PDFJS_WEB_DIR, pathname.substring("/pdfjs-web/".length));
    } else {
      filePath = path.join(RENDERER_DIR, pathname.replace(/^\//, ""));
    }
    
    // Simple directory traversal check
    if (filePath.includes("..")) {
        return new Response("Forbidden", { status: 403 });
    }

    const allowed =
      filePath === RENDERER_DIR ||
      filePath.startsWith(RENDERER_DIR + path.sep) ||
      (filePath.startsWith(PDFJS_BUILD_DIR + path.sep) && pathname.startsWith("/pdfjs/")) ||
      (filePath.startsWith(PDFJS_WEB_DIR + path.sep) && pathname.startsWith("/pdfjs-web/"));
      
    if (!allowed) {
      return new Response("Forbidden", { status: 403 });
    }
    return net.fetch(pathToFileURL(filePath).toString());
  });
}

function sendReadyFile(filePath) {
  fs.readFile(filePath)
    .then((buf) => {
      if (!mainWindow || mainWindow.isDestroyed()) return;
      mainWindow.webContents.send("open-file", {
        name: path.basename(filePath),
        path: filePath,
        data: new Uint8Array(buf),
      });
    })
    .catch(() => {});
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 760,
    minHeight: 480,
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#101318" : "#f2f3f5",
    show: false,
    icon: path.join(__dirname, "..", "assets", "app-icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  win.once("ready-to-show", () => win.show());
  win.setMenuBarVisibility(true);

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event) => event.preventDefault());

  win.on("closed", () => {
    if (mainWindow === win) mainWindow = null;
  });

  return win;
}

function buildMenu() {
  const send = (cmd) => (mainWindow && !mainWindow.isDestroyed() ? mainWindow.webContents.send("menu:command", cmd) : null);
  const isMac = process.platform === "darwin";
  const template = [
    ...(isMac ? [{ role: "appMenu" }] : []),
    {
      label: "File",
      submenu: [
        { label: "Open PDF…", accelerator: "CmdOrCtrl+O", click: () => send("open") },
        { label: "Print…", accelerator: "CmdOrCtrl+P", click: () => send("print") },
        { label: "Document Properties…", accelerator: "CmdOrCtrl+D", click: () => send("properties") },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    {
      label: "View",
      submenu: [
        { label: "Zoom In", accelerator: "CmdOrCtrl+=", click: () => send("zoom-in") },
        { label: "Zoom Out", accelerator: "CmdOrCtrl+-", click: () => send("zoom-out") },
        { label: "Actual Size", accelerator: "CmdOrCtrl+0", click: () => send("actual-size") },
        { label: "Fit to Width", click: () => send("fit-width") },
        { label: "Fit to Page", click: () => send("fit-page") },
        { type: "separator" },
        { label: "Rotate Clockwise", accelerator: "CmdOrCtrl+R", click: () => send("rotate") },
        { type: "separator" },
        { label: "Toggle Thumbnails", click: () => send("toggle-thumbnails") },
        { label: "Toggle Dark Mode", click: () => send("toggle-theme") },
        { type: "separator" },
        { role: "forceReload", accelerator: "CmdOrCtrl+Shift+R" },
        { role: "togglefullscreen" },
        { role: "toggleDevTools" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
        { type: "separator" },
        {
          label: "Find…",
          accelerator: "CmdOrCtrl+F",
          click: () => send("find"),
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        { label: "Keyboard Shortcuts", accelerator: "F1", click: () => send("shortcuts") },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function makeTestPdf() {
  const objects = {
    "1": "<< /Type /Catalog /Pages 2 0 R >>",
    "2": "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "3": "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 400 600] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "4": "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  };
  const content = "BT /F1 30 Tf 60 380 Td (Hello PDFForge Viewer) Tj ET\n";
  objects["5"] = `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}endstream`;

  const header = Buffer.from("%PDF-1.4\n");
  let body = header;
  const offsets = {};
  for (const id of ["1", "2", "3", "4", "5"]) {
    offsets[id] = body.length;
    body = Buffer.concat([body, Buffer.from(`${id} 0 obj\n${objects[id]}\nendobj\n`)]);
  }
  const xrefPos = body.length;
  let xref = "xref\n0 6\n0000000000 65535 f \n";
  for (const id of ["1", "2", "3", "4", "5"]) {
    xref += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;
  return Buffer.concat([body, Buffer.from(xref + trailer)]);
}

async function runSmoke() {
  const poll = async (fn, timeout) => {
    const start = Date.now();
    for (;;) {
      try {
        const v = await fn();
        if (v) return v;
      } catch {
        // keep polling
      }
      if (Date.now() - start > timeout) return null;
      await new Promise((r) => setTimeout(r, 150));
    }
  };
  mainWindow.webContents.on("console-message", (event) => {
    const message = typeof event.message === "string" ? event.message : event;
    console.log("[renderer]", message);
  });
  try {
    const ready = await poll(() => mainWindow.webContents.executeJavaScript("Boolean(window.__pdfViewerReady)"), 15000);
    if (!ready) throw new Error("renderer did not become ready");

    const smokeFile = process.env.PDFVIEWER_SMOKE_FILE;
    const expectedPages = process.env.PDFVIEWER_SMOKE_PAGES;
    if (smokeFile) {
      const buf = await fs.readFile(smokeFile);
      mainWindow.webContents.send("open-file", {
        name: path.basename(smokeFile),
        data: new Uint8Array(buf),
      });
    } else if (!expectedPages) {
      mainWindow.webContents.send("open-file", {
        name: "smoke.pdf",
        data: new Uint8Array(makeTestPdf()),
      });
    }

    const expect = `of ${expectedPages || "1"}`;
    const ok = await poll(
      () =>
        mainWindow.webContents.executeJavaScript(
          `document.getElementById('page-indicator').textContent.includes('${expect}') && ` +
            "document.querySelector('.pdf-canvas').width > 0"
        ),
      20000
    );
    if (!ok) {
      const diag = await mainWindow.webContents.executeJavaScript(
        "JSON.stringify({ err: document.getElementById('error-message').textContent, " +
          "pages: document.querySelectorAll('.pdf-page').length, " +
          "globalErr: window.__pdfViewerError || null, " +
          "indicator: document.getElementById('page-indicator').textContent })"
      );
      console.error("[smoke] diagnostics:", diag);
      throw new Error("document did not render (indicator or canvas failed)");
    }
    const thumbs = await mainWindow.webContents.executeJavaScript(
      "document.querySelectorAll('.thumb').length"
    );
    if (thumbs !== Number(expectedPages || 1)) {
      throw new Error(`expected ${expectedPages} thumbnails, found ${thumbs}`);
    }
    mainWindow.webContents.executeJavaScript("document.title").then((title) => console.log("[smoke] title:", title));
    console.log("[smoke] PASS");
    app.exit(0);
  } catch (err) {
    console.error("[smoke] FAIL:", err && err.message);
    app.exit(1);
  }
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, argv) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    firstPdfArg(argv).then((p) => {
      if (p) {
        if (mainWindow) sendReadyFile(p);
        else pendingFile = p;
      }
    });
  });

  app.whenReady().then(async () => {
    nativeTheme.themeSource = "system";
    registerProtocol();

    ipcMain.handle("dialog:open-pdf", async () => {
      const result = await dialog.showOpenDialog(mainWindow, {
        title: "Open PDF",
        properties: ["openFile"],
        filters: [{ name: "PDF documents", extensions: ["pdf"] }],
      });
      if (result.canceled || !result.filePaths.length) return { canceled: true };
      const filePath = result.filePaths[0];
      const data = await fs.readFile(filePath);
      return { canceled: false, name: path.basename(filePath), path: filePath, data: new Uint8Array(data) };
    });

    ipcMain.handle("file:read", async (_event, filePath) => {
      if (typeof filePath !== "string" || path.isAbsolute(filePath) !== true) {
        throw new Error("Invalid path");
      }
      const data = await fs.readFile(filePath);
      return { name: path.basename(filePath), data: new Uint8Array(data) };
    });

    ipcMain.handle("app:set-theme", (_event, theme) => {
      if (theme === "light" || theme === "dark" || theme === "system") nativeTheme.themeSource = theme;
    });

    ipcMain.handle("app:get-theme", () => (nativeTheme.shouldUseDarkColors ? "dark" : "light"));

    mainWindow = createWindow();
    buildMenu();

    const first = await firstPdfArg(process.argv);
    if (first) pendingFile = first;

    mainWindow.webContents.once("did-finish-load", () => {
      if (pendingFile) {
        const p = pendingFile;
        pendingFile = null;
        sendReadyFile(p);
      }
      if (SMOKE) runSmoke();
    });

    await mainWindow.loadURL("app://renderer/index.html");
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow();
  });
}