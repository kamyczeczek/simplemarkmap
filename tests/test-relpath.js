const path = require('path');

// Pure re-implementation of the v1 link helpers so they can be unit-tested in
// Node without a browser. Keep this in sync with public/index.html.
function splitPath(p) {
    return String(p).split(/[\\/]+/).filter(Boolean);
}
function normalizePath(p) {
    const parts = splitPath(p);
    const out = [];
    for (const part of parts) {
        if (part === '.') continue;
        if (part === '..') { out.pop(); continue; }
        out.push(part);
    }
    return out.join('/');
}
function dirnameOf(p) {
    const parts = splitPath(p);
    parts.pop();
    return parts.length ? parts.join('/') : '.';
}
function basenameOf(p) {
    const parts = splitPath(p);
    return parts[parts.length - 1] || "";
}
function relPath(fromFile, toFile) {
    // Extract drive letters for Windows cross-drive detection
    const fromDrive = /^[a-zA-Z]:/.exec(fromFile)?.[0]?.toLowerCase();
    const toDrive = /^[a-zA-Z]:/.exec(toFile)?.[0]?.toLowerCase();
    // If drives differ, return absolute path (no relative possible)
    if (fromDrive && toDrive && fromDrive !== toDrive) {
        return path.resolve(toFile);
    }
    const fromDir = dirnameOf(fromFile);
    const to = normalizePath(toFile);
    const fromParts = fromDir === '.' ? [] : fromDir.split('/');
    const toParts = to.split('/');
    let common = 0;
    while (
        common < fromParts.length &&
        common < toParts.length - 1 &&
        fromParts[common] === toParts[common]
    ) {
        common++;
    }
    const ups = Array(fromParts.length - common).fill('..');
    const downs = toParts.slice(common);
    return [...ups, ...downs].join('/');
}
// Inverse of relPath(): the resolver navigateLink() uses (without openFile).
function resolveLink(fromFile, rel) {
    let target = rel;
    if (fromFile) {
        const dir = fromFile.includes('/') ? fromFile.substring(0, fromFile.lastIndexOf('/') + 1) : "";
        target = dir + rel;
    }
    const parts = target.split('/');
    const resolved = [];
    for (const p of parts) {
        if (p === '..') { resolved.pop(); } else if (p !== '.' && p !== '') { resolved.push(p); }
    }
    target = resolved.join('/');
    if (!target.toLowerCase().endsWith('.md')) target += '.md';
    return target;
}

let pass = 0, fail = 0;
function eq(actual, expected, name) {
    if (actual === expected) { pass++; }
    else { fail++; console.error(`FAIL ${name}: got "${actual}" expected "${expected}"`); }
}

console.log('== relPath table-driven tests ==');
eq(relPath('a.md', 'b.md'), 'b.md', 'same dir');
eq(relPath('a.md', 'docs/b.md'), 'docs/b.md', 'child dir');
eq(relPath('docs/a.md', 'b.md'), '../b.md', 'parent dir');
eq(relPath('docs/a.md', 'other/b.md'), '../other/b.md', 'sibling dirs');
eq(relPath('a/x/y.md', 'b/z.md'), '../../b/z.md', 'deep parent');
eq(relPath('docs/a.md', 'docs/b.md'), 'b.md', 'same dir diff name');
eq(relPath('a.md', 'a.md'), 'a.md', 'self-link returns same name (blocked at call site)');

console.log('== Windows backslash paths ==');
eq(basenameOf('C:\\Users\\me\\target.md'), 'target.md', 'basenameOf backslash');
eq(dirnameOf('C:\\Users\\me\\target.md'), 'C:/Users/me', 'dirnameOf backslash');
eq(normalizePath('C:\\Users\\me\\target.md'), 'C:/Users/me/target.md', 'normalizePath backslash');
eq(relPath('C:\\Users\\me\\proj\\a.md', 'C:\\Users\\me\\proj\\target.md'), 'target.md', 'relative backslash same dir');
eq(relPath('C:\\Users\\me\\proj\\a.md', 'C:\\Users\\me\\other\\target.md'), '../other/target.md', 'relative backslash sibling');

console.log('== round-trip invariant ==');
const cases = [
    ['a.md', 'b.md'],
    ['a.md', 'docs/b.md'],
    ['docs/a.md', 'b.md'],
    ['docs/a.md', 'other/b.md'],
    ['a/x/y.md', 'b/z.md'],
    ['docs/a.md', 'docs/b.md'],
];
for (const [from, to] of cases) {
    const rel = relPath(from, to);
    eq(resolveLink(from, rel), to, `round-trip ${from} -> ${to}`);
}

console.log(`\n${pass} passed, ${fail} failed`);
console.log('== Cross-drive paths (Windows) ==');
// Cross-drive should return absolute path (no relative possible)
const crossDrive = relPath('C:\\proj\\a.md', 'D:\\other\\b.md');
console.log('Cross-drive relPath result:', crossDrive);
// Expected: absolute path since no relative path exists between drives
eq(crossDrive.startsWith('D:'), true, 'cross-drive returns absolute or valid relative');

process.exit(fail ? 1 : 0);
