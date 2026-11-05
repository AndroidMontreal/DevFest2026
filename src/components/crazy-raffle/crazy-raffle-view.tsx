'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1D04JStTF_TwXjcHKKTKpBaAH5FZNzMHyVyKUebZXU1U/edit?resourcekey=&gid=1616495823#gid=1616495823';

const ENTRY_GOOGLE_FORM_URL = 'https://forms.gle/uDH1NmnFMeqgkCQ16';

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
  icon: string;
  badgeColor: string;
  columns: string[];
  totalPrizes: number;
}

class SynthRaffleAudio {
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

  stepCounter = 0;
  noiseBuffer: AudioBuffer | null = null;

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

    // 1980s Outrun 4-chord progression (Am -> F -> C -> G) shifting across the 5s shuffle
    const chordBank = [
      { bass: 55.0, notes: [220.0, 261.63, 329.63, 440.0, 523.25, 659.25, 880.0] }, // A minor
      { bass: 43.65, notes: [174.61, 220.0, 261.63, 349.23, 440.0, 523.25, 698.46] }, // F major
      { bass: 65.41, notes: [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5] }, // C major
      { bass: 49.0, notes: [196.0, 246.94, 293.66, 392.0, 493.88, 587.33, 783.99] }, // G major
    ];
    const safeProgress = Math.max(0, Math.min(1, progress));
    const chordIdx = Math.max(0, Math.min(3, Math.floor(safeProgress * 4)));
    const chord = chordBank[chordIdx] || chordBank[0];

    // 1. Detuned 80s Polysynth Arpeggio (Saw + Pulse through Resonant Lowpass Filter)
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
    osc2.frequency.setValueAtTime(arpFreq * 1.006, now); // Classic 80s chorus detune

    filter.type = 'lowpass';
    const cutoff = 650 + progress * 4200 + Math.random() * 600;
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

    // 2. Pumping 80s Analog Sub-Bass on even steps
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

