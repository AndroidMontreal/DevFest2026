'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1D04JStTF_TwXjcHKKTKpBaAH5FZNzMHyVyKUebZXU1U/edit?resourcekey=&gid=1616495823#gid=1616495823';

const ENTRY_GOOGLE_FORM_URL = 'https://forms.gle/uDH1NmnFMeqgkCQ16';

const DEFAULT_SHEET_HEADERS = [
  'Timestamp',
  'Email Address',
  'Nom Complet / Full Name',
  '1 year license for a Jetbrain IDE (6)',
  'Kodeco e-book voucher (5)',
  'Packt Book - Android Programming for Beginners (2)',
  'Packt Book - How to Build Applications with Kotlin (1)',
  'Packt Book - Essential Data Structures and Algorithms in Java (1)',
  'Packt Book - Flutter for Beginners (3)',
  'Packt Book - Enterprise Vibe Coding for Agentic Engineering (2)',
  'Packt Book - Distributed AI Systems (2)',
  'Packt Book - Flutter Cookbook (3)',
];

const DEMO_RAFFLE_CSV = `Timestamp,Email Address,Nom Complet / Full Name,1 year license for a Jetbrain IDE (6),Kodeco e-book voucher (5),Packt Book - Android Programming for Beginners (2),Packt Book - How to Build Applications with Kotlin (1),Packt Book - Essential Data Structures and Algorithms in Java (1),Packt Book - Flutter for Beginners (3),Packt Book - Enterprise Vibe Coding for Agentic Engineering (2),Packt Book - Distributed AI Systems (2),Packt Book - Flutter Cookbook (3)
2026-11-06 08:45:00,ada@analytical.org,Ada Lovelace,Yes,Yes,No,Yes,No,Yes,Yes,No,No
2026-11-06 08:46:10,grace@cobol.navy.mil,Grace Hopper,Yes,No,Yes,No,Yes,No,Yes,Yes,No
2026-11-06 08:47:22,alan@bletchley.uk,Alan Turing,No,Yes,Yes,Yes,Yes,No,No,Yes,Yes
2026-11-06 08:48:05,margaret@apollo.nasa.gov,Margaret Hamilton,Yes,Yes,No,No,No,Yes,Yes,No,Yes
2026-11-06 08:49:12,katherine@orbital.nasa.gov,Katherine Johnson,Yes,No,Yes,No,No,Yes,No,Yes,No
2026-11-06 08:50:40,linus@kernel.org,Linus Torvalds,Yes,Yes,No,Yes,Yes,No,No,Yes,No
2026-11-06 08:51:19,timbl@w3.org,Tim Berners-Lee,No,Yes,Yes,No,No,Yes,Yes,No,Yes
2026-11-06 08:52:03,radia@spanningtree.net,Radia Perlman,Yes,No,No,Yes,Yes,No,Yes,Yes,No
2026-11-06 08:53:44,hedy@freqhop.io,Hedy Lamarr,Yes,Yes,Yes,No,No,Yes,No,No,Yes
2026-11-06 08:54:15,dmr@bell-labs.com,Dennis Ritchie,Yes,No,No,Yes,Yes,No,No,Yes,No
2026-11-06 08:55:28,liskov@csail.mit.edu,Barbara Liskov,No,Yes,Yes,No,Yes,Yes,Yes,No,No
2026-11-06 08:56:02,knuth@tex.stanford.edu,Donald Knuth,Yes,Yes,No,No,Yes,No,No,Yes,Yes
2026-11-06 08:57:31,guido@python.org,Guido van Rossum,Yes,Yes,Yes,Yes,No,Yes,Yes,No,Yes
2026-11-06 08:58:49,brendan@js-engine.dev,Brendan Eich,No,Yes,No,Yes,No,Yes,No,Yes,Yes
2026-11-06 08:59:11,solomon@containers.dev,Solomon Hykes,Yes,No,Yes,No,No,No,Yes,Yes,No
2026-11-06 09:00:25,kelsey@serverless.cloud,Kelsey Hightower,Yes,Yes,No,Yes,No,Yes,Yes,Yes,Yes
2026-11-06 09:01:38,jeff@deepmind.google,Jeff Dean,Yes,No,Yes,No,Yes,No,Yes,Yes,No
2026-11-06 09:02:50,feifei@vision.ai,Fei-Fei Li,Yes,Yes,No,No,No,Yes,Yes,Yes,Yes
2026-11-06 09:03:14,yann@fair.meta.ai,Yann LeCun,No,Yes,Yes,No,Yes,No,Yes,Yes,No
2026-11-06 09:04:29,geoff@toronto.edu,Geoffrey Hinton,Yes,No,No,Yes,No,Yes,Yes,Yes,No
2026-11-06 09:05:42,yoshua@mila.quebec,Yoshua Bengio,Yes,Yes,Yes,No,No,Yes,Yes,Yes,Yes
2026-11-06 09:06:55,karpathy@eureka.ai,Andrej Karpathy,Yes,Yes,No,Yes,No,No,Yes,Yes,Yes`;

type SheetInfo =
  | { directUrl: string; sheetId?: undefined; gid?: undefined }
  | { sheetId: string; gid: string; directUrl?: undefined };

export interface RaffleParticipant {
  id: string;
  name: string;
  email: string;
  matchedColumns: string[];
  assignedPrize?: string;
  row: Record<string, string>;
}

export interface MainCategoryGroup {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  badgeColor: string;
  columns: string[];
  totalPrizes: number;
}

