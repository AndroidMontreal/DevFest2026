'use client';

import { useEffect, useRef } from 'react';

interface SliceTheme {
  bg: string;
  border: string;
  text: string;
}

interface WheelEntry {
  id: string;
  name: string;
  email: string;
  prize: string;
  meta: string;
  row: Record<string, string>;
}

interface DroppedWinner {
  name: string;
  email: string;
  prize: string;
  meta: string;
  rank: number;
}

type SheetInfo =
  | { directUrl: string; sheetId?: undefined; gid?: undefined }
  | { sheetId: string; gid: string; directUrl?: undefined };

const LOGICAL_WHEEL_SIZE = 760;

const SYNTH_SLICE_PALETTE: readonly SliceTheme[] = [
  { bg: '#ff007f', border: '#00f0ff', text: '#ffffff' }, // Neon Magenta
  { bg: '#1e1044', border: '#00f0ff', text: '#00f0ff' }, // Deep Cyber Violet
  { bg: '#4285F4', border: '#ffffff', text: '#ffffff' }, // GDG Blue
  { bg: '#6a0dad', border: '#ffbe0b', text: '#ffbe0b' }, // Laser Purple
  { bg: '#EA4335', border: '#ffffff', text: '#ffffff' }, // GDG Red
  { bg: '#0c2d48', border: '#00f59b', text: '#00f59b' }, // Outrun Teal
  { bg: '#34A853', border: '#ffffff', text: '#ffffff' }, // GDG Green
  { bg: '#b5179e', border: '#ffbe0b', text: '#ffffff' }, // Retro Berry
];

const DEMO_GDG_SHEET_CSV = `Email,Full Name,Pixel Watch 3,Google Cloud Swag Pack,JetBrains All Products Pack,Gemini AI Hoodie
ada@analytical.org,Ada Lovelace,Yes,Yes,No,Yes
grace@cobol.navy.mil,Grace Hopper,Yes,No,Yes,Yes
alan@bletchley.uk,Alan Turing,No,Yes,Yes,Yes
margaret@apollo.nasa.gov,Margaret Hamilton,Yes,Yes,Yes,No
katherine@orbital.nasa.gov,Katherine Johnson,Yes,No,No,Yes
linus@kernel.org,Linus Torvalds,No,Yes,Yes,No
timbl@w3.org,Tim Berners-Lee,Yes,Yes,No,Yes
radia@spanningtree.net,Radia Perlman,No,Yes,Yes,Yes
hedy@freqhop.io,Hedy Lamarr,Yes,No,Yes,Yes
dmr@bell-labs.com,Dennis Ritchie,Yes,Yes,No,No
liskov@csail.mit.edu,Barbara Liskov,No,Yes,Yes,Yes
knuth@tex.stanford.edu,Donald Knuth,No,No,Yes,No
guido@python.org,Guido van Rossum,Yes,Yes,Yes,Yes
brendan@js-engine.dev,Brendan Eich,Yes,No,Yes,No
solomon@containers.dev,Solomon Hykes,No,Yes,No,Yes
kelsey@serverless.cloud,Kelsey Hightower,Yes,Yes,Yes,Yes
jeff@deepmind.google,Jeff Dean,Yes,Yes,No,Yes
feifei@vision.ai,Fei-Fei Li,Yes,No,Yes,Yes`;

class SynthAudioEngine {
  ctx: AudioContext | null = null;
  enabled = true;

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  playTick(speedFactor = 1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const baseFreq = 320 + Math.min(speedFactor * 260, 500);
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.045);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playFillSweep() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [220, 277.18, 329.63, 440, 554.37, 659.25, 880];
    const audioCtx = this.ctx;
    notes.forEach((freq, idx) => {
      const now = audioCtx.currentTime + idx * 0.055;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    });
  }

  playWinnerFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const sequence = [
      { freq: 261.63, delay: 0.0, dur: 0.22 },
      { freq: 329.63, delay: 0.11, dur: 0.22 },
      { freq: 392.0, delay: 0.22, dur: 0.22 },
      { freq: 523.25, delay: 0.33, dur: 0.55 },
      { freq: 659.25, delay: 0.45, dur: 0.75 },
      { freq: 783.99, delay: 0.58, dur: 1.1 },
    ];

    const audioCtx = this.ctx;
    sequence.forEach(({ freq, delay, dur }) => {
      const start = audioCtx.currentTime + delay;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(freq, start);
      osc2.frequency.setValueAtTime(freq * 1.004, start);

      gain.gain.setValueAtTime(0.14, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + dur + 0.02);
      osc2.stop(start + dur + 0.02);
    });
  }

  dispose() {
    if (this.ctx && this.ctx.state !== 'closed') {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}

function extractGoogleSheetInfo(inputUrlOrId: string): SheetInfo | null {
  const trimmed = inputUrlOrId.trim();
  if (!trimmed) return null;

  if (trimmed.includes('output=csv') || trimmed.endsWith('.csv')) {
    return { directUrl: trimmed };
  }

  const idMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
  const gid = gidMatch ? gidMatch[1] : '0';

  if (idMatch) {
    return { sheetId: idMatch[1], gid };
  }

  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
    return { sheetId: trimmed, gid: '0' };
  }

  return { directUrl: trimmed };
}

function parseCSV(text: string): {
  headers: string[];
  records: Record<string, string>[];
} {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  const firstLine = text.split(/\r?\n/)[0] || '';
  const delimiter =
    firstLine.includes('\t') && !firstLine.includes(',') ? '\t' : ',';

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        currentCell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentCell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if (ch === '\n' || (ch === '\r' && next === '\n')) {
      if (ch === '\r') i++;
      currentRow.push(currentCell.trim());
      if (currentRow.some((cell) => cell !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += ch;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell !== '')) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return { headers: [], records: [] };

  const headers = rows[0].map((h, idx) => h || `Column ${idx + 1}`);
  const records = rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = r[idx] !== undefined ? r[idx].trim() : '';
    });
    return obj;
  });

  return { headers, records };
}

function isAffirmativePrizeCell(val: string | undefined): boolean {
  const s = (val || '').trim();
  if (!s) return false;
  return !/^(no|non|no\s*\/\s*non|non\s*\/\s*no|false|0|-|n\/a|none)$/i.test(s);
}