    // 3. 1980s Simmons Electronic Laser Tom / Gated Snare Accents
    if (step % 4 === 0) {
      // Punchy 80s electronic kick/tom pitch drop
      const tomOsc = this.ctx.createOscillator();
      const tomGain = this.ctx.createGain();
      tomOsc.type = 'triangle';
      const startPitch = 190 + Math.random() * 140;
      tomOsc.frequency.setValueAtTime(startPitch, now);
      tomOsc.frequency.exponentialRampToValueAtTime(48, now + 0.09);

      tomGain.gain.setValueAtTime(0.18, now);
      tomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

      tomOsc.connect(tomGain);
      tomGain.connect(this.ctx.destination);
      tomOsc.start(now);
      tomOsc.stop(now + 0.1);
    } else if (step % 4 === 2) {
      // 80s Gated Reverb Snare / Hi-Hat Noise Burst
      const noiseBuf = this.getNoiseBuffer();
      if (noiseBuf) {
        const noiseSrc = this.ctx.createBufferSource();
        const bandpass = this.ctx.createBiquadFilter();
        const noiseGain = this.ctx.createGain();

        noiseSrc.buffer = noiseBuf;
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(1800 + Math.random() * 1200, now);
        bandpass.Q.setValueAtTime(1.2, now);

        noiseGain.gain.setValueAtTime(0.09, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        noiseSrc.connect(bandpass);
        bandpass.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noiseSrc.start(now);
        noiseSrc.stop(now + 0.085);
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

function cryptoShuffle<T>(items: T[]): T[] {
  const arr = [...items];
  const n = arr.length;
  if (n <= 1) return arr;

  const randBuf = new Uint32Array(n);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(randBuf);
  } else {
    for (let i = 0; i < n; i++) {
      randBuf[i] = Math.floor(Math.random() * 0xffffffff);
    }
  }

  for (let i = n - 1; i > 0; i--) {
    const j = randBuf[i] % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function assignPacktBooksToShuffledOrder(
  shuffled: RaffleParticipant[],
  prizeColumns: string[],
): RaffleParticipant[] {
  if (prizeColumns.length <= 1) {
    const singleLabel = prizeColumns[0] ? cleanPrizeLabel(prizeColumns[0]) : '';
    return shuffled.map((p) => ({
      ...p,
      assignedPrize: singleLabel || p.matchedColumns.map(cleanPrizeLabel).join(' / '),
    }));
  }

  // Track remaining copies of each book in this category
  const remainingInventory: Record<string, number> = {};
  prizeColumns.forEach((col) => {
    remainingInventory[col] = parsePrizeCountFromHeader(col);
  });

  return shuffled.map((p) => {
    // Find a book this participant selected "Yes" to that still has inventory
    const availableMatch = p.matchedColumns.find(
      (col) => (remainingInventory[col] || 0) > 0,
    );
    if (availableMatch) {
      remainingInventory[availableMatch] -= 1;
      return {
        ...p,
        assignedPrize: cleanPrizeLabel(availableMatch),
      };
    }
    // For backup buffer participants (after initial inventory is assigned), show the books they opted into
    return {
      ...p,
      assignedPrize: p.matchedColumns.map(cleanPrizeLabel).join(' · '),
    };
  });
}

function toCsvField(val: string | undefined): string {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

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
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [rawCsvText, setRawCsvText] = useState('');

  // Category & Sub-Prize Selection
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('jetbrains');
  const [selectedSubColumn, setSelectedSubColumn] = useState<string>('__ALL_IN_CATEGORY__');

  // Winner & Buffer Counts + Shuffle Settings
  const [winnerCount, setWinnerCount] = useState<number>(6);
  const [bufferCount, setBufferCount] = useState<number>(6);
  const [shuffleDurationSec, setShuffleDurationSec] = useState<number>(5);
  const [excludePastWinners, setExcludePastWinners] = useState<boolean>(true);
  const [deckCollapsed, setDeckCollapsed] = useState<boolean>(false);
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

  // Group prize columns into the 3 main categories (JetBrains, Kodeco, Packt Books) + any custom columns
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

  const activeTargetColumns = useMemo<string[]>(() => {
    if (!activeCategory) return [];
    if (
      selectedSubColumn !== '__ALL_IN_CATEGORY__' &&
      activeCategory.columns.includes(selectedSubColumn)
    ) {
      return [selectedSubColumn];
    }
    return activeCategory.columns;
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

  // Eligible participants who answered "Yes" to the selected category/prize
  const eligibleCandidates = useMemo<RaffleParticipant[]>(() => {
    if (!nameColumn || rows.length === 0 || activeTargetColumns.length === 0) {
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

      const matchedCols = activeTargetColumns.filter((col) =>
        isAffirmativePrizeCell(row[col]),
      );
      if (matchedCols.length === 0) return;

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
        matchedColumns: matchedCols,
        row,
      });
    });

    return list;
  }, [
    nameColumn,
    rows,
    activeTargetColumns,
    extractRowEmail,
    excludePastWinners,
    lockedWinnersHistory,
  ]);

  const displayPool = isShuffling ? shuffledPool : eligibleCandidates;

  const handleSelectCategory = (cat: MainCategoryGroup) => {
    if (isShuffling) return;
    setSelectedCategoryId(cat.id);
    setSelectedSubColumn('__ALL_IN_CATEGORY__');
    setWinnerCount(cat.totalPrizes);
    setBufferCount(cat.totalPrizes);
    setDrawnOrder([]);
    setNoShowIds(new Set());
    audioRef.current?.playCategoryLoad();
  };

  const handleSelectSubColumn = (col: string) => {
    if (isShuffling || !activeCategory) return;
    setSelectedSubColumn(col);
    if (col === '__ALL_IN_CATEGORY__') {
      setWinnerCount(activeCategory.totalPrizes);
      setBufferCount(activeCategory.totalPrizes);
    } else {
      const count = parsePrizeCountFromHeader(col);
      setWinnerCount(count);
      setBufferCount(count);
    }
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

      // Set initial category prize count from first detected category
      const firstJetbrains = parsedHeaders.find((h) => /jetbrain/i.test(h));
      if (firstJetbrains) {
        const count = parsePrizeCountFromHeader(firstJetbrains);
        setSelectedCategoryId('jetbrains');
        setSelectedSubColumn('__ALL_IN_CATEGORY__');
        setWinnerCount(count);
        setBufferCount(count);
      }

      setStatusMsg(
        `${sourceLabel} // ${records.length} RESPONSES & ${parsedHeaders.length} COLUMNS READY`,
      );
      setStatusType('success');
    },
    [],
  );

  const fetchGoogleSheet = useCallback(
    async (urlOverride?: string) => {
      const targetUrl = (urlOverride ?? sheetUrl).trim() || DEFAULT_GOOGLE_SHEET_URL;
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
          `LIVE STREAM NOTICE // ${errMsg}. Make sure the sheet is shared as "Anyone with the link can view" or click LOAD DEMO / CSV.`,
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

      // Every ~85ms during the 5-second shuffle, mix all names on screen & play synth pulse
      if (now - lastSwapTime >= 85) {
        lastSwapTime = now;
        const progress = Math.max(0, Math.min(1, elapsed / durationMs));
        setShuffledPool(cryptoShuffle(eligibleCandidates));
        audioRef.current?.playShufflePulse(progress);
      }

      if (elapsed < durationMs) {
        requestAnimationFrame(tick);
      } else {
        // Final cryptographically random order
        const finalShuffled = assignPacktBooksToShuffledOrder(
          cryptoShuffle(eligibleCandidates),
          activeTargetColumns,
        );
        setShuffledPool(finalShuffled);
        setDrawnOrder(finalShuffled);
        setIsShuffling(false);
        setShuffleRemainingSec(0);
        audioRef.current?.playWinnerFanfare();
        triggerConfettiBurst();
        setStatusMsg(
          `SHUFFLE COMPLETE // TOP ${Math.min(winnerCount, finalShuffled.length)} WINNERS + ${Math.max(0, Math.min(bufferCount, finalShuffled.length - winnerCount))} BACKUP BUFFER READY`,
        );
        setStatusType('success');
      }
    };

    requestAnimationFrame(tick);
  };

  // Compute active primary winners & backup buffer accounting for any No-Shows marked on stage
  const { primaryWinners, backupBuffer, remainingStandby, noShowList } =
    useMemo(() => {
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
          remainingStandby: [] as Array<{
            participant: RaffleParticipant;
            drawRank: number;
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

      // Re-assign Packt books dynamically among active (non-no-show) participants in rank order
      const reassignedParticipants = assignPacktBooksToShuffledOrder(
        active.map((a) => a.participant),
        activeTargetColumns,
      );

      const enrichedActive = active.map((a, i) => ({
        participant: reassignedParticipants[i],
        drawRank: a.drawRank,
      }));

      const primary = enrichedActive
        .slice(0, winnerCount)
        .map((item, idx) => ({
          ...item,
          effectiveSlot: idx + 1,
        }));

      const buffer = enrichedActive
        .slice(winnerCount, winnerCount + bufferCount)
        .map((item, idx) => ({
          ...item,
          backupIndex: idx + 1,
        }));

      const standby = enrichedActive.slice(winnerCount + bufferCount);

      return {
        primaryWinners: primary,
        backupBuffer: buffer,
        remainingStandby: standby,
        noShowList: noShows,
      };
    }, [drawnOrder, noShowIds, winnerCount, bufferCount, activeTargetColumns]);

  const getCategoryLabel = useCallback(() => {
    if (!activeCategory) return 'Raffle';
    return selectedSubColumn === '__ALL_IN_CATEGORY__'
      ? activeCategory.label
      : cleanPrizeLabel(selectedSubColumn);
  }, [activeCategory, selectedSubColumn]);

  const getPrizeForParticipant = useCallback(
    (p: RaffleParticipant): string => {
      if (p.assignedPrize) return p.assignedPrize;
      if (selectedSubColumn !== '__ALL_IN_CATEGORY__') {
        return cleanPrizeLabel(selectedSubColumn);
      }
      if (activeCategory && activeCategory.columns.length === 1) {
        return cleanPrizeLabel(activeCategory.columns[0]);
      }
      return activeCategory?.label || 'Raffle Prize';
    },
    [activeCategory, selectedSubColumn],
  );

  const isWinnerConfirmed = useCallback(
    (p: RaffleParticipant, prizeLabel?: string): boolean => {
      const targetPrize = (prizeLabel ?? getPrizeForParticipant(p)).toLowerCase();
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

  const toggleConfirmWinner = (
    p: RaffleParticipant,
    rankSlot: number,
  ) => {
    const catLabel = getCategoryLabel();
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
      setStatusMsg(
        `UNCONFIRMED "${p.name.toUpperCase()}" FOR "${prizeLabel.toUpperCase()}"`,
      );
      setStatusType('info');
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
      setStatusMsg(
        `CONFIRMED WINNER // ${p.name.toUpperCase()} → ${prizeLabel.toUpperCase()}`,
      );
      setStatusType('success');
    }
  };

  const toggleNoShow = (participantId: string) => {
    setNoShowIds((prev) => {
      const next = new Set(prev);
      if (next.has(participantId)) {
        next.delete(participantId);
      } else {
        next.add(participantId);
        // If marked as No-Show, ensure they are not left confirmed for this draw
        setLockedWinnersHistory((lockedPrev) =>
          lockedPrev.filter((lw) => lw.participantId !== participantId),
        );
      }
      return next;
    });
  };

  const lockCurrentPrimaryWinners = () => {
    if (primaryWinners.length === 0 || !activeCategory) return;
    const catLabel = getCategoryLabel();

    let addedCount = 0;
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
          addedCount++;
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
    setStatusMsg(
      addedCount > 0
        ? `CONFIRMED ${addedCount} NEW WINNER(S) FOR "${catLabel.toUpperCase()}"`
        : `ALL SHOWN WINNERS FOR "${catLabel.toUpperCase()}" ARE ALREADY CONFIRMED`,
    );
    setStatusType('success');
  };

  // Export Confirmed Winners CSV with Name, Prize, Email (plus Category)
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
      // Fallback if user clicks export before clicking confirm: export current primary winners
      const catLabel = getCategoryLabel();
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

  const exportFullLogCSV = () => {
    const lines = [
      'Status,Name,Prize,Email,Category,Draw Order,Winner Slot',
    ];
    const catLabel = getCategoryLabel();

    lockedWinnersHistory.forEach((lw) => {
      lines.push(
        [
          'CONFIRMED WINNER',
          toCsvField(lw.name),
          toCsvField(lw.prize),
          toCsvField(lw.email),
          toCsvField(lw.category),
          String(lw.rank),
          `#${lw.rank}`,
        ].join(','),
      );
    });

    primaryWinners.forEach((w) => {
      const confirmed = isWinnerConfirmed(w.participant);
      lines.push(
        [
          confirmed ? 'CURRENT DRAW (CONFIRMED)' : 'CURRENT DRAW (UNCONFIRMED)',
          toCsvField(w.participant.name),
          toCsvField(getPrizeForParticipant(w.participant)),
          toCsvField(w.participant.email),
          toCsvField(catLabel),
          String(w.drawRank),
          `#${w.effectiveSlot}`,
        ].join(','),
      );
    });

    backupBuffer.forEach((b) => {
      lines.push(
        [
          `BACKUP BUFFER #${b.backupIndex}`,
          toCsvField(b.participant.name),
          toCsvField(getPrizeForParticipant(b.participant)),
          toCsvField(b.participant.email),
          toCsvField(catLabel),
          String(b.drawRank),
          `Backup #${b.backupIndex}`,
        ].join(','),
      );
    });

    noShowList.forEach((n) => {
      lines.push(
        [
          'NO-SHOW',
          toCsvField(n.participant.name),
          toCsvField(getPrizeForParticipant(n.participant)),
          toCsvField(n.participant.email),
          toCsvField(catLabel),
          String(n.drawRank),
          'No-Show',
        ].join(','),
      );
    });

    const csvContent = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'devfest-mtl-26-crazy-raffle-full-log.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="crazy-raffle-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Press+Start+2P&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');

        .crazy-raffle-root {
          --bg-deep: #090214;
          --bg-mid: #16052b;
          --bg-panel: rgba(18, 6, 38, 0.86);
          --neon-pink: #ff007f;
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

          position: fixed;
          inset: 0;
          z-index: 9999;
          width: 100%;
          height: 100vh;
          overflow-x: hidden;
          overflow-y: auto;
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

        .crazy-raffle-root .stars {
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
            radial-gradient(2px 2px at 91% 38%, #fff, transparent);
          opacity: 0.75;
        }

        .crazy-raffle-root .synth-sun {
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
          opacity: 0.35;
          pointer-events: none;
        }

        .crazy-raffle-root .perspective-grid {
          position: absolute;
          left: -50%;
          right: -50%;
          bottom: -25%;
          height: 60%;
          background-image:
            linear-gradient(to right, rgba(255, 0, 127, 0.45) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.4) 2px, transparent 2px);
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

        /* TOP BAR */
        .crazy-raffle-root .top-bar {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: rgba(10, 2, 22, 0.9);
          border-bottom: 2px solid var(--neon-cyan);
          box-shadow: 0 0 24px rgba(0, 240, 255, 0.35);
          backdrop-filter: blur(10px);
          gap: 12px;
          flex-wrap: wrap;
        }

        .crazy-raffle-root .brand-title {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .crazy-raffle-root .gdg-mini-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(0, 240, 255, 0.5);
          border-radius: 10px;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.35);
        }

        .crazy-raffle-root .sub-eyebrow {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.88rem;
          letter-spacing: 2.5px;
          color: var(--neon-cyan);
        }

        .crazy-raffle-root .brand-title h1 {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 1.85rem;
          letter-spacing: 2.5px;
          background: linear-gradient(90deg, #ffffff 0%, #00f0ff 45%, #ffbe0b 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .crazy-raffle-root .top-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .crazy-raffle-root .stat-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 15px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(184, 163, 217, 0.4);
          font-family: var(--font-mono);
        }

        .crazy-raffle-root .stat-pill.neon-cyan {
          border-color: var(--neon-cyan);
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.3);
        }

        .crazy-raffle-root .stat-pill.neon-pink {
          border-color: var(--neon-pink);
          box-shadow: 0 0 12px rgba(255, 0, 127, 0.3);
        }

        .crazy-raffle-root .stat-label {
          font-size: 0.88rem;
          color: var(--text-dim);
        }

        .crazy-raffle-root .stat-value {
          font-size: 1.28rem;
          font-weight: 800;
          color: #fff;
        }

        .crazy-raffle-root .icon-btn {
          cursor: pointer;
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid var(--neon-cyan);
          background: rgba(0, 240, 255, 0.12);
          color: var(--neon-cyan);
          font-family: var(--font-display);
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-decoration: none;
          transition: all 0.18s ease;
        }

        .crazy-raffle-root .icon-btn:hover {
          background: var(--neon-cyan);
          color: #090214;
          box-shadow: 0 0 15px var(--neon-cyan);
        }

        /* MAIN LAYOUT */
        .crazy-raffle-root .main-stage {
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: 390px 1fr;
          gap: 22px;
          padding: 20px 26px;
          min-height: calc(100vh - 78px);
          align-items: start;
        }

        .crazy-raffle-root .main-stage.deck-collapsed {
          grid-template-columns: 1fr;
        }

        .crazy-raffle-root .control-deck {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .crazy-raffle-root .deck-card {
          background: var(--bg-panel);
          border: 1px solid rgba(0, 240, 255, 0.38);
          border-left: 4px solid var(--neon-pink);
          border-radius: 12px;
          padding: 16px 18px;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(12px);
        }

        .crazy-raffle-root .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          padding-bottom: 10px;
        }

        .crazy-raffle-root .step-tag {
          font-family: var(--font-arcade);
          font-size: 0.78rem;
          padding: 5px 8px;
          background: var(--neon-pink);
          color: #fff;
          border-radius: 4px;
        }

        .crazy-raffle-root .card-header h2 {
          font-family: var(--font-display);
          font-size: 1.02rem;
          letter-spacing: 1.5px;
          color: var(--neon-cyan);
          flex: 1;
        }

        .crazy-raffle-root .field-group {
          margin-bottom: 13px;
        }

        .crazy-raffle-root .field-group label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.88rem;
          letter-spacing: 1px;
          color: var(--text-dim);
          margin-bottom: 6px;
        }

        .crazy-raffle-root .input-row {
          display: flex;
          gap: 8px;
        }

        .crazy-raffle-root input[type="text"],
        .crazy-raffle-root input[type="number"],
        .crazy-raffle-root select,
        .crazy-raffle-root textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 6px;
          border: 1px solid rgba(0, 240, 255, 0.45);
          background: rgba(7, 1, 18, 0.92);
          color: #fff;
          font-family: var(--font-mono);
          font-size: 0.98rem;
          outline: none;
        }

        .crazy-raffle-root .btn {
          cursor: pointer;
          border: none;
          border-radius: 8px;
          font-family: var(--font-display);
          font-weight: 700;
          letter-spacing: 1.2px;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }

        .crazy-raffle-root .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .crazy-raffle-root .btn-cyan {
          padding: 10px 18px;
          font-size: 0.9rem;
          background: linear-gradient(135deg, #00f0ff 0%, #0077ff 100%);
          color: #060112;
          box-shadow: 0 0 14px rgba(0, 240, 255, 0.45);
        }

        .crazy-raffle-root .btn-outline-sm {
          flex: 1;
          padding: 9px 12px;
          font-size: 0.82rem;
          background: rgba(255, 255, 255, 0.06);
          color: var(--neon-cyan);
          border: 1px solid rgba(0, 240, 255, 0.45);
        }

        .crazy-raffle-root .quick-actions-row {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .crazy-raffle-root .status-banner {
          padding: 9px 12px;
          border-radius: 6px;
          background: rgba(0, 240, 255, 0.09);
          border: 1px solid rgba(0, 240, 255, 0.3);
          font-family: var(--font-mono);
          font-size: 0.88rem;
          color: var(--neon-cyan);
          line-height: 1.4;
        }

        .crazy-raffle-root .status-banner.error {
          background: rgba(234, 67, 53, 0.16);
          border-color: #ea4335;
          color: #ff8a80;
        }

        .crazy-raffle-root .status-banner.success {
          background: rgba(0, 245, 155, 0.13);
          border-color: var(--neon-green);
          color: var(--neon-green);
        }

        /* STAGE PANEL */
        .crazy-raffle-root .raffle-stage {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* 3 MAIN CATEGORY TABS */
        .crazy-raffle-root .category-selector-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
        }

        .crazy-raffle-root .category-tab {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          border-radius: 14px;
          background: rgba(18, 6, 38, 0.88);
          border: 2px solid rgba(0, 240, 255, 0.35);
          color: #fff;
          text-align: left;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .crazy-raffle-root .category-tab:hover:not(:disabled) {
          transform: translateY(-2px);
          border-color: var(--neon-cyan);
          box-shadow: 0 0 22px rgba(0, 240, 255, 0.4);
        }

        .crazy-raffle-root .category-tab.active {
          background: linear-gradient(135deg, rgba(255, 0, 127, 0.3) 0%, rgba(0, 240, 255, 0.24) 100%);
          border-color: var(--neon-cyan);
          box-shadow:
            0 0 26px rgba(0, 240, 255, 0.55),
            inset 0 0 18px rgba(255, 0, 127, 0.25);
        }

        .crazy-raffle-root .cat-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .crazy-raffle-root .cat-icon {
          font-size: 2.2rem;
        }

        .crazy-raffle-root .cat-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .crazy-raffle-root .cat-sub {
          font-family: var(--font-mono);
          font-size: 0.95rem;
          color: var(--neon-yellow);
          margin-top: 4px;
        }

        .crazy-raffle-root .cat-count-badge {
          font-family: var(--font-mono);
          font-size: 1.05rem;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(0, 240, 255, 0.2);
          border: 1px solid var(--neon-cyan);
          color: var(--neon-cyan);
          white-space: nowrap;
        }

        /* SUB-PRIZE PILLS (e.g. Individual Packt Books) */
        .crazy-raffle-root .subprize-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 12px;
          background: rgba(18, 6, 38, 0.85);
          border: 1px solid rgba(255, 190, 11, 0.45);
        }

        .crazy-raffle-root .subprize-pill {
          cursor: pointer;
          padding: 9px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.26);
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-bright);
          font-family: var(--font-mono);
          font-size: 0.96rem;
          transition: all 0.15s ease;
        }

        .crazy-raffle-root .subprize-pill.active {
          background: var(--neon-yellow);
          color: #090214;
          border-color: #fff;
          font-weight: 800;
          box-shadow: 0 0 16px rgba(255, 190, 11, 0.7);
        }

        /* ACTION HERO BAR */
        .crazy-raffle-root .shuffle-action-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          padding: 20px 24px;
          border-radius: 16px;
          background: rgba(18, 6, 38, 0.92);
          border: 2px solid var(--neon-pink);
          box-shadow: 0 0 32px rgba(255, 0, 127, 0.32);
        }

        .crazy-raffle-root .btn-shuffle-mega {
          padding: 18px 42px;
          font-size: 1.42rem;
          font-weight: 900;
          letter-spacing: 2.5px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff007f 0%, #ffbe0b 50%, #00f0ff 100%);
          background-size: 200% auto;
          color: #090117;
          border: 2px solid #ffffff;
          box-shadow:
            0 0 28px rgba(255, 0, 127, 0.85),
            0 0 48px rgba(0, 240, 255, 0.5);
          animation: crGradientShift 3s linear infinite;
        }

        .crazy-raffle-root .btn-shuffle-mega:hover:not(:disabled) {
          transform: scale(1.03);
        }

        @keyframes crGradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* SHUFFLE PROGRESS BAR */
        .crazy-raffle-root .shuffle-progress-wrap {
          width: 100%;
          margin-top: 8px;
        }

        .crazy-raffle-root .shuffle-progress-bar {
          width: 100%;
          height: 16px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid var(--neon-cyan);
          overflow: hidden;
        }

        .crazy-raffle-root .shuffle-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--neon-pink), var(--neon-yellow), var(--neon-cyan));
          transition: width 0.08s linear;
        }