class SynthRaffleAudio {
  ctx: AudioContext | null = null;
  enabled = true;
  stepCounter = 0;
  noiseBuffer: AudioBuffer | null = null;

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

  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (this.noiseBuffer) return this.noiseBuffer;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.14);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  playShufflePulse(progress = 0.5) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const step = this.stepCounter++;

    const chordBank = [
      { bass: 55.0, notes: [220.0, 261.63, 329.63, 440.0, 523.25, 659.25, 880.0] },
      { bass: 43.65, notes: [174.61, 220.0, 261.63, 349.23, 440.0, 523.25, 698.46] },
      { bass: 65.41, notes: [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5] },
      { bass: 49.0, notes: [196.0, 246.94, 293.66, 392.0, 493.88, 587.33, 783.99] },
    ];
    const safeProgress = Math.max(0, Math.min(1, progress));
    const chordIdx = Math.max(0, Math.min(3, Math.floor(safeProgress * 4)));
    const chord = chordBank[chordIdx] || chordBank[0];

    const arpFreq =
      chord.notes[Math.floor(Math.random() * chord.notes.length)] *
      (Math.random() < 0.22 ? 1.5 : 1);

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const arpGain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(arpFreq, now);
    osc2.frequency.setValueAtTime(arpFreq * 1.006, now);

    filter.type = 'lowpass';
    const cutoff = 650 + safeProgress * 4200 + Math.random() * 600;
    filter.frequency.setValueAtTime(cutoff, now);
    filter.frequency.exponentialRampToValueAtTime(280, now + 0.085);
    filter.Q.setValueAtTime(5.5, now);

    arpGain.gain.setValueAtTime(0.11, now);
    arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(arpGain);
    arpGain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.09);
    osc2.stop(now + 0.09);

    if (step % 2 === 0) {
      const bassOsc = this.ctx.createOscillator();
      const bassFilter = this.ctx.createBiquadFilter();
      const bassGain = this.ctx.createGain();

      bassOsc.type = 'sawtooth';
      const octaveJump = step % 4 === 2 ? 2 : 1;
      bassOsc.frequency.setValueAtTime(chord.bass * octaveJump, now);

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(360, now);
      bassFilter.Q.setValueAtTime(3.0, now);

      bassGain.gain.setValueAtTime(0.14, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.ctx.destination);

      bassOsc.start(now);
      bassOsc.stop(now + 0.12);
    }

    if (step % 6 === 0) {
      const tomOsc = this.ctx.createOscillator();
      const tomGain = this.ctx.createGain();
      tomOsc.type = 'sine';
      const startPitch = 140 + Math.random() * 90;
      tomOsc.frequency.setValueAtTime(startPitch, now);
      tomOsc.frequency.exponentialRampToValueAtTime(38, now + 0.11);

      tomGain.gain.setValueAtTime(0.15, now);
      tomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      tomOsc.connect(tomGain);
      tomGain.connect(this.ctx.destination);
      tomOsc.start(now);
      tomOsc.stop(now + 0.12);
    } else if (step % 6 === 3) {
      const noiseBuf = this.getNoiseBuffer();
      if (noiseBuf) {
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;
        const snareFilter = this.ctx.createBiquadFilter();
        snareFilter.type = 'bandpass';
        snareFilter.frequency.setValueAtTime(1100, now);
        snareFilter.Q.setValueAtTime(0.9, now);

        const snareGain = this.ctx.createGain();
        snareGain.gain.setValueAtTime(0.12, now);
        snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

        noiseSrc.connect(snareFilter);
        snareFilter.connect(snareGain);
        snareGain.connect(this.ctx.destination);
        noiseSrc.start(now);
        noiseSrc.stop(now + 0.12);
      }
    }
  }

  playCategoryLoad() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.0, 523.25];
    const audioCtx = this.ctx;
    notes.forEach((freq, idx) => {
      const now = audioCtx.currentTime + idx * 0.045;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    });
  }

  playWinnerFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const sequence = [
      { freq: 261.63, delay: 0.0, dur: 0.2 },
      { freq: 329.63, delay: 0.1, dur: 0.2 },
      { freq: 392.0, delay: 0.2, dur: 0.2 },
      { freq: 523.25, delay: 0.3, dur: 0.5 },
      { freq: 659.25, delay: 0.42, dur: 0.7 },
      { freq: 783.99, delay: 0.55, dur: 1.05 },
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

      gain.gain.setValueAtTime(0.13, start);
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

  if (idMatch) {
    const sheetId = idMatch[1];
    const defaultGid =
      sheetId === '1D04JStTF_TwXjcHKKTKpBaAH5FZNzMHyVyKUebZXU1U'
        ? '1616495823'
        : '0';
    return { sheetId, gid: gidMatch ? gidMatch[1] : defaultGid };
  }

  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
    const defaultGid =
      trimmed === '1D04JStTF_TwXjcHKKTKpBaAH5FZNzMHyVyKUebZXU1U'
        ? '1616495823'
        : '0';
    return { sheetId: trimmed, gid: defaultGid };
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

function parsePrizeCountFromHeader(header: string): number {
  const match = header.match(/\((\d+)\)\s*$/);
  if (match) {
    const n = parseInt(match[1], 10);
    if (n > 0) return n;
  }
  return 1;
}

function cleanPrizeLabel(header: string): string {
  return header.replace(/\s*\(\d+\)\s*$/, '').trim();
}

function shortBookTitle(header: string): string {
  return header.replace(/^Packt Book\s*-\s*/i, '').trim();
}

function cryptoShuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  if (copy.length <= 1) return copy;
  const randBuf = new Uint32Array(copy.length);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(randBuf);
  } else {
    for (let i = 0; i < copy.length; i++) {
      randBuf[i] = Math.floor(Math.random() * 0xffffffff);
    }
  }
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randBuf[i] % (i + 1);
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

