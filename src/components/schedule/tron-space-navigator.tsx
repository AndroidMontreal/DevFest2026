'use client';

import { getRoomSongCredits } from '@/lib/room-song-synth';
import {
  ArrowLeftRight,
  ArrowUpRight,
  Compass,
  Cpu,
  DoorOpen,
  Headphones,
  Layers,
  LocateFixed,
  MapPin,
  Music,
  Navigation,
  RotateCcw,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getCategoryBadgeClass,
  getLevelBadgeClass,
  type RoomTrack,
} from './room-agenda-section';

type FloorId = '03' | '04';
type RenderMode = 'tron' | 'blueprint';

export type MapNodeCategory =
  | 'room'
  | 'coaching'
  | 'showcase'
  | 'registration'
  | 'sponsor'
  | 'activity'
  | 'transit'
  | 'amenity';

export type MapNode = {
  id: string;
  floor: FloorId;
  numberBadge?: string;
  code?: string;
  roomScheduleId?: string;
  name: string;
  subtitleEn: string;
  subtitleFr: string;
  zone: string;
  capacityEn: string;
  capacityFr: string;
  category: MapNodeCategory;
  x: number;
  y: number;
  /** SVG polyline points for TRON light-cycle pathfinding from Elevator/Stairs */
  routeFromElevator: string;
  routeFromStairs: string;
  color: 'red' | 'yellow' | 'cyan' | 'green' | 'magenta' | 'orange' | 'blue';
};

const MAP_NODES: MapNode[] = [
  // ==================== LEVEL 03 ====================
  {
    id: 'l3-room-1',
    floor: '03',
    numberBadge: '1',
    code: 'WORLD 3-1',
    roomScheduleId: '3-1',
    name: "Don't Stop Believin'",
    subtitleEn: 'Main Stage · Keynotes, Panels & Talks',
    subtitleFr: 'Scène principale · Keynotes, panels et conférences',
    zone: 'Le Parquet · West Wing',
    capacityEn: '75 seats',
    capacityFr: '75 places',
    category: 'room',
    x: 133,
    y: 367,
    routeFromElevator: '551,345 512,345 512,342 176,342 176,367 133,367',
    routeFromStairs: '147,190 147,367 133,367',
    color: 'yellow',
  },
  {
    id: 'l3-room-2',
    floor: '03',
    numberBadge: '2',
    code: 'WORLD 3-2',
    name: 'Mr. Roboto',
    subtitleEn: 'Tech Showcase & Drop-in Demos (The Doomsday Course)',
    subtitleFr: 'Vitrine techno et démos en continu (The Doomsday Course)',
    zone: 'Room #321 · West Atrium',
    capacityEn: '5 seats · 10:15–16:45 drop-in',
    capacityFr: '5 places · 10:15–16:45 en continu',
    category: 'showcase',
    x: 197,
    y: 232,
    routeFromElevator: '551,345 512,345 512,342 184,342 184,232 197,232',
    routeFromStairs: '147,190 184,190 184,232 197,232',
    color: 'cyan',
  },
  {
    id: 'l3-room-3',
    floor: '03',
    numberBadge: '3',
    code: 'COACHING 3-3',
    roomScheduleId: '3-3',
    name: 'Take On Me',
    subtitleEn: '1:1 Career Coaching Pod',
    subtitleFr: 'Salle de mentorat carrière 1:1',
    zone: 'Room #319 · West Atrium',
    capacityEn: '2 seats (1:1 sessions · 10:30–16:40)',
    capacityFr: '2 places (Sessions 1:1 · 10:30–16:40)',
    category: 'coaching',
    x: 207,
    y: 299,
    routeFromElevator: '551,345 512,345 512,342 184,342 184,299 207,299',
    routeFromStairs: '147,190 184,190 184,299 207,299',
    color: 'green',
  },
  {
    id: 'l3-room-4',
    floor: '03',
    numberBadge: '4',
    code: 'WORLD 3-4',
    roomScheduleId: '3-4',
    name: 'Call Me',
    subtitleEn: 'Talks & Lightning Round',
    subtitleFr: 'Conférences et ronde éclair',
    zone: 'Room #302 · Central Bridge',
    capacityEn: '20 seats',
    capacityFr: '20 places',
    category: 'room',
    x: 440,
    y: 363,
    routeFromElevator: '551,345 512,345 512,342 440,342 440,363',
    routeFromStairs: '147,190 184,190 184,342 440,342 440,363',
    color: 'red',
  },
  {
    id: 'l3-room-5',
    floor: '03',
    numberBadge: '5',
    code: 'WORLD 3-5',
    roomScheduleId: '3-5',
    name: "Just Can't Get Enough",
    subtitleEn: 'Technical Talks',
    subtitleFr: 'Conférences techniques',
    zone: 'Room #342 · Central Bridge',
    capacityEn: '25 seats',
    capacityFr: '25 places',
    category: 'room',
    x: 439,
    y: 312,
    routeFromElevator: '551,345 512,345 512,342 439,342 439,312',
    routeFromStairs: '147,190 184,190 184,342 439,342 439,312',
    color: 'red',
  },
  {
    id: 'l3-reg',
    floor: '03',
    numberBadge: 'R',
    code: 'CHECK-IN (R)',
    name: 'Registration / Enregistrement',
    subtitleEn: 'Main Event Check-in & Welcome Desk',
    subtitleFr: 'Accueil des participants et enregistrement principal',
    zone: 'Central Bridge Corridor',
    capacityEn: 'All Attendees · Opens 08:30',
    capacityFr: 'Tous les participants · Ouverture à 08:30',
    category: 'registration',
    x: 379,
    y: 341,
    routeFromElevator: '551,345 512,345 512,342 379,341',
    routeFromStairs: '147,190 184,190 184,342 379,341',
    color: 'cyan',
  },
  {
    id: 'l3-sponsor-m',
    floor: '03',
    numberBadge: 'M',
    code: 'MARQUEE BOOTH (M)',
    name: 'Marquee Sponsor (TELUS Digital)',
    subtitleEn: 'Marquee Partner Booth & Engineering Showcase',
    subtitleFr: 'Kiosque du partenaire principal TELUS Digital',
    zone: 'West Bridge Entrance',
    capacityEn: 'TELUS Digital (M)',
    capacityFr: 'TELUS Digital (M)',
    category: 'sponsor',
    x: 232,
    y: 361,
    routeFromElevator: '551,345 512,345 512,342 232,342 232,361',
    routeFromStairs: '147,190 184,190 184,342 232,342 232,361',
    color: 'green',
  },
  {
    id: 'l3-sponsor-g1',
    floor: '03',
    numberBadge: 'G',
    code: 'GOLD SPONSORS (G)',
    name: 'Gold Sponsors: Vooban, oXya, Davidson Canada & Kanastruk',
    subtitleEn:
      'Gold Sponsor Booths (G) — Vooban, oXya, Davidson Canada and Kanastruk',
    subtitleFr:
      'Kiosques Commanditaires Or (G) — Vooban, oXya, Davidson Canada et Kanastruk',
    zone: 'Central Bridge & Room #321 (4 Booths)',
    capacityEn: 'Vooban · oXya · Davidson Canada · Kanastruk',
    capacityFr: 'Vooban · oXya · Davidson Canada · Kanastruk',
    category: 'sponsor',
    x: 284,
    y: 324,
    routeFromElevator: '551,345 512,345 512,342 284,342 284,324',
    routeFromStairs: '147,190 184,190 184,342 284,342 284,324',
    color: 'green',
  },
  {
    id: 'l3-sega',
    floor: '03',
    numberBadge: '80s',
    code: 'RETRO ARCADE',
    name: 'Sega Genesis & Photo Booth',
    subtitleEn: '80s Retro Gaming Station & Event Photo Booth',
    subtitleFr: 'Station rétro Sega Genesis et cabine photo',
    zone: 'South Parquet (#313/#310)',
    capacityEn: 'Open All Day',
    capacityFr: 'Ouvert toute la journée',
    category: 'activity',
    x: 165,
    y: 606,
    routeFromElevator: '551,345 512,345 512,342 184,342 184,606 165,606',
    routeFromStairs: '147,190 147,606 165,606',
    color: 'magenta',
  },
  {
    id: 'l3-dining',
    floor: '03',
    numberBadge: '☕',
    code: 'CATERING 3F',
    name: 'Dining Area & Coffee Station',
    subtitleEn: 'Breakfast (08:30), Lunch (12:00), Coffee & 5 à 7',
    subtitleFr: 'Déjeuner (08:30), dîner (12:00), café et 5 à 7',
    zone: 'Le Parquet South-East',
    capacityEn: 'Catering & Espresso',
    capacityFr: 'Restauration et machine à café',
    category: 'amenity',
    x: 197,
    y: 451,
    routeFromElevator: '551,345 512,345 512,342 184,342 184,451 197,451',
    routeFromStairs: '147,190 184,190 184,451 197,451',
    color: 'orange',
  },
  {
    id: 'l3-restrooms',
    floor: '03',
    numberBadge: 'WC',
    code: 'RESTROOMS 3F',
    name: 'Restrooms / Salles de bain',
    subtitleEn:
      '3 Restroom Zones (East Elevator Core North/South & West Atrium)',
    subtitleFr:
      '3 zones de salles de bain (Ascenseurs nord/sud et atrium ouest)',
    zone: 'East Core & West Atrium',
    capacityEn: '3 Restroom Locations (Level 03)',
    capacityFr: '3 salles de bain (Niveau 03)',
    category: 'amenity',
    x: 314,
    y: 415,
    routeFromElevator: '551,345 512,345 512,281 571,281',
    routeFromStairs: '147,190 184,190 184,342 322,342 322,415 314,415',
    color: 'orange',
  },
  {
    id: 'l3-stairs',
    floor: '03',
    numberBadge: '⇅',
    code: 'STAIRS 3↔4',
    name: 'Grand Stairs / Escaliers (To Level 04)',
    subtitleEn: 'Direct internal staircase connecting Level 03 and Level 04',
    subtitleFr:
      'Escalier intérieur direct reliant le Niveau 03 et le Niveau 04',
    zone: 'North Parquet Atrium',
    capacityEn: 'Click to switch to Level 04',
    capacityFr: 'Cliquez pour passer au Niveau 04',
    category: 'transit',
    x: 147,
    y: 190,
    routeFromElevator: '551,345 512,345 512,342 184,342 184,190 147,190',
    routeFromStairs: '147,190',
    color: 'cyan',
  },
  {
    id: 'l3-elevators',
    floor: '03',
    numberBadge: '★',
    code: 'ELEVATORS',
    name: 'Main Elevators / Ascenseurs',
    subtitleEn: 'Main arrival point from ground floor & metro',
    subtitleFr:
      'Point d’arrivée principal depuis le rez-de-chaussée et le métro',
    zone: 'East Core Lobby',
    capacityEn: '4 Elevators + Restrooms & Info Desk',
    capacityFr: '4 ascenseurs + salles de bain et accueil',
    category: 'transit',
    x: 551,
    y: 345,
    routeFromElevator: '551,345',
    routeFromStairs: '147,190 184,190 184,342 512,342 512,345 551,345',
    color: 'magenta',
  },

  // ==================== LEVEL 04 ====================
  {
    id: 'l4-room-1',
    floor: '04',
    numberBadge: '1',
    code: 'WORLD 4-1',
    name: 'The Danger Zone',
    subtitleEn: 'Chill Zone, Games & Badge Station (B)',
    subtitleFr: 'Zone détente, jeux et station de badges (B)',
    zone: 'Le Café · North-West Wing',
    capacityEn: '25 seats · All-Day Lounge & Badge Station',
    capacityFr: '25 places · Zone détente et station de badges',
    category: 'activity',
    x: 140,
    y: 77,
    routeFromElevator: '530,330 496,330 496,336 208,336 208,140 140,140 140,77',
    routeFromStairs: '137,190 137,140 140,77',
    color: 'blue',
  },
  {
    id: 'l4-badge',
    floor: '04',
    numberBadge: 'B',
    code: 'BADGE STATION (B)',
    name: 'Badge Station',
    subtitleEn: 'Custom Badge Perks & Swag Station',
    subtitleFr: 'Station de personnalisation de badges',
    zone: 'Le Café · Next to The Danger Zone',
    capacityEn: 'All Day',
    capacityFr: 'Toute la journée',
    category: 'registration',
    x: 164,
    y: 59,
    routeFromElevator: '530,330 496,330 496,336 208,336 208,140 164,140 164,59',
    routeFromStairs: '137,190 137,140 164,140 164,59',
    color: 'cyan',
  },
  {
    id: 'l4-room-2',
    floor: '04',
    numberBadge: '2',
    code: 'COACHING 4-2',
    roomScheduleId: '4-2',
    name: 'Money For Nothing',
    subtitleEn: '1:1 Career Coaching Pod & Photo Booth (#417)',
    subtitleFr: 'Salle de mentorat carrière 1:1 et cabine photo (#417)',
    zone: 'Room #418 · North-West Corridor',
    capacityEn: '2 seats (1:1 sessions · 10:30–16:40)',
    capacityFr: '2 places (Sessions 1:1 · 10:30–16:40)',
    category: 'coaching',
    x: 221,
    y: 146,
    routeFromElevator: '530,330 496,330 496,336 208,336 208,146 221,146',
    routeFromStairs: '137,190 137,146 221,146',
    color: 'green',
  },
  {
    id: 'l4-photo',
    floor: '04',
    numberBadge: '📷',
    code: 'PHOTO BOOTH 4F',
    name: 'Photo Booth (Level 04)',
    subtitleEn: '4th Floor Community Photo Station',
    subtitleFr: 'Cabine photo communautaire du 4e étage',
    zone: 'Room #417 · Near Stairs',
    capacityEn: 'Open All Day',
    capacityFr: 'Ouvert toute la journée',
    category: 'activity',
    x: 213,
    y: 198,
    routeFromElevator: '530,330 496,330 496,336 208,336 208,198 213,198',
    routeFromStairs: '137,190 137,146 208,146 208,198 213,198',
    color: 'green',
  },
  {
    id: 'l4-room-3',
    floor: '04',
    numberBadge: '3',
    code: 'COACHING 4-3',
    roomScheduleId: '4-3',
    name: 'Working For The Weekend',
    subtitleEn: '1:1 Career Coaching Pod',
    subtitleFr: 'Salle de mentorat carrière 1:1',
    zone: 'Room #415 · South-West Corridor',
    capacityEn: '2 seats (1:1 sessions · 10:30–16:40)',
    capacityFr: '2 places (Sessions 1:1 · 10:30–16:40)',
    category: 'coaching',
    x: 221,
    y: 495,
    routeFromElevator:
      '530,330 496,330 496,336 273,336 273,522 221,522 221,495',
    routeFromStairs:
      '137,190 137,146 208,146 208,336 273,336 273,522 221,522 221,495',
    color: 'green',
  },
  {
    id: 'l4-room-4',
    floor: '04',
    numberBadge: '4',
    code: 'WORLD 4-4',
    roomScheduleId: '4-4',
    name: 'Under Pressure',
    subtitleEn: 'Technical Talks & Breakout Sessions',
    subtitleFr: 'Conférences techniques et sessions',
    zone: 'Room #403 · École des Entrepreneurs',
    capacityEn: '40 seats',
    capacityFr: '40 places',
    category: 'room',
    x: 341,
    y: 350,
    routeFromElevator: '530,330 496,330 496,336 341,336 341,350',
    routeFromStairs: '137,190 137,146 208,146 208,336 341,336 341,350',
    color: 'red',
  },
  {
    id: 'l4-room-5',
    floor: '04',
    numberBadge: '5',
    code: 'WORLD 4-5',
    roomScheduleId: '4-5',
    name: 'Never Gonna Give You Up',
    subtitleEn: 'Technical Talks & Breakout Sessions',
    subtitleFr: 'Conférences techniques et sessions',
    zone: 'Room #403.1 · École des Entrepreneurs',
    capacityEn: '40 seats',
    capacityFr: '40 places',
    category: 'room',
    x: 365,
    y: 501,
    routeFromElevator:
      '530,330 496,330 496,336 273,336 273,522 365,522 365,501',
    routeFromStairs:
      '137,190 137,146 208,146 208,336 273,336 273,522 365,522 365,501',
    color: 'red',
  },
  {
    id: 'l4-room-6',
    floor: '04',
    numberBadge: '6',
    code: 'WORLD 4-6',
    roomScheduleId: '4-6',
    name: 'Hip To Be Square',
    subtitleEn: 'Hands-On Workshops',
    subtitleFr: 'Ateliers pratiques',
    zone: 'Le Square · East Wing',
    capacityEn: '91 table seated (110 with 19 standing up)',
    capacityFr: '91 places assises aux tables (110 avec 19 debout)',
    category: 'room',
    x: 812,
    y: 356,
    routeFromElevator: '530,330 496,330 496,404 852,404 852,356 812,356',
    routeFromStairs:
      '137,190 137,146 208,146 208,336 496,336 496,404 852,404 852,356 812,356',
    color: 'red',
  },
  {
    id: 'l4-room-7',
    floor: '04',
    numberBadge: '7',
    code: 'COACHING 4-7',
    roomScheduleId: '4-7',
    name: 'Should I Stay Or Should I Go',
    subtitleEn: '1:1 Career Coaching Pod',
    subtitleFr: 'Salle de mentorat carrière 1:1',
    zone: 'Room #410 · South-West Corridor',
    capacityEn: '2 seats (1:1 sessions · 10:30–16:40)',
    capacityFr: '2 places (Sessions 1:1 · 10:30–16:40)',
    category: 'coaching',
    x: 284,
    y: 514,
    routeFromElevator: '530,330 496,330 496,336 273,336 273,514 284,514',
    routeFromStairs: '137,190 137,146 208,146 208,336 273,336 273,514 284,514',
    color: 'green',
  },
  {
    id: 'l4-dining',
    floor: '04',
    numberBadge: '🍴',
    code: 'DINING 4F · PRIMARY',
    name: 'Le Square Dining — South (Primary)',
    subtitleEn:
      'Primary 4F Catering & Dining Area + Coat Rack (South of Hip To Be Square)',
    subtitleFr:
      'Espace repas principal du 4e étage + vestiaire (au sud de Hip To Be Square)',
    zone: 'East Wing · South of Le Square',
    capacityEn: 'Primary Dining Area + Coat Rack',
    capacityFr: 'Espace repas principal + vestiaire',
    category: 'amenity',
    x: 852,
    y: 446,
    routeFromElevator: '530,330 496,330 496,404 852,404 852,446',
    routeFromStairs:
      '137,190 137,146 208,146 208,336 496,336 496,404 852,404 852,446',
    color: 'orange',
  },
  {
    id: 'l4-dining-north',
    floor: '04',
    numberBadge: '🍴',
    code: 'DINING 4F · SECONDARY',
    name: 'Le Square Dining — North (Secondary)',
    subtitleEn:
      'Secondary Overflow Dining Area + Coat Rack (North of Hip To Be Square)',
    subtitleFr:
      'Espace repas secondaire + vestiaire (au nord de Hip To Be Square)',
    zone: 'East Wing · North of Le Square',
    capacityEn: 'Secondary Dining Area + Coat Rack',
    capacityFr: 'Espace repas secondaire + vestiaire',
    category: 'amenity',
    x: 852,
    y: 224,
    routeFromElevator: '530,330 496,330 496,252 852,252 852,224',
    routeFromStairs:
      '137,190 137,146 208,146 208,336 496,336 496,252 852,252 852,224',
    color: 'yellow',
  },
  {
    id: 'l4-restrooms',
    floor: '04',
    numberBadge: 'WC',
    code: 'RESTROOMS 4F',
    name: 'Restrooms / Salles de bain',
    subtitleEn: '3 Restroom Zones (East Elevator Core North/South & West Wing)',
    subtitleFr: '3 zones de salles de bain (Ascenseurs nord/sud et aile ouest)',
    zone: 'East Core & West Wing',
    capacityEn: '3 Restroom Locations (Level 04)',
    capacityFr: '3 salles de bain (Niveau 04)',
    category: 'amenity',
    x: 292,
    y: 403,
    routeFromElevator: '530,330 496,330 496,266 556,266',
    routeFromStairs: '137,190 137,146 208,146 208,336 273,336 273,403 292,403',
    color: 'orange',
  },
  {
    id: 'l4-stairs',
    floor: '04',
    numberBadge: '⇅',
    code: 'STAIRS 4↔3',
    name: 'Grand Stairs / Escaliers (To Level 03)',
    subtitleEn: 'Direct internal staircase down to Level 03 (Main Stage)',
    subtitleFr:
      'Escalier intérieur direct vers le Niveau 03 (Scène principale)',
    zone: 'North-West Mezzanine',
    capacityEn: 'Click to switch to Level 03',
    capacityFr: 'Cliquez pour descendre au Niveau 03',
    category: 'transit',
    x: 137,
    y: 190,
    routeFromElevator:
      '530,330 496,330 496,336 208,336 208,146 137,146 137,190',
    routeFromStairs: '137,190',
    color: 'cyan',
  },
  {
    id: 'l4-elevators',
    floor: '04',
    numberBadge: '★',
    code: 'ELEVATORS',
    name: 'Main Elevators / Ascenseurs',
    subtitleEn: 'Central Elevator Core & Restrooms',
    subtitleFr: 'Ascenseurs centraux et salles de bain',
    zone: 'East Core Lobby',
    capacityEn: '4 Elevators + 2 Restrooms',
    capacityFr: '4 ascenseurs + 2 salles de bain',
    category: 'transit',
    x: 530,
    y: 330,
    routeFromElevator: '530,330',
    routeFromStairs: '137,190 137,146 208,146 208,336 496,336 496,330 530,330',
    color: 'magenta',
  },
];

