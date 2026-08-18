# SimpleMarkmap

> **Your thought command center. Write in Markdown, think in map structure.**

SimpleMarkmap is a powerful yet simple desktop (Electron) tool that eliminates the barrier between writing notes and visualizing them. You don't have to choose between linear text and chaotic drawing – one emerges from the other here.

---

## 🛠 What can you do in SimpleMarkmap?

The app is designed so you can go from idea to full project structure in minutes. Here are the main capabilities:

### 1. Instant map creation by typing
Forget about manually drawing bubbles and lines.
*   **Structure from headings:** Use `#` for main topics and `##`, `###` for subpoints.
*   **Bullet lists:** Create branches with plain hyphens `-`. The app intelligently detects indentation depth and converts them to map levels.
*   **Real-time preview:** Every letter typed in the editor instantly appears on the visual map.

### 2. Interactive structure management (Drag & Drop)
The map in SimpleMarkmap is not just a static image – it's a live editor:
*   **Drag branches:** Grab any node and drag it to a new position. You can attach an entire branch under another topic or change its order (Before/After/Child).
*   **Auto text update:** When you change the layout visually, the app automatically rewrites your Markdown file, maintaining proper indentation and heading levels.
*   **Collapsible nodes:** Double-click a node to hide its children. This helps you focus on a specific project section without distraction from the rest of the map.

### 3. Building your personal knowledge base (Zettelkasten / Obsidian-style)
The app allows creating a network of interconnected documents:
*   **Fast `[[` linking:** Type two square brackets to trigger smart file search across your disk.
*   **Create files "on the fly":** If you type a note title that doesn't exist yet, SimpleMarkmap will suggest creating it and automatically insert a link.
*   **Browser-like navigation:** Use "Back" and "Forward" buttons to move between related maps without losing context.

### 4. Work on your terms (Local-First)
Your data is not trapped in the cloud or inside the app's database:
*   **Open any file:** You can edit Markdown files from anywhere on your computer – desktop, USB drive, or Dropbox folder.
*   **Edit externally:** One click opens the current note in your preferred system editor (e.g., VS Code or Notepad++), and SimpleMarkmap refreshes the view after saving.
*   **Work safety:** The app has an **autosave** feature, so you don't need to remember clicking "Save". Every change is safe.

---

## ⌨️ Keyboard shortcuts that make life easier

*   **Enter** – add new item at the same level.
*   **Tab** – add child node.
*   **Shift + Tab** – move item up one level (unindent).
*   **Del / Backspace** – delete node (or edit its content).
*   **Ctrl + Z** – undo last change.
*   **Alt + Drag** – pan the whole map.

---

## 🏗 Engineering and Stability (Harness Engineering)

The project is not just a simple tool – underneath lies an advanced **ICM (Interpretable Context Methodology)** methodology:
*   **Quality guarantee:** Every feature, from file linking to branch dragging, is covered by automated tests (Playwright), ensuring no bugs during updates.
*   **Transparency:** The app maintains an operational logbook that documents every major design decision and bug fix.
*   **Harness verification:** Before each release, the system automatically checks safety rules (e.g., prohibits hardcoded user paths), making the app secure and portable.

---

## 🚀 How to get started?

1.  Download `SimpleMarkmap-Setup-x.x.x.exe` from the Releases section.
2.  Run and open your first `.md` file.
3.  Start typing – your mind map will create itself.

---

*Created with passion for clean code and efficient thinking.*