function toCsvField(val: string | undefined): string {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function CrazyRaffleView() {
  const [sheetUrl, setSheetUrl] = useState(DEFAULT_GOOGLE_SHEET_URL);
  const [headers, setHeaders] = useState<string[]>(DEFAULT_SHEET_HEADERS);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [nameColumn, setNameColumn] = useState('Nom Complet / Full Name');
  const [emailColumn, setEmailColumn] = useState('Email Address');
  const [statusMsg, setStatusMsg] = useState(
    'CONNECTING TO DEVFEST MTL RAFFLE SHEET...',
  );
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>(
    'info',
  );
  const [isLoadingSheet, setIsLoadingSheet] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [rawCsvText, setRawCsvText] = useState('');

  // Category & Sub-Prize Selection
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string>('jetbrains');
  const [selectedSubColumn, setSelectedSubColumn] = useState<string>(
    '1 year license for a Jetbrain IDE (6)',
  );

  // Winner & Buffer Counts + Shuffle Settings
  const [winnerCount, setWinnerCount] = useState<number>(6);
  const [bufferCount, setBufferCount] = useState<number>(6);
  const [shuffleDurationSec, setShuffleDurationSec] = useState<number>(5);
  const [excludePastWinners, setExcludePastWinners] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Shuffling & Results State
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [shuffleRemainingSec, setShuffleRemainingSec] = useState<number>(0);
  const [shuffledPool, setShuffledPool] = useState<RaffleParticipant[]>([]);
  const [drawnOrder, setDrawnOrder] = useState<RaffleParticipant[]>([]);
  const [noShowIds, setNoShowIds] = useState<Set<string>>(new Set());
  const [lockedWinnersHistory, setLockedWinnersHistory] = useState<
    Array<{
      key: string;
      participantId: string;
      name: string;
      email: string;
      category: string;
      prize: string;
      rank: number;
    }>
  >([]);

  const audioRef = useRef<SynthRaffleAudio | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiRafRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    audioRef.current = new SynthRaffleAudio();
    return () => {
      audioRef.current?.dispose();
      if (confettiRafRef.current) {
        cancelAnimationFrame(confettiRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.enabled = soundEnabled;
    }
  }, [soundEnabled]);

  const isEmailHeader = useCallback(
    (h: string) => {
      if (/email|e-mail|mail|courriel/i.test(h)) return true;
      if (emailColumn !== '__AUTO__' && h === emailColumn) return true;
      return false;
    },
    [emailColumn],
  );

  const isTimestampHeader = useCallback((h: string) => {
    return /timestamp|horodateur|date/i.test(h);
  }, []);

  const prizeColumns = useMemo(() => {
    if (headers.length === 0) return [];
    const nameIdx = headers.indexOf(nameColumn);
    if (nameIdx !== -1 && nameIdx < headers.length - 1) {
      return headers
        .slice(nameIdx + 1)
        .filter((h) => !isEmailHeader(h) && !isTimestampHeader(h));
    }
    return headers.filter(
      (h) => h !== nameColumn && !isEmailHeader(h) && !isTimestampHeader(h),
    );
  }, [headers, nameColumn, isEmailHeader, isTimestampHeader]);

  // Group prize columns into the 3 main categories (JetBrains, Kodeco, Packt Books)
  const categories = useMemo<MainCategoryGroup[]>(() => {
    if (prizeColumns.length === 0) return [];

    const jetbrainsCols = prizeColumns.filter((c) => /jetbrain/i.test(c));
    const kodecoCols = prizeColumns.filter((c) => /kodeco/i.test(c));
    const packtCols = prizeColumns.filter((c) => /packt/i.test(c));
    const otherCols = prizeColumns.filter(
      (c) =>
        !/jetbrain/i.test(c) && !/kodeco/i.test(c) && !/packt/i.test(c),
    );

    const groups: MainCategoryGroup[] = [];

    if (jetbrainsCols.length > 0) {
      groups.push({
        id: 'jetbrains',
        label: 'JetBrains IDE Licenses',
        shortLabel: 'JetBrains IDE',
        icon: '💻',
        badgeColor: '#ff007f',
        columns: jetbrainsCols,
        totalPrizes: jetbrainsCols.reduce(
          (sum, c) => sum + parsePrizeCountFromHeader(c),
          0,
        ),
      });
    }

    if (kodecoCols.length > 0) {
      groups.push({
        id: 'kodeco',
        label: 'Kodeco E-Book Vouchers',
        shortLabel: 'Kodeco Vouchers',
        icon: '📚',
        columns: kodecoCols,
        badgeColor: '#00f0ff',
        totalPrizes: kodecoCols.reduce(
          (sum, c) => sum + parsePrizeCountFromHeader(c),
          0,
        ),
      });
    }

    if (packtCols.length > 0) {
      groups.push({
        id: 'packt',
        label: 'Packt Books',
        shortLabel: 'Packt Books',
        icon: '📖',
        badgeColor: '#ffbe0b',
        columns: packtCols,
        totalPrizes: packtCols.reduce(
          (sum, c) => sum + parsePrizeCountFromHeader(c),
          0,
        ),
      });
    }

    otherCols.forEach((col, idx) => {
      groups.push({
        id: `custom-${idx}`,
        label: cleanPrizeLabel(col),
        shortLabel: cleanPrizeLabel(col),
        icon: '🎁',
        badgeColor: '#00f59b',
        columns: [col],
        totalPrizes: parsePrizeCountFromHeader(col),
      });
    });

    return groups;
  }, [prizeColumns]);

  const activeCategory = useMemo<MainCategoryGroup | null>(() => {
    if (categories.length === 0) return null;
    return (
      categories.find((c) => c.id === selectedCategoryId) || categories[0]
    );
  }, [categories, selectedCategoryId]);

  // Active single prize column (for Packt Books, always one specific book column)
  const activePrizeColumn = useMemo<string>(() => {
    if (!activeCategory || activeCategory.columns.length === 0) return '';
    if (activeCategory.columns.includes(selectedSubColumn)) {
      return selectedSubColumn;
    }
    return activeCategory.columns[0];
  }, [activeCategory, selectedSubColumn]);

  const extractRowEmail = useCallback(
    (row: Record<string, string>): string => {
      if (emailColumn && emailColumn !== '__AUTO__') {
        return (row[emailColumn] || '').trim();
      }
      const emailHdr = headers.find((h) => /email|e-mail|mail|courriel/i.test(h));
      if (emailHdr && row[emailHdr]) {
        return row[emailHdr].trim();
      }
      for (const h of headers) {
        const val = (row[h] || '').trim();
        if (/\S+@\S+\.\S+/.test(val)) return val;
      }
      return '';
    },
    [emailColumn, headers],
  );

  // Eligible participants who answered "Yes" to the selected prize column
  const eligibleCandidates = useMemo<RaffleParticipant[]>(() => {
    if (!nameColumn || rows.length === 0 || !activePrizeColumn) {
      return [];
    }

    const lockedNamesSet = new Set(
      lockedWinnersHistory.map((w) => w.name.toLowerCase()),
    );
    const lockedEmailsSet = new Set(
      lockedWinnersHistory
        .map((w) => w.email.toLowerCase())
        .filter(Boolean),
    );

    const list: RaffleParticipant[] = [];
    const seenKeys = new Set<string>();

    rows.forEach((row, idx) => {
      const rawName = (row[nameColumn] || '').trim();
      if (!rawName) return;

      if (!isAffirmativePrizeCell(row[activePrizeColumn])) return;

      const email = extractRowEmail(row);
      const dedupeKey = (email || rawName).toLowerCase();
      if (seenKeys.has(dedupeKey)) return;

      if (excludePastWinners) {
        if (
          lockedNamesSet.has(rawName.toLowerCase()) ||
          (email && lockedEmailsSet.has(email.toLowerCase()))
        ) {
          return;
        }
      }

      seenKeys.add(dedupeKey);
      list.push({
        id: `cand-${idx}-${rawName}`,
        name: rawName,
        email,
        matchedColumns: [activePrizeColumn],
        assignedPrize: cleanPrizeLabel(activePrizeColumn),
        row,
      });
    });

    return list;
  }, [
    nameColumn,
    rows,
    activePrizeColumn,
    extractRowEmail,
    excludePastWinners,
    lockedWinnersHistory,
  ]);

  const displayPool = isShuffling ? shuffledPool : eligibleCandidates;

  const handleSelectCategory = (cat: MainCategoryGroup) => {
    if (isShuffling) return;
    const firstCol = cat.columns[0] || '';
    const count = firstCol ? parsePrizeCountFromHeader(firstCol) : cat.totalPrizes;
    setSelectedCategoryId(cat.id);
    setSelectedSubColumn(firstCol);
    setWinnerCount(count);
    setBufferCount(count);
    setDrawnOrder([]);
    setNoShowIds(new Set());
    audioRef.current?.playCategoryLoad();
  };

  const handleSelectSubColumn = (col: string) => {
    if (isShuffling) return;
    const count = parsePrizeCountFromHeader(col);
    setSelectedSubColumn(col);
    setWinnerCount(count);
    setBufferCount(count);
    setDrawnOrder([]);
    setNoShowIds(new Set());
    audioRef.current?.playCategoryLoad();
  };

  const ingestCSVText = useCallback(
    (csvText: string, sourceLabel = 'GOOGLE SHEET LOADED') => {
      const { headers: parsedHeaders, records } = parseCSV(csvText);

      if (parsedHeaders.length === 0) {
        setStatusMsg('ERROR // NO VALID HEADERS FOUND IN SHEET');
        setStatusType('error');
        return;
      }

      setHeaders(parsedHeaders);
      setRows(records);

      const preferredName =
        parsedHeaders.find((h) =>
          /nom|name|attendee|participant|user|speaker/i.test(h),
        ) || parsedHeaders[0];
      setNameColumn(preferredName);

      const detectedEmail = parsedHeaders.find((h) =>
        /email|e-mail|mail|courriel/i.test(h),
      );
      setEmailColumn(detectedEmail || '__AUTO__');

      const firstJetbrains = parsedHeaders.find((h) => /jetbrain/i.test(h));
      if (firstJetbrains) {
        const count = parsePrizeCountFromHeader(firstJetbrains);
        setSelectedCategoryId('jetbrains');
        setSelectedSubColumn(firstJetbrains);
        setWinnerCount(count);
        setBufferCount(count);
      }

      setStatusMsg(
        `${sourceLabel} // ${records.length} RESPONSES READY`,
      );
      setStatusType('success');
    },
    [],
  );

  const fetchGoogleSheet = useCallback(
    async (urlOverride?: string) => {
      const targetUrl =
        (urlOverride ?? sheetUrl).trim() || DEFAULT_GOOGLE_SHEET_URL;
      if (!sheetUrl.trim()) {
        setSheetUrl(DEFAULT_GOOGLE_SHEET_URL);
      }
      const info = extractGoogleSheetInfo(targetUrl);

      if (!info) {
        setStatusMsg('ERROR // PLEASE ENTER A VALID GOOGLE SHEET URL OR ID');
        setStatusType('error');
        return;
      }

      setIsLoadingSheet(true);
      setStatusMsg('CONNECTING TO GOOGLE SHEET STREAM...');
      setStatusType('info');

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

        ingestCSVText(csvText, 'GOOGLE SHEET SYNCED');
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setStatusMsg(
          `LIVE STREAM NOTICE // ${errMsg}. Make sure the sheet is shared as "Anyone with the link can view" or click LOAD DEMO.`,
        );
        setStatusType('error');
      } finally {
        setIsLoadingSheet(false);
      }
    },
    [sheetUrl, ingestCSVText],
  );

  // Auto-load the Google Sheet on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchGoogleSheet(DEFAULT_GOOGLE_SHEET_URL);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerConfettiBurst = useCallback(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    if (confettiRafRef.current) {
      cancelAnimationFrame(confettiRafRef.current);
    }

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
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: 7 + Math.random() * 9,
      h: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: 3 + Math.random() * 5,
      vx: -2 + Math.random() * 4,
      rot: Math.random() * Math.PI * 2,
      vRot: -0.09 + Math.random() * 0.18,
    }));

    const start = performance.now();
    const runConfetti = (now: number) => {
      if (now - start > 4500) {
        cCtx.clearRect(0, 0, canvas.width, canvas.height);
        confettiRafRef.current = null;
        return;
      }
      cCtx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;
        cCtx.save();
        cCtx.translate(p.x, p.y);
        cCtx.rotate(p.rot);
        cCtx.fillStyle = p.color;
        cCtx.shadowColor = p.color;
        cCtx.shadowBlur = 8;
        cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        cCtx.restore();
      });
      confettiRafRef.current = requestAnimationFrame(runConfetti);
    };

    confettiRafRef.current = requestAnimationFrame(runConfetti);
  }, []);

  // 5-Second Shuffle & Winner Selection
  const startFiveSecondShuffle = () => {
    if (isShuffling || eligibleCandidates.length === 0) return;

    setIsShuffling(true);
    setDrawnOrder([]);
    setNoShowIds(new Set());

    const durationMs = Math.max(1, shuffleDurationSec) * 1000;
    const startTime = performance.now();
    let lastSwapTime = 0;

    const tick = (now: number) => {
      const elapsed = Math.max(0, now - startTime);
      const remaining = Math.max(0, (durationMs - elapsed) / 1000);
      setShuffleRemainingSec(remaining);

      if (now - lastSwapTime >= 85) {
        lastSwapTime = now;
        const progress = Math.max(0, Math.min(1, elapsed / durationMs));
        setShuffledPool(cryptoShuffle(eligibleCandidates));
        audioRef.current?.playShufflePulse(progress);
      }

      if (elapsed < durationMs) {
        requestAnimationFrame(tick);
      } else {
        const prizeTitle = cleanPrizeLabel(activePrizeColumn);
        const finalShuffled = cryptoShuffle(eligibleCandidates).map((p) => ({
          ...p,
          assignedPrize: prizeTitle,
        }));
        setShuffledPool(finalShuffled);
        setDrawnOrder(finalShuffled);
        setIsShuffling(false);
        setShuffleRemainingSec(0);
        audioRef.current?.playWinnerFanfare();
        triggerConfettiBurst();
      }
    };

    requestAnimationFrame(tick);
  };

  // Compute active primary winners & backup buffer accounting for any No-Shows marked on stage
  const { primaryWinners, backupBuffer, noShowList } = useMemo(() => {
    if (drawnOrder.length === 0) {
      return {
        primaryWinners: [] as Array<{
          participant: RaffleParticipant;
          drawRank: number;
          effectiveSlot: number;
        }>,
        backupBuffer: [] as Array<{
          participant: RaffleParticipant;
          drawRank: number;
          backupIndex: number;
        }>,
        noShowList: [] as Array<{
          participant: RaffleParticipant;
          drawRank: number;
        }>,
      };
    }

    const active: Array<{
      participant: RaffleParticipant;
      drawRank: number;
    }> = [];
    const noShows: Array<{
      participant: RaffleParticipant;
      drawRank: number;
    }> = [];

    drawnOrder.forEach((p, idx) => {
      const item = { participant: p, drawRank: idx + 1 };
      if (noShowIds.has(p.id)) {
        noShows.push(item);
      } else {
        active.push(item);
      }
    });

    const primary = active.slice(0, winnerCount).map((item, idx) => ({
      ...item,
      effectiveSlot: idx + 1,
    }));

    const buffer = active
      .slice(winnerCount, winnerCount + bufferCount)
      .map((item, idx) => ({
        ...item,
        backupIndex: idx + 1,
      }));

    return {
      primaryWinners: primary,
      backupBuffer: buffer,
      noShowList: noShows,
    };
  }, [drawnOrder, noShowIds, winnerCount, bufferCount]);

  const currentPrizeLabel = useMemo(() => {
    if (activePrizeColumn) return cleanPrizeLabel(activePrizeColumn);
    return activeCategory?.label || 'Raffle Prize';
  }, [activePrizeColumn, activeCategory]);

  const getPrizeForParticipant = useCallback(
    (p: RaffleParticipant): string => {
      return p.assignedPrize || currentPrizeLabel;
    },
    [currentPrizeLabel],
  );

  const isWinnerConfirmed = useCallback(
    (p: RaffleParticipant, prizeLabel?: string): boolean => {
      const targetPrize = (
        prizeLabel ?? getPrizeForParticipant(p)
      ).toLowerCase();
      const pName = p.name.toLowerCase();
      const pEmail = p.email.toLowerCase();
      return lockedWinnersHistory.some(
        (lw) =>
          lw.prize.toLowerCase() === targetPrize &&
          (lw.participantId === p.id ||
            lw.name.toLowerCase() === pName ||
            (pEmail && lw.email.toLowerCase() === pEmail)),
      );
    },
    [lockedWinnersHistory, getPrizeForParticipant],
  );

  const toggleConfirmWinner = (p: RaffleParticipant, rankSlot: number) => {
    const catLabel = activeCategory?.label || 'Raffle';
    const prizeLabel = getPrizeForParticipant(p);
    const alreadyConfirmed = isWinnerConfirmed(p, prizeLabel);

    if (alreadyConfirmed) {
      const targetPrize = prizeLabel.toLowerCase();
      const pName = p.name.toLowerCase();
      const pEmail = p.email.toLowerCase();
      setLockedWinnersHistory((prev) =>
        prev.filter(
          (lw) =>
            !(
              lw.prize.toLowerCase() === targetPrize &&
              (lw.participantId === p.id ||
                lw.name.toLowerCase() === pName ||
                (pEmail && lw.email.toLowerCase() === pEmail))
            ),
        ),
      );
    } else {
      const key = `${p.id}::${prizeLabel}`;
      setLockedWinnersHistory((prev) => [
        ...prev,
        {
          key,
          participantId: p.id,
          name: p.name,
          email: p.email,
          category: catLabel,
          prize: prizeLabel,
          rank: rankSlot,
        },
      ]);
      audioRef.current?.playCategoryLoad();
    }
  };

  const toggleNoShow = (participantId: string) => {
    setNoShowIds((prev) => {
      const next = new Set(prev);
      if (next.has(participantId)) {
        next.delete(participantId);
      } else {
        next.add(participantId);
        setLockedWinnersHistory((lockedPrev) =>
          lockedPrev.filter((lw) => lw.participantId !== participantId),
        );
      }
      return next;
    });
  };

  const lockCurrentPrimaryWinners = () => {
    if (primaryWinners.length === 0 || !activeCategory) return;
    const catLabel = activeCategory.label;

    setLockedWinnersHistory((prev) => {
      const next = [...prev];
      primaryWinners.forEach((w) => {
        const prizeLabel = getPrizeForParticipant(w.participant);
        const targetPrize = prizeLabel.toLowerCase();
        const pName = w.participant.name.toLowerCase();
        const pEmail = w.participant.email.toLowerCase();
        const exists = next.some(
          (lw) =>
            lw.prize.toLowerCase() === targetPrize &&
            (lw.participantId === w.participant.id ||
              lw.name.toLowerCase() === pName ||
              (pEmail && lw.email.toLowerCase() === pEmail)),
        );
        if (!exists) {
          next.push({
            key: `${w.participant.id}::${prizeLabel}`,
            participantId: w.participant.id,
            name: w.participant.name,
            email: w.participant.email,
            category: catLabel,
            prize: prizeLabel,
            rank: w.effectiveSlot,
          });
        }
      });
      return next;
    });
    audioRef.current?.playCategoryLoad();
  };

  const exportConfirmedWinnersCSV = () => {
    const lines = ['Name,Prize,Email,Category'];

    if (lockedWinnersHistory.length > 0) {
      lockedWinnersHistory.forEach((lw) => {
        lines.push(
          [
            toCsvField(lw.name),
            toCsvField(lw.prize),
            toCsvField(lw.email),
            toCsvField(lw.category),
          ].join(','),
        );
      });
    } else {
      const catLabel = activeCategory?.label || 'Raffle';
      primaryWinners.forEach((w) => {
        lines.push(
          [
            toCsvField(w.participant.name),
            toCsvField(getPrizeForParticipant(w.participant)),
            toCsvField(w.participant.email),
            toCsvField(catLabel),
          ].join(','),
        );
      });
    }

    const csvContent = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'devfest-mtl-26-confirmed-raffle-winners.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Dynamic grid sizing for Candidate Pool so all chips fit in 1 screen without scrolling
  const poolCols = useMemo(() => {
    const count = displayPool.length;
    if (count <= 8) return 2;
    if (count <= 18) return 3;
    if (count <= 32) return 4;
    if (count <= 55) return 5;
    if (count <= 84) return 6;
    return 7;
  }, [displayPool.length]);

  const poolChipFontSize = useMemo(() => {
    const count = displayPool.length;
    if (count <= 12) return '1.65rem';
    if (count <= 24) return '1.38rem';
    if (count <= 45) return '1.16rem';
    if (count <= 75) return '1.0rem';
    return '0.88rem';
  }, [displayPool.length]);

  // Dynamic font sizing for Winner / Buffer rows based on count (1 to 6)
  const maxRowsInResults = Math.max(
    1,
    primaryWinners.length,
    backupBuffer.length,
  );
  const winnerNameSize =
    maxRowsInResults <= 3
      ? '1.95rem'
      : maxRowsInResults <= 5
        ? '1.6rem'
        : '1.38rem';

  return (
    <div className="crazy-raffle-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800;900&family=Press+Start+2P&family=Rajdhani:wght@600;700&family=Share+Tech+Mono&display=swap');

        .crazy-raffle-root {
          --bg-deep: #090214;
          --bg-panel: rgba(16, 5, 34, 0.88);
          --neon-pink: #ff007f;
          --neon-cyan: #00f0ff;
          --neon-yellow: #ffbe0b;
          --neon-green: #00f59b;
          --text-bright: #ffffff;
          --text-dim: #c4b2e3;
          --font-display: 'Orbitron', sans-serif;
          --font-arcade: 'Press Start 2P', monospace;
          --font-body: 'Rajdhani', sans-serif;
          --font-mono: 'Share Tech Mono', monospace;

          position: fixed;
          inset: 0;
          z-index: 9999;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-deep);
          color: var(--text-bright);
          font-family: var(--font-body);
          user-select: none;
        }

        .crazy-raffle-root * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .crazy-raffle-root .synth-sky {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            #05000c 0%,
            #130429 38%,
            #34094e 58%,
            #701060 68%,
            #120224 68.5%,
            #070110 100%
          );
        }

        .crazy-raffle-root .synth-sun {
          position: absolute;
          left: 50%;
          top: 42%;
          transform: translate(-50%, -50%);
          width: 360px;
          height: 360px;
          border-radius: 50%;
          background: linear-gradient(180deg, #ffea00 0%, #ff7b00 45%, #ff007f 85%, #900058 100%);
          box-shadow: 0 0 60px rgba(255, 0, 127, 0.7);
          opacity: 0.28;
        }

        .crazy-raffle-root .perspective-grid {
          position: absolute;
          left: -50%;
          right: -50%;
          bottom: -25%;
          height: 58%;
          background-image:
            linear-gradient(to right, rgba(255, 0, 127, 0.42) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.36) 2px, transparent 2px);
          background-size: 64px 42px;
          transform: perspective(360px) rotateX(68deg);
          transform-origin: top center;
          animation: crGridTravel 2.2s linear infinite;
        }

        @keyframes crGridTravel {
          0% { background-position: 0 0; }
          100% { background-position: 0 42px; }
        }

        .crazy-raffle-root #confettiCanvas {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 90;
        }

        /* UNIFIED TOP BAR */
        .crazy-raffle-root .top-bar {
          position: relative;
          z-index: 10;
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          background: rgba(9, 2, 20, 0.94);
          border-bottom: 2px solid var(--neon-cyan);
          box-shadow: 0 0 22px rgba(0, 240, 255, 0.32);
          gap: 12px;
        }

        .crazy-raffle-root .brand-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .crazy-raffle-root .brand-title {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 1.35rem;
          letter-spacing: 2px;
          background: linear-gradient(90deg, #ffffff 0%, #00f0ff 50%, #ffbe0b 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          white-space: nowrap;
        }

        /* INLINE 3 CATEGORY TABS */
        .crazy-raffle-root .cat-pills {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .crazy-raffle-root .cat-btn {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 16px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 2px solid rgba(0, 240, 255, 0.32);
          color: #fff;
          font-family: var(--font-display);
          font-size: 0.98rem;
          font-weight: 800;
          letter-spacing: 0.8px;
          transition: all 0.16s ease;
          white-space: nowrap;
        }

        .crazy-raffle-root .cat-btn:hover:not(:disabled) {
          border-color: var(--neon-cyan);
          box-shadow: 0 0 16px rgba(0, 240, 255, 0.4);
        }

        .crazy-raffle-root .cat-btn.active {
          background: linear-gradient(135deg, rgba(255, 0, 127, 0.38) 0%, rgba(0, 240, 255, 0.28) 100%);
          border-color: var(--neon-yellow);
          box-shadow: 0 0 20px rgba(255, 190, 11, 0.5);
        }

        .crazy-raffle-root .cat-badge {
          font-family: var(--font-mono);
          font-size: 0.86rem;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.45);
          color: var(--neon-yellow);
          border: 1px solid rgba(255, 190, 11, 0.5);
        }

        /* CENTER MEGA SHUFFLE BUTTON */
        .crazy-raffle-root .center-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .crazy-raffle-root .btn-shuffle-mega {
          cursor: pointer;
          padding: 11px 28px;
          font-family: var(--font-display);
          font-size: 1.18rem;
          font-weight: 900;
          letter-spacing: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff007f 0%, #ffbe0b 50%, #00f0ff 100%);
          background-size: 200% auto;
          color: #090117;
          border: 2px solid #ffffff;
          box-shadow: 0 0 22px rgba(255, 0, 127, 0.8);
          animation: crGradientShift 3s linear infinite;
          white-space: nowrap;
          text-transform: uppercase;
        }

        .crazy-raffle-root .btn-shuffle-mega:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        @keyframes crGradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* RIGHT CONTROLS */
        .crazy-raffle-root .right-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .crazy-raffle-root .top-btn {
          cursor: pointer;
          padding: 9px 14px;
          border-radius: 8px;
          border: 1px solid var(--neon-cyan);
          background: rgba(0, 240, 255, 0.12);
          color: var(--neon-cyan);
          font-family: var(--font-display);
          font-size: 0.84rem;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .crazy-raffle-root .top-btn:hover:not(:disabled) {
          background: var(--neon-cyan);
          color: #090214;
        }

        .crazy-raffle-root .top-btn.green {
          border-color: var(--neon-green);
          background: rgba(0, 245, 155, 0.18);
          color: var(--neon-green);
        }

        .crazy-raffle-root .top-btn.green:hover:not(:disabled) {
          background: var(--neon-green);
          color: #04130c;
        }

        /* PACKT BOOK TITLE SELECTOR BAR */
        .crazy-raffle-root .book-selector-bar {
          position: relative;
          z-index: 9;
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(15, 4, 32, 0.92);
          border-bottom: 1px solid rgba(255, 190, 11, 0.45);
          overflow-x: auto;
        }

        .crazy-raffle-root .book-pill {
          cursor: pointer;
          padding: 7px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
          font-family: var(--font-mono);
          font-size: 0.9rem;
          font-weight: 700;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .crazy-raffle-root .book-pill.active {
          background: var(--neon-yellow);
          color: #090214;
          border-color: #fff;
          box-shadow: 0 0 14px rgba(255, 190, 11, 0.7);
        }

        /* MAIN STAGE AREA: FITS REMAINING 100VH WITH ZERO SCROLLING */
        .crazy-raffle-root .stage-body {
          position: relative;
          z-index: 5;
          flex: 1;
          min-height: 0;
          padding: 14px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow: hidden;
        }

        /* PRIZE HEADER BANNER */
        .crazy-raffle-root .prize-banner {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          border-radius: 12px;
          background: rgba(18, 6, 38, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.4);
          gap: 16px;
        }

        .crazy-raffle-root .prize-banner-title {
          font-family: var(--font-display);
          font-size: 1.45rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: 1.2px;
        }

        .crazy-raffle-root .prize-banner-stats {
          font-family: var(--font-mono);
          font-size: 1.12rem;
          color: var(--neon-cyan);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* CANDIDATE POOL AUTO-FIT GRID */
        .crazy-raffle-root .pool-container {
          flex: 1;
          min-height: 0;
          background: var(--bg-panel);
          border: 2px solid rgba(0, 240, 255, 0.4);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .crazy-raffle-root .pool-grid-autofit {
          flex: 1;
          min-height: 0;
          display: grid;
          gap: 10px;
          align-content: stretch;
          overflow: hidden;
        }

        .crazy-raffle-root .candidate-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(0, 240, 255, 0.35);
          border-left: 5px solid var(--neon-cyan);
          font-weight: 800;
          min-height: 0;
          overflow: hidden;
        }

        .crazy-raffle-root .candidate-chip.shuffling {
          border-color: var(--neon-pink);
          border-left-color: var(--neon-yellow);
          background: linear-gradient(90deg, rgba(255, 0, 127, 0.3), rgba(0, 240, 255, 0.18));
          box-shadow: 0 0 14px rgba(255, 0, 127, 0.4);
        }

        /* WINNERS + BUFFER 2-COLUMN ZERO-SCROLL STAGE */
        .crazy-raffle-root .results-grid {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 18px;
          overflow: hidden;
        }

        .crazy-raffle-root .stage-col {
          min-height: 0;
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          padding: 14px 18px;
          background: rgba(16, 5, 34, 0.94);
          overflow: hidden;
        }

        .crazy-raffle-root .stage-col.winners {
          border: 2px solid var(--neon-yellow);
          box-shadow: 0 0 28px rgba(255, 190, 11, 0.25);
        }

        .crazy-raffle-root .stage-col.buffer {
          border: 2px solid var(--neon-cyan);
          box-shadow: 0 0 24px rgba(0, 240, 255, 0.2);
        }

        .crazy-raffle-root .col-header {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          margin-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }

        .crazy-raffle-root .col-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .crazy-raffle-root .cards-stack {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          justify-content: space-evenly;
          overflow: hidden;
        }

        .crazy-raffle-root .stage-card {
          flex: 1;
          min-height: 0;
          max-height: 110px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 10px 18px;
          border-radius: 12px;
          background: linear-gradient(90deg, rgba(255, 190, 11, 0.2) 0%, rgba(255, 0, 127, 0.14) 100%);
          border: 2px solid rgba(255, 190, 11, 0.65);
          transition: all 0.16s ease;
        }

        .crazy-raffle-root .stage-card.backup {
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.5);
        }

        .crazy-raffle-root .stage-card.confirmed {
          background: linear-gradient(90deg, rgba(0, 245, 155, 0.28) 0%, rgba(0, 240, 255, 0.18) 100%);
          border: 2px solid var(--neon-green);
          box-shadow: 0 0 18px rgba(0, 245, 155, 0.35);
        }

        .crazy-raffle-root .slot-pill {
          font-family: var(--font-arcade);
          font-size: 1rem;
          padding: 10px 14px;
          border-radius: 8px;
          background: var(--neon-yellow);
          color: #090214;
          font-weight: 900;
          white-space: nowrap;
        }

        .crazy-raffle-root .slot-pill.confirmed {
          background: var(--neon-green);
          color: #04130c;
        }

        .crazy-raffle-root .slot-pill.backup {
          font-size: 0.85rem;
          background: rgba(0, 240, 255, 0.22);
          color: var(--neon-cyan);
          border: 1px solid var(--neon-cyan);
        }

        .crazy-raffle-root .card-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .crazy-raffle-root .btn-confirm {
          cursor: pointer;
          padding: 10px 18px;
          border-radius: 8px;
          border: 2px solid var(--neon-green);
          background: rgba(0, 245, 155, 0.18);
          color: var(--neon-green);
          font-family: var(--font-mono);
          font-size: 1rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .crazy-raffle-root .btn-confirm:hover,
        .crazy-raffle-root .btn-confirm.active {
          background: var(--neon-green);
          color: #04130c;
          box-shadow: 0 0 14px rgba(0, 245, 155, 0.7);
        }

        .crazy-raffle-root .btn-noshow {
          cursor: pointer;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid rgba(234, 67, 53, 0.8);
          background: rgba(234, 67, 53, 0.18);
          color: #ff8a80;
          font-family: var(--font-mono);
          font-size: 0.95rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .crazy-raffle-root .btn-noshow:hover {
          background: #ea4335;
          color: #fff;
        }

        /* SETUP & CONFIRMED WINNERS MODAL OVERLAY */
        .crazy-raffle-root .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          background: rgba(5, 0, 14, 0.82);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .crazy-raffle-root .modal-panel {
          width: 100%;
          max-width: 780px;
          max-height: 88vh;
          overflow-y: auto;
          background: #140529;
          border: 2px solid var(--neon-cyan);
          border-radius: 16px;
          padding: 22px 26px;
          box-shadow: 0 0 40px rgba(0, 240, 255, 0.35);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
      `}</style>

      <div className="synth-sky" aria-hidden="true">
        <div className="synth-sun" />
        <div className="perspective-grid" />
      </div>

      <canvas ref={confettiCanvasRef} id="confettiCanvas" />

      {/* 1. UNIFIED TOP BAR */}
      <header className="top-bar">
        <div className="brand-left">
          <span className="brand-title">🎲 CRAZY RAFFLE</span>

          {/* 3 MAIN CATEGORY TABS */}
          <div className="cat-pills">
            {categories.map((cat) => {
              const isActive = activeCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`cat-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectCategory(cat)}
                  disabled={isShuffling}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.shortLabel}</span>
                  <span className="cat-badge">
                    {cat.id === 'packt'
                      ? `${cat.columns.length} BOOKS`
                      : `${cat.totalPrizes}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CENTER SHUFFLE ACTION */}
        <div className="center-actions">
          <button
            type="button"
            className="btn-shuffle-mega"
            disabled={isShuffling || eligibleCandidates.length === 0}
            onClick={startFiveSecondShuffle}
          >
            {isShuffling
              ? `⚡ SHUFFLING... ${shuffleRemainingSec.toFixed(1)}s`
              : drawnOrder.length > 0
                ? `🔀 RESHUFFLE (${shuffleDurationSec}s)`
                : `🎲 SHUFFLE ${eligibleCandidates.length} NAMES (${shuffleDurationSec}s)`}
          </button>

          {drawnOrder.length > 0 && !isShuffling && (
            <>
              <button
                type="button"
                className="top-btn green"
                onClick={lockCurrentPrimaryWinners}
              >
                ✅ CONFIRM ALL ({primaryWinners.length})
              </button>
              <button
                type="button"
                className="top-btn"
                onClick={() => {
                  setDrawnOrder([]);
                  setNoShowIds(new Set());
                }}
              >
                👥 POOL ({eligibleCandidates.length})
              </button>
            </>
          )}
        </div>

        {/* RIGHT CONTROLS */}
        <div className="right-controls">
          <button
            type="button"
            className="top-btn green"
            disabled={
              lockedWinnersHistory.length === 0 && primaryWinners.length === 0
            }
            onClick={exportConfirmedWinnersCSV}
            title="Export Confirmed Winners CSV (Name, Prize, Email)"
          >
            📥 EXPORT CSV ({lockedWinnersHistory.length})
          </button>
          <a
            href={ENTRY_GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="top-btn"
          >
            📝 FORM
          </a>
          <button
            type="button"
            className="top-btn"
            onClick={() => setSoundEnabled((s) => !s)}
            title="Toggle 1980s Synthwave Audio"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            type="button"
            className="top-btn"
            onClick={() => setShowSetupModal(true)}
            title="Sheet Sync, Demo Data & Confirmed Winners List"
          >
            ⚙️ SETUP
          </button>
        </div>
      </header>

      {/* 2. PACKT BOOK SELECTOR BAR (INDIVIDUAL BOOKS ONLY, 1-3 COPIES EACH) */}
      {activeCategory && activeCategory.columns.length > 1 && (
        <div className="book-selector-bar">
          {activeCategory.columns.map((col) => {
            const isSelected = activePrizeColumn === col;
            const prizeName = cleanPrizeLabel(col).toLowerCase();
            const confirmedForBook = lockedWinnersHistory.filter(
              (lw) => lw.prize.toLowerCase() === prizeName,
            ).length;
            return (
              <button
                key={col}
                type="button"
                className={`book-pill ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectSubColumn(col)}
                disabled={isShuffling}
              >
                📘 {shortBookTitle(col)}
                {confirmedForBook > 0 ? ` ✅(${confirmedForBook})` : ''}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. SINGLE-SCREEN ZERO-SCROLL STAGE */}
      <main className="stage-body">
        {/* PRIZE STATUS BANNER */}
        <div className="prize-banner">
          <div className="prize-banner-title">
            {activeCategory?.icon} {currentPrizeLabel.toUpperCase()}
          </div>
          <div className="prize-banner-stats">
            <span>
              ELIGIBLE (YES):{' '}
              <strong style={{ color: '#fff', fontSize: '1.3rem' }}>
                {eligibleCandidates.length}
              </strong>
            </span>
            <span>·</span>
            <span style={{ color: 'var(--neon-yellow)' }}>
              WINNERS: <strong>{winnerCount}</strong>
            </span>
            <span>·</span>
            <span style={{ color: 'var(--neon-green)' }}>
              NO-SHOW BUFFER: <strong>{bufferCount}</strong>
            </span>
          </div>
        </div>

        {/* VIEW A: WINNERS + BACKUP BUFFER (SIDE-BY-SIDE, ZERO SCROLL) */}
        {drawnOrder.length > 0 && !isShuffling ? (
          <div className="results-grid">
            {/* LEFT: SELECTED WINNERS */}
            <section className="stage-col winners">
              <div className="col-header">
                <span
                  className="col-title"
                  style={{ color: 'var(--neon-yellow)' }}
                >
                  🏆 SELECTED WINNERS ({primaryWinners.length})
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.95rem',
                    color: 'var(--text-dim)',
                  }}
                >
                  ✅ Confirm to lock · ❌ No-Show promotes Backup #1
                </span>
              </div>

              <div className="cards-stack">
                {primaryWinners.map((w) => {
                  const prizeLabel = getPrizeForParticipant(w.participant);
                  const confirmed = isWinnerConfirmed(
                    w.participant,
                    prizeLabel,
                  );
                  return (
                    <div
                      key={w.participant.id}
                      className={`stage-card ${confirmed ? 'confirmed' : ''}`}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          minWidth: 0,
                        }}
                      >
                        <span
                          className={`slot-pill ${confirmed ? 'confirmed' : ''}`}
                        >
                          {confirmed ? '✓' : `#${w.effectiveSlot}`}
                        </span>
                        <div
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: winnerNameSize,
                            fontWeight: 900,
                            color: '#fff',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {w.participant.name}
                        </div>
                      </div>

                      <div className="card-actions">
                        <button
                          type="button"
                          className={`btn-confirm ${confirmed ? 'active' : ''}`}
                          onClick={() =>
                            toggleConfirmWinner(w.participant, w.effectiveSlot)
                          }
                        >
                          {confirmed ? '✅ CONFIRMED' : '✅ CONFIRM'}
                        </button>
                        <button
                          type="button"
                          className="btn-noshow"
                          onClick={() => toggleNoShow(w.participant.id)}
                        >
                          NO-SHOW ❌
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* RIGHT: NO-SHOW BACKUP BUFFER */}
            <section className="stage-col buffer">
              <div className="col-header">
                <span
                  className="col-title"
                  style={{ color: 'var(--neon-cyan)' }}
                >
                  🛡️ NO-SHOW BACKUP BUFFER ({backupBuffer.length})
                </span>
                {noShowList.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {noShowList.map((n) => (
                      <button
                        key={n.participant.id}
                        type="button"
                        onClick={() => toggleNoShow(n.participant.id)}
                        title="Click to restore No-Show"
                        style={{
                          cursor: 'pointer',
                          padding: '3px 8px',
                          borderRadius: 999,
                          border: '1px solid rgba(234,67,53,0.6)',
                          background: 'rgba(234,67,53,0.15)',
                          color: '#ff8a80',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          textDecoration: 'line-through',
                        }}
                      >
                        {n.participant.name} ↩
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="cards-stack">
                {backupBuffer.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.1rem',
                      color: 'var(--text-dim)',
                    }}
                  >
                    No additional backup candidates in pool.
                  </div>
                ) : (
                  backupBuffer.map((b) => {
                    const prizeLabel = getPrizeForParticipant(b.participant);
                    const confirmed = isWinnerConfirmed(
                      b.participant,
                      prizeLabel,
                    );
                    return (
                      <div
                        key={b.participant.id}
                        className={`stage-card backup ${confirmed ? 'confirmed' : ''}`}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            minWidth: 0,
                          }}
                        >
                          <span className="slot-pill backup">
                            B#{b.backupIndex}
                          </span>
                          <div
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: winnerNameSize,
                              fontWeight: 800,
                              color: '#fff',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {b.participant.name}
                          </div>
                        </div>

                        <div className="card-actions">
                          <button
                            type="button"
                            className={`btn-confirm ${confirmed ? 'active' : ''}`}
                            onClick={() =>
                              toggleConfirmWinner(
                                b.participant,
                                winnerCount + b.backupIndex,
                              )
                            }
                          >
                            {confirmed ? '✅ CONFIRMED' : '✅ CONFIRM'}
                          </button>
                          <button
                            type="button"
                            className="btn-noshow"
                            onClick={() => toggleNoShow(b.participant.id)}
                          >
                            SKIP ❌
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        ) : (
          /* VIEW B: ON-SCREEN CANDIDATE POOL GRID (AUTO-FITTED, ZERO SCROLL) */
          <div className="pool-container">
            {displayPool.length === 0 ? (
              <div
                style={{
                  margin: 'auto',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <p
                  style={{
                    fontSize: '1.35rem',
                    color: 'var(--text-dim)',
                    marginBottom: 18,
                  }}
                >
                  {rows.length === 0
                    ? `Waiting for responses in Google Sheet (${statusMsg})`
                    : 'No remaining eligible "Yes" responses for this prize.'}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    justifyContent: 'center',
                  }}
                >
                  <button
                    type="button"
                    className="top-btn"
                    style={{ fontSize: '1rem', padding: '12px 22px' }}
                    onClick={() => void fetchGoogleSheet()}
                  >
                    🔄 SYNC GOOGLE SHEET
                  </button>
                  <button
                    type="button"
                    className="top-btn green"
                    style={{ fontSize: '1rem', padding: '12px 22px' }}
                    onClick={() =>
                      ingestCSVText(DEMO_RAFFLE_CSV, 'DEMO RAFFLE SHEET LOADED')
                    }
                  >
                    ⚡ LOAD DEMO PARTICIPANTS
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="pool-grid-autofit"
                style={{
                  gridTemplateColumns: `repeat(${poolCols}, minmax(0, 1fr))`,
                }}
              >
                {displayPool.map((person, idx) => (
                  <div
                    key={person.id}
                    className={`candidate-chip ${
                      isShuffling ? 'shuffling' : ''
                    }`}
                    style={{ fontSize: poolChipFontSize }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85em',
                        color: 'var(--neon-yellow)',
                        minWidth: 32,
                      }}
                    >
                      #{idx + 1}
                    </span>
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {person.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* SETUP & CONFIRMED WINNERS MODAL */}
      {showSetupModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowSetupModal(false)}
        >
          <div
            className="modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(0,240,255,0.3)',
                paddingBottom: 12,
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  color: 'var(--neon-cyan)',
                }}
              >
                ⚙️ RAFFLE SETUP &amp; CONFIRMED WINNERS
              </h2>
              <button
                type="button"
                className="top-btn"
                onClick={() => setShowSetupModal(false)}
              >
                ✕ CLOSE
              </button>
            </div>

            {/* GOOGLE SHEET SYNC */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label
                htmlFor="raffleSheetUrl"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  color: 'var(--text-dim)',
                }}
              >
                GOOGLE SHEET URL (DEFAULT: GID=1616495823)
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id="raffleSheetUrl"
                  type="text"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--neon-cyan)',
                    background: '#070112',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.95rem',
                  }}
                />
                <button
                  type="button"
                  className="top-btn"
                  disabled={isLoadingSheet}
                  onClick={() => void fetchGoogleSheet()}
                >
                  {isLoadingSheet ? '...' : '🔄 SYNC'}
                </button>
                <button
                  type="button"
                  className="top-btn"
                  onClick={() =>
                    ingestCSVText(DEMO_RAFFLE_CSV, 'DEMO RAFFLE SHEET LOADED')
                  }
                >
                  ⚡ DEMO DATA
                </button>
                <button
                  type="button"
                  className="top-btn"
                  onClick={() => setShowPasteBox((v) => !v)}
                >
                  📂 CSV
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.tsv,.txt"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      ingestCSVText(
                        String(ev.target?.result || ''),
                        `FILE "${file.name.toUpperCase()}" LOADED`,
                      );
                    };
                    reader.readAsText(file);
                  }}
                />
              </div>

              {showPasteBox && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <textarea
                    rows={4}
                    placeholder="Paste CSV or TSV rows here..."
                    value={rawCsvText}
                    onChange={(e) => setRawCsvText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 10,
                      borderRadius: 8,
                      border: '1px solid var(--neon-cyan)',
                      background: '#070112',
                      color: '#fff',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                  <button
                    type="button"
                    className="top-btn"
                    onClick={() => {
                      if (!rawCsvText.trim()) {
                        fileInputRef.current?.click();
                        return;
                      }
                      ingestCSVText(rawCsvText, 'PASTED DATA LOADED');
                      setShowPasteBox(false);
                    }}
                  >
                    PARSE / UPLOAD FILE
                  </button>
                </div>
              )}

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.88rem',
                  color:
                    statusType === 'error'
                      ? '#ff8a80'
                      : statusType === 'success'
                        ? 'var(--neon-green)'
                        : 'var(--neon-cyan)',
                }}
              >
                {statusMsg}
              </div>
            </div>

            {/* TUNING ROW */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 12,
              }}
            >
              <div>
                <label
                  htmlFor="winnerCountModal"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: 'var(--text-dim)',
                    marginBottom: 4,
                  }}
                >
                  PRIZES / WINNERS
                </label>
                <input
                  id="winnerCountModal"
                  type="number"
                  min={1}
                  max={50}
                  value={winnerCount}
                  onChange={(e) => {
                    const val = Math.max(1, Number(e.target.value) || 1);
                    setWinnerCount(val);
                    setBufferCount(val);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: '1px solid var(--neon-cyan)',
                    background: '#070112',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="bufferCountModal"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: 'var(--text-dim)',
                    marginBottom: 4,
                  }}
                >
                  NO-SHOW BUFFER
                </label>
                <input
                  id="bufferCountModal"
                  type="number"
                  min={0}
                  max={50}
                  value={bufferCount}
                  onChange={(e) =>
                    setBufferCount(Math.max(0, Number(e.target.value) || 0))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: '1px solid var(--neon-cyan)',
                    background: '#070112',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="shuffleSecModal"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: 'var(--text-dim)',
                    marginBottom: 4,
                  }}
                >
                  SHUFFLE SECONDS ({shuffleDurationSec}s)
                </label>
                <input
                  id="shuffleSecModal"
                  type="range"
                  min={2}
                  max={10}
                  value={shuffleDurationSec}
                  onChange={(e) =>
                    setShuffleDurationSec(Number(e.target.value) || 5)
                  }
                  style={{ width: '100%', marginTop: 10, accentColor: '#ff007f' }}
                />
              </div>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                color: 'var(--neon-cyan)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={excludePastWinners}
                onChange={(e) => setExcludePastWinners(e.target.checked)}
              />
              Exclude confirmed winners from subsequent prize draws
            </label>

            {/* CONFIRMED WINNERS LIST */}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.15)',
                paddingTop: 14,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.05rem',
                    color: 'var(--neon-green)',
                  }}
                >
                  ✅ CONFIRMED WINNERS ({lockedWinnersHistory.length})
                </h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="top-btn green"
                    disabled={lockedWinnersHistory.length === 0}
                    onClick={exportConfirmedWinnersCSV}
                  >
                    📥 EXPORT CSV (Name, Prize, Email)
                  </button>
                  {lockedWinnersHistory.length > 0 && (
                    <button
                      type="button"
                      className="top-btn"
                      onClick={() => setLockedWinnersHistory([])}
                    >
                      CLEAR ALL
                    </button>
                  )}
                </div>
              </div>

              {lockedWinnersHistory.length === 0 ? (
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    color: 'var(--text-dim)',
                  }}
                >
                  No confirmed winners yet. Click <strong>✅ CONFIRM</strong>{' '}
                  next to winners on stage to lock them in.
                </p>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    maxHeight: 220,
                    overflowY: 'auto',
                  }}
                >
                  {lockedWinnersHistory.map((lw) => (
                    <div
                      key={lw.key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: 'rgba(0,245,155,0.1)',
                        border: '1px solid rgba(0,245,155,0.4)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <div>
                        <strong style={{ color: '#fff' }}>{lw.name}</strong> ·{' '}
                        <span style={{ color: 'var(--neon-cyan)' }}>
                          {lw.prize}
                        </span>
                        {lw.email ? ` · ${lw.email}` : ''}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setLockedWinnersHistory((prev) =>
                            prev.filter((item) => item.key !== lw.key),
                          )
                        }
                        style={{
                          cursor: 'pointer',
                          background: 'transparent',
                          border: '1px solid #ea4335',
                          color: '#ff8a80',
                          borderRadius: 4,
                          padding: '2px 8px',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