type GridPoint = { x: number; y: number };

const LEVEL_03_EDGES: Array<[[number, number], [number, number]]> = [
  // Main horizontal bridge spine (y = 342)
  [
    [176, 342],
    [184, 342],
  ],
  [
    [184, 342],
    [232, 342],
  ],
  [
    [232, 342],
    [268, 342],
  ],
  [
    [268, 342],
    [284, 342],
  ],
  [
    [284, 342],
    [300, 342],
  ],
  [
    [300, 342],
    [301, 342],
  ],
  [
    [301, 342],
    [322, 342],
  ],
  [
    [322, 342],
    [379, 342],
  ],
  [
    [379, 342],
    [439, 342],
  ],
  [
    [439, 342],
    [440, 342],
  ],
  [
    [440, 342],
    [512, 342],
  ],

  // West Atrium vertical spine (x = 184)
  [
    [184, 190],
    [184, 213],
  ],
  [
    [184, 213],
    [184, 232],
  ],
  [
    [184, 232],
    [184, 299],
  ],
  [
    [184, 299],
    [184, 342],
  ],
  [
    [184, 342],
    [184, 367],
  ],
  [
    [184, 367],
    [184, 451],
  ],
  [
    [184, 451],
    [184, 606],
  ],

  // Far-West Parquet vertical spine (x = 147)
  [
    [147, 190],
    [147, 367],
  ],
  [
    [147, 367],
    [147, 606],
  ],

  // East Elevator Core vertical spine (x = 512)
  [
    [512, 281],
    [512, 342],
  ],
  [
    [512, 342],
    [512, 345],
  ],
  [
    [512, 345],
    [512, 405],
  ],

  // Node spurs & cross-links
  [
    [147, 190],
    [184, 190],
  ],
  [
    [133, 367],
    [147, 367],
  ],
  [
    [147, 367],
    [176, 367],
  ],
  [
    [176, 367],
    [184, 367],
  ],
  [
    [176, 367],
    [176, 342],
  ],
  [
    [194, 213],
    [184, 213],
  ],
  [
    [197, 232],
    [184, 232],
  ],
  [
    [207, 299],
    [184, 299],
  ],
  [
    [440, 363],
    [440, 342],
  ],
  [
    [439, 312],
    [439, 342],
  ],
  [
    [379, 341],
    [379, 342],
  ],
  [
    [232, 361],
    [232, 342],
  ],
  [
    [268, 324],
    [268, 342],
  ],
  [
    [284, 324],
    [284, 342],
  ],
  [
    [300, 324],
    [300, 342],
  ],
  [
    [301, 361],
    [301, 342],
  ],
  [
    [147, 606],
    [165, 606],
  ],
  [
    [165, 606],
    [184, 606],
  ],
  [
    [197, 451],
    [184, 451],
  ],
  [
    [314, 415],
    [322, 415],
  ],
  [
    [322, 415],
    [322, 342],
  ],
  [
    [571, 281],
    [512, 281],
  ],
  [
    [571, 405],
    [512, 405],
  ],
  [
    [551, 345],
    [512, 345],
  ],
];