function toCsvField(val: string | undefined): string {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function CrazyWheelView() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const getEl = <T extends HTMLElement>(id: string): T => {
      const el = root.querySelector<T>(`#${id}`);
      if (!el) {
        throw new Error(`Missing element #${id}`);
      }
      return el;
    };

    const dom = {
      sheetUrlInput: getEl<HTMLInputElement>('sheetUrlInput'),
      fetchSheetBtn: getEl<HTMLButtonElement>('fetchSheetBtn'),
      loadDemoSheetBtn: getEl<HTMLButtonElement>('loadDemoSheetBtn'),
      uploadCsvBtn: getEl<HTMLButtonElement>('uploadCsvBtn'),
      csvFileInput: getEl<HTMLInputElement>('csvFileInput'),
      pasteBox: getEl<HTMLDivElement>('pasteBox'),
      rawCsvInput: getEl<HTMLTextAreaElement>('rawCsvInput'),
      parsePastedBtn: getEl<HTMLButtonElement>('parsePastedBtn'),
      sheetStatusMsg: getEl<HTMLDivElement>('sheetStatusMsg'),

      nameColumnSelect: getEl<HTMLSelectElement>('nameColumnSelect'),
      emailColumnSelect: getEl<HTMLSelectElement>('emailColumnSelect'),
      filterColumnSelect: getEl<HTMLSelectElement>('filterColumnSelect'),
      filterValueGroup: getEl<HTMLDivElement>('filterValueGroup'),
      filterValueSelect: getEl<HTMLSelectElement>('filterValueSelect'),
      matchedCountText: getEl<HTMLElement>('matchedCountText'),
      fillWheelBtn: getEl<HTMLButtonElement>('fillWheelBtn'),

      floatDurationInput: getEl<HTMLInputElement>('floatDurationInput'),
      floatDurationNumber: getEl<HTMLInputElement>('floatDurationNumber'),
      spinDurationInput: getEl<HTMLInputElement>('spinDurationInput'),
      spinDurationNumber: getEl<HTMLInputElement>('spinDurationNumber'),

      wheelCanvas: getEl<HTMLCanvasElement>('wheelCanvas'),
      wheelGlowRing: getEl<HTMLDivElement>('wheelGlowRing'),
      wheelPointer: getEl<HTMLDivElement>('wheelPointer'),
      spinWheelBtn: getEl<HTMLButtonElement>('spinWheelBtn'),

      activeRosterCount: getEl<HTMLSpanElement>('activeRosterCount'),
      activeRosterList: getEl<HTMLDivElement>('activeRosterList'),
      winnersList: getEl<HTMLDivElement>('winnersList'),
      exportWinnersBtn: getEl<HTMLButtonElement>('exportWinnersBtn'),
      resetWinnersBtn: getEl<HTMLButtonElement>('resetWinnersBtn'),

      sheetCountBadge: getEl<HTMLSpanElement>('sheetCountBadge'),
      wheelCountBadge: getEl<HTMLSpanElement>('wheelCountBadge'),
      winnerCountBadge: getEl<HTMLSpanElement>('winnerCountBadge'),

      soundToggleBtn: getEl<HTMLButtonElement>('soundToggleBtn'),
      soundIcon: getEl<HTMLSpanElement>('soundIcon'),
      togglePanelBtn: getEl<HTMLButtonElement>('togglePanelBtn'),
      mainStage: getEl<HTMLElement>('mainStage'),

      winnerOverlay: getEl<HTMLDivElement>('winnerOverlay'),
      winnerNameDisplay: getEl<HTMLDivElement>('winnerNameDisplay'),
      winnerMetaSubtitle: getEl<HTMLDivElement>('winnerMetaSubtitle'),
      winnerCountdownFill: getEl<HTMLDivElement>('winnerCountdownFill'),
      winnerCountdownSec: getEl<HTMLElement>('winnerCountdownSec'),
      skipFloatBtn: getEl<HTMLButtonElement>('skipFloatBtn'),
      confettiCanvas: getEl<HTMLCanvasElement>('confettiCanvas'),
    };

    const ctx = dom.wheelCanvas.getContext('2d');
    if (!ctx) return;

    // Configure high-DPI backing store for crisp rendering on 4K projectors & Retina displays
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dom.wheelCanvas.width = LOGICAL_WHEEL_SIZE * dpr;
    dom.wheelCanvas.height = LOGICAL_WHEEL_SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const audio = new SynthAudioEngine();

    const state = {
      headers: [] as string[],
      rows: [] as Record<string, string>[],
      nameColumn: '',
      emailColumn: '__AUTO__',
      filterColumn: '__ALL__',
      filterValue: '__ALL__',

      wheelEntries: [] as WheelEntry[],
      droppedWinners: [] as DroppedWinner[],

      isWheelFilled: false,
      isSpinning: false,
      currentAngle: 0,
      floatDurationSec: 7,
      spinDurationSec: 6,

      fillRafId: null as number | null,
      spinRafId: null as number | null,
      floatRafId: null as number | null,
      confettiRafId: null as number | null,
      tickTimeoutId: null as ReturnType<typeof setTimeout> | null,
    };

    function setStatus(
      message: string,
      type: 'info' | 'error' | 'success' = 'info',
    ) {
      dom.sheetStatusMsg.textContent = message;
      dom.sheetStatusMsg.className = 'status-banner';
      if (type === 'error') dom.sheetStatusMsg.classList.add('error');
      if (type === 'success') dom.sheetStatusMsg.classList.add('success');
    }

    function isEmailHeaderOrValue(header: string, value: string): boolean {
      if (/email|e-mail|mail/i.test(header)) return true;
      if (state.emailColumn !== '__AUTO__' && header === state.emailColumn) {
        return true;
      }
      return /\S+@\S+\.\S+/.test(value);
    }

    function getPrizeColumns(): string[] {
      const nameIdx = state.headers.indexOf(state.nameColumn);
      if (nameIdx !== -1 && nameIdx < state.headers.length - 1) {
        return state.headers
          .slice(nameIdx + 1)
          .filter((h) => !isEmailHeaderOrValue(h, ''));
      }
      return state.headers.filter(
        (h) => h !== state.nameColumn && !isEmailHeaderOrValue(h, ''),
      );
    }

    function populatePrizeColumnsSelect() {
      const prizeCols = getPrizeColumns();
      const frag = document.createDocumentFragment();
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '__ALL__';
      defaultOpt.textContent = '-- All Users (No Prize Filter) --';
      frag.appendChild(defaultOpt);

      prizeCols.forEach((h) => {
        const opt = document.createElement('option');
        opt.value = h;
        opt.textContent = `🎁 ${h}`;
        frag.appendChild(opt);
      });
      dom.filterColumnSelect.replaceChildren(frag);
      dom.filterColumnSelect.disabled = prizeCols.length === 0;
      state.filterColumn = '__ALL__';
      dom.filterValueGroup.classList.add('hidden');
    }

    function extractRowEmail(row: Record<string, string> | undefined): string {
      if (!row) return '';
      if (state.emailColumn && state.emailColumn !== '__AUTO__') {
        return (row[state.emailColumn] || '').trim();
      }
      const emailHeader = state.headers.find((h) =>
        /email|e-mail|mail/i.test(h),
      );
      if (emailHeader && row[emailHeader]) {
        return row[emailHeader].trim();
      }
      for (const h of state.headers) {
        const val = (row[h] || '').trim();
        if (/\S+@\S+\.\S+/.test(val)) return val;
      }
      return '';
    }

    function resolvePrizeFromFilter(
      row: Record<string, string> | undefined,
    ): string {
      if (state.filterColumn && state.filterColumn !== '__ALL__') {
        return state.filterColumn.trim();
      }
      if (row) {
        const prizeCols = getPrizeColumns();
        const matchedPrizes = prizeCols.filter((col) =>
          isAffirmativePrizeCell(row[col]),
        );
        if (matchedPrizes.length > 0) {
          return matchedPrizes.join(' / ');
        }
      }
      return '';
    }

    function getFilteredSheetCandidates(): WheelEntry[] {
      if (!state.nameColumn || state.rows.length === 0) return [];

      const candidates: WheelEntry[] = [];
      state.rows.forEach((row, index) => {
        const rawName = (row[state.nameColumn] || '').trim();
        if (!rawName) return;

        if (state.filterColumn !== '__ALL__') {
          const cellVal = (row[state.filterColumn] || '').trim();
          if (
            state.filterValue === '__AFFIRMATIVE__' ||
            state.filterValue === '__NON_EMPTY__'
          ) {
            if (!isAffirmativePrizeCell(cellVal)) return;
          } else if (
            cellVal.toLowerCase() !== state.filterValue.toLowerCase()
          ) {
            return;
          }
        }

        const email = extractRowEmail(row);
        const prize = resolvePrizeFromFilter(row);

        candidates.push({
          id: `row-${index}-${rawName}`,
          name: rawName,
          email,
          prize,
          meta: prize ? `🎁 ${prize}` : "DevFest MTL '26 Winner",
          row,
        });
      });

      return candidates;
    }

    function updateMatchedPreview() {
      state.nameColumn = dom.nameColumnSelect.value;
      state.emailColumn = dom.emailColumnSelect
        ? dom.emailColumnSelect.value
        : '__AUTO__';
      const matched = getFilteredSheetCandidates();
      dom.matchedCountText.textContent = String(matched.length);
      dom.fillWheelBtn.disabled = matched.length === 0 || state.isSpinning;
    }

    function populateFilterValues() {
      const col = dom.filterColumnSelect.value;
      state.filterColumn = col;

      if (col === '__ALL__') {
        dom.filterValueGroup.classList.add('hidden');
        state.filterValue = '__ALL__';
        updateMatchedPreview();
        return;
      }

      dom.filterValueGroup.classList.remove('hidden');
      const uniqueValues = Array.from(
        new Set(state.rows.map((r) => (r[col] || '').trim()).filter(Boolean)),
      );

      const frag = document.createDocumentFragment();
      const affirmativeOpt = document.createElement('option');
      affirmativeOpt.value = '__AFFIRMATIVE__';
      affirmativeOpt.textContent = '-- Entered (Yes) --';
      frag.appendChild(affirmativeOpt);

      uniqueValues.forEach((val) => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = `${col} = "${val}"`;
        frag.appendChild(opt);
      });
      dom.filterValueSelect.replaceChildren(frag);

      const yesOption = uniqueValues.find(
        (v) => /yes|true|1/i.test(v) && !/^no/i.test(v),
      );
      const selectedVal = yesOption || '__AFFIRMATIVE__';
      dom.filterValueSelect.value = selectedVal;
      state.filterValue = selectedVal;

      updateMatchedPreview();
    }

    function ingestCSVText(csvText: string, sourceLabel = 'SHEET LOADED') {
      const { headers, records } = parseCSV(csvText);

      if (headers.length === 0 || records.length === 0) {
        setStatus('ERROR // NO VALID ROWS FOUND IN SHEET', 'error');
        return;
      }

      state.headers = headers;
      state.rows = records;
      dom.sheetCountBadge.textContent = String(records.length);

      const nameFrag = document.createDocumentFragment();
      headers.forEach((h) => {
        const opt = document.createElement('option');
        opt.value = h;
        opt.textContent = h;
        nameFrag.appendChild(opt);
      });
      dom.nameColumnSelect.replaceChildren(nameFrag);
      dom.nameColumnSelect.disabled = false;

      const preferredNameHeader =
        headers.find((h) =>
          /name|attendee|participant|user|speaker|member/i.test(h),
        ) || headers[0];
      dom.nameColumnSelect.value = preferredNameHeader;
      state.nameColumn = preferredNameHeader;

      const emailFrag = document.createDocumentFragment();
      const autoEmailOpt = document.createElement('option');
      autoEmailOpt.value = '__AUTO__';
      autoEmailOpt.textContent = '-- Auto-detect Email --';
      emailFrag.appendChild(autoEmailOpt);

      headers.forEach((h) => {
        const opt = document.createElement('option');
        opt.value = h;
        opt.textContent = h;
        emailFrag.appendChild(opt);
      });
      dom.emailColumnSelect.replaceChildren(emailFrag);
      dom.emailColumnSelect.disabled = false;

      const detectedEmailHeader = headers.find((h) =>
        /email|e-mail|mail/i.test(h),
      );
      if (detectedEmailHeader) {
        dom.emailColumnSelect.value = detectedEmailHeader;
        state.emailColumn = detectedEmailHeader;
      } else {
        dom.emailColumnSelect.value = '__AUTO__';
        state.emailColumn = '__AUTO__';
      }

      populatePrizeColumnsSelect();
      updateMatchedPreview();
      setStatus(
        `${sourceLabel} // ${records.length} ROWS & ${headers.length} COLUMNS READY`,
        'success',
      );
    }

    async function fetchGoogleSheet() {
      const rawInput = dom.sheetUrlInput.value;
      const info = extractGoogleSheetInfo(rawInput);

      if (!info) {
        setStatus('ERROR // PLEASE ENTER A GOOGLE SHEET URL OR ID', 'error');
        return;
      }

      setStatus('CONNECTING TO GOOGLE SHEET STREAM...', 'info');
      dom.fetchSheetBtn.disabled = true;

      try {
        let csvText = '';
        if (info.directUrl) {
          const resp = await fetch(info.directUrl);
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          csvText = await resp.text();
        } else {
          const gvizUrl = `https://docs.google.com/spreadsheets/d/${info.sheetId}/gviz/tq?tqx=out:csv&gid=${info.gid}`;
          const exportUrl = `https://docs.google.com/spreadsheets/d/${info.sheetId}/export?format=csv&gid=${info.gid}`;

          try {
            const resp = await fetch(gvizUrl);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            csvText = await resp.text();
          } catch {
            const resp2 = await fetch(exportUrl);
            if (!resp2.ok) throw new Error(`HTTP ${resp2.status}`);
            csvText = await resp2.text();
          }
        }

        if (
          csvText.trim().startsWith('<!DOCTYPE html') ||
          csvText.includes('accounts.google.com')
        ) {
          throw new Error(
            'Sheet is private. Set sharing to "Anyone with the link can view".',
          );
        }

        ingestCSVText(csvText, 'GOOGLE SHEET LOADED');
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setStatus(
          `LOAD FAILED // ${errMsg}. Check link sharing or use CSV/Paste.`,
          'error',
        );
      } finally {
        dom.fetchSheetBtn.disabled = false;
      }
    }

    function renderWheel() {
      if (!ctx) return;
      const width = LOGICAL_WHEEL_SIZE;
      const height = LOGICAL_WHEEL_SIZE;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(cx, cy) - 18;

      ctx.clearRect(0, 0, width, height);

      const entries = state.wheelEntries;
      const count = entries.length;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
      ctx.fillStyle = '#0c021c';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#ff007f';
      ctx.stroke();
      ctx.restore();

      if (count === 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(cx, cy, 40, cx, cy, radius);
        grad.addColorStop(0, '#240847');
        grad.addColorStop(0.7, '#110326');
        grad.addColorStop(1, '#070112');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
        ctx.lineWidth = 1.5;
        for (let r = 100; r < radius; r += 75) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        for (let i = 0; i < 12; i++) {
          const a = (i * Math.PI) / 6 + state.currentAngle;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
          ctx.stroke();
        }

        ctx.fillStyle = '#00f0ff';
        ctx.font = '700 22px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CLICK "FILL WHEEL" TO LOAD NAMES', cx, cy - 135);
        ctx.restore();
        return;
      }

      const arcSize = (Math.PI * 2) / count;
      let fontSize = 21;
      if (count > 16) fontSize = 17;
      if (count > 26) fontSize = 14;
      if (count > 40) fontSize = 11;
      if (count > 65) fontSize = 9;

      const maxTextRadius = radius - 24;
      const maxChars = count > 35 ? 18 : 22;

      for (let i = 0; i < count; i++) {
        const startAngle = state.currentAngle + i * arcSize;
        const endAngle = startAngle + arcSize;
        const midAngle = startAngle + arcSize / 2;
        const theme = SYNTH_SLICE_PALETTE[i % SYNTH_SLICE_PALETTE.length];

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = theme.bg;
        ctx.fill();

        ctx.lineWidth = count > 40 ? 1 : 2.2;
        ctx.strokeStyle = '#0b0118';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + Math.cos(startAngle) * radius,
          cy + Math.sin(startAngle) * radius,
        );
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = count > 40 ? 0.8 : 1.5;
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(midAngle);
        ctx.font = `700 ${fontSize}px Orbitron, Rajdhani, sans-serif`;
        ctx.fillStyle = theme.text;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 6;

        let label = entries[i].name;
        if (label.length > maxChars) {
          label = label.slice(0, maxChars - 1) + '…';
        }

        ctx.fillText(label, maxTextRadius, 0);
        ctx.restore();

        ctx.save();
        const pegX = cx + Math.cos(startAngle) * (radius - 6);
        const pegY = cy + Math.sin(startAngle) * (radius - 6);
        ctx.beginPath();
        ctx.arc(pegX, pegY, count > 40 ? 2.5 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    }

    function renderRosterUI() {
      dom.wheelCountBadge.textContent = String(state.wheelEntries.length);
      dom.activeRosterCount.textContent = String(state.wheelEntries.length);
      dom.winnerCountBadge.textContent = String(state.droppedWinners.length);

      if (state.wheelEntries.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'empty-roster';
        emptyEl.append('Wheel is empty. Click ');
        const strongEl = document.createElement('strong');
        strongEl.textContent = 'FILL WHEEL';
        emptyEl.append(strongEl, ' to populate from sheet.');
        dom.activeRosterList.replaceChildren(emptyEl);
      } else {
        const frag = document.createDocumentFragment();
        state.wheelEntries.forEach((item, index) => {
          const rowEl = document.createElement('div');
          rowEl.className = 'roster-item';
          rowEl.style.borderLeftColor =
            SYNTH_SLICE_PALETTE[index % SYNTH_SLICE_PALETTE.length].bg;

          const nameSpan = document.createElement('span');
          nameSpan.textContent = item.name;

          const delBtn = document.createElement('button');
          delBtn.className = 'remove-slice-btn';
          delBtn.type = 'button';
          delBtn.title = 'Drop from wheel';
          delBtn.textContent = '✕';
          delBtn.onclick = () => {
            if (state.isSpinning) return;
            state.wheelEntries.splice(index, 1);
            renderWheel();
            renderRosterUI();
            dom.spinWheelBtn.disabled = state.wheelEntries.length === 0;
          };

          rowEl.appendChild(nameSpan);
          rowEl.appendChild(delBtn);
          frag.appendChild(rowEl);
        });
        dom.activeRosterList.replaceChildren(frag);
      }

      dom.exportWinnersBtn.disabled = state.droppedWinners.length === 0;

      if (state.droppedWinners.length === 0) {
        const emptyWinEl = document.createElement('div');
        emptyWinEl.className = 'empty-roster';
        emptyWinEl.textContent = 'No winners drawn yet.';
        dom.winnersList.replaceChildren(emptyWinEl);
      } else {
        const winFrag = document.createDocumentFragment();
        state.droppedWinners.forEach((w) => {
          const el = document.createElement('div');
          el.className = 'winner-item';

          const topRow = document.createElement('div');
          topRow.className = 'winner-item-top';

          const leftCol = document.createElement('div');
          const rankSpan = document.createElement('span');
          rankSpan.className = 'winner-rank';
          rankSpan.textContent = `#${w.rank}`;
          const nameSpan = document.createElement('span');
          nameSpan.textContent = w.name;
          leftCol.append(rankSpan, nameSpan);

          const droppedBadge = document.createElement('span');
          droppedBadge.style.fontSize = '0.72rem';
          droppedBadge.style.color = '#00f0ff';
          droppedBadge.textContent = 'DROPPED';

          topRow.append(leftCol, droppedBadge);
          el.appendChild(topRow);

          if (w.prize) {
            const prizeRow = document.createElement('div');
            prizeRow.className = 'winner-prize-row';
            const prizeSpan = document.createElement('span');
            prizeSpan.textContent = `🎁 PRIZE: ${w.prize}`;
            prizeRow.appendChild(prizeSpan);
            el.appendChild(prizeRow);
          }

          winFrag.appendChild(el);
        });
        dom.winnersList.replaceChildren(winFrag);
      }
    }

    function fillWheelFromSheet() {
      if (state.isSpinning) return;
      if (state.fillRafId) {
        cancelAnimationFrame(state.fillRafId);
        state.fillRafId = null;
      }

      const candidates = getFilteredSheetCandidates();
      if (candidates.length === 0) {
        setStatus(
          'WARNING // NO USERS MATCH SELECTED COLUMN CRITERIA',
          'error',
        );
        return;
      }

      audio.playFillSweep();

      state.wheelEntries = [];
      state.isWheelFilled = false;
      dom.spinWheelBtn.disabled = true;

      const total = candidates.length;
      const batchSize = Math.max(1, Math.ceil(total / 18));
      let idx = 0;

      function stepFill() {
        const nextEnd = Math.min(idx + batchSize, total);
        for (let i = idx; i < nextEnd; i++) {
          state.wheelEntries.push({ ...candidates[i] });
        }
        idx = nextEnd;
        state.currentAngle += 0.14;
        renderWheel();
        renderRosterUI();

        if (idx < total) {
          state.fillRafId = requestAnimationFrame(stepFill);
        } else {
          state.fillRafId = null;
          state.isWheelFilled = true;
          dom.spinWheelBtn.disabled = state.wheelEntries.length === 0;
          setStatus(
            `WHEEL FILLED // ${state.wheelEntries.length} CONTESTANTS READY TO SPIN!`,
            'success',
          );
        }
      }

      state.fillRafId = requestAnimationFrame(stepFill);
    }

    function getWinningSliceIndex(angleRad: number, count: number): number {
      const twoPi = Math.PI * 2;
      const normalized = (twoPi - (angleRad % twoPi) + twoPi) % twoPi;
      const arcSize = twoPi / count;
      return Math.floor(normalized / arcSize) % count;
    }

    function startSynthConfetti() {
      stopSynthConfetti();
      const canvas = dom.confettiCanvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cCtx = canvas.getContext('2d');
      if (!cCtx) return;

      const colors = [
        '#ff007f',
        '#00f0ff',
        '#ffbe0b',
        '#4285F4',
        '#EA4335',
        '#34A853',
        '#00f59b',
      ];
      const pieces = Array.from({ length: 110 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: 7 + Math.random() * 9,
        h: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: 2.5 + Math.random() * 4.5,
        vx: -2 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        vRot: -0.08 + Math.random() * 0.16,
      }));

      function loop() {
        if (!cCtx) return;
        cCtx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vRot;
          if (p.y > canvas.height + 20) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
          }
          cCtx.save();
          cCtx.translate(p.x, p.y);
          cCtx.rotate(p.rot);
          cCtx.fillStyle = p.color;
          cCtx.shadowColor = p.color;
          cCtx.shadowBlur = 8;
          cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          cCtx.restore();
        });
        state.confettiRafId = requestAnimationFrame(loop);
      }

      loop();
    }

    function stopSynthConfetti() {
      if (state.confettiRafId) {
        cancelAnimationFrame(state.confettiRafId);
        state.confettiRafId = null;
      }
    }

    function finalizeWinnerDrop(winnerIdx: number, winnerEntry: WheelEntry) {
      if (state.floatRafId) {
        cancelAnimationFrame(state.floatRafId);
        state.floatRafId = null;
      }
      stopSynthConfetti();
      dom.winnerOverlay.classList.add('hidden');

      const idxInWheel = state.wheelEntries.findIndex(
        (item) => item.id === winnerEntry.id,
      );
      if (idxInWheel !== -1) {
        state.wheelEntries.splice(idxInWheel, 1);
      } else if (state.wheelEntries[winnerIdx]) {
        state.wheelEntries.splice(winnerIdx, 1);
      }

      const prizeWon =
        winnerEntry.prize || resolvePrizeFromFilter(winnerEntry.row);

      state.droppedWinners.unshift({
        name: winnerEntry.name,
        email: winnerEntry.email || extractRowEmail(winnerEntry.row),
        prize: prizeWon,
        meta: winnerEntry.meta,
        rank: state.droppedWinners.length + 1,
      });

      renderWheel();
      renderRosterUI();

      dom.spinWheelBtn.disabled = state.wheelEntries.length === 0;
      dom.fillWheelBtn.disabled = state.rows.length === 0;

      setStatus(
        `WINNER "${winnerEntry.name.toUpperCase()}" DROPPED FROM WHEEL (SHEET UNTOUCHED). ${state.wheelEntries.length} REMAINING.`,
        'success',
      );
    }

    function onWheelStopped(winnerIdx: number) {
      const winnerEntry = state.wheelEntries[winnerIdx];
      if (!winnerEntry) return;

      audio.playWinnerFanfare();

      const floatSeconds = Math.max(1, Number(state.floatDurationSec) || 7);
      const floatMs = floatSeconds * 1000;

      dom.winnerNameDisplay.textContent = winnerEntry.name;
      dom.winnerMetaSubtitle.textContent =
        winnerEntry.meta || "DevFest MTL '26 Winner";
      dom.winnerCountdownFill.style.width = '100%';
      dom.winnerCountdownSec.textContent = floatSeconds.toFixed(1);
      dom.winnerOverlay.classList.remove('hidden');

      startSynthConfetti();

      const startFloat = performance.now();

      function updateCountdown(now: number) {
        const elapsed = now - startFloat;
        const remainingMs = Math.max(0, floatMs - elapsed);
        const pct = (remainingMs / floatMs) * 100;

        dom.winnerCountdownFill.style.width = `${pct}%`;
        dom.winnerCountdownSec.textContent = (remainingMs / 1000).toFixed(1);

        if (remainingMs > 0) {
          state.floatRafId = requestAnimationFrame(updateCountdown);
        } else {
          finalizeWinnerDrop(winnerIdx, winnerEntry);
        }
      }

      state.floatRafId = requestAnimationFrame(updateCountdown);

      dom.skipFloatBtn.onclick = () => {
        if (state.floatRafId) cancelAnimationFrame(state.floatRafId);
        finalizeWinnerDrop(winnerIdx, winnerEntry);
      };
    }

    function spinWheel() {
      if (state.isSpinning || state.wheelEntries.length === 0) return;

      state.isSpinning = true;
      dom.spinWheelBtn.disabled = true;
      dom.fillWheelBtn.disabled = true;
      dom.wheelGlowRing.classList.add('spinning');

      const count = state.wheelEntries.length;
      const durationMs = Math.max(2, Number(state.spinDurationSec) || 6) * 1000;

      const startAngle = state.currentAngle;
      const extraSpins = (6 + Math.random() * 4) * Math.PI * 2;

      const startTime = performance.now();
      let lastSliceIdx = getWinningSliceIndex(startAngle, count);

      function animateSpin(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);

        const easeOut = 1 - Math.pow(1 - progress, 4.2);
        state.currentAngle = startAngle + extraSpins * easeOut;

        const currentSliceIdx = getWinningSliceIndex(state.currentAngle, count);
        if (currentSliceIdx !== lastSliceIdx) {
          lastSliceIdx = currentSliceIdx;
          const speedRemaining = 1 - progress;
          audio.playTick(speedRemaining);

          dom.wheelPointer.classList.add('tick-bounce');
          if (state.tickTimeoutId) clearTimeout(state.tickTimeoutId);
          state.tickTimeoutId = setTimeout(
            () => dom.wheelPointer.classList.remove('tick-bounce'),
            55,
          );
        }

        renderWheel();

        if (progress < 1) {
          state.spinRafId = requestAnimationFrame(animateSpin);
        } else {
          state.spinRafId = null;
          state.isSpinning = false;
          dom.wheelGlowRing.classList.remove('spinning');
          const winnerIdx = getWinningSliceIndex(state.currentAngle, count);
          onWheelStopped(winnerIdx);
        }
      }

      state.spinRafId = requestAnimationFrame(animateSpin);
    }

    function exportWinnersCSV() {
      if (state.droppedWinners.length === 0) return;

      const ordered = [...state.droppedWinners].sort((a, b) => a.rank - b.rank);
      const lines = ['Name,Email,Prize Won'];

      ordered.forEach((w) => {
        lines.push(
          [
            toCsvField(w.name),
            toCsvField(w.email || ''),
            toCsvField(w.prize || ''),
          ].join(','),
        );
      });

      const csvContent = '\uFEFF' + lines.join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'devfest-mtl-26-winners.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    const onSheetKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') void fetchGoogleSheet();
    };
    const onLoadDemo = () => {
      dom.sheetUrlInput.value =
        'https://docs.google.com/spreadsheets/d/GDG-DEVFEST-MTL-26-DEMO/edit#gid=0';
      ingestCSVText(DEMO_GDG_SHEET_CSV, 'DEMO DEVFEST MTL SHEET LOADED');
    };
    const onTogglePaste = () => {
      dom.pasteBox.classList.toggle('hidden');
    };
    const onParsePasted = () => {
      const raw = dom.rawCsvInput.value.trim();
      if (!raw) {
        dom.csvFileInput.click();
        return;
      }
      ingestCSVText(raw, 'PASTED SHEET DATA LOADED');
      dom.pasteBox.classList.add('hidden');
    };
    const onCsvFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        ingestCSVText(
          String(ev.target?.result || ''),
          `FILE "${file.name.toUpperCase()}" LOADED`,
        );
      };
      reader.readAsText(file);
    };
    const onNameColumnChange = () => {
      state.nameColumn = dom.nameColumnSelect.value;
      populatePrizeColumnsSelect();
      updateMatchedPreview();
    };
    const onFilterValueChange = () => {
      state.filterValue = dom.filterValueSelect.value;
      updateMatchedPreview();
    };
    const onFloatSliderInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      state.floatDurationSec = Number(target.value);
      dom.floatDurationNumber.value = String(state.floatDurationSec);
    };
    const onFloatNumberInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const val = Math.max(1, Math.min(60, Number(target.value) || 7));
      state.floatDurationSec = val;
      dom.floatDurationInput.value = String(Math.min(30, val));
    };
    const onSpinSliderInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      state.spinDurationSec = Number(target.value);
      dom.spinDurationNumber.value = String(state.spinDurationSec);
    };
    const onSpinNumberInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const val = Math.max(2, Math.min(20, Number(target.value) || 6));
      state.spinDurationSec = val;
      dom.spinDurationInput.value = String(Math.min(15, val));
    };
    const onResetWinners = () => {
      state.droppedWinners = [];
      renderRosterUI();
    };
    const onSoundToggle = () => {
      audio.enabled = !audio.enabled;
      dom.soundIcon.textContent = audio.enabled ? '🔊' : '🔇';
    };
    const onTogglePanel = () => {
      dom.mainStage.classList.toggle('deck-collapsed');
    };
    const onWindowKeydown = (e: KeyboardEvent) => {
      if (
        e.key === 'Escape' &&
        !dom.winnerOverlay.classList.contains('hidden')
      ) {
        dom.skipFloatBtn.click();
      }
    };
    const onWindowResize = () => {
      if (!dom.winnerOverlay.classList.contains('hidden')) {
        dom.confettiCanvas.width = window.innerWidth;
        dom.confettiCanvas.height = window.innerHeight;
      }
    };

    dom.fetchSheetBtn.addEventListener('click', fetchGoogleSheet);
    dom.sheetUrlInput.addEventListener('keydown', onSheetKeydown);
    dom.loadDemoSheetBtn.addEventListener('click', onLoadDemo);
    dom.uploadCsvBtn.addEventListener('click', onTogglePaste);
    dom.parsePastedBtn.addEventListener('click', onParsePasted);
    dom.csvFileInput.addEventListener('change', onCsvFileChange);
    dom.nameColumnSelect.addEventListener('change', onNameColumnChange);
    dom.emailColumnSelect.addEventListener('change', updateMatchedPreview);
    dom.filterColumnSelect.addEventListener('change', populateFilterValues);
    dom.filterValueSelect.addEventListener('change', onFilterValueChange);
    dom.fillWheelBtn.addEventListener('click', fillWheelFromSheet);
    dom.spinWheelBtn.addEventListener('click', spinWheel);
    dom.floatDurationInput.addEventListener('input', onFloatSliderInput);
    dom.floatDurationNumber.addEventListener('input', onFloatNumberInput);
    dom.spinDurationInput.addEventListener('input', onSpinSliderInput);
    dom.spinDurationNumber.addEventListener('input', onSpinNumberInput);
    dom.exportWinnersBtn.addEventListener('click', exportWinnersCSV);
    dom.resetWinnersBtn.addEventListener('click', onResetWinners);
    dom.soundToggleBtn.addEventListener('click', onSoundToggle);
    dom.togglePanelBtn.addEventListener('click', onTogglePanel);
    window.addEventListener('keydown', onWindowKeydown);
    window.addEventListener('resize', onWindowResize);

    renderWheel();
    renderRosterUI();

    return () => {
      if (state.fillRafId) cancelAnimationFrame(state.fillRafId);
      if (state.spinRafId) cancelAnimationFrame(state.spinRafId);
      if (state.floatRafId) cancelAnimationFrame(state.floatRafId);
      if (state.confettiRafId) cancelAnimationFrame(state.confettiRafId);
      if (state.tickTimeoutId) clearTimeout(state.tickTimeoutId);
      audio.dispose();

      dom.fetchSheetBtn.removeEventListener('click', fetchGoogleSheet);
      dom.sheetUrlInput.removeEventListener('keydown', onSheetKeydown);
      dom.loadDemoSheetBtn.removeEventListener('click', onLoadDemo);
      dom.uploadCsvBtn.removeEventListener('click', onTogglePaste);
      dom.parsePastedBtn.removeEventListener('click', onParsePasted);
      dom.csvFileInput.removeEventListener('change', onCsvFileChange);
      dom.nameColumnSelect.removeEventListener('change', onNameColumnChange);
      dom.emailColumnSelect.removeEventListener('change', updateMatchedPreview);
      dom.filterColumnSelect.removeEventListener(
        'change',
        populateFilterValues,
      );
      dom.filterValueSelect.removeEventListener('change', onFilterValueChange);
      dom.fillWheelBtn.removeEventListener('click', fillWheelFromSheet);
      dom.spinWheelBtn.removeEventListener('click', spinWheel);
      dom.floatDurationInput.removeEventListener('input', onFloatSliderInput);
      dom.floatDurationNumber.removeEventListener('input', onFloatNumberInput);
      dom.spinDurationInput.removeEventListener('input', onSpinSliderInput);
      dom.spinDurationNumber.removeEventListener('input', onSpinNumberInput);
      dom.exportWinnersBtn.removeEventListener('click', exportWinnersCSV);
      dom.resetWinnersBtn.removeEventListener('click', onResetWinners);
      dom.soundToggleBtn.removeEventListener('click', onSoundToggle);
      dom.togglePanelBtn.removeEventListener('click', onTogglePanel);
      window.removeEventListener('keydown', onWindowKeydown);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <div ref={rootRef} className="crazy-wheel-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Press+Start+2P&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');

        .crazy-wheel-root {
          --bg-deep: #090214;
          --bg-mid: #16052b;
          --bg-panel: rgba(18, 6, 38, 0.84);
          --neon-pink: #ff007f;
          --neon-magenta: #ff2a85;
          --neon-cyan: #00f0ff;
          --neon-purple: #9d4edd;
          --neon-yellow: #ffbe0b;
          --neon-green: #00f59b;
          --gdg-blue: #4285F4;
          --gdg-red: #EA4335;
          --gdg-yellow: #FBBC04;
          --gdg-green: #34A853;
          --text-bright: #ffffff;
          --text-dim: #b8a3d9;
          --font-display: 'Orbitron', sans-serif;
          --font-arcade: 'Press Start 2P', monospace;
          --font-body: 'Rajdhani', sans-serif;
          --font-mono: 'Share Tech Mono', monospace;

          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background-color: var(--bg-deep);
          color: var(--text-bright);
          font-family: var(--font-body);
          user-select: none;
        }

        .crazy-wheel-root * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* =========================================================
           1980s SYNTHWAVE ANIMATED ENVIRONMENT
           ========================================================= */
        .crazy-wheel-root .synth-sky {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: linear-gradient(
            180deg,
            #05000c 0%,
            #130429 35%,
            #34094e 56%,
            #701060 66%,
            #120224 66.5%,
            #070110 100%
          );
        }

        .crazy-wheel-root .stars {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60%;
          background-image:
            radial-gradient(1.5px 1.5px at 12% 18%, #fff, transparent),
            radial-gradient(1px 1px at 26% 42%, #00f0ff, transparent),
            radial-gradient(2px 2px at 48% 12%, #ff99cc, transparent),
            radial-gradient(1.5px 1.5px at 68% 28%, #fff, transparent),
            radial-gradient(1px 1px at 82% 16%, #00f0ff, transparent),
            radial-gradient(2px 2px at 91% 38%, #fff, transparent),
            radial-gradient(1.5px 1.5px at 36% 8%, #ffbe0b, transparent),
            radial-gradient(1px 1px at 60% 44%, #fff, transparent);
          opacity: 0.75;
        }

        /* Classic Outrun Striped Sun */
        .crazy-wheel-root .synth-sun {
          position: absolute;
          left: 50%;
          top: 38%;
          transform: translate(-50%, -50%);
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: linear-gradient(180deg, #ffea00 0%, #ff7b00 45%, #ff007f 85%, #900058 100%);
          box-shadow:
            0 0 60px rgba(255, 0, 127, 0.75),
            0 0 130px rgba(255, 145, 0, 0.45);
          -webkit-mask-image: linear-gradient(
            to bottom,
            #000 0%,
            #000 50%,
            transparent 50%,
            transparent 52.5%,
            #000 52.5%,
            #000 60%,
            transparent 60%,
            transparent 63%,
            #000 63%,
            #000 70%,
            transparent 70%,
            transparent 74%,
            #000 74%,
            #000 80%,
            transparent 80%,
            transparent 85%,
            #000 85%,
            #000 90%,
            transparent 90%,
            transparent 96%,
            #000 96%
          );
          mask-image: linear-gradient(
            to bottom,
            #000 0%,
            #000 50%,
            transparent 50%,
            transparent 52.5%,
            #000 52.5%,
            #000 60%,
            transparent 60%,
            transparent 63%,
            #000 63%,
            #000 70%,
            transparent 70%,
            transparent 74%,
            #000 74%,
            #000 80%,
            transparent 80%,
            transparent 85%,
            #000 85%,
            #000 90%,
            transparent 90%,
            transparent 96%,
            #000 96%
          );
          opacity: 0.55;
          pointer-events: none;
        }

        /* Horizon Wireframe Mountains Silhouette */
        .crazy-wheel-root .mountains {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 33.5%;
          height: 110px;
          background:
            linear-gradient(135deg, transparent 55%, #17032e 55%) 0 0 / 180px 110px repeat-x,
            linear-gradient(225deg, transparent 55%, #230642 55%) 50px 0 / 220px 110px repeat-x;
          border-bottom: 3px solid var(--neon-cyan);
          box-shadow: 0 4px 25px var(--neon-cyan), 0 -4px 20px var(--neon-pink);
        }

        /* Moving 3D Perspective Grid Floor */
        .crazy-wheel-root .perspective-grid {
          position: absolute;
          left: -50%;
          right: -50%;
          bottom: -25%;
          height: 60%;
          background-image:
            linear-gradient(to right, rgba(255, 0, 127, 0.5) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.45) 2px, transparent 2px);
          background-size: 64px 42px;
          transform: perspective(360px) rotateX(68deg);
          transform-origin: top center;
          animation: cwGridTravel 2.2s linear infinite;
        }

        @keyframes cwGridTravel {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 42px;
          }
        }

        /* =========================================================
           TOP HEADER BAR
           ========================================================= */
        .crazy-wheel-root .top-bar {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: rgba(10, 2, 22, 0.88);
          border-bottom: 2px solid var(--neon-pink);
          box-shadow: 0 0 24px rgba(255, 0, 127, 0.45);
          backdrop-filter: blur(10px);
        }

        .crazy-wheel-root .brand-title {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .crazy-wheel-root .gdg-mini-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(0, 240, 255, 0.5);
          border-radius: 10px;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.35);
        }

        .crazy-wheel-root .sub-eyebrow {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 2.5px;
          color: var(--neon-cyan);
          text-shadow: 0 0 8px var(--neon-cyan);
        }

        .crazy-wheel-root .brand-title h1 {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 1.45rem;
          letter-spacing: 3px;
          background: linear-gradient(90deg, #ffffff 0%, #00f0ff 45%, #ff007f 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 10px rgba(255, 0, 127, 0.5));
        }

        .crazy-wheel-root .top-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .crazy-wheel-root .stat-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(184, 163, 217, 0.35);
          font-family: var(--font-mono);
        }

        .crazy-wheel-root .stat-pill.neon-cyan {
          border-color: var(--neon-cyan);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.25);
        }

        .crazy-wheel-root .stat-pill.neon-pink {
          border-color: var(--neon-pink);
          box-shadow: 0 0 10px rgba(255, 0, 127, 0.25);
        }

        .crazy-wheel-root .stat-label {
          font-size: 0.72rem;
          color: var(--text-dim);
        }

        .crazy-wheel-root .stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
        }

        .crazy-wheel-root .icon-btn {
          cursor: pointer;
          padding: 7px 12px;
          border-radius: 6px;
          border: 1px solid var(--neon-cyan);
          background: rgba(0, 240, 255, 0.1);
          color: var(--neon-cyan);
          font-family: var(--font-display);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 1px;
          transition: all 0.18s ease;
        }

        .crazy-wheel-root .icon-btn:hover {
          background: var(--neon-cyan);
          color: #090214;
          box-shadow: 0 0 15px var(--neon-cyan);
        }

        /* =========================================================
           MAIN 3-COLUMN STAGE
           ========================================================= */
        .crazy-wheel-root .main-stage {
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: 350px 1fr 310px;
          gap: 20px;
          padding: 18px 24px;
          height: calc(100vh - 69px);
          align-items: stretch;
        }

        .crazy-wheel-root .main-stage.deck-collapsed {
          grid-template-columns: 1fr 310px;
        }

        .crazy-wheel-root .main-stage.deck-collapsed .control-deck {
          display: none;
        }

        .crazy-wheel-root .control-deck,
        .crazy-wheel-root .roster-deck {
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .crazy-wheel-root ::-webkit-scrollbar {
          width: 6px;
        }

        .crazy-wheel-root ::-webkit-scrollbar-track {
          background: rgba(9, 2, 20, 0.6);
        }

        .crazy-wheel-root ::-webkit-scrollbar-thumb {
          background: var(--neon-pink);
          border-radius: 4px;
        }

        .crazy-wheel-root .deck-card {
          background: var(--bg-panel);
          border: 1px solid rgba(0, 240, 255, 0.35);
          border-left: 4px solid var(--neon-pink);
          border-radius: 10px;
          padding: 14px 16px;
          box-shadow:
            0 8px 28px rgba(0, 0, 0, 0.65),
            inset 0 0 18px rgba(255, 0, 127, 0.08);
          backdrop-filter: blur(12px);
        }

        .crazy-wheel-root .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 8px;
        }

        .crazy-wheel-root .step-tag {
          font-family: var(--font-arcade);
          font-size: 0.65rem;
          padding: 4px 6px;
          background: var(--neon-pink);
          color: #fff;
          border-radius: 4px;
          box-shadow: 0 0 8px var(--neon-pink);
        }

        .crazy-wheel-root .card-header h2 {
          font-family: var(--font-display);
          font-size: 0.86rem;
          letter-spacing: 1.5px;
          color: var(--neon-cyan);
          flex: 1;
        }

        .crazy-wheel-root .field-group {
          margin-bottom: 11px;
        }

        .crazy-wheel-root .field-group label,
        .crazy-wheel-root .slider-header label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 1px;
          color: var(--text-dim);
          margin-bottom: 5px;
        }

        .crazy-wheel-root .input-row {
          display: flex;
          gap: 6px;
        }

        .crazy-wheel-root input[type="text"],
        .crazy-wheel-root select,
        .crazy-wheel-root textarea {
          width: 100%;
          padding: 9px 11px;
          border-radius: 6px;
          border: 1px solid rgba(0, 240, 255, 0.45);
          background: rgba(7, 1, 18, 0.9);
          color: #fff;
          font-family: var(--font-mono);
          font-size: 0.88rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .crazy-wheel-root input[type="text"]:focus,
        .crazy-wheel-root select:focus,
        .crazy-wheel-root textarea:focus {
          border-color: var(--neon-pink);
          box-shadow: 0 0 12px rgba(255, 0, 127, 0.45);
        }

        .crazy-wheel-root select:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .crazy-wheel-root .helper-note {
          font-size: 0.78rem;
          color: var(--text-dim);
          margin-top: 5px;
          line-height: 1.3;
        }

        .crazy-wheel-root .quick-actions-row {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
        }

        .crazy-wheel-root .paste-box {
          margin-top: 8px;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px dashed var(--neon-cyan);
          border-radius: 6px;
          background: rgba(0, 240, 255, 0.05);
        }

        .crazy-wheel-root .hidden {
          display: none !important;
        }

        .crazy-wheel-root .status-banner {
          padding: 7px 10px;
          border-radius: 5px;
          background: rgba(0, 240, 255, 0.09);
          border: 1px solid rgba(0, 240, 255, 0.3);
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: var(--neon-cyan);
        }

        .crazy-wheel-root .status-banner.error {
          background: rgba(234, 67, 53, 0.16);
          border-color: #ea4335;
          color: #ff8a80;
        }

        .crazy-wheel-root .status-banner.success {
          background: rgba(0, 245, 155, 0.13);
          border-color: var(--neon-green);
          color: var(--neon-green);
        }

        .crazy-wheel-root .matched-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          margin-bottom: 10px;
          border-radius: 6px;
          background: rgba(255, 0, 127, 0.12);
          border: 1px solid rgba(255, 0, 127, 0.35);
          font-family: var(--font-mono);
          font-size: 0.82rem;
        }

        .crazy-wheel-root .matched-preview strong {
          font-size: 1.1rem;
          color: var(--neon-yellow);
        }

        /* =========================================================
           SYNTHWAVE BUTTONS
           ========================================================= */
        .crazy-wheel-root .btn {
          cursor: pointer;
          border: none;
          border-radius: 6px;
          font-family: var(--font-display);
          font-weight: 700;
          letter-spacing: 1.2px;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }

        .crazy-wheel-root .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          filter: grayscale(0.6);
        }

        .crazy-wheel-root .btn-cyan {
          padding: 9px 14px;
          background: linear-gradient(135deg, #00f0ff 0%, #0077ff 100%);
          color: #060112;
          box-shadow: 0 0 14px rgba(0, 240, 255, 0.45);
        }

        .crazy-wheel-root .btn-cyan:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 0 22px rgba(0, 240, 255, 0.85);
        }

        .crazy-wheel-root .btn-outline-sm {
          flex: 1;
          padding: 7px 10px;
          font-size: 0.68rem;
          background: rgba(255, 255, 255, 0.05);
          color: var(--neon-cyan);
          border: 1px solid rgba(0, 240, 255, 0.45);
        }

        .crazy-wheel-root .btn-outline-sm:hover {
          background: rgba(0, 240, 255, 0.18);
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.35);
        }

        .crazy-wheel-root .btn-sm {
          margin-top: 6px;
          width: 100%;
          padding: 7px 10px;
          font-size: 0.74rem;
        }

        .crazy-wheel-root .btn-fill-wheel {
          width: 100%;
          padding: 13px 16px;
          font-size: 0.92rem;
          background: linear-gradient(90deg, #ff007f 0%, #9d4edd 50%, #00f0ff 100%);
          color: #ffffff;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
          box-shadow: 0 0 20px rgba(255, 0, 127, 0.55);
        }

        .crazy-wheel-root .btn-fill-wheel:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 0 28px rgba(0, 240, 255, 0.85), 0 0 18px rgba(255, 0, 127, 0.8);
        }

        /* Sliders */
        .crazy-wheel-root .slider-group {
          margin-bottom: 12px;
        }

        .crazy-wheel-root .slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .crazy-wheel-root .num-badge-wrap {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--neon-yellow);
        }

        .crazy-wheel-root .num-badge-wrap input[type="number"] {
          width: 54px;
          padding: 3px 6px;
          border-radius: 4px;
          border: 1px solid var(--neon-yellow);
          background: rgba(0, 0, 0, 0.75);
          color: var(--neon-yellow);
          font-family: var(--font-mono);
          font-weight: 700;
          text-align: center;
        }

        .crazy-wheel-root input[type="range"] {
          width: 100%;
          accent-color: var(--neon-pink);
          cursor: pointer;
        }

        /* =========================================================
           CENTER WHEEL STAGE & GDG LOGO HUB
           ========================================================= */
        .crazy-wheel-root .wheel-stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 0;
        }

        .crazy-wheel-root .wheel-outer-frame {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: min(68vh, 640px);
          height: min(68vh, 640px);
        }

        .crazy-wheel-root .wheel-glow-ring {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          border: 3px solid var(--neon-cyan);
          box-shadow:
            0 0 30px var(--neon-cyan),
            0 0 65px var(--neon-pink),
            inset 0 0 25px var(--neon-pink);
          pointer-events: none;
          transition: box-shadow 0.3s ease;
        }

        .crazy-wheel-root .wheel-glow-ring.spinning {
          animation: cwRingPulse 0.4s infinite alternate;
        }

        @keyframes cwRingPulse {
          from {
            box-shadow: 0 0 35px var(--neon-cyan), 0 0 85px var(--neon-pink);
          }
          to {
            box-shadow: 0 0 55px var(--neon-yellow), 0 0 110px var(--neon-cyan);
          }
        }

        .crazy-wheel-root #wheelCanvas {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          z-index: 2;
        }

        /* Right-side Laser Pointer */
        .crazy-wheel-root .wheel-pointer {
          position: absolute;
          right: -28px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 8;
          filter: drop-shadow(0 0 14px var(--neon-cyan)) drop-shadow(0 0 24px var(--neon-pink));
          transform-origin: 85% 50%;
          transition: transform 0.06s ease-out;
        }

        .crazy-wheel-root .wheel-pointer.tick-bounce {
          transform: translateY(-50%) rotate(-16deg) scale(1.06);
        }

        /* Center GDG Hub */
        .crazy-wheel-root .gdg-center-hub {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 22%;
          height: 22%;
          min-width: 106px;
          min-height: 106px;
          border-radius: 50%;
          z-index: 6;
          padding: 5px;
          background: conic-gradient(
            from 0deg,
            var(--gdg-red),
            var(--gdg-blue),
            var(--gdg-green),
            var(--gdg-yellow),
            var(--gdg-red)
          );
          box-shadow:
            0 0 25px rgba(0, 240, 255, 0.8),
            0 0 45px rgba(255, 0, 127, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .crazy-wheel-root .gdg-hub-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at center, #1b0736 0%, #080114 100%);
          border: 2px solid rgba(255, 255, 255, 0.85);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }

        .crazy-wheel-root .gdg-hub-svg {
          width: 78%;
          height: auto;
        }

        .crazy-wheel-root .gdg-hub-text {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 0.78rem;
          letter-spacing: 3px;
          color: #fff;
          text-shadow: 0 0 8px var(--neon-cyan);
          margin-top: 2px;
        }

        /* Spin CTA Bar */
        .crazy-wheel-root .stage-cta-bar {
          margin-top: 18px;
          z-index: 6;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .crazy-wheel-root .btn-spin-mega {
          position: relative;
          padding: 16px 48px;
          font-size: 1.35rem;
          font-weight: 900;
          letter-spacing: 3px;
          border-radius: 50px;
          background: linear-gradient(90deg, #ff007f 0%, #ffbe0b 50%, #00f0ff 100%);
          background-size: 200% auto;
          color: #090117;
          border: 2px solid #ffffff;
          box-shadow:
            0 0 25px rgba(255, 0, 127, 0.8),
            0 0 50px rgba(0, 240, 255, 0.5);
          animation: cwGradientShift 3s linear infinite;
        }

        .crazy-wheel-root .btn-spin-mega:hover:not(:disabled) {
          transform: scale(1.06) translateY(-2px);
          box-shadow:
            0 0 35px rgba(0, 240, 255, 1),
            0 0 70px rgba(255, 0, 127, 0.95);
        }

        @keyframes cwGradientShift {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        /* =========================================================
           RIGHT ROSTER & DROPPED WINNERS PANEL
           ========================================================= */
        .crazy-wheel-root .roster-card {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          min-height: 180px;
        }

        .crazy-wheel-root .winners-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 180px;
        }

        .crazy-wheel-root .pill-mini {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          padding: 2px 8px;
          border-radius: 12px;
          background: rgba(0, 240, 255, 0.2);
          color: var(--neon-cyan);
          border: 1px solid var(--neon-cyan);
        }

        .crazy-wheel-root .winner-header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .crazy-wheel-root .btn-link-export {
          background: rgba(0, 240, 255, 0.14);
          border: 1px solid var(--neon-cyan);
          color: var(--neon-cyan);
          border-radius: 4px;
          padding: 2px 8px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .crazy-wheel-root .btn-link-export:hover:not(:disabled) {
          background: var(--neon-cyan);
          color: #090214;
          box-shadow: 0 0 10px var(--neon-cyan);
        }

        .crazy-wheel-root .btn-link-export:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .crazy-wheel-root .btn-link-clear {
          background: transparent;
          border: 1px solid rgba(255, 0, 127, 0.5);
          color: var(--neon-pink);
          border-radius: 4px;
          padding: 2px 7px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          cursor: pointer;
        }

        .crazy-wheel-root .btn-link-clear:hover {
          background: var(--neon-pink);
          color: #fff;
        }

        .crazy-wheel-root .roster-list,
        .crazy-wheel-root .winners-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 6px;
          padding-right: 4px;
        }

        .crazy-wheel-root .roster-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          border-left: 3px solid var(--neon-cyan);
          font-size: 0.92rem;
          font-weight: 600;
        }

        .crazy-wheel-root .roster-item .remove-slice-btn {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          font-size: 0.85rem;
        }

        .crazy-wheel-root .roster-item .remove-slice-btn:hover {
          color: var(--neon-pink);
        }

        .crazy-wheel-root .winner-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 8px 10px;
          border-radius: 6px;
          background: linear-gradient(90deg, rgba(255, 0, 127, 0.18), rgba(255, 190, 11, 0.08));
          border: 1px solid rgba(255, 190, 11, 0.45);
          font-weight: 700;
          color: var(--neon-yellow);
          overflow: hidden;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .crazy-wheel-root .winner-item-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          width: 100%;
        }

        .crazy-wheel-root .winner-prize-row {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          width: 100%;
        }

        .crazy-wheel-root .winner-prize-row span {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--neon-cyan);
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
          line-height: 1.35;
        }

        .crazy-wheel-root .winner-item .winner-rank {
          font-family: var(--font-arcade);
          font-size: 0.65rem;
          color: var(--neon-cyan);
          margin-right: 8px;
        }

        .crazy-wheel-root .empty-roster {
          color: var(--text-dim);
          font-size: 0.85rem;
          text-align: center;
          padding: 22px 10px;
          font-style: italic;
        }

        /* =========================================================
           WINNER FLOATING OVERLAY (7 SECONDS BIG & BOLD)
           ========================================================= */
        .crazy-wheel-root .winner-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: radial-gradient(circle at center, rgba(26, 4, 58, 0.92) 0%, rgba(5, 0, 14, 0.96) 100%);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .crazy-wheel-root #confettiCanvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .crazy-wheel-root .winner-float-card {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 44px 64px;
          max-width: 92vw;
          border-radius: 20px;
          background: rgba(14, 3, 32, 0.85);
          border: 3px solid var(--neon-cyan);
          box-shadow:
            0 0 50px rgba(0, 240, 255, 0.6),
            0 0 110px rgba(255, 0, 127, 0.7),
            inset 0 0 40px rgba(255, 0, 127, 0.25);
          animation: cwCardEntrance 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes cwCardEntrance {
          from {
            transform: scale(0.5) translateY(60px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        .crazy-wheel-root .winner-badge {
          display: inline-block;
          font-family: var(--font-arcade);
          font-size: 0.9rem;
          letter-spacing: 3px;
          padding: 8px 18px;
          border-radius: 30px;
          background: linear-gradient(90deg, var(--gdg-red), var(--gdg-blue), var(--gdg-green), var(--gdg-yellow));
          color: #fff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
          margin-bottom: 24px;
          box-shadow: 0 0 20px rgba(255, 190, 11, 0.6);
        }

        /* BIG AND BOLD FLOATING WINNER NAME */
        .crazy-wheel-root .winner-floating-name {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: clamp(2.8rem, 7vw, 6.2rem);
          line-height: 1.08;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #ffffff;
          text-shadow:
            0 0 12px #ffffff,
            0 0 28px var(--neon-cyan),
            0 0 55px var(--neon-pink),
            0 6px 0 #79004b,
            0 12px 24px rgba(0, 0, 0, 0.9);
          margin: 10px 0 18px;
          animation: cwSynthFloat 2.1s ease-in-out infinite alternate;
        }

        @keyframes cwSynthFloat {
          0% {
            transform: translateY(-12px) scale(1) rotate(-1deg);
            text-shadow:
              0 0 15px #ffffff,
              0 0 35px var(--neon-cyan),
              0 0 70px var(--neon-pink),
              0 8px 0 #79004b;
          }
          100% {
            transform: translateY(12px) scale(1.05) rotate(1deg);
            text-shadow:
              0 0 20px #ffffff,
              0 0 45px var(--neon-yellow),
              0 0 90px var(--neon-cyan),
              0 12px 0 #4285F4;
          }
        }

        .crazy-wheel-root .winner-meta-subtitle {
          font-family: var(--font-mono);
          font-size: 1.15rem;
          color: var(--neon-yellow);
          letter-spacing: 2px;
          margin-bottom: 26px;
          max-width: 100%;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
          line-height: 1.4;
        }

        .crazy-wheel-root .winner-countdown-wrap {
          max-width: 440px;
          margin: 0 auto 20px;
        }

        .crazy-wheel-root .winner-countdown-bar {
          width: 100%;
          height: 10px;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 99px;
          overflow: hidden;
          border: 1px solid rgba(0, 240, 255, 0.5);
          margin-bottom: 8px;
        }

        .crazy-wheel-root .winner-countdown-fill {
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, var(--neon-cyan), var(--neon-pink), var(--neon-yellow));
          box-shadow: 0 0 12px var(--neon-cyan);
          transition: width 0.08s linear;
        }

        .crazy-wheel-root .winner-countdown-text {
          font-family: var(--font-mono);
          font-size: 0.88rem;
          letter-spacing: 1.5px;
          color: var(--text-dim);
        }

        .crazy-wheel-root .winner-countdown-text strong {
          color: var(--neon-cyan);
        }

        @media (max-width: 1120px) {
          .crazy-wheel-root .main-stage {
            grid-template-columns: 1fr;
            height: auto;
          }

          .crazy-wheel-root .wheel-outer-frame {
            width: min(75vw, 520px);
            height: min(75vw, 520px);
            margin: 20px 0;
          }
        }
      `}</style>

      {/* Retro 1980s Synthwave Background Layer */}
      <div className="synth-sky" aria-hidden="true">
        <div className="stars" />
        <div className="synth-sun" />
        <div className="mountains" />
        <div className="perspective-grid" />
      </div>

      {/* Top Conference Header */}
      <header className="top-bar">
        <div className="brand-title">
          <div className="gdg-mini-badge" aria-hidden="true">
            <svg viewBox="0 0 120 68" width="44" height="26">
              <path d="M36 8 L10 34 L22 46 L48 20 Z" fill="#EA4335" />
              <path d="M10 34 L36 60 L48 48 L22 22 Z" fill="#4285F4" />
              <path d="M84 60 L110 34 L98 22 L72 48 Z" fill="#FBBC04" />
              <path d="M110 34 L84 8 L72 20 L98 46 Z" fill="#34A853" />
            </svg>
          </div>
          <div>
            <span className="sub-eyebrow">
              GOOGLE DEVELOPER GROUPS // DevFest MTL &apos;26
            </span>
            <h1>NEON WHEEL OF NAMES</h1>
          </div>
        </div>

        <div className="top-controls">
          <div className="stat-pill">
            <span className="stat-label">SHEET ROWS</span>
            <span className="stat-value" id="sheetCountBadge">
              0
            </span>
          </div>
          <div className="stat-pill neon-cyan">
            <span className="stat-label">ON WHEEL</span>
            <span className="stat-value" id="wheelCountBadge">
              0
            </span>
          </div>
          <div className="stat-pill neon-pink">
            <span className="stat-label">WINNERS</span>
            <span className="stat-value" id="winnerCountBadge">
              0
            </span>
          </div>
          <button
            className="icon-btn"
            id="soundToggleBtn"
            type="button"
            title="Toggle 80s Synth Audio"
            aria-label="Toggle Sound"
          >
            <span id="soundIcon">🔊</span> SYNTH SFX
          </button>
          <button
            className="icon-btn"
            id="togglePanelBtn"
            type="button"
            title="Collapse/Expand Control Deck"
          >
            🎛️ DECK
          </button>
        </div>
      </header>

      {/* Main Stage Layout */}
      <main className="main-stage" id="mainStage">
        {/* Left Control Deck: Google Sheet Loader & Column Selection */}
        <aside className="control-deck" id="controlDeck">
          <section className="deck-card">
            <div className="card-header">
              <span className="step-tag">01</span>
              <h2>GOOGLE SHEET SOURCE</h2>
            </div>

            <div className="field-group">
              <label htmlFor="sheetUrlInput">GOOGLE SHEET URL OR ID</label>
              <div className="input-row">
                <input
                  type="text"
                  id="sheetUrlInput"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  autoComplete="off"
                />
                <button
                  className="btn btn-cyan"
                  id="fetchSheetBtn"
                  type="button"
                >
                  LOAD
                </button>
              </div>
              <p className="helper-note">
                Share sheet as{' '}
                <strong>&quot;Anyone with the link can view&quot;</strong>{' '}
                (read-only). The sheet is never modified.
              </p>
            </div>

            <div className="quick-actions-row">
              <button
                className="btn btn-outline-sm"
                id="loadDemoSheetBtn"
                type="button"
              >
                ⚡ LOAD DEMO GDG CONFERENCE SHEET
              </button>
              <button
                className="btn btn-outline-sm"
                id="uploadCsvBtn"
                type="button"
              >
                📂 CSV / PASTE
              </button>
              <input
                type="file"
                id="csvFileInput"
                accept=".csv,.tsv,.txt"
                hidden
              />
            </div>

            <div className="paste-box hidden" id="pasteBox">
              <label htmlFor="rawCsvInput">
                PASTE CSV OR TAB-SEPARATED ROWS (WITH HEADER ROW)
              </label>
              <textarea
                id="rawCsvInput"
                rows={4}
                placeholder={
                  'Name,Email,Pixel Watch,Cloud Swag\nAda Lovelace,ada@example.com,Yes,Yes'
                }
              />
              <button
                className="btn btn-cyan btn-sm"
                id="parsePastedBtn"
                type="button"
              >
                PARSE DATA
              </button>
            </div>

            <div id="sheetStatusMsg" className="status-banner">
              READY // AWAITING DATA STREAM...
            </div>
          </section>

          {/* Step 2: Column Selection & Filtering */}
          <section className="deck-card">
            <div className="card-header">
              <span className="step-tag">02</span>
              <h2>SELECT USER COLUMN</h2>
            </div>

            <div className="field-group">
              <label htmlFor="nameColumnSelect">
                NAME COLUMN (DISPLAYED ON WHEEL)
              </label>
              <select id="nameColumnSelect" disabled defaultValue="">
                <option value="">-- Load a sheet first --</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="emailColumnSelect">
                EMAIL COLUMN (HIDDEN ON SCREEN // USED IN EXPORT)
              </label>
              <select id="emailColumnSelect" disabled defaultValue="__AUTO__">
                <option value="__AUTO__">-- Auto-detect Email --</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="filterColumnSelect">
                PRIZE COLUMN (COLUMNS AFTER FULL NAME)
              </label>
              <select id="filterColumnSelect" disabled defaultValue="__ALL__">
                <option value="__ALL__">
                  -- All Users (No Prize Filter) --
                </option>
              </select>
            </div>

            <div className="field-group hidden" id="filterValueGroup">
              <label htmlFor="filterValueSelect">MATCH COLUMN VALUE</label>
              <select id="filterValueSelect" defaultValue="__AFFIRMATIVE__">
                <option value="__AFFIRMATIVE__">-- Entered (Yes) --</option>
              </select>
            </div>

            <div className="matched-preview">
              <span>MATCHED CANDIDATES:</span>
              <strong id="matchedCountText">0</strong>
            </div>

            <button
              className="btn btn-fill-wheel"
              id="fillWheelBtn"
              type="button"
              disabled
            >
              ⚡ FILL WHEEL FROM SHEET
            </button>
          </section>

          {/* Step 3: Timing & Conference Settings */}
          <section className="deck-card">
            <div className="card-header">
              <span className="step-tag">03</span>
              <h2>WINNER FLOAT &amp; SPIN TUNING</h2>
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label htmlFor="floatDurationInput">WINNER FLOAT TIME</label>
                <div className="num-badge-wrap">
                  <input
                    type="number"
                    id="floatDurationNumber"
                    min={1}
                    max={60}
                    step={1}
                    defaultValue={7}
                    aria-label="Winner float time in seconds"
                  />
                  <span>SEC</span>
                </div>
              </div>
              <input
                type="range"
                id="floatDurationInput"
                min={1}
                max={30}
                step={1}
                defaultValue={7}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label htmlFor="spinDurationInput">WHEEL SPIN DURATION</label>
                <div className="num-badge-wrap">
                  <input
                    type="number"
                    id="spinDurationNumber"
                    min={2}
                    max={20}
                    step={1}
                    defaultValue={6}
                    aria-label="Wheel spin duration in seconds"
                  />
                  <span>SEC</span>
                </div>
              </div>
              <input
                type="range"
                id="spinDurationInput"
                min={2}
                max={15}
                step={1}
                defaultValue={6}
              />
            </div>
          </section>
        </aside>

        {/* Center Stage: The Synthwave Wheel of Names */}
        <section className="wheel-stage">
          <div className="wheel-outer-frame">
            <div className="wheel-glow-ring" id="wheelGlowRing" />

            {/* Right-side Laser Pointer Stopper */}
            <div
              className="wheel-pointer"
              id="wheelPointer"
              title="Winning Slice Indicator"
            >
              <svg viewBox="0 0 70 54" width="66" height="50">
                <defs>
                  <linearGradient
                    id="pointerGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="50%" stopColor="#ff007f" />
                    <stop offset="100%" stopColor="#ffbe0b" />
                  </linearGradient>
                </defs>
                <polygon
                  points="4,27 64,5 52,27 64,49"
                  fill="url(#pointerGrad)"
                  stroke="#ffffff"
                  strokeWidth="3"
                />
              </svg>
            </div>

            {/* Main HTML5 Canvas for Wheel Slices */}
            <canvas
              id="wheelCanvas"
              width={LOGICAL_WHEEL_SIZE}
              height={LOGICAL_WHEEL_SIZE}
            />

            {/* Center Hub with Official GDG Logo */}
            <div className="gdg-center-hub" id="gdgCenterHub">
              <div className="gdg-hub-inner">
                <svg
                  className="gdg-hub-svg"
                  viewBox="0 0 160 100"
                  aria-label="GDG Logo"
                >
                  <defs>
                    <filter
                      id="hubGlow"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="2.5"
                        floodColor="#00f0ff"
                        floodOpacity="0.7"
                      />
                    </filter>
                  </defs>
                  <g filter="url(#hubGlow)">
                    <path
                      d="M56 14 L18 50 L32 64 L70 28 A10 10 0 0 0 56 14 Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M18 50 L56 86 A10 10 0 0 0 70 72 L32 36 Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M104 86 L142 50 L128 36 L90 72 A10 10 0 0 0 104 86 Z"
                      fill="#FBBC04"
                    />
                    <path
                      d="M142 50 L104 14 A10 10 0 0 0 90 28 L128 64 Z"
                      fill="#34A853"
                    />
                  </g>
                </svg>
                <span className="gdg-hub-text">GDG</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons Under Wheel */}
          <div className="stage-cta-bar">
            <button
              className="btn btn-spin-mega"
              id="spinWheelBtn"
              type="button"
              disabled
            >
              <span className="spin-btn-text">🚀 SPIN THE WHEEL</span>
            </button>
          </div>
        </section>

        {/* Right Roster & Winners Panel */}
        <aside className="roster-deck" id="rosterDeck">
          <section className="deck-card roster-card">
            <div className="card-header">
              <h2>ACTIVE WHEEL ROSTER</h2>
              <span className="pill-mini" id="activeRosterCount">
                0
              </span>
            </div>
            <div className="roster-list" id="activeRosterList">
              <div className="empty-roster">
                Click <strong>FILL WHEEL</strong> to load participants onto the
                wheel.
              </div>
            </div>
          </section>

          <section className="deck-card winners-card">
            <div className="card-header">
              <h2>🏆 DROPPED WINNERS</h2>
              <div className="winner-header-actions">
                <button
                  className="btn-link-export"
                  id="exportWinnersBtn"
                  type="button"
                  title="Export Winners CSV (Name, Email, Prize Won)"
                  disabled
                >
                  📥 EXPORT CSV
                </button>
                <button
                  className="btn-link-clear"
                  id="resetWinnersBtn"
                  type="button"
                  title="Clear Winners List"
                >
                  CLEAR
                </button>
              </div>
            </div>
            <p className="helper-note">
              Emails stay hidden on screen. Export includes{' '}
              <strong>Name, Email &amp; Prize Won</strong>.
            </p>
            <div className="winners-list" id="winnersList">
              <div className="empty-roster">No winners drawn yet.</div>
            </div>
          </section>
        </aside>
      </main>

      {/* Floating Winner Overlay (7 Seconds Adjustable Big & Bold Synthwave Display) */}
      <div
        className="winner-overlay hidden"
        id="winnerOverlay"
        role="dialog"
        aria-live="assertive"
      >
        <canvas id="confettiCanvas" />
        <div className="winner-float-card">
          <div className="winner-gdg-header">
            <span className="winner-badge">
              ★ DevFest MTL &apos;26 Winner ★
            </span>
          </div>
          <div className="winner-floating-name" id="winnerNameDisplay">
            ADA LOVELACE
          </div>
          <div className="winner-meta-subtitle" id="winnerMetaSubtitle" />
          <div className="winner-countdown-wrap">
            <div className="winner-countdown-bar">
              <div className="winner-countdown-fill" id="winnerCountdownFill" />
            </div>
            <div className="winner-countdown-text">
              DROPPING FROM WHEEL IN{' '}
              <strong id="winnerCountdownSec">7.0</strong>s
            </div>
          </div>
          <button
            className="btn btn-outline-sm"
            id="skipFloatBtn"
            type="button"
          >
            DROP NOW &amp; CONTINUE [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
