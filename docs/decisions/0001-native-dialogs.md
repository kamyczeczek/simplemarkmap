# Native file dialogs

## Decyzja

Wybór plików odbywa się przez natywny Electron `dialog.showOpenDialog`.

## Powód

HTML-owy picker nie był systemowym Eksploratorem Windows i powodował niespójne zachowanie.

## Konsekwencje

Renderer komunikuje się z procesem głównym przez `preload.js` i IPC.