const LEVEL_04_EDGES: Array<[[number, number], [number, number]]> = [
  // Central horizontal spine (y = 336)
  [
    [208, 336],
    [273, 336],
  ],
  [
    [273, 336],
    [341, 336],
  ],
  [
    [341, 336],
    [496, 336],
  ],

  // North-West vertical spine (x = 208)
  [
    [208, 140],
    [208, 146],
  ],
  [
    [208, 146],
    [208, 198],
  ],
  [
    [208, 198],
    [208, 336],
  ],

  // North-West Stairs & Cafe connectors
  [
    [137, 190],
    [137, 146],
  ],
  [
    [137, 146],
    [137, 140],
  ],
  [
    [137, 146],
    [208, 146],
  ],
  [
    [137, 140],
    [140, 140],
  ],
  [
    [140, 140],
    [164, 140],
  ],
  [
    [164, 140],
    [208, 140],
  ],
  [
    [140, 77],
    [140, 140],
  ],
  [
    [164, 59],
    [164, 140],
  ],
  [
    [221, 146],
    [208, 146],
  ],
  [
    [213, 198],
    [208, 198],
  ],

  // South-West vertical spine (x = 273)
  [
    [273, 336],
    [273, 403],
  ],
  [
    [273, 403],
    [273, 514],
  ],
  [
    [273, 514],
    [273, 522],
  ],

  // South-West horizontal spine (y = 522) & spurs
  [
    [221, 522],
    [273, 522],
  ],
  [
    [273, 522],
    [365, 522],
  ],
  [
    [221, 495],
    [221, 522],
  ],
  [
    [284, 514],
    [273, 514],
  ],
  [
    [365, 501],
    [365, 522],
  ],
  [
    [341, 350],
    [341, 336],
  ],
  [
    [292, 403],
    [273, 403],
  ],

  // East Elevator Core vertical spine (x = 496)
  [
    [496, 252],
    [496, 266],
  ],
  [
    [496, 266],
    [496, 330],
  ],
  [
    [496, 330],
    [496, 336],
  ],
  [
    [496, 336],
    [496, 384],
  ],
  [
    [496, 384],
    [496, 404],
  ],
  [
    [530, 330],
    [496, 330],
  ],
  [
    [556, 266],
    [496, 266],
  ],
  [
    [556, 384],
    [496, 384],
  ],

  // East Wing: Primary South Food Area & Hip To Be Square (doorway at 852,356)
  [
    [496, 404],
    [852, 404],
  ],
  [
    [852, 446],
    [852, 404],
  ],
  [
    [852, 404],
    [852, 356],
  ],
  [
    [812, 356],
    [852, 356],
  ],

  // East Wing: Secondary North Food Area
  [
    [496, 252],
    [852, 252],
  ],
  [
    [852, 224],
    [852, 252],
  ],
];

function computeShortestCorridorPath(
  floor: FloorId,
  startCandidates: GridPoint[],
  endCandidates: GridPoint[],
): { points: string; distance: number; startPt: GridPoint; endPt: GridPoint } {
  const edges = floor === '03' ? LEVEL_03_EDGES : LEVEL_04_EDGES;
  const adj = new Map<string, Array<{ key: string; cost: number }>>();
  const coords = new Map<string, GridPoint>();

  for (const [[x1, y1], [x2, y2]] of edges) {
    const k1 = `${x1},${y1}`;
    const k2 = `${x2},${y2}`;
    coords.set(k1, { x: x1, y: y1 });
    coords.set(k2, { x: x2, y: y2 });
    const cost = Math.hypot(x2 - x1, y2 - y1);
    if (!adj.has(k1)) adj.set(k1, []);
    if (!adj.has(k2)) adj.set(k2, []);
    adj.get(k1)!.push({ key: k2, cost });
    adj.get(k2)!.push({ key: k1, cost });
  }

  let bestResult: {
    points: string;
    distance: number;
    startPt: GridPoint;
    endPt: GridPoint;
  } | null = null;

  for (const sPt of startCandidates) {
    for (const ePt of endCandidates) {
      const startKey = `${sPt.x},${sPt.y}`;
      const endKey = `${ePt.x},${ePt.y}`;

      if (startKey === endKey) {
        return {
          points: startKey,
          distance: 0,
          startPt: sPt,
          endPt: ePt,
        };
      }

      const dist = new Map<string, number>();
      const prev = new Map<string, string>();
      const visited = new Set<string>();

      for (const k of adj.keys()) {
        dist.set(k, Infinity);
      }
      dist.set(startKey, 0);

      while (true) {
        let u: string | null = null;
        let minD = Infinity;
        for (const [k, d] of dist.entries()) {
          if (!visited.has(k) && d < minD) {
            minD = d;
            u = k;
          }
        }
        if (u === null || u === endKey) break;
        visited.add(u);

        for (const neighbor of adj.get(u) ?? []) {
          if (visited.has(neighbor.key)) continue;
          const alt = minD + neighbor.cost;
          if (alt < (dist.get(neighbor.key) ?? Infinity)) {
            dist.set(neighbor.key, alt);
            prev.set(neighbor.key, u);
          }
        }
      }

      const totalDist = dist.get(endKey) ?? Infinity;
      if (totalDist < Infinity) {
        const pathKeys: string[] = [];
        let curr: string | undefined = endKey;
        while (curr) {
          pathKeys.unshift(curr);
          curr = prev.get(curr);
        }

        // Simplify collinear intermediate points for clean SVG polylines
        const pts = pathKeys.map((k) => coords.get(k)!);
        const simplified: GridPoint[] = [];
        for (const p of pts) {
          if (simplified.length >= 2) {
            const p1 = simplified[simplified.length - 2];
            const p2 = simplified[simplified.length - 1];
            const collinearX = p1.x === p2.x && p2.x === p.x;
            const collinearY = p1.y === p2.y && p2.y === p.y;
            if (collinearX || collinearY) {
              simplified[simplified.length - 1] = p;
              continue;
            }
          }
          simplified.push(p);
        }

        if (!bestResult || totalDist < bestResult.distance) {
          bestResult = {
            points: simplified.map((p) => `${p.x},${p.y}`).join(' '),
            distance: totalDist,
            startPt: sPt,
            endPt: ePt,
          };
        }
      }
    }
  }

  const fallbackS = startCandidates[0];
  const fallbackE = endCandidates[0];
  return (
    bestResult ?? {
      points: `${fallbackS.x},${fallbackS.y} ${fallbackE.x},${fallbackE.y}`,
      distance: Math.hypot(
        fallbackE.x - fallbackS.x,
        fallbackE.y - fallbackS.y,
      ),
      startPt: fallbackS,
      endPt: fallbackE,
    }
  );
}

function getNodeCandidatePoints(
  node: MapNode,
  overridePt: GridPoint | null,
): GridPoint[] {
  if (overridePt) return [overridePt];
  if (node.id === 'l3-sponsor-g1') {
    return [
      { x: 268, y: 324 },
      { x: 300, y: 324 },
      { x: 301, y: 361 },
      { x: 194, y: 213 },
    ];
  }
  if (node.id === 'l3-restrooms') {
    return [
      { x: 314, y: 415 },
      { x: 571, y: 281 },
      { x: 571, y: 405 },
    ];
  }
  if (node.id === 'l4-restrooms') {
    return [
      { x: 292, y: 403 },
      { x: 556, y: 266 },
      { x: 556, y: 384 },
    ];
  }
  return [{ x: node.x, y: node.y }];
}

export type TronMapFocusRequest = {
  floor: '03' | '04';
  destinationNodeId: string;
  originNodeId?: string;
  labelEn?: string;
  labelFr?: string;
  seq: number;
};

type TronSpaceNavigatorProps = {
  rooms: RoomTrack[];
  onSelectRoomSchedule?: (roomId: string) => void;
  locale?: string;
  focusRequest?: TronMapFocusRequest | null;
};

