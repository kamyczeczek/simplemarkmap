# src/ Context

## Identity
Electron main process and server logic for SimpleMarkmap markdown mind-map editor.

## Pipeline
1. **Entry**: `node server.js <root>` or Electron main process launches server
2. **Configuration**: Reads `package.json` build config, `SIMPLEMARKMAP_ROOT` env var
3. **Server**: HTTP on 127.0.0.1:8765 with API routes for markdown operations
4. **Output**: Static file serving, markdown read/write, file listing

## Inputs (this run)
- `process.argv[2]` - optional root directory argument
- `process.env.SIMPLEMARKMAP_ROOT` - environment variable override
- `process.env.PORT` - port override (default 8765)
- `process.env.HOST` - host override (default 127.0.0.1)

## Outputs (this run)
- `C:\sm-build\out\` - build installer output
- `dist/` - development build artifacts (do not edit manually)
- `MONITORING/` - monitoring state and logbook

## Human Check
- Verify server starts on http://localhost:8765
- Confirm `npm test` passes (18 tests)
- Ensure build output exists at `C:\sm-build\out\SimpleMarkmap-Setup-1.0.0.exe`
- Check git status: clean working tree before commit

## Token Discipline
- Root `AGENTS.md` must stay under 100 lines
- This `CONTEXT.md` provides stage-specific details
- Keep intermediate outputs under 2k-8k tokens per step