        /* CANDIDATES GRID (PRE-DRAW & DURING 5S SHUFFLE) */
        .crazy-raffle-root .candidates-pool-card {
          background: var(--bg-panel);
          border: 1px solid rgba(0, 240, 255, 0.4);
          border-radius: 16px;
          padding: 22px 24px;
          backdrop-filter: blur(12px);
        }

        .crazy-raffle-root .pool-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
          margin-top: 16px;
          max-height: 60vh;
          overflow-y: auto;
          padding-right: 6px;
        }

        .crazy-raffle-root .candidate-chip {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(0, 240, 255, 0.35);
          border-left: 5px solid var(--neon-cyan);
          font-size: 1.28rem;
          font-weight: 700;
          transition: transform 0.08s ease;
        }

        .crazy-raffle-root .candidate-chip.shuffling {
          border-color: var(--neon-pink);
          border-left-color: var(--neon-yellow);
          background: linear-gradient(90deg, rgba(255, 0, 127, 0.25), rgba(0, 240, 255, 0.16));
          box-shadow: 0 0 16px rgba(255, 0, 127, 0.4);
          transform: scale(1.02);
        }

        .crazy-raffle-root .chip-idx {
          font-family: var(--font-mono);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--neon-yellow);
          min-width: 34px;
        }

        /* RESULTS: PRIMARY WINNERS + BACKUP BUFFER */
        .crazy-raffle-root .results-columns {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
        }

        .crazy-raffle-root .winners-panel {
          background: rgba(18, 6, 38, 0.94);
          border: 2px solid var(--neon-yellow);
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 0 34px rgba(255, 190, 11, 0.28);
        }

        .crazy-raffle-root .buffer-panel {
          background: rgba(18, 6, 38, 0.92);
          border: 2px solid var(--neon-cyan);
          border-radius: 16px;
          padding: 22px 24px;
          box-shadow: 0 0 30px rgba(0, 240, 255, 0.22);
        }

        .crazy-raffle-root .winner-row-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 16px 18px;
          border-radius: 12px;
          background: linear-gradient(90deg, rgba(255, 190, 11, 0.2) 0%, rgba(255, 0, 127, 0.14) 100%);
          border: 1px solid rgba(255, 190, 11, 0.6);
          margin-top: 12px;
          transition: all 0.2s ease;
        }

        .crazy-raffle-root .winner-row-card.confirmed {
          background: linear-gradient(90deg, rgba(0, 245, 155, 0.24) 0%, rgba(0, 240, 255, 0.16) 100%);
          border: 2px solid var(--neon-green);
          box-shadow: 0 0 20px rgba(0, 245, 155, 0.35);
        }

        .crazy-raffle-root .buffer-row-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 12px;
          background: rgba(0, 240, 255, 0.09);
          border: 1px solid rgba(0, 240, 255, 0.45);
          margin-top: 10px;
          transition: all 0.2s ease;
        }

        .crazy-raffle-root .buffer-row-card.confirmed {
          background: rgba(0, 245, 155, 0.18);
          border: 2px solid var(--neon-green);
        }

        .crazy-raffle-root .rank-badge {
          font-family: var(--font-arcade);
          font-size: 0.92rem;
          padding: 9px 12px;
          border-radius: 8px;
          background: var(--neon-yellow);
          color: #090214;
          font-weight: 900;
          white-space: nowrap;
        }

        .crazy-raffle-root .rank-badge.confirmed {
          background: var(--neon-green);
          color: #04130c;
        }

        .crazy-raffle-root .rank-badge.backup {
          background: rgba(0, 240, 255, 0.24);
          color: var(--neon-cyan);
          border: 1px solid var(--neon-cyan);
        }

        .crazy-raffle-root .winner-main-name {
          font-family: var(--font-display);
          font-size: 1.52rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.8px;
        }

        .crazy-raffle-root .winner-prize-sub {
          font-family: var(--font-mono);
          font-size: 1.02rem;
          font-weight: 700;
          color: var(--neon-cyan);
          margin-top: 4px;
        }

        .crazy-raffle-root .winner-email-sub {
          font-family: var(--font-mono);
          font-size: 0.88rem;
          color: var(--text-dim);
          margin-top: 3px;
        }

        .crazy-raffle-root .winner-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .crazy-raffle-root .btn-confirm {
          cursor: pointer;
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid var(--neon-green);
          background: rgba(0, 245, 155, 0.18);
          color: var(--neon-green);
          font-family: var(--font-mono);
          font-size: 0.92rem;
          font-weight: 800;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .crazy-raffle-root .btn-confirm:hover {
          background: var(--neon-green);
          color: #04130c;
          box-shadow: 0 0 14px rgba(0, 245, 155, 0.65);
        }

        .crazy-raffle-root .btn-confirm.active {
          background: var(--neon-green);
          color: #04130c;
          box-shadow: 0 0 16px rgba(0, 245, 155, 0.8);
        }

        .crazy-raffle-root .btn-noshow {
          cursor: pointer;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid rgba(234, 67, 53, 0.75);
          background: rgba(234, 67, 53, 0.18);
          color: #ff8a80;
          font-family: var(--font-mono);
          font-size: 0.9rem;
          font-weight: 800;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .crazy-raffle-root .btn-noshow:hover {
          background: #ea4335;
          color: #fff;
        }

        @media (max-width: 1120px) {
          .crazy-raffle-root .main-stage {
            grid-template-columns: 1fr;
          }
          .crazy-raffle-root .results-columns {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="synth-sky" aria-hidden="true">
        <div className="stars" />
        <div className="synth-sun" />
        <div className="perspective-grid" />
      </div>

      <canvas ref={confettiCanvasRef} id="confettiCanvas" />

      {/* TOP BAR */}
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
            <h1>CRAZY RAFFLE // CATEGORY SHUFFLER</h1>
          </div>
        </div>

        <div className="top-controls">
          <div className="stat-pill">
            <span className="stat-label">SHEET ROWS</span>
            <span className="stat-value">{rows.length}</span>
          </div>
          <div className="stat-pill neon-cyan">
            <span className="stat-label">ELIGIBLE (YES)</span>
            <span className="stat-value">{eligibleCandidates.length}</span>
          </div>
          <div className="stat-pill neon-pink">
            <span className="stat-label">CONFIRMED WINNERS</span>
            <span className="stat-value">{lockedWinnersHistory.length}</span>
          </div>
          {lockedWinnersHistory.length > 0 && (
            <button
              className="icon-btn"
              type="button"
              onClick={exportConfirmedWinnersCSV}
              title="Export Confirmed Winners CSV (Name, Prize, Email)"
              style={{
                borderColor: 'var(--neon-green)',
                color: 'var(--neon-green)',
                background: 'rgba(0, 245, 155, 0.12)',
              }}
            >
              📥 EXPORT WINNERS ({lockedWinnersHistory.length})
            </button>
          )}
          <a
            href={ENTRY_GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            title="Open Raffle Entry Google Form"
          >
            📝 ENTRY FORM
          </a>
          <button
            className="icon-btn"
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
          >
            <span>{soundEnabled ? '🔊' : '🔇'}</span> SYNTH SFX
          </button>
          <button
            className="icon-btn"
            type="button"
            onClick={() => setDeckCollapsed((c) => !c)}
          >
            🎛️ {deckCollapsed ? 'SHOW DECK' : 'HIDE DECK'}
          </button>
        </div>
      </header>

      <main
        className={`main-stage ${deckCollapsed ? 'deck-collapsed' : ''}`}
      >
        {/* LEFT CONTROL DECK */}
        {!deckCollapsed && (
          <aside className="control-deck">
            <section className="deck-card">
              <div className="card-header">
                <span className="step-tag">01</span>
                <h2>GOOGLE SHEET SOURCE</h2>
              </div>

              <div className="field-group">
                <label htmlFor="raffleSheetUrl">GOOGLE SHEET URL OR ID</label>
                <div className="input-row">
                  <input
                    id="raffleSheetUrl"
                    type="text"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void fetchGoogleSheet();
                    }}
                  />
                  <button
                    className="btn btn-cyan"
                    type="button"
                    disabled={isLoadingSheet}
                    onClick={() => void fetchGoogleSheet()}
                  >
                    {isLoadingSheet ? '...' : 'SYNC'}
                  </button>
                </div>
              </div>

              <div className="quick-actions-row">
                <button
                  className="btn btn-outline-sm"
                  type="button"
                  onClick={() =>
                    ingestCSVText(DEMO_RAFFLE_CSV, 'DEMO RAFFLE SHEET LOADED')
                  }
                >
                  ⚡ LOAD DEMO DATA
                </button>
                <button
                  className="btn btn-outline-sm"
                  type="button"
                  onClick={() => setShowPasteBox((v) => !v)}
                >
                  📂 CSV / PASTE
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
                <div className="field-group">
                  <textarea
                    rows={4}
                    placeholder="Paste CSV or TSV rows here..."
                    value={rawCsvText}
                    onChange={(e) => setRawCsvText(e.target.value)}
                  />
                  <div className="quick-actions-row" style={{ marginTop: 6 }}>
                    <button
                      className="btn btn-cyan"
                      style={{ flex: 1 }}
                      type="button"
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
                </div>
              )}

              <div className={`status-banner ${statusType}`}>{statusMsg}</div>
            </section>

            {/* STEP 2: WINNERS & NO-SHOW BUFFER CONFIG */}
            <section className="deck-card">
              <div className="card-header">
                <span className="step-tag">02</span>
                <h2>SHUFFLE &amp; BUFFER TUNING</h2>
              </div>

              <div className="field-group">
                <label htmlFor="raffleNameCol">PARTICIPANT NAME COLUMN</label>
                <select
                  id="raffleNameCol"
                  value={nameColumn}
                  onChange={(e) => setNameColumn(e.target.value)}
                  disabled={headers.length === 0}
                >
                  {headers.length === 0 ? (
                    <option value="">-- Load sheet first --</option>
                  ) : (
                    headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div className="field-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="winnerCountInput">PRIZES / WINNERS</label>
                  <input
                    id="winnerCountInput"
                    type="number"
                    min={1}
                    max={100}
                    value={winnerCount}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value) || 1);
                      setWinnerCount(val);
                      setBufferCount(val);
                    }}
                  />
                </div>
                <div className="field-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="bufferCountInput">NO-SHOW BUFFER</label>
                  <input
                    id="bufferCountInput"
                    type="number"
                    min={0}
                    max={100}
                    value={bufferCount}
                    onChange={(e) =>
                      setBufferCount(Math.max(0, Number(e.target.value) || 0))
                    }
                  />
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="shuffleSecondsInput">
                  SHUFFLE DURATION: {shuffleDurationSec} SECONDS
                </label>
                <input
                  id="shuffleSecondsInput"
                  type="range"
                  min={2}
                  max={10}
                  step={1}
                  value={shuffleDurationSec}
                  onChange={(e) =>
                    setShuffleDurationSec(Number(e.target.value) || 5)
                  }
                  style={{ width: '100%', accentColor: '#ff007f' }}
                />
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--neon-cyan)',
                  cursor: 'pointer',
                  marginTop: 6,
                }}
              >
                <input
                  type="checkbox"
                  checked={excludePastWinners}
                  onChange={(e) => setExcludePastWinners(e.target.checked)}
                />
                Exclude locked winners from earlier categories
              </label>
            </section>

            {/* STEP 3: CONFIRMED WINNERS & EXPORT */}
            <section className="deck-card">
              <div className="card-header">
                <span className="step-tag">03</span>
                <h2>CONFIRMED WINNERS ({lockedWinnersHistory.length})</h2>
              </div>

              <div className="quick-actions-row">
                <button
                  className="btn btn-cyan"
                  style={{ flex: 1, fontSize: '0.73rem' }}
                  type="button"
                  disabled={
                    primaryWinners.length === 0 &&
                    lockedWinnersHistory.length === 0
                  }
                  onClick={exportConfirmedWinnersCSV}
                  title="Export Confirmed Winners CSV with Name, Prize, and Email"
                >
                  📥 EXPORT WINNERS CSV
                </button>
                <button
                  className="btn btn-outline-sm"
                  type="button"
                  disabled={
                    primaryWinners.length === 0 &&
                    lockedWinnersHistory.length === 0
                  }
                  onClick={exportFullLogCSV}
                  title="Export full draw log including buffer and no-shows"
                >
                  📄 FULL LOG
                </button>
              </div>

              {lockedWinnersHistory.length > 0 ? (
                <div
                  style={{
                    marginTop: 10,
                    maxHeight: 220,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    paddingRight: 4,
                  }}
                >
                  {lockedWinnersHistory.map((lw) => (
                    <div
                      key={lw.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        padding: '7px 9px',
                        borderRadius: 6,
                        background: 'rgba(0, 245, 155, 0.1)',
                        border: '1px solid rgba(0, 245, 155, 0.4)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            color: '#fff',
                            fontWeight: 700,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          ✅ {lw.name}
                        </div>
                        <div
                          style={{
                            color: 'var(--neon-cyan)',
                            fontSize: '0.68rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          🎁 {lw.prize}
                        </div>
                        {lw.email && (
                          <div
                            style={{
                              color: 'var(--text-dim)',
                              fontSize: '0.66rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            ✉️ {lw.email}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setLockedWinnersHistory((prev) =>
                            prev.filter((item) => item.key !== lw.key),
                          )
                        }
                        title="Remove confirmed winner"
                        style={{
                          cursor: 'pointer',
                          background: 'transparent',
                          border: '1px solid rgba(234, 67, 53, 0.5)',
                          color: '#ff8a80',
                          borderRadius: 4,
                          padding: '2px 6px',
                          fontSize: '0.7rem',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    className="btn btn-outline-sm"
                    style={{ marginTop: 4 }}
                    type="button"
                    onClick={() => setLockedWinnersHistory([])}
                  >
                    CLEAR ALL CONFIRMED ({lockedWinnersHistory.length})
                  </button>
                </div>
              ) : (
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    color: 'var(--text-dim)',
                    lineHeight: 1.35,
                  }}
                >
                  Click <strong>✅ CONFIRM</strong> next to each winner (or{' '}
                  <strong>CONFIRM ALL</strong>) to lock them in per prize for
                  your <strong>Name, Prize, Email</strong> CSV export.
                </p>
              )}
            </section>
          </aside>
        )}

        {/* RIGHT / CENTER MAIN STAGE */}
        <section className="raffle-stage">
          {/* 1. SELECT PRIZE CATEGORY (3 MAIN CATEGORIES) */}
          <div className="category-selector-bar">
            {categories.map((cat) => {
              const isActive = activeCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-tab ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectCategory(cat)}
                  disabled={isShuffling}
                >
                  <div className="cat-left">
                    <span className="cat-icon">{cat.icon}</span>
                    <div>
                      <div className="cat-title">{cat.label}</div>
                      <div className="cat-sub">
                        {cat.totalPrizes} PRIZES · {cat.columns.length}{' '}
                        {cat.columns.length === 1 ? 'ITEM' : 'TITLES'}
                      </div>
                    </div>
                  </div>
                  {isActive && (
                    <span className="cat-count-badge">
                      {eligibleCandidates.length} YES
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* SUB-PRIZE FILTER FOR MULTI-ITEM CATEGORIES (e.g. Packt Books) */}
          {activeCategory && activeCategory.columns.length > 1 && (
            <div className="subprize-bar">
              <button
                type="button"
                className={`subprize-pill ${
                  selectedSubColumn === '__ALL_IN_CATEGORY__' ? 'active' : ''
                }`}
                onClick={() => handleSelectSubColumn('__ALL_IN_CATEGORY__')}
                disabled={isShuffling}
              >
                ⚡ All {activeCategory.label} ({activeCategory.totalPrizes}{' '}
                prizes total)
              </button>
              {activeCategory.columns.map((col) => (
                <button
                  key={col}
                  type="button"
                  className={`subprize-pill ${
                    selectedSubColumn === col ? 'active' : ''
                  }`}
                  onClick={() => handleSelectSubColumn(col)}
                  disabled={isShuffling}
                >
                  📘 {col.replace(/^Packt Book\s*-\s*/i, '')}
                </button>
              ))}
            </div>
          )}

          {/* 2. SHUFFLE CTA & STATUS BAR */}
          <div className="shuffle-action-bar">
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.52rem',
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: 1.2,
                }}
              >
                {activeCategory ? (
                  <>
                    {activeCategory.icon}{' '}
                    {selectedSubColumn === '__ALL_IN_CATEGORY__'
                      ? activeCategory.label.toUpperCase()
                      : cleanPrizeLabel(selectedSubColumn).toUpperCase()}
                  </>
                ) : (
                  'SELECT A PRIZE CATEGORY'
                )}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.08rem',
                  color: 'var(--neon-cyan)',
                  marginTop: 6,
                }}
              >
                <strong>{eligibleCandidates.length}</strong> participants
                selected <strong>YES</strong> · Drawing{' '}
                <strong style={{ color: 'var(--neon-yellow)' }}>
                  {winnerCount} winners
                </strong>{' '}
                +{' '}
                <strong style={{ color: 'var(--neon-green)' }}>
                  {bufferCount} no-show buffer
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {drawnOrder.length > 0 && !isShuffling && (
                <>
                  <button
                    type="button"
                    className="btn btn-cyan"
                    onClick={lockCurrentPrimaryWinners}
                    title="Confirm all shown winners into the CSV export list"
                  >
                    ✅ CONFIRM ALL SHOWN ({primaryWinners.length})
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-sm"
                    style={{ padding: '10px 14px' }}
                    onClick={() => {
                      setDrawnOrder([]);
                      setNoShowIds(new Set());
                    }}
                  >
                    👁️ VIEW ALL {eligibleCandidates.length} NAMES
                  </button>
                </>
              )}

              <button
                type="button"
                className="btn btn-shuffle-mega"
                disabled={isShuffling || eligibleCandidates.length === 0}
                onClick={startFiveSecondShuffle}
              >
                {isShuffling
                  ? `⚡ MIXING NAMES... ${shuffleRemainingSec.toFixed(1)}s`
                  : drawnOrder.length > 0
                    ? `🔀 RESHUFFLE (${shuffleDurationSec}s)`
                    : `🎲 SHUFFLE ${eligibleCandidates.length} NAMES (${shuffleDurationSec}s)`}
              </button>
            </div>

            {isShuffling && (
              <div className="shuffle-progress-wrap">
                <div className="shuffle-progress-bar">
                  <div
                    className="shuffle-progress-fill"
                    style={{
                      width: `${Math.min(
                        100,
                        ((shuffleDurationSec - shuffleRemainingSec) /
                          shuffleDurationSec) *
                          100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3A. WINNERS + BUFFER RESULTS VIEW (WHEN SHUFFLE COMPLETES) */}
          {drawnOrder.length > 0 && !isShuffling ? (
            <div className="results-columns">
              {/* PRIMARY WINNERS */}
              <div className="winners-panel">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255, 190, 11, 0.35)',
                    paddingBottom: 10,
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.45rem',
                        color: 'var(--neon-yellow)',
                        letterSpacing: 1.5,
                      }}
                    >
                      🏆 SELECTED WINNERS (TOP {primaryWinners.length})
                    </h2>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.95rem',
                        color: 'var(--text-dim)',
                        marginTop: 4,
                      }}
                    >
                      Click <strong>✅ CONFIRM</strong> to lock in a winner for
                      CSV export, or <strong>NO-SHOW ❌</strong> to promote next
                      from the buffer!
                    </p>
                  </div>
                </div>

                {primaryWinners.map((w) => {
                  const prizeLabel = getPrizeForParticipant(w.participant);
                  const confirmed = isWinnerConfirmed(
                    w.participant,
                    prizeLabel,
                  );
                  return (
                    <div
                      key={w.participant.id}
                      className={`winner-row-card ${confirmed ? 'confirmed' : ''}`}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          minWidth: 0,
                        }}
                      >
                        <span
                          className={`rank-badge ${confirmed ? 'confirmed' : ''}`}
                        >
                          {confirmed ? '✓' : `#${w.effectiveSlot}`}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div className="winner-main-name">
                            {w.participant.name}
                          </div>
                          <div className="winner-prize-sub">
                            🎁 {prizeLabel}
                          </div>
                          {w.participant.email && (
                            <div className="winner-email-sub">
                              ✉️ {w.participant.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="winner-actions">
                        <button
                          type="button"
                          className={`btn-confirm ${confirmed ? 'active' : ''}`}
                          onClick={() =>
                            toggleConfirmWinner(w.participant, w.effectiveSlot)
                          }
                          title={
                            confirmed
                              ? 'Confirmed for export! Click to unconfirm'
                              : 'Confirm winner and lock in Name, Prize, and Email for export'
                          }
                        >
                          {confirmed ? '✅ CONFIRMED ✓' : '✅ CONFIRM'}
                        </button>
                        <button
                          type="button"
                          className="btn-noshow"
                          onClick={() => toggleNoShow(w.participant.id)}
                          title="Mark as No-Show and promote Backup #1"
                        >
                          NO-SHOW ❌
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* NO-SHOW BACKUP BUFFER */}
              <div className="buffer-panel">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 240, 255, 0.35)',
                    paddingBottom: 10,
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.4rem',
                        color: 'var(--neon-cyan)',
                        letterSpacing: 1.5,
                      }}
                    >
                      🛡️ NO-SHOW BACKUP BUFFER ({backupBuffer.length})
                    </h2>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.95rem',
                        color: 'var(--text-dim)',
                        marginTop: 4,
                      }}
                    >
                      Next in line in exact random draw order (#
                      {winnerCount + 1} – #{winnerCount + backupBuffer.length})
                    </p>
                  </div>
                  {remainingStandby.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-outline-sm"
                      style={{ flex: '0 0 auto' }}
                      onClick={() => setBufferCount((b) => b + 5)}
                    >
                      +5 MORE ({remainingStandby.length} LEFT)
                    </button>
                  )}
                </div>

                {backupBuffer.length === 0 ? (
                  <div
                    style={{
                      padding: '24px 12px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-dim)',
                    }}
                  >
                    No additional backup candidates remaining in pool.
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
                        className={`buffer-row-card ${confirmed ? 'confirmed' : ''}`}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            minWidth: 0,
                          }}
                        >
                          <span className="rank-badge backup">
                            BACKUP #{b.backupIndex}
                          </span>
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.32rem',
                                fontWeight: 800,
                                color: '#fff',
                              }}
                            >
                              {b.participant.name}
                            </div>
                            <div className="winner-prize-sub">
                              🎁 {prizeLabel}
                            </div>
                            {b.participant.email && (
                              <div className="winner-email-sub">
                                ✉️ {b.participant.email}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="winner-actions">
                          <button
                            type="button"
                            className={`btn-confirm ${confirmed ? 'active' : ''}`}
                            onClick={() =>
                              toggleConfirmWinner(
                                b.participant,
                                winnerCount + b.backupIndex,
                              )
                            }
                            title="Confirm backup winner directly"
                          >
                            {confirmed ? '✅ CONFIRMED ✓' : '✅ CONFIRM'}
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

                {noShowList.length > 0 && (
                  <div
                    style={{
                      marginTop: 16,
                      paddingTop: 12,
                      borderTop: '1px dashed rgba(234, 67, 53, 0.45)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: '#ff8a80',
                        marginBottom: 6,
                      }}
                    >
                      MARKED AS NO-SHOW (CLICK TO RESTORE):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {noShowList.map((n) => (
                        <button
                          key={n.participant.id}
                          type="button"
                          onClick={() => toggleNoShow(n.participant.id)}
                          style={{
                            cursor: 'pointer',
                            padding: '4px 10px',
                            borderRadius: 999,
                            border: '1px solid rgba(234, 67, 53, 0.6)',
                            background: 'rgba(234, 67, 53, 0.12)',
                            color: '#ff8a80',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            textDecoration: 'line-through',
                          }}
                        >
                          {n.participant.name} ↩
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 3B. ON-SCREEN CANDIDATE POOL GRID (BEFORE & DURING 5-SECOND SHUFFLE) */
            <div className="candidates-pool-card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  paddingBottom: 10,
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.38rem',
                    letterSpacing: 1.5,
                    color: isShuffling
                      ? 'var(--neon-yellow)'
                      : 'var(--neon-cyan)',
                  }}
                >
                  {isShuffling
                    ? `⚡ SHUFFLING ALL ${displayPool.length} CANDIDATES... (${shuffleRemainingSec.toFixed(1)}s)`
                    : `👥 ELIGIBLE PARTICIPANTS ON SCREEN (${displayPool.length})`}
                </h2>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.96rem',
                    color: 'var(--text-dim)',
                  }}
                >
                  {rows.length === 0
                    ? 'Waiting for responses in sheet (or click LOAD DEMO DATA to test)'
                    : 'Filtered by "Yes" on selected prize category'}
                </span>
              </div>

              {displayPool.length === 0 ? (
                <div
                  style={{
                    padding: '48px 20px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-dim)',
                  }}
                >
                  <p style={{ fontSize: '1rem', marginBottom: 12 }}>
                    No responses in the sheet yet for this category (currently{' '}
                    {rows.length} rows in Google Sheet).
                  </p>
                  <button
                    type="button"
                    className="btn btn-cyan"
                    onClick={() =>
                      ingestCSVText(DEMO_RAFFLE_CSV, 'DEMO RAFFLE SHEET LOADED')
                    }
                  >
                    ⚡ LOAD DEMO PARTICIPANTS TO TEST SHUFFLER
                  </button>
                </div>
              ) : (
                <div className="pool-grid">
                  {displayPool.map((person, idx) => (
                    <div
                      key={person.id}
                      className={`candidate-chip ${
                        isShuffling ? 'shuffling' : ''
                      }`}
                    >
                      <span className="chip-idx">#{idx + 1}</span>
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
        </section>
      </main>
    </div>
  );
}