export function TronSpaceNavigator({
  rooms,
  onSelectRoomSchedule,
  locale = 'en',
  focusRequest = null,
}: TronSpaceNavigatorProps) {
  const isFr = locale === 'fr';
  const [activeFloor, setActiveFloor] = useState<FloorId>('03');
  const [renderMode, setRenderMode] = useState<RenderMode>('tron');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [originNodeId, setOriginNodeId] = useState<string>('l3-elevators');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('l3-room-1');
  const [mapSelectionTarget, setMapSelectionTarget] = useState<
    'destination' | 'origin'
  >('destination');
  const [originPointOverride, setOriginPointOverride] =
    useState<GridPoint | null>(null);
  const [destPointOverride, setDestPointOverride] = useState<GridPoint | null>(
    null,
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const mapScrollRef = useRef<HTMLDivElement>(null);
  const mapViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focusRequest) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveFloor(focusRequest.floor);
    setSelectedCategory('all');
    setOriginPointOverride(null);
    setDestPointOverride(null);
    setMapSelectionTarget('destination');
    setOriginNodeId(
      focusRequest.originNodeId ||
        (focusRequest.floor === '03' ? 'l3-elevators' : 'l4-elevators'),
    );
    setSelectedNodeId(focusRequest.destinationNodeId);

    requestAnimationFrame(() => {
      mapViewportRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, [focusRequest]);

  const floorNodes = useMemo(
    () =>
      MAP_NODES.filter(
        (n) =>
          n.floor === activeFloor &&
          (selectedCategory === 'all' || n.category === selectedCategory),
      ),
    [activeFloor, selectedCategory],
  );

  const allCurrentFloorNodes = useMemo(
    () => MAP_NODES.filter((n) => n.floor === activeFloor),
    [activeFloor],
  );

  const originNode = useMemo(() => {
    const found = MAP_NODES.find(
      (n) => n.id === originNodeId && n.floor === activeFloor,
    );
    if (found) return found;
    return (
      MAP_NODES.find(
        (n) =>
          n.id === (activeFloor === '03' ? 'l3-elevators' : 'l4-elevators'),
      ) || MAP_NODES[0]
    );
  }, [originNodeId, activeFloor]);

  const selectedNode = useMemo(() => {
    const found = MAP_NODES.find(
      (n) => n.id === selectedNodeId && n.floor === activeFloor,
    );
    if (found) return found;
    return MAP_NODES.find((n) => n.floor === activeFloor) || MAP_NODES[0];
  }, [selectedNodeId, activeFloor]);

  const linkedRoomSchedule = useMemo(() => {
    if (!selectedNode.roomScheduleId) return undefined;
    return rooms.find((r) => r.id === selectedNode.roomScheduleId);
  }, [rooms, selectedNode]);

  const centerMapOnPoint = useCallback(
    (x: number, y: number, targetZoom: number) => {
      const container = mapScrollRef.current;
      if (!container || targetZoom <= 1) return;
      requestAnimationFrame(() => {
        setTimeout(() => {
          const el = mapScrollRef.current;
          if (!el) return;
          const targetLeft = Math.max(
            0,
            (x / 1000) * el.scrollWidth - el.clientWidth / 2,
          );
          const targetTop = Math.max(
            0,
            (y / 700) * el.scrollHeight - el.clientHeight / 2,
          );
          el.scrollTo({
            left: targetLeft,
            top: targetTop,
            behavior: 'smooth',
          });
        }, 40);
      });
    },
    [],
  );

  const handleZoomChange = (nextZoom: number, focusNode = selectedNode) => {
    const clamped = Math.min(Math.max(nextZoom, 1), 2.5);
    setZoomLevel(clamped);
    if (clamped > 1) {
      centerMapOnPoint(focusNode.x, focusNode.y, clamped);
    } else if (mapScrollRef.current) {
      mapScrollRef.current.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  };

  const handleFloorSwitch = (floor: FloorId) => {
    setActiveFloor(floor);
    setHoveredNodeId(null);
    setOriginPointOverride(null);
    setDestPointOverride(null);
    setMapSelectionTarget('destination');
    setOriginNodeId(floor === '03' ? 'l3-elevators' : 'l4-elevators');
    const defaultId = floor === '03' ? 'l3-room-1' : 'l4-room-6';
    setSelectedNodeId(defaultId);
    const nextNode = MAP_NODES.find((n) => n.id === defaultId);
    if (nextNode && zoomLevel > 1) {
      centerMapOnPoint(nextNode.x, nextNode.y, zoomLevel);
    }
  };

  const handleNodeClick = (
    node: MapNode,
    scrollToMapOnMobile = false,
    specificPoint?: GridPoint,
  ) => {
    const targetPt = specificPoint ?? { x: node.x, y: node.y };
    if (mapSelectionTarget === 'origin') {
      setOriginNodeId(node.id);
      setOriginPointOverride(specificPoint ?? null);
      setMapSelectionTarget('destination');
    } else {
      setSelectedNodeId(node.id);
      setDestPointOverride(specificPoint ?? null);
    }

    if (zoomLevel > 1) {
      centerMapOnPoint(targetPt.x, targetPt.y, zoomLevel);
    }
    if (
      scrollToMapOnMobile &&
      typeof window !== 'undefined' &&
      window.innerWidth < 1024
    ) {
      mapViewportRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  const handleSwapOriginAndDest = () => {
    const prevOriginId = originNode.id;
    const prevOriginPt = originPointOverride;
    setOriginNodeId(selectedNode.id);
    setOriginPointOverride(destPointOverride);
    setSelectedNodeId(prevOriginId);
    setDestPointOverride(prevOriginPt);
  };

  const isRestroomSelected =
    selectedNode.id === 'l3-restrooms' ||
    selectedNode.id === 'l4-restrooms' ||
    originNode.id === 'l3-restrooms' ||
    originNode.id === 'l4-restrooms';

  const computedRoute = useMemo(() => {
    const startCandidates = getNodeCandidatePoints(
      originNode,
      originPointOverride,
    );
    const endCandidates = getNodeCandidatePoints(
      selectedNode,
      destPointOverride,
    );
    return computeShortestCorridorPath(
      activeFloor,
      startCandidates,
      endCandidates,
    );
  }, [
    activeFloor,
    originNode,
    originPointOverride,
    selectedNode,
    destPointOverride,
  ]);

  const activeRoutePoints = computedRoute.points;

  return (
    <div
      ref={mapViewportRef}
      className="relative overflow-hidden rounded-2xl border border-cyan-400/35 bg-[#040814]/95 p-3.5 sm:p-6 md:p-8 shadow-[0_0_70px_rgba(0,240,255,0.12)] backdrop-blur-2xl"
    >
      {/* Top Laser Border */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00f0ff]" />

      {focusRequest && (focusRequest.labelEn || focusRequest.labelFr) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-fuchsia-400/50 bg-fuchsia-500/15 px-4 py-2.5 font-mono-tech text-xs text-fuchsia-200 shadow-[0_0_20px_rgba(217,70,239,0.2)]">
          <div className="flex items-center gap-2">
            <Navigation className="h-3.5 w-3.5 text-fuchsia-300 animate-pulse shrink-0" />
            <span className="font-bold uppercase tracking-wider">
              {isFr ? 'TRAJET MON AGENDA :' : 'ACTIVE AGENDA ROUTE:'}
            </span>
            <span className="text-white">
              {isFr
                ? focusRequest.labelFr || focusRequest.labelEn
                : focusRequest.labelEn}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-fuchsia-300/80">
            {isFr ? `Niveau ${activeFloor}` : `Level ${activeFloor}`}
          </span>
        </div>
      )}

      {/* Top HUD Command Bar */}
      <div className="mb-4 sm:mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-3.5 sm:gap-4 border-b border-cyan-500/20 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Compass
              className="h-4 w-4 text-cyan-400 animate-spin shrink-0"
              style={{ animationDuration: '12s' }}
            />
            <span className="font-mono-tech text-[10px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.28em] text-cyan-400">
              {isFr
                ? 'SYSTÈME DE NAVIGATION SPATIALE // AX.C HUB'
                : 'TRON SPACE NAVIGATOR // AX.C HUB'}
            </span>
          </div>
          <h3 className="mt-1 font-display text-xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">
            {isFr
              ? 'Carte Interactive — Niveau '
              : 'Interactive Floor Grid — Level '}
            <span className="text-cyan-400 neon-glow-cyan">{activeFloor}</span>
          </h3>
        </div>

        {/* Controls: Floor Switcher + Render Mode (Full-width segmented bars on mobile) */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-2.5 w-full xl:w-auto">
          {/* Floor Toggle */}
          <div className="grid grid-cols-2 sm:inline-flex rounded-xl border border-cyan-400/40 bg-[#071024] p-1 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
            <button
              type="button"
              onClick={() => handleFloorSwitch('03')}
              className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-3 sm:px-4 py-2 font-mono-tech text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeFloor === '03'
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                  : 'text-cyan-200/70 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5 shrink-0" />
              <span>{isFr ? 'Niveau 03 (3e)' : 'Level 03 (3F)'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleFloorSwitch('04')}
              className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-3 sm:px-4 py-2 font-mono-tech text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeFloor === '04'
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                  : 'text-cyan-200/70 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5 shrink-0" />
              <span>{isFr ? 'Niveau 04 (4e)' : 'Level 04 (4F)'}</span>
            </button>
          </div>

          {/* Render Mode Selector */}
          <div className="grid grid-cols-2 sm:inline-flex rounded-xl border border-white/15 bg-[#070d1c] p-1">
            <button
              type="button"
              onClick={() => setRenderMode('tron')}
              className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-mono-tech text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                renderMode === 'tron'
                  ? 'bg-fuchsia-500/25 border border-fuchsia-400/60 text-fuchsia-200 shadow-[0_0_12px_rgba(217,70,239,0.3)]'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              <Cpu className="h-3.5 w-3.5 shrink-0" />
              <span>TRON Ray-Trace</span>
            </button>
            <button
              type="button"
              onClick={() => setRenderMode('blueprint')}
              className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-mono-tech text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                renderMode === 'blueprint'
                  ? 'bg-google-yellow/25 border border-google-yellow/60 text-google-yellow'
                  : 'text-white/55 hover:text-white'
              }`}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{isFr ? 'Plan Original' : 'Original Map'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Point-to-Point Wayfinding Planner: Select Where You Are & Where You Want To Go */}
      <div className="mb-3.5 sm:mb-4 rounded-xl border border-cyan-400/30 bg-[#060d1f]/90 p-2.5 sm:p-3.5 shadow-[0_0_25px_rgba(0,240,255,0.08)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
          {/* WHERE I AM (START / ORIGIN) */}
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border p-2 sm:px-3 sm:py-2 transition-all ${
              mapSelectionTarget === 'origin'
                ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'border-emerald-500/35 bg-[#081523]/80'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/25 border border-emerald-400/60 text-emerald-300">
                <LocateFixed className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="map-origin-select"
                  className="block font-mono-tech text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-300"
                >
                  {isFr ? '📍 Où je suis (Départ)' : '📍 Where I Am (Start)'}
                </label>
                <select
                  id="map-origin-select"
                  value={originNode.id}
                  onChange={(e) => {
                    setOriginNodeId(e.target.value);
                    setOriginPointOverride(null);
                  }}
                  className="mt-0.5 w-full bg-transparent font-display text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer truncate"
                >
                  {allCurrentFloorNodes.map((n) => (
                    <option
                      key={`origin-opt-${n.id}`}
                      value={n.id}
                      className="bg-[#071024] text-white"
                    >
                      {n.numberBadge ? `[${n.numberBadge}] ` : ''}
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setMapSelectionTarget(
                  mapSelectionTarget === 'origin' ? 'destination' : 'origin',
                )
              }
              className={`shrink-0 rounded-md border px-2.5 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                mapSelectionTarget === 'origin'
                  ? 'border-emerald-300 bg-emerald-400 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  : 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/30'
              }`}
            >
              {mapSelectionTarget === 'origin'
                ? isFr
                  ? 'Touchez une icône...'
                  : 'Tap map icon...'
                : isFr
                  ? 'Choisir sur carte'
                  : 'Pick on Map'}
            </button>
          </div>

          {/* SWAP ORIGIN <-> DESTINATION BUTTON */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleSwapOriginAndDest}
              title={
                isFr
                  ? 'Inverser le départ et la destination'
                  : 'Swap Start and Destination'
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/35 bg-[#09142a] px-3 py-1.5 lg:p-2 font-mono-tech text-[10px] uppercase tracking-wider text-cyan-300 hover:border-cyan-400 hover:bg-cyan-400/20 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span className="lg:hidden">
                {isFr ? 'Inverser' : 'Swap Route'}
              </span>
            </button>
          </div>

          {/* WHERE I WANT TO GO (DESTINATION) */}
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border p-2 sm:px-3 sm:py-2 transition-all ${
              mapSelectionTarget === 'destination'
                ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'border-cyan-500/30 bg-[#081226]/80'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cyan-500/25 border border-cyan-400/60 text-cyan-300">
                <Navigation className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="map-dest-select"
                  className="block font-mono-tech text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-300"
                >
                  {isFr
                    ? '🏁 Où je veux aller (Destination)'
                    : '🏁 Where I Want To Go (Destination)'}
                </label>
                <select
                  id="map-dest-select"
                  value={selectedNode.id}
                  onChange={(e) => {
                    setSelectedNodeId(e.target.value);
                    setDestPointOverride(null);
                  }}
                  className="mt-0.5 w-full bg-transparent font-display text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer truncate"
                >
                  {allCurrentFloorNodes.map((n) => (
                    <option
                      key={`dest-opt-${n.id}`}
                      value={n.id}
                      className="bg-[#071024] text-white"
                    >
                      {n.numberBadge ? `[${n.numberBadge}] ` : ''}
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMapSelectionTarget('destination')}
              className={`shrink-0 rounded-md border px-2.5 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                mapSelectionTarget === 'destination'
                  ? 'border-cyan-300 bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,240,255,0.5)]'
                  : 'border-cyan-400/40 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/30'
              }`}
            >
              {mapSelectionTarget === 'destination'
                ? isFr
                  ? 'Mode Carte Actif'
                  : 'Map Tap Active'
                : isFr
                  ? 'Choisir sur carte'
                  : 'Pick on Map'}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Bar (Single-row horizontal scroll on mobile) */}
      <div className="mb-3.5 sm:mb-4 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap -mx-1 px-1">
        {[
          { id: 'all', labelEn: 'All Zones', labelFr: 'Toutes les zones' },
          {
            id: 'room',
            labelEn: 'Event Rooms (♦)',
            labelFr: 'Salles de conf. (♦)',
          },
          {
            id: 'coaching',
            labelEn: '1:1 Coaching',
            labelFr: 'Mentorat 1:1',
          },
          {
            id: 'sponsor',
            labelEn: 'Sponsors & Reg',
            labelFr: 'Sponsors & Accueil',
          },
          {
            id: 'activity',
            labelEn: 'Retro & Chill',
            labelFr: 'Rétro & Détente',
          },
          {
            id: 'amenity',
            labelEn: 'Food & Restrooms (WC)',
            labelFr: 'Repas & Salles de bain (WC)',
          },
          {
            id: 'transit',
            labelEn: 'Stairs & Elevators',
            labelFr: 'Escaliers & Asc.',
          },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 rounded-lg border px-2.5 sm:px-3 py-1.5 font-mono-tech text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'border-cyan-400 bg-cyan-400/15 text-cyan-300'
                : 'border-white/10 bg-white/[0.02] text-white/55 hover:border-white/25 hover:text-white'
            }`}
          >
            {isFr ? cat.labelFr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Quick-Tap Room & Booth Strip (Especially handy on mobile thumbs to switch targets while viewing the map) */}
      <div className="mb-3.5 flex items-center gap-1.5 overflow-x-auto pb-1.5 -mx-1 px-1">
        {allCurrentFloorNodes.map((node) => {
          const isSelected = selectedNode.id === node.id;
          return (
            <button
              key={`quick-pill-${node.id}`}
              type="button"
              onClick={() => handleNodeClick(node)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono-tech text-[11px] transition-all cursor-pointer ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-400/20 text-white shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  : 'border-white/10 bg-[#081022]/90 text-white/65 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              <span
                className={`inline-flex h-4 min-w-4 items-center justify-center rounded px-1 text-[10px] font-bold ${
                  node.category === 'room'
                    ? 'bg-google-red text-white'
                    : node.category === 'sponsor' ||
                        node.category === 'coaching'
                      ? 'bg-emerald-500 text-black'
                      : 'bg-cyan-400 text-black'
                }`}
              >
                {node.numberBadge}
              </span>
              <span className="max-w-[130px] sm:max-w-[160px] truncate">
                {node.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Map Viewport (8 cols) + Right Telemetry Inspector (4 cols) */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-12">
        {/* TRON Ray-Traced Floor Map Canvas */}
        <div className="lg:col-span-8">
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#02050d] shadow-[inset_0_0_60px_rgba(0,240,255,0.08)]">
            {/* Animated Radar Sweep Line */}
            <div className="scanning-line pointer-events-none z-20" />

            {/* Floating Mobile/Desktop Map Zoom Controls (Top-Left Overlay) */}
            <div className="absolute left-2.5 top-2.5 z-30 flex items-center gap-1 rounded-xl border border-cyan-400/35 bg-[#050c1d]/90 p-1 shadow-[0_0_18px_rgba(0,0,0,0.7)] backdrop-blur-md">
              <button
                type="button"
                onClick={() => handleZoomChange(zoomLevel - 0.75)}
                disabled={zoomLevel <= 1}
                aria-label="Zoom out"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-cyan-300 transition-colors hover:bg-cyan-400/20 disabled:opacity-35 cursor-pointer"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleZoomChange(zoomLevel === 1 ? 1.75 : 1)}
                className="rounded-md px-2 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-cyan-200 hover:bg-cyan-400/15 cursor-pointer"
              >
                {zoomLevel === 1 ? '1×' : `${zoomLevel.toFixed(1)}×`}
              </button>
              <button
                type="button"
                onClick={() => handleZoomChange(zoomLevel + 0.75)}
                disabled={zoomLevel >= 2.5}
                aria-label="Zoom in"
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-cyan-300 transition-colors hover:bg-cyan-400/20 disabled:opacity-35 cursor-pointer"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              {zoomLevel > 1 && (
                <button
                  type="button"
                  onClick={() => handleZoomChange(1)}
                  aria-label="Reset zoom"
                  className="inline-flex h-7 items-center gap-1 rounded-lg border border-cyan-400/30 bg-cyan-400/15 px-2 font-mono-tech text-[10px] uppercase text-cyan-200 hover:bg-cyan-400/25 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span className="hidden sm:inline">
                    {isFr ? 'Ajuster' : 'Fit'}
                  </span>
                </button>
              )}
            </div>

            {/* Top-Right Level Watermark */}
            <div className="pointer-events-none absolute right-3 sm:right-4 top-2.5 sm:top-3 z-20 text-right">
              <div className="font-mono-tech text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-cyan-400/70">
                NIVEAU / LEVEL
              </div>
              <div className="font-display text-2xl sm:text-5xl font-black leading-none tracking-tighter text-cyan-400/25">
                {activeFloor}
              </div>
            </div>

            {/* Scrollable / Pan-Ready Map Viewport Container */}
            <div
              ref={mapScrollRef}
              className={`relative w-full ${
                zoomLevel > 1
                  ? 'overflow-auto touch-pan-x touch-pan-y cursor-grab active:cursor-grabbing'
                  : 'overflow-hidden'
              }`}
            >
              <div
                style={{ width: `${zoomLevel * 100}%` }}
                className="relative aspect-[1000/700] transition-[width] duration-200 ease-out"
              >
                {/* Architectural Map Image (Glowing Cyan CAD Wireframe in TRON Mode, Full Color in Original Mode) */}
                <div className="pointer-events-none absolute inset-0 z-0">
                  <Image
                    src={`/assets/images/maps/level-${activeFloor}.jpg`}
                    alt={`Level ${activeFloor} floor plan`}
                    fill
                    className={`object-fill transition-all duration-500 ${
                      renderMode === 'tron'
                        ? 'invert hue-rotate-180 contrast-150 brightness-75 saturate-200 opacity-35 mix-blend-screen'
                        : 'opacity-90'
                    }`}
                  />
                </div>

                {/* SVG Ray-Traced Vector Architecture & Interactive Overlay */}
                <svg
                  viewBox="0 0 1000 700"
                  className="relative z-10 h-full w-full select-none"
                >
                  <defs>
                    {/* Neon Cyan Glow Filter */}
                    <filter
                      id="tron-cyan-glow"
                      x="-30%"
                      y="-30%"
                      width="160%"
                      height="160%"
                    >
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Neon Pink/Red Glow Filter */}
                    <filter
                      id="tron-red-glow"
                      x="-40%"
                      y="-40%"
                      width="180%"
                      height="180%"
                    >
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Diagonal Hatch Pattern for Utility/Atrium Cores */}
                    <pattern
                      id="tron-hatch"
                      width="10"
                      height="10"
                      patternTransform="rotate(45 0 0)"
                      patternUnits="userSpaceOnUse"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="10"
                        stroke="rgba(0, 240, 255, 0.18)"
                        strokeWidth="1.5"
                      />
                    </pattern>

                    {/* Fine Subgrid Pattern */}
                    <pattern
                      id="tron-subgrid"
                      width="25"
                      height="25"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 25 0 L 0 0 0 25"
                        fill="none"
                        stroke="rgba(0, 240, 255, 0.06)"
                        strokeWidth="0.75"
                      />
                    </pattern>
                  </defs>

                  {/* Base TRON Coordinate Grid */}
                  {renderMode === 'tron' && (
                    <rect width="1000" height="700" fill="url(#tron-subgrid)" />
                  )}

                  {/* Architectural Vector Blueprint Walls & Corridors (Visible in TRON mode) */}
                  {renderMode === 'tron' && (
                    <g className="transition-opacity duration-500">
                      {/* Outer Building Hull — West Wing + Bridge + East Wing */}
                      <polygon
                        points="28,46 412,42 414,185 506,185 506,170 520,170 520,108 824,112 824,188 886,190 895,355 880,505 824,505 818,578 510,575 510,520 495,520 495,495 415,495 415,636 42,626"
                        fill="rgba(4, 10, 24, 0.45)"
                        stroke="#00f0ff"
                        strokeWidth="2.2"
                        filter="url(#tron-cyan-glow)"
                      />

                      {/* East Wing Central Hatched Courtyard Core */}
                      <rect
                        x="578"
                        y="268"
                        width="148"
                        height="145"
                        fill="url(#tron-hatch)"
                        stroke="rgba(0, 240, 255, 0.45)"
                        strokeWidth="1.5"
                      />

                      {/* Level 03 Specific Vector Rooms & Walkable Corridors */}
                      {activeFloor === '03' && (
                        <g>
                          {/* Walkable Corridor Conduits (Level 03) */}
                          <g
                            fill="rgba(0, 240, 255, 0.06)"
                            stroke="rgba(0, 240, 255, 0.35)"
                            strokeDasharray="5 4"
                            strokeWidth="1"
                          >
                            {/* Central East-West Bridge Corridor */}
                            <rect x="176" y="328" width="340" height="28" />
                            {/* West Atrium North-South Corridor */}
                            <rect x="172" y="166" width="24" height="445" />
                            {/* East Wing Elevator Lobby & Courtyard Corridor */}
                            <rect x="504" y="252" width="20" height="184" />
                          </g>

                          {/* West Wing Inner Hatched Utility Cores */}
                          <rect
                            x="244"
                            y="170"
                            width="72"
                            height="142"
                            fill="url(#tron-hatch)"
                            stroke="rgba(0, 240, 255, 0.35)"
                            strokeWidth="1.2"
                          />
                          <rect
                            x="240"
                            y="376"
                            width="76"
                            height="122"
                            fill="url(#tron-hatch)"
                            stroke="rgba(0, 240, 255, 0.35)"
                            strokeWidth="1.2"
                          />

                          {/* Le Parquet — Main Stage 3-1 Zone */}
                          <rect
                            x="110"
                            y="122"
                            width="90"
                            height="465"
                            rx="4"
                            fill="rgba(251, 188, 4, 0.07)"
                            stroke="rgba(251, 188, 4, 0.45)"
                            strokeWidth="1.5"
                          />
                          <text
                            x="155"
                            y="338"
                            textAnchor="middle"
                            className="fill-yellow-300/75 font-mono-tech text-[10px] uppercase tracking-widest"
                          >
                            LE PARQUET
                          </text>

                          {/* Room #321 (2 - Mr. Roboto) */}
                          <rect
                            x="205"
                            y="196"
                            width="39"
                            height="48"
                            fill="rgba(0, 240, 255, 0.14)"
                            stroke="#00f0ff"
                            strokeWidth="1.6"
                          />
                          {/* Room #319 (3 - Take On Me) */}
                          <rect
                            x="205"
                            y="284"
                            width="39"
                            height="34"
                            fill="rgba(52, 211, 153, 0.14)"
                            stroke="#34d399"
                            strokeWidth="1.6"
                          />

                          {/* Room #342 (5 - Just Can't Get Enough) */}
                          <rect
                            x="416"
                            y="263"
                            width="76"
                            height="56"
                            fill="rgba(234, 67, 53, 0.16)"
                            stroke="#ea4335"
                            strokeWidth="1.8"
                          />
                          {/* Room #302 (4 - Call Me) */}
                          <rect
                            x="416"
                            y="366"
                            width="42"
                            height="62"
                            fill="rgba(234, 67, 53, 0.16)"
                            stroke="#ea4335"
                            strokeWidth="1.8"
                          />
                        </g>
                      )}

                      {/* Level 04 Specific Vector Rooms & Walkable Corridors */}
                      {activeFloor === '04' && (
                        <g>
                          {/* Walkable Corridor Conduits (Level 04) */}
                          <g
                            fill="rgba(0, 240, 255, 0.06)"
                            stroke="rgba(0, 240, 255, 0.35)"
                            strokeDasharray="5 4"
                            strokeWidth="1"
                          >
                            {/* Central East-West Bridge Corridor */}
                            <rect x="200" y="324" width="302" height="22" />
                            {/* North-West Corridor (Stairs / Le Café to Central Bridge) */}
                            <rect x="198" y="134" width="22" height="202" />
                            <rect x="130" y="134" width="88" height="20" />
                            {/* South-West Corridor (to #415, #410, #403.1) */}
                            <rect x="266" y="346" width="16" height="184" />
                            <rect x="218" y="514" width="152" height="16" />
                            {/* East Wing Ring Corridor to Primary Food Area & Le Square Doorway */}
                            <rect x="488" y="242" width="18" height="172" />
                            <rect x="488" y="242" width="376" height="18" />
                            <rect x="488" y="396" width="376" height="18" />
                          </g>

                          {/* West Wing Inner Hatched Utility Cores */}
                          <rect
                            x="268"
                            y="185"
                            width="44"
                            height="138"
                            fill="url(#tron-hatch)"
                            stroke="rgba(0, 240, 255, 0.35)"
                            strokeWidth="1.2"
                          />
                          <rect
                            x="226"
                            y="374"
                            width="40"
                            height="102"
                            fill="url(#tron-hatch)"
                            stroke="rgba(0, 240, 255, 0.35)"
                            strokeWidth="1.2"
                          />

                          {/* Le Café (1 - The Danger Zone + Badge Station) */}
                          <rect
                            x="98"
                            y="44"
                            width="95"
                            height="84"
                            fill="rgba(56, 189, 248, 0.15)"
                            stroke="#38bdf8"
                            strokeWidth="1.8"
                          />
                          <text
                            x="145"
                            y="116"
                            textAnchor="middle"
                            className="fill-sky-300/80 font-mono-tech text-[9px] uppercase tracking-widest"
                          >
                            LE CAFÉ
                          </text>

                          {/* Le Parquet Upper Mezzanine Void (Hatched) */}
                          <rect
                            x="28"
                            y="128"
                            width="165"
                            height="404"
                            fill="url(#tron-hatch)"
                            stroke="rgba(0, 240, 255, 0.25)"
                            strokeWidth="1.2"
                          />
                          <text
                            x="110"
                            y="340"
                            textAnchor="middle"
                            className="fill-cyan-300/60 font-mono-tech text-[10px] uppercase tracking-widest"
                          >
                            LE PARQUET (MEZZANINE)
                          </text>

                          {/* Room #403 (4 - Under Pressure) */}
                          <rect
                            x="315"
                            y="346"
                            width="68"
                            height="91"
                            fill="rgba(234, 67, 53, 0.16)"
                            stroke="#ea4335"
                            strokeWidth="1.8"
                          />
                          {/* Room #403.1 (5 - Never Gonna Give You Up) */}
                          <rect
                            x="315"
                            y="437"
                            width="68"
                            height="93"
                            fill="rgba(234, 67, 53, 0.16)"
                            stroke="#ea4335"
                            strokeWidth="1.8"
                          />

                          {/* Coaching Pods: #418 (2), #415 (3), #410 (7) */}
                          <rect
                            x="226"
                            y="134"
                            width="42"
                            height="34"
                            fill="rgba(52, 211, 153, 0.15)"
                            stroke="#34d399"
                            strokeWidth="1.5"
                          />
                          <rect
                            x="226"
                            y="476"
                            width="40"
                            height="52"
                            fill="rgba(52, 211, 153, 0.15)"
                            stroke="#34d399"
                            strokeWidth="1.5"
                          />
                          <rect
                            x="280"
                            y="482"
                            width="35"
                            height="46"
                            fill="rgba(52, 211, 153, 0.15)"
                            stroke="#34d399"
                            strokeWidth="1.5"
                          />

                          {/* Le Square — Room 6: Hip To Be Square (91 Workshop Seats) */}
                          <rect
                            x="735"
                            y="260"
                            width="148"
                            height="136"
                            rx="4"
                            fill="rgba(244, 63, 94, 0.16)"
                            stroke="#fb7185"
                            strokeWidth="2.2"
                            filter="url(#tron-red-glow)"
                          />
                          {/* Doorway entry at South-East corner from Primary Food Area */}
                          <line
                            x1="840"
                            y1="396"
                            x2="864"
                            y2="396"
                            stroke="#00f0ff"
                            strokeWidth="3"
                          />
                          <text
                            x="810"
                            y="326"
                            textAnchor="middle"
                            className="fill-rose-300 font-mono-tech text-[11px] font-bold uppercase tracking-widest"
                          >
                            LE SQUARE
                          </text>

                          {/* South Dining Area — Primary Catering Zone (South of Hip To Be Square) */}
                          <rect
                            x="795"
                            y="416"
                            width="88"
                            height="56"
                            rx="3"
                            fill="rgba(249, 115, 22, 0.16)"
                            stroke="#f97316"
                            strokeWidth="1.8"
                          />
                          <text
                            x="839"
                            y="484"
                            textAnchor="middle"
                            className="fill-orange-300/90 font-mono-tech text-[8px] font-bold uppercase tracking-wider"
                          >
                            PRIMARY FOOD
                          </text>

                          {/* North Dining Area — Secondary Catering Zone (North of Hip To Be Square) */}
                          <rect
                            x="795"
                            y="196"
                            width="88"
                            height="54"
                            rx="3"
                            fill="rgba(251, 188, 4, 0.1)"
                            stroke="rgba(251, 188, 4, 0.55)"
                            strokeDasharray="4 3"
                            strokeWidth="1.4"
                          />
                          <text
                            x="839"
                            y="190"
                            textAnchor="middle"
                            className="fill-amber-300/75 font-mono-tech text-[8px] uppercase tracking-wider"
                          >
                            SECONDARY FOOD
                          </text>
                        </g>
                      )}

                      {/* Stairs Inverted Triangle Symbol */}
                      <polygon
                        points={
                          activeFloor === '03'
                            ? '119,166 175,166 147,219'
                            : '109,166 165,166 137,219'
                        }
                        fill="rgba(0, 240, 255, 0.14)"
                        stroke="#00f0ff"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}

                  {/* Animated TRON Ray-Traced Light-Cycle Path from Origin Icon to Destination Icon */}
                  {activeRoutePoints && (
                    <g>
                      {/* Outer Neon Path Glow */}
                      <polyline
                        points={activeRoutePoints}
                        fill="none"
                        stroke={
                          isRestroomSelected
                            ? '#eab308'
                            : originNode.id.endsWith('elevators')
                              ? '#ff007f'
                              : '#00f0ff'
                        }
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.38"
                        filter="url(#tron-cyan-glow)"
                      />
                      {/* Core Animated Energy Beam */}
                      <polyline
                        points={activeRoutePoints}
                        fill="none"
                        stroke={
                          isRestroomSelected
                            ? '#fde047'
                            : originNode.id.endsWith('elevators')
                              ? '#ff4da6'
                              : '#00f0ff'
                        }
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="10 6"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="64"
                          to="0"
                          dur="1.4s"
                          repeatCount="indefinite"
                        />
                      </polyline>
                    </g>
                  )}

                  {/* Pulsing "Where I Am" (Origin) Beacon Ring at Start Point */}
                  <g
                    transform={`translate(${computedRoute.startPt.x}, ${computedRoute.startPt.y})`}
                    className="pointer-events-none"
                  >
                    <circle
                      r="22"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="360"
                        to="0"
                        dur="5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="16" fill="rgba(16, 185, 129, 0.28)">
                      <animate
                        attributeName="r"
                        values="14;22;14"
                        dur="1.8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>

                  {/* Interactive Map Nodes */}
                  {floorNodes.map((node) => {
                    const isSelected = selectedNode.id === node.id;
                    const isOrigin = originNode.id === node.id;
                    const isHovered = hoveredNodeId === node.id;
                    const isRoomDiamond =
                      node.category === 'room' ||
                      node.category === 'coaching' ||
                      node.category === 'showcase' ||
                      node.id === 'l4-room-1';

                    const palette = {
                      red: {
                        fill: '#ea4335',
                        stroke: '#ff8a80',
                        ring: 'rgba(234, 67, 53, 0.5)',
                      },
                      yellow: {
                        fill: '#fbbc04',
                        stroke: '#fde047',
                        ring: 'rgba(251, 188, 4, 0.55)',
                      },
                      cyan: {
                        fill: '#00bcd4',
                        stroke: '#67e8f9',
                        ring: 'rgba(0, 240, 255, 0.55)',
                      },
                      green: {
                        fill: '#10b981',
                        stroke: '#6ee7b7',
                        ring: 'rgba(16, 185, 129, 0.5)',
                      },
                      magenta: {
                        fill: '#ec4899',
                        stroke: '#f9a8d4',
                        ring: 'rgba(236, 72, 153, 0.55)',
                      },
                      orange: {
                        fill: '#f97316',
                        stroke: '#fdba74',
                        ring: 'rgba(249, 115, 22, 0.5)',
                      },
                      blue: {
                        fill: '#3b82f6',
                        stroke: '#93c5fd',
                        ring: 'rgba(59, 130, 246, 0.5)',
                      },
                    }[node.color];

                    // Special Case: Gold Sponsors (G) renders all 4 Gold Booths (Vooban, oXya, Davidson Canada, Kanastruk)
                    if (node.id === 'l3-sponsor-g1') {
                      const goldBooths = [
                        { x: 268, y: 324, name: 'Vooban' },
                        { x: 300, y: 324, name: 'oXya' },
                        { x: 301, y: 361, name: 'Davidson Canada' },
                        { x: 194, y: 213, name: 'Kanastruk' },
                      ];
                      return (
                        <g
                          key={node.id}
                          onMouseEnter={() => setHoveredNodeId(node.id)}
                          onMouseLeave={() => setHoveredNodeId(null)}
                          className="cursor-pointer group"
                        >
                          {goldBooths.map((booth, idx) => (
                            <g
                              key={idx}
                              transform={`translate(${booth.x}, ${booth.y})`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNodeClick(node, false, {
                                  x: booth.x,
                                  y: booth.y,
                                });
                              }}
                            >
                              {/* Invisible Mobile Touch Target */}
                              <rect
                                x="-20"
                                y="-18"
                                width="40"
                                height="36"
                                fill="transparent"
                              />
                              {(isSelected || isOrigin) && (
                                <rect
                                  x="-15"
                                  y="-11"
                                  width="30"
                                  height="22"
                                  rx="4"
                                  fill="none"
                                  stroke="#6ee7b7"
                                  strokeWidth="1.5"
                                  strokeDasharray="4 2"
                                />
                              )}
                              <rect
                                x="-11"
                                y="-7.5"
                                width="22"
                                height="15"
                                rx="3"
                                fill="#10b981"
                                stroke={
                                  isSelected || isOrigin || isHovered
                                    ? '#ffffff'
                                    : '#6ee7b7'
                                }
                                strokeWidth={
                                  isSelected || isOrigin || isHovered
                                    ? '2.2'
                                    : '1.4'
                                }
                                filter="url(#tron-cyan-glow)"
                              />
                              <text
                                y="3.5"
                                textAnchor="middle"
                                className="fill-white font-mono-tech text-[9.5px] font-bold pointer-events-none"
                              >
                                G
                              </text>
                            </g>
                          ))}
                        </g>
                      );
                    }

                    // Special Case: Restrooms (WC) renders all 3 Bathroom Icons on the floor
                    if (
                      node.id === 'l3-restrooms' ||
                      node.id === 'l4-restrooms'
                    ) {
                      const restroomSpots =
                        node.id === 'l3-restrooms'
                          ? [
                              { x: 314, y: 415 },
                              { x: 571, y: 281 },
                              { x: 571, y: 405 },
                            ]
                          : [
                              { x: 292, y: 403 },
                              { x: 556, y: 266 },
                              { x: 556, y: 384 },
                            ];

                      return (
                        <g
                          key={node.id}
                          onMouseEnter={() => setHoveredNodeId(node.id)}
                          onMouseLeave={() => setHoveredNodeId(null)}
                          className="cursor-pointer group"
                        >
                          {restroomSpots.map((spot, idx) => (
                            <g
                              key={idx}
                              transform={`translate(${spot.x}, ${spot.y})`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNodeClick(node, false, {
                                  x: spot.x,
                                  y: spot.y,
                                });
                              }}
                            >
                              {/* Generous Mobile Touch Target */}
                              <circle r="22" fill="transparent" />
                              {(isSelected || isOrigin) && (
                                <circle
                                  r="19"
                                  fill="none"
                                  stroke="#fde047"
                                  strokeWidth="1.5"
                                  strokeDasharray="4 2"
                                />
                              )}
                              <circle
                                r="12"
                                fill="#f97316"
                                stroke={
                                  isSelected || isOrigin || isHovered
                                    ? '#ffffff'
                                    : '#fdba74'
                                }
                                strokeWidth={
                                  isSelected || isOrigin || isHovered
                                    ? '2.2'
                                    : '1.5'
                                }
                                filter="url(#tron-cyan-glow)"
                              />
                              {/* Crisp Restroom (Man | Woman) Vector Icon */}
                              <g fill="#ffffff" className="pointer-events-none">
                                {/* Left figure (Man) */}
                                <circle cx="-4" cy="-4.5" r="1.6" />
                                <rect
                                  x="-6"
                                  y="-2.2"
                                  width="4"
                                  height="4.2"
                                  rx="0.8"
                                />
                                <rect
                                  x="-5.3"
                                  y="2"
                                  width="2.6"
                                  height="3.5"
                                  rx="0.5"
                                />
                                {/* Center divider */}
                                <rect
                                  x="-0.4"
                                  y="-5.5"
                                  width="0.8"
                                  height="11"
                                  opacity="0.7"
                                />
                                {/* Right figure (Woman) */}
                                <circle cx="4" cy="-4.5" r="1.6" />
                                <polygon points="4,-2.4 6.6,2.2 1.4,2.2" />
                                <rect
                                  x="2.8"
                                  y="2"
                                  width="2.4"
                                  height="3.5"
                                  rx="0.5"
                                />
                              </g>
                            </g>
                          ))}
                        </g>
                      );
                    }

                    // Special Case: Marquee Sponsor (M), Registration (R), Badge Station (B) render as rectangular booths
                    const isRectBooth =
                      node.id === 'l3-sponsor-m' ||
                      node.id === 'l3-reg' ||
                      node.id === 'l4-badge';

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onClick={() => handleNodeClick(node)}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        className="cursor-pointer group"
                      >
                        {/* Generous Invisible Touch Hit Target for Mobile Fingers */}
                        {isRectBooth ? (
                          <rect
                            x={node.id === 'l3-reg' ? -40 : -24}
                            y="-20"
                            width={node.id === 'l3-reg' ? 80 : 48}
                            height="40"
                            fill="transparent"
                          />
                        ) : (
                          <circle r="24" fill="transparent" />
                        )}

                        {/* Pulsing Radar Target Ring when selected */}
                        {isSelected && (
                          <>
                            <circle
                              r="26"
                              fill="none"
                              stroke={palette.stroke}
                              strokeWidth="1.5"
                              strokeDasharray="5 3"
                            >
                              <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0"
                                to="360"
                                dur="6s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle r="18" fill={palette.ring} opacity="0.35">
                              <animate
                                attributeName="r"
                                values="15;24;15"
                                dur="2s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          </>
                        )}

                        {/* Marker Shape: Red Diamond for Rooms (1-7), Rect Booth for M/R/B, or Circle for Amenities */}
                        {isRoomDiamond ? (
                          <polygon
                            points="0,-15 15,0 0,15 -15,0"
                            fill="#ea4335"
                            stroke={
                              isSelected || isOrigin || isHovered
                                ? '#ffffff'
                                : '#fca5a5'
                            }
                            strokeWidth={
                              isSelected || isOrigin || isHovered
                                ? '2.5'
                                : '1.5'
                            }
                            filter="url(#tron-red-glow)"
                          />
                        ) : isRectBooth ? (
                          <rect
                            x={node.id === 'l3-reg' ? -33 : -14}
                            y="-8"
                            width={node.id === 'l3-reg' ? 66 : 28}
                            height="16"
                            rx="3"
                            fill={palette.fill}
                            stroke={
                              isSelected || isOrigin || isHovered
                                ? '#ffffff'
                                : palette.stroke
                            }
                            strokeWidth={
                              isSelected || isOrigin || isHovered
                                ? '2.3'
                                : '1.5'
                            }
                            filter="url(#tron-cyan-glow)"
                          />
                        ) : (
                          <circle
                            r="13"
                            fill={palette.fill}
                            stroke={
                              isSelected || isOrigin || isHovered
                                ? '#ffffff'
                                : palette.stroke
                            }
                            strokeWidth={
                              isSelected || isOrigin || isHovered
                                ? '2.5'
                                : '1.5'
                            }
                            filter="url(#tron-cyan-glow)"
                          />
                        )}

                        {/* Node Badge Number / Symbol */}
                        <text
                          y="3.8"
                          textAnchor="middle"
                          className="fill-white font-mono-tech text-[10.5px] font-bold pointer-events-none"
                        >
                          {node.numberBadge}
                        </text>
                      </g>
                    );
                  })}

                  {/* Floating "YOU ARE HERE" Pill Badge on the Origin Icon */}
                  {originNode.id !== selectedNode.id && (
                    <g
                      transform={`translate(${Math.min(Math.max(computedRoute.startPt.x, 68), 932)}, ${
                        computedRoute.startPt.y > 640
                          ? computedRoute.startPt.y - 26
                          : computedRoute.startPt.y + 30
                      })`}
                      className="pointer-events-none"
                    >
                      <rect
                        x="-56"
                        y="-13"
                        width="112"
                        height="19"
                        rx="4"
                        fill="rgba(16, 185, 129, 0.95)"
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                      <text
                        y="-0.5"
                        textAnchor="middle"
                        className="fill-black font-mono-tech text-[9px] font-bold tracking-wider"
                      >
                        {isFr ? '📍 VOUS ÊTES ICI' : '📍 YOU ARE HERE'}
                      </text>
                    </g>
                  )}

                  {/* Top-Layer Floating Tooltip Label (Shows hovered node on desktop, or active selected node on mobile/tap, clamped inside SVG bounds) */}
                  {floorNodes
                    .filter(
                      (node) => (hoveredNodeId ?? selectedNode.id) === node.id,
                    )
                    .map((node) => {
                      const isRoomDiamond =
                        node.category === 'room' ||
                        node.category === 'coaching' ||
                        node.category === 'showcase' ||
                        node.id === 'l4-room-1';
                      const targetX =
                        node.id === selectedNode.id
                          ? computedRoute.endPt.x
                          : node.x;
                      const targetY =
                        node.id === selectedNode.id
                          ? computedRoute.endPt.y
                          : node.y;
                      const goldBoothMatch =
                        node.id === 'l3-sponsor-g1'
                          ? [
                              { x: 268, y: 324, name: 'Vooban (Gold Sponsor)' },
                              { x: 300, y: 324, name: 'oXya (Gold Sponsor)' },
                              {
                                x: 301,
                                y: 361,
                                name: 'Davidson Canada (Gold Sponsor)',
                              },
                              {
                                x: 194,
                                y: 213,
                                name: 'Kanastruk (Gold Sponsor · #321)',
                              },
                            ].find((b) => b.x === targetX && b.y === targetY)
                          : undefined;
                      const labelText = goldBoothMatch
                        ? `G · ${goldBoothMatch.name}`
                        : node.numberBadge &&
                            (isRoomDiamond ||
                              node.category === 'sponsor' ||
                              node.category === 'registration')
                          ? `${node.numberBadge} · ${node.name}`
                          : node.name;
                      const halfWidth = Math.max(labelText.length * 3.5, 44);
                      const clampedX = Math.min(
                        Math.max(targetX, halfWidth + 12),
                        1000 - halfWidth - 12,
                      );
                      const tooltipY =
                        targetY < 68 ? targetY + 34 : targetY - 26;

                      return (
                        <g
                          key={`hover-label-${node.id}`}
                          transform={`translate(${clampedX}, ${tooltipY})`}
                          className="pointer-events-none"
                        >
                          <rect
                            x={-halfWidth}
                            y="-16"
                            width={halfWidth * 2}
                            height="22"
                            rx="5"
                            fill="rgba(0, 240, 255, 0.96)"
                            stroke="#ffffff"
                            strokeWidth="1.2"
                            filter="url(#tron-cyan-glow)"
                          />
                          <text
                            y="-2"
                            textAnchor="middle"
                            className="fill-black font-mono-tech text-[10px] font-bold tracking-wider"
                          >
                            {labelText}
                          </text>
                        </g>
                      );
                    })}
                </svg>
              </div>
            </div>

            {/* Bottom Map Legend Bar (Matches Original Map Key) */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-t border-cyan-500/20 bg-[#050b1a]/95 px-3 sm:px-4 py-2.5 sm:py-3 font-mono-tech text-[10px] sm:text-[11px] text-white/70">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rotate-45 bg-google-red border border-rose-300" />
                  <span>{isFr ? 'Salles (1–7)' : 'Event Rooms (1–7)'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm bg-cyan-400" />
                  <span>
                    {activeFloor === '03'
                      ? isFr
                        ? 'Enregistrement (R)'
                        : 'Registration (R)'
                      : isFr
                        ? 'Station Badges (B)'
                        : 'Badge Station (B)'}
                  </span>
                </span>
                {activeFloor === '03' && (
                  <button
                    type="button"
                    onClick={() =>
                      handleNodeClick(
                        MAP_NODES.find((n) => n.id === 'l3-sponsor-g1')!,
                      )
                    }
                    className="inline-flex items-center gap-1.5 hover:text-emerald-300 transition-colors cursor-pointer text-left"
                  >
                    <span className="inline-block h-3 w-3 shrink-0 rounded-sm bg-emerald-400" />
                    <span>
                      {isFr
                        ? 'Commanditaires Or (G) : Vooban, oXya, Davidson Canada, Kanastruk'
                        : 'Gold Sponsors (G): Vooban, oXya, Davidson Canada, Kanastruk'}
                    </span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    handleNodeClick(
                      MAP_NODES.find(
                        (n) =>
                          n.id ===
                          (activeFloor === '03'
                            ? 'l3-restrooms'
                            : 'l4-restrooms'),
                      )!,
                    )
                  }
                  className="inline-flex items-center gap-1.5 hover:text-orange-300 transition-colors cursor-pointer text-left"
                >
                  <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-orange-500" />
                  <span>{isFr ? 'Salles de bain (WC)' : 'Restrooms (WC)'}</span>
                </button>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-full bg-fuchsia-500" />
                  <span>{isFr ? 'Ascenseurs' : 'Elevators'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-full bg-cyan-300" />
                  <span>{isFr ? 'Escaliers 3↔4' : 'Stairs 3↔4'}</span>
                </span>
              </div>
              <span className="text-cyan-400/80 uppercase tracking-widest">
                {zoomLevel > 1
                  ? isFr
                    ? 'Glissez pour déplacer la carte'
                    : 'Drag / swipe to pan zoomed map'
                  : mapSelectionTarget === 'origin'
                    ? isFr
                      ? 'Touchez votre position actuelle sur la carte'
                      : 'Tap your current location on the map'
                    : isFr
                      ? 'Touchez une icône pour tracer la route'
                      : 'Tap any icon to ray-trace route'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Target Telemetry & Live Room Schedule Inspector */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border border-cyan-400/40 bg-[#070d1f]/95 p-4 sm:p-6 shadow-[0_0_35px_rgba(0,240,255,0.1)]">
          <div>
            {/* Telemetry Header */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3.5 sm:pb-4">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="font-mono-tech text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 truncate">
                  {selectedNode.code || `LEVEL ${activeFloor}`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleZoomChange(zoomLevel > 1 ? 1 : 1.75, selectedNode)
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-400/15 px-2.5 py-0.5 font-mono-tech text-[10px] uppercase tracking-wider text-cyan-200 hover:bg-cyan-400 hover:text-black transition-colors cursor-pointer"
                >
                  <ZoomIn className="h-3 w-3" />
                  <span>
                    {zoomLevel > 1
                      ? isFr
                        ? 'Vue globale'
                        : 'Reset Zoom'
                      : isFr
                        ? 'Zoomer ici'
                        : 'Zoom Here'}
                  </span>
                </button>
                <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-0.5 font-mono-tech text-[10px] uppercase tracking-wider text-cyan-200">
                  {isFr ? `Niv. ${activeFloor}` : `Floor ${activeFloor}`}
                </span>
              </div>
            </div>

            {/* Selected Node Title & Metadata */}
            <div className="mt-4">
              <div className="flex items-center gap-3">
                {selectedNode.numberBadge && (
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-400/60 bg-google-red/20 font-mono-tech text-sm font-bold text-rose-300">
                    {selectedNode.numberBadge}
                  </span>
                )}
                <div className="min-w-0">
                  <h4 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
                    {selectedNode.name}
                  </h4>
                  {(() => {
                    const credits =
                      getRoomSongCredits(selectedNode.id) ||
                      getRoomSongCredits(selectedNode.name);
                    if (!credits) return null;
                    return (
                      <div className="mt-1 flex flex-wrap items-center gap-2 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-google-yellow/90">
                        <div className="flex items-center gap-1.5">
                          <Music className="h-3 w-3 text-google-yellow shrink-0" />
                          <span className="font-bold">{credits.artist}</span>
                          <span className="text-white/35">·</span>
                          <span className="text-cyan-300/90">
                            {credits.year}
                          </span>
                        </div>
                        {credits.youtubeUrl && (
                          <a
                            href={credits.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-red-500/45 bg-red-950/40 px-2 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-wider text-white/95 hover:border-red-400 hover:bg-red-600/30 hover:text-white transition-all"
                            title={
                              isFr
                                ? `Écouter ${credits.songTitle} sur YouTube Music`
                                : `Play ${credits.songTitle} on YouTube Music`
                            }
                          >
                            {/* YouTube Music Disc Logo */}
                            <svg
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="h-3.5 w-3.5 shrink-0"
                            >
                              <circle cx="12" cy="12" r="11" fill="#FF0000" />
                              <circle
                                cx="12"
                                cy="12"
                                r="6.2"
                                fill="none"
                                stroke="#FFFFFF"
                                strokeWidth="1.4"
                              />
                              <polygon
                                points="10.4,9.2 15.2,12 10.4,14.8"
                                fill="#FFFFFF"
                              />
                            </svg>
                            <Headphones className="h-3 w-3 text-red-300 shrink-0" />
                            <span>{isFr ? 'Écouter' : 'Click to play'}</span>
                          </a>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <p className="mt-2 font-sans text-xs sm:text-sm text-cyan-100/80">
                {isFr ? selectedNode.subtitleFr : selectedNode.subtitleEn}
              </p>

              {/* Telemetry Specs */}
              <div className="mt-4 grid grid-cols-1 gap-2.5 rounded-xl border border-white/10 bg-[#0b132b]/80 p-3.5 font-mono-tech text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/45 uppercase">
                    {isFr ? 'Zone :' : 'Zone:'}
                  </span>
                  <span className="text-cyan-300 text-right">
                    {selectedNode.zone}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2">
                  <span className="text-white/45 uppercase">
                    {selectedNode.category === 'sponsor'
                      ? isFr
                        ? 'Commanditaires :'
                        : 'Sponsors:'
                      : isFr
                        ? 'Capacité :'
                        : 'Capacity:'}
                  </span>
                  <span className="text-google-yellow font-bold text-right">
                    {isFr ? selectedNode.capacityFr : selectedNode.capacityEn}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2">
                  <span className="text-white/45 uppercase">
                    {isFr ? 'Départ actuel :' : 'Routing From:'}
                  </span>
                  <span className="text-emerald-300 font-bold text-right truncate">
                    {originNode.numberBadge
                      ? `[${originNode.numberBadge}] `
                      : ''}
                    {originNode.name}
                  </span>
                </div>
              </div>

              {/* Quick "I Am Here" Action Button */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setOriginNodeId(selectedNode.id);
                    setOriginPointOverride(destPointOverride);
                  }}
                  disabled={
                    originNode.id === selectedNode.id &&
                    originPointOverride?.x === destPointOverride?.x &&
                    originPointOverride?.y === destPointOverride?.y
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500/15 px-3.5 py-2 font-mono-tech text-[11px] font-bold uppercase tracking-wider text-emerald-200 hover:bg-emerald-400 hover:text-black disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <LocateFixed className="h-3.5 w-3.5" />
                  <span>
                    {originNode.id === selectedNode.id &&
                    originPointOverride?.x === destPointOverride?.x &&
                    originPointOverride?.y === destPointOverride?.y
                      ? isFr
                        ? '✓ Vous êtes ici (Point de départ)'
                        : '✓ You Are Here (Current Start)'
                      : isFr
                        ? '📍 Je suis ici — Partir de ce point'
                        : '📍 I Am Here — Route From This Spot'}
                  </span>
                </button>
              </div>

              {/* Gold Sponsors Explicit Lineup when G is selected */}
              {selectedNode.id === 'l3-sponsor-g1' && (
                <div className="mt-4 rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-3.5">
                  <div className="font-mono-tech text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                    {isFr
                      ? 'KIOSQUES COMMANDITAIRES OR (G)'
                      : 'GOLD SPONSOR BOOTHS (G)'}
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    {[
                      {
                        name: 'Vooban',
                        x: 268,
                        y: 324,
                        locEn: 'Central Bridge',
                        locFr: 'Passerelle',
                      },
                      {
                        name: 'oXya',
                        x: 300,
                        y: 324,
                        locEn: 'Central Bridge',
                        locFr: 'Passerelle',
                      },
                      {
                        name: 'Davidson Canada',
                        x: 301,
                        y: 361,
                        locEn: 'Central Bridge',
                        locFr: 'Passerelle',
                      },
                      {
                        name: 'Kanastruk',
                        x: 194,
                        y: 213,
                        locEn: 'Near #321 (2)',
                        locFr: 'Près du #321 (2)',
                      },
                    ].map((sponsor) => {
                      const isActiveBooth =
                        computedRoute.endPt.x === sponsor.x &&
                        computedRoute.endPt.y === sponsor.y;
                      return (
                        <button
                          key={sponsor.name}
                          type="button"
                          onClick={() =>
                            handleNodeClick(selectedNode, false, {
                              x: sponsor.x,
                              y: sponsor.y,
                            })
                          }
                          className={`flex flex-col items-center justify-center rounded-lg border px-2 py-2 text-center transition-all cursor-pointer ${
                            isActiveBooth
                              ? 'border-emerald-300 bg-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                              : 'border-emerald-400/35 bg-[#071520] hover:border-emerald-400'
                          }`}
                        >
                          <span className="font-mono-tech text-[10px] font-bold text-emerald-400">
                            [G] {isFr ? sponsor.locFr : sponsor.locEn}
                          </span>
                          <span className="mt-0.5 font-display text-xs font-bold text-white leading-tight">
                            {sponsor.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* If Stairs is selected, offer instant Floor Jump button */}
            {(selectedNode.id === 'l3-stairs' ||
              selectedNode.id === 'l4-stairs') && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() =>
                    handleFloorSwitch(activeFloor === '03' ? '04' : '03')
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400 bg-cyan-400/20 px-4 py-3 font-mono-tech text-xs font-bold uppercase tracking-wider text-cyan-200 hover:bg-cyan-400 hover:text-black transition-all cursor-pointer"
                >
                  <Layers className="h-4 w-4" />
                  <span>
                    {activeFloor === '03'
                      ? isFr
                        ? 'Monter au Niveau 04 →'
                        : 'Go Upstairs to Level 04 →'
                      : isFr
                        ? 'Descendre au Niveau 03 →'
                        : 'Go Downstairs to Level 03 →'}
                  </span>
                </button>
              </div>
            )}

            {/* Live Room Sessions Preview (if this room has a schedule) */}
            {linkedRoomSchedule ? (
              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono-tech text-[11px] uppercase tracking-wider text-white/60">
                    {isFr ? 'Sessions dans cette salle' : 'Room Sessions'}
                  </span>
                  {onSelectRoomSchedule && (
                    <button
                      type="button"
                      onClick={() =>
                        onSelectRoomSchedule(linkedRoomSchedule.id)
                      }
                      className="inline-flex items-center gap-1 font-mono-tech text-[11px] font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-200 cursor-pointer"
                    >
                      <span>{isFr ? 'Horaire complet' : 'Full Schedule'}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="max-h-[250px] space-y-2 overflow-y-auto pr-1">
                  {linkedRoomSchedule.sessions
                    .filter((s) => s.kind !== 'lunch')
                    .map((s, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg border px-3 py-2 text-xs ${
                          s.kind === 'open'
                            ? 'border-dashed border-white/15 bg-white/[0.01] text-white/50'
                            : 'border-white/10 bg-white/[0.04] text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 font-mono-tech text-[10px]">
                          <span className="font-bold text-google-yellow">
                            {s.time}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {s.tentative && (
                              <span className="rounded border border-amber-400/60 bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-300">
                                {isFr ? 'Provisoire' : 'Tentative'}
                              </span>
                            )}
                            {s.duration && (
                              <span className="text-cyan-300">
                                {s.duration}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-0.5 font-display font-bold leading-snug line-clamp-2">
                          {s.title}
                        </div>
                        {s.speakers && (
                          <div className="mt-0.5 font-mono-tech text-[10px] text-cyan-400/90 truncate">
                            {s.speakers}
                          </div>
                        )}
                        {((s.categories && s.categories.length > 0) ||
                          s.level) && (
                          <div className="mt-1 flex flex-wrap items-center gap-1">
                            {s.categories?.map((cat) => (
                              <span
                                key={cat}
                                className={`inline-flex items-center rounded-full border px-1.5 py-0.2 font-mono-tech text-[8px] font-semibold uppercase tracking-wider ${getCategoryBadgeClass(cat)}`}
                              >
                                {cat}
                              </span>
                            ))}
                            {s.level && (
                              <span
                                className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.2 font-mono-tech text-[8px] font-semibold uppercase tracking-wider ${getLevelBadgeClass(s.level)}`}
                              >
                                <span className="opacity-60">
                                  {isFr ? 'Niv:' : 'Lvl:'}
                                </span>
                                <span>{s.level}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {onSelectRoomSchedule && (
                  <button
                    type="button"
                    onClick={() => onSelectRoomSchedule(linkedRoomSchedule.id)}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/60 bg-cyan-400/15 px-4 py-2.5 font-mono-tech text-xs font-bold uppercase tracking-wider text-cyan-200 hover:bg-cyan-400 hover:text-black transition-all cursor-pointer"
                  >
                    <DoorOpen className="h-4 w-4" />
                    <span>
                      {isFr
                        ? `Ouvrir l'horaire de ${linkedRoomSchedule.name}`
                        : `Open ${linkedRoomSchedule.name} Schedule`}
                    </span>
                  </button>
                )}
              </div>
            ) : (
              /* Directory of numbered rooms on this floor when a non-talk node is selected */
              <div className="mt-5 border-t border-white/10 pt-4">
                <span className="block mb-2.5 font-mono-tech text-[11px] uppercase tracking-wider text-white/55">
                  {isFr
                    ? `Accès rapide — Niveau ${activeFloor}`
                    : `Quick Jump — Level ${activeFloor}`}
                </span>
                <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1">
                  {allCurrentFloorNodes.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => handleNodeClick(n, true)}
                      className={`w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left font-mono-tech text-xs transition-all cursor-pointer ${
                        selectedNode.id === n.id
                          ? 'border-cyan-400 bg-cyan-400/15 text-white'
                          : 'border-white/5 bg-white/[0.02] text-white/70 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className="truncate">
                        <strong className="text-cyan-400 mr-1.5">
                          {n.numberBadge}
                        </strong>
                        {n.name}
                      </span>
                      <span className="text-[10px] text-white/45 shrink-0">
                        {isFr
                          ? n.capacityFr.split(' ')[0]
                          : n.capacityEn.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Floor Directory Footer */}
          <div className="mt-6 border-t border-white/10 pt-3 flex items-center justify-between font-mono-tech text-[10px] uppercase tracking-widest text-white/40">
            <span>AX.C // 800 SQUARE-VICTORIA</span>
            <span className="text-cyan-400">GRID STATUS: ONLINE</span>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Legend Grid: All Numbered Rooms on Current Floor */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-4 border-t border-white/10">
        {allCurrentFloorNodes.map((node) => {
          const isSelected = selectedNode.id === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => handleNodeClick(node, true)}
              className={`group flex items-start gap-3 rounded-xl border p-3 sm:p-3.5 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-400/15 shadow-[0_0_20px_rgba(0,240,255,0.18)]'
                  : 'border-white/10 bg-[#080f20]/80 hover:border-cyan-400/40 hover:bg-[#0c162e]'
              }`}
            >
              <span
                className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border font-mono-tech text-xs font-bold ${
                  node.category === 'room'
                    ? 'border-rose-400/60 bg-google-red/25 text-rose-200'
                    : node.category === 'coaching'
                      ? 'border-emerald-400/60 bg-emerald-500/20 text-emerald-200'
                      : 'border-cyan-400/60 bg-cyan-500/20 text-cyan-200'
                }`}
              >
                {node.numberBadge}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-display text-sm font-bold text-white truncate group-hover:text-cyan-200">
                    {node.name}
                  </span>
                </div>
                <p className="mt-0.5 font-mono-tech text-[10px] text-cyan-300/80 truncate">
                  {isFr ? node.capacityFr : node.capacityEn}
                </p>
                <p className="mt-0.5 font-sans text-[11px] text-white/50 truncate">
                  {isFr ? node.subtitleFr : node.subtitleEn}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
