'use client';

import { useMemo, useState } from 'react';

type Locale = 'en' | 'fr';

type RawRow = [
  room: string,
  floor: string,
  seats: string,
  time: string,
  session: string,
  speaker: string,
  staff: string,
  notes: string,
];

interface ShiftItem {
  time: string;
  session: string;
  speaker: string;
  staff: string;
  notes: string;
  floor: string;
}

interface RoomGroup {
  name: string;
  floor: string;
  seats: string;
  items: ShiftItem[];
}

interface CalendarEventFields {
  title: string;
  start: string;
  end: string;
  location: string;
  details: string;
}

const ROWS: RawRow[] = [
  [
    '3-1 · Don’t Stop Believin’',
    '3',
    '100',
    '07:00 - 08:30',
    'Setup',
    '',
    'All staff (dispatched on site)',
    '',
  ],
  [
    '3-1 · Don’t Stop Believin’',
    '3',
    '100',
    '09:25 - 10:00',
    'Opening Remarks & Keynote — Montreal in the Age of AI: The Local Ecosystem',
    'Stacy Véronneau',
    '',
    '',
  ],
  [
    '3-1 · Don’t Stop Believin’',
    '3',
    '100',
    '10:15 - 11:00',
    "Panel – Montreal Tech Community: How local tech groups are shaping Montreal's digital future",
    'JL Maréchaux, Pierre-Alexandre Lacerte, Stefania Pecore, Raphaelle Giraud',
    'KHASHAYAR (support), BILLY (main recorder), ALI (OBS support)',
    '',
  ],
  [
    '3-1 · Don’t Stop Believin’',
    '3',
    '100',
    '11:15 - 12:00',
    "Bâtir une plateforme agentique d'entreprise avec Google ADK et Gemini : Retour d'expérience sur Nova",
    'Ludovic Dessemon',
    'KHASHAYAR (support), BILLY (main recorder), ALI (OBS support)',
    '',
  ],
  [
    '3-1 · Don’t Stop Believin’',
    '3',
    '100',
    '13:00 - 13:45',
    'From Data to Action: Building AI Agents with Google ADK, MCP, and Cloud Databases',
    'Gleb Otochkin',
    'JESSY (support), BILLY (main recorder), ALI (OBS support)',
    '',
  ],
  [
    '3-1 · Don’t Stop Believin’',
    '3',
    '100',
    '14:00 - 14:45',
    'So... You want to work at Google?',
    'Olivier Bourgeois',
    'JESSY (support), BILLY (main recorder), ALI (OBS support)',
    '',
  ],
  [
    '3-1 · Don’t Stop Believin’',
    '3',
    '100',
    '15:00 - 15:45',
    'Google Workspace MCPs with Antigravity',
    'Mohammad Al-Ansari',
    'DANIEL TO (support), BILLY (main recorder), ALI (OBS support)',
    '',
  ],
  [
    '3-1 · Don’t Stop Believin’',
    '3',
    '100',
    '16:00 - 16:45',
    "AI Isn't Magic: The Infrastructure That Actually Wins the Race",
    'Stacy Véronneau',
    'DANIEL TO (support), BILLY (main recorder), ALI (OBS support)',
    '',
  ],
  [
    '3-1 · Don’t Stop Believin’',
    '3',
    '100',
    '17:00 - 17:15',
    'Closing Keynote — Google Developer Groups (GDG) on Campus: Mission, Impact, and Student Perspectives',
    'Stefania Pecore, Michael Persico, Rebecca Abi Chahine, Daniel Wei, Oumaima El Khayiri',
    '',
    '',
  ],
  [
    '3-1 · Don’t Stop Believin’',
    '3',
    '100',
    '17:15 - 18:30',
    'Wrapping-Up, Raffles & Happy Hour (5 à 7)',
    'Stacy Véronneau',
    '',
    '',
  ],
  [
    '3-1 · Don’t Stop Believin’',
    '3',
    '100',
    'After 18:30',
    'Wrap-up',
    '',
    'BILLY (last staff in room)',
    '3rd floor wrap-up after 18:30',
  ],

  [
    '3-5 · Just Can’t Get Enough',
    '3',
    '30',
    '07:00 - 08:30',
    'Setup',
    '',
    'All staff (dispatched on site)',
    '',
  ],
  [
    '3-5 · Just Can’t Get Enough',
    '3',
    '30',
    '10:15 - 11:00',
    'Building the Doomsday Course: Robots, Live Video and an Agentic Coding Coach',
    'Etienne Caron',
    'SAJAD (support)',
    '',
  ],
  [
    '3-5 · Just Can’t Get Enough',
    '3',
    '30',
    '11:15 - 12:00',
    'Attention Attention Everywhere',
    'Dev J. Shah',
    'SAJAD (support)',
    '',
  ],
  [
    '3-5 · Just Can’t Get Enough',
    '3',
    '30',
    '13:00 - 13:45',
    'Beyond Red, Blue and Purple: Meet the Gold Team',
    'Faustin Bouchard',
    'WANLIN (support)',
    '',
  ],
  [
    '3-5 · Just Can’t Get Enough',
    '3',
    '30',
    '14:00 - 14:45',
    'Beyond Push-to-Talk: Real-Time Fact-Checking Agents with Gemini Live API and Google Search Grounding',
    'Aisha Yaseen',
    'WANLIN (support)',
    '',
  ],
  [
    '3-5 · Just Can’t Get Enough',
    '3',
    '30',
    '15:00 - 15:45',
    'Edge AI on Mobile: Practical Approaches and Challenges',
    'Mathieu Fillion',
    'SAJAD (support)',
    '',
  ],
  [
    '3-5 · Just Can’t Get Enough',
    '3',
    '30',
    '16:00 - 16:45',
    'Building Applications with Google AI Studio and Databases',
    'Gleb Otochkin',
    'SAJAD (support)',
    '',
  ],
  [
    '3-5 · Just Can’t Get Enough',
    '3',
    '30',
    'After 18:30',
    'Wrap-up',
    '',
    'SAJAD (last staff in room)',
    '3rd floor wrap-up after 18:30',
  ],

  [
    '3-2 · Mr. Roboto',
    '3',
    '5',
    '07:00 - 08:30',
    'Setup',
    '',
    'Kanastruk team',
    '',
  ],
  [
    '3-2 · Mr. Roboto',
    '3',
    '5',
    '10:15 - 12:00',
    'The Doomsday Course (Interactive Robotics, Live Video & Agentic Coding Coach Showcase)',
    'Etienne Caron',
    'Kanastruk team (support)',
    '',
  ],
  [
    '3-2 · Mr. Roboto',
    '3',
    '5',
    '13:00 - 14:00',
    'The Doomsday Course (Interactive Robotics, Live Video & Agentic Coding Coach Showcase)',
    'Etienne Caron',
    'Kanastruk team (support)',
    '',
  ],
  [
    '3-2 · Mr. Roboto',
    '3',
    '5',
    '14:00 - 16:45',
    'The Doomsday Course (Interactive Robotics, Live Video & Agentic Coding Coach Showcase)',
    'Etienne Caron',
    'Kanastruk team (support)',
    '',
  ],
  [
    '3-2 · Mr. Roboto',
    '3',
    '5',
    'After 18:30',
    'Wrap-up',
    '',
    'Kanastruk team (last staff in room)',
    '3rd floor wrap-up after 18:30',
  ],

  [
    '4-1 · The Danger Zone',
    '4',
    '25',
    '07:00 - 08:30',
    'Setup',
    '',
    'All staff (dispatched on site)',
    '',
  ],
  [
    '4-1 · The Danger Zone',
    '4',
    '25',
    '08:30 - 10:00',
    'Chill Zone, Board Games & Community Lounge',
    'GDG Montreal Community Lounge',
    '',
    '',
  ],
  [
    '4-1 · The Danger Zone',
    '4',
    '25',
    '10:00 - 12:00',
    'Chill Zone, Board Games & Community Lounge',
    'GDG Montreal Community Lounge',
    'ANDY (support)',
    '',
  ],
  [
    '4-1 · The Danger Zone',
    '4',
    '25',
    '13:00 - 16:45',
    'Chill Zone, Board Games & Community Lounge',
    'GDG Montreal Community Lounge',
    'SARA (support)',
    '',
  ],
  [
    '4-1 · The Danger Zone',
    '4',
    '25',
    '16:45 - 17:00',
    'Wrap-up',
    '',
    'SARA (last staff in room)',
    '',
  ],

  [
    '4-3 · Working For The Weekend',
    '4',
    '20',
    '07:00 - 08:30',
    'Setup',
    '',
    'All staff (dispatched on site)',
    '',
  ],
  [
    '4-3 · Working For The Weekend',
    '4',
    '20',
    '10:15 - 11:00',
    'From Prompt Engineering to Harness Engineering: Securing Autonomous AI Agents on GCP',
    'Eckarath Khounsombath',
    'SARA',
    '',
  ],
  [
    '4-3 · Working For The Weekend',
    '4',
    '20',
    '11:15 - 12:00',
    "The Web Could be Agentic: A first dive into Google's WebMCP Proposal",
    'Lester Botello',
    'SARA',
    '',
  ],
  [
    '4-3 · Working For The Weekend',
    '4',
    '20',
    '13:00 - 13:45',
    'Agents Working Together: Orchestration with ADK and A2A',
    'Arunesh Choudhary',
    'SOUAD',
    '',
  ],
  [
    '4-3 · Working For The Weekend',
    '4',
    '20',
    '14:00 - 14:15',
    'Lightning: Six Agents, One Patient Record: A Google ADK Retrospective',
    'Radwan Baba',
    'SOUAD',
    '',
  ],
  [
    '4-3 · Working For The Weekend',
    '4',
    '20',
    '14:25 - 14:40',
    "Lightning: The 90% You Don't See: Shipping AI Inside a Health System",
    'Guryash Singh Dhall',
    'BRIJ-PAUL',
    '',
  ],
  [
    '4-3 · Working For The Weekend',
    '4',
    '20',
    '14:40 - 15:00',
    'Wrap-up',
    '',
    'BRIJ-PAUL (last staff in room)',
    'Right after last talk at 14:40',
  ],
  [
    '4-3 · Working For The Weekend',
    '4',
    '20',
    '15:00 - 15:45',
    'Open Talk Slot — TBC',
    'Open',
    'Not staffed',
    '',
  ],
  [
    '4-3 · Working For The Weekend',
    '4',
    '20',
    '16:00 - 16:45',
    'Open Talk Slot — TBC',
    'Open',
    'Not staffed',
    '',
  ],

  [
    '4-4 · Under Pressure',
    '4',
    '40',
    '07:00 - 08:30',
    'Setup',
    '',
    'All staff (dispatched on site)',
    '',
  ],
  [
    '4-4 · Under Pressure',
    '4',
    '40',
    '10:15 - 11:00',
    'Building Real-Time RAG Systems with Gemini & the Multimodal Live API',
    'Olayinka Peter Oluwafemi',
    'FLORIAN (lead), TBD (OBS support). Jhin is on talk',
    '',
  ],
  [
    '4-4 · Under Pressure',
    '4',
    '40',
    '11:15 - 12:00',
    "Off the Edge: Grading Google AI Edge and Gemini Against a Practitioner's Eye",
    'Boris-Wilfried Nyasse',
    'FLORIAN (lead), TBD (OBS support). Jhin is on talk',
    '',
  ],
  [
    '4-4 · Under Pressure',
    '4',
    '40',
    '13:00 - 13:45',
    'Gemini Live: Architecting, building and pricing conversational experiences',
    'Felipe Lujan',
    'FLORIAN (lead), JHIN (OBS support)',
    '',
  ],
  [
    '4-4 · Under Pressure',
    '4',
    '40',
    '14:00 - 14:45',
    'From Black Belts to Small Language Models: My Taekwondo AI Journey',
    'Kevin Moore',
    'FLORIAN (lead), JHIN (OBS support)',
    '',
  ],
  [
    '4-4 · Under Pressure',
    '4',
    '40',
    '15:00 - 15:45',
    'Under the Hood of Gemini Enterprise: No-Code Agents, and Workflow Automation',
    'François Légaré',
    'FLORIAN (lead), JHIN (OBS support)',
    '',
  ],
  [
    '4-4 · Under Pressure',
    '4',
    '40',
    '16:00 - 16:45',
    'Terminal to Stadium: Building an AI Sports PA Announcer with Gemini',
    'Angelo Italiano',
    'FLORIAN (lead), JHIN (OBS support)',
    '',
  ],
  [
    '4-4 · Under Pressure',
    '4',
    '40',
    '16:45 - 17:00',
    'Wrap-up',
    '',
    'FLORIAN (last staff in room)',
    '',
  ],

  [
    '4-6 · Hip To Be Square (workshops)',
    '4',
    '100',
    '07:00 - 08:30',
    'Setup',
    '',
    'All staff (dispatched on site)',
    '',
  ],
  [
    '4-6 · Hip To Be Square (workshops)',
    '4',
    '100',
    '10:15 - 11:45',
    'AI-driven troubleshooting for Google Cloud infrastructure (workshop)',
    'Olivier Bourgeois',
    'NAV (support), JERWIN (support)',
    '',
  ],
  [
    '4-6 · Hip To Be Square (workshops)',
    '4',
    '100',
    '13:15 - 14:45',
    'Build a Personal Productivity Assistant on Cloud Run (workshop)',
    'Rishab Kumar',
    'LUNE (support), WILSON (support), YANIS (support)',
    '',
  ],
  [
    '4-6 · Hip To Be Square (workshops)',
    '4',
    '100',
    '15:00 - 16:30',
    'Automatisez la gestion des admissions de vos événements avec Gemini et Google Apps Script (workshop)',
    'Cyprien Tankeu',
    'LUNE (support), WILSON (support), YANIS (support until 16:00)',
    '',
  ],
  [
    '4-6 · Hip To Be Square (workshops)',
    '4',
    '100',
    '16:45 - 17:00',
    'Wrap-up',
    '',
    'LUNE, WILSON (last staff in room)',
    '',
  ],

  [
    '4-5 · Never Gonna Give You Up',
    '4',
    '40',
    '07:00 - 08:30',
    'Setup',
    '',
    'All staff (dispatched on site)',
    '',
  ],
  [
    '4-5 · Never Gonna Give You Up',
    '4',
    '40',
    '10:15 - 11:00',
    'Agentic Mobile Testing: Automating Flutter E2E Flows with Maestro MCP',
    'Ethiel Adiassa',
    'YANIS (support), LUNE (recording)',
    '',
  ],
  [
    '4-5 · Never Gonna Give You Up',
    '4',
    '40',
    '11:15 - 12:00',
    'Flight Mode AI: Shipping Reliable Offline AI with Flutter and Dart',
    'Jhin Lee',
    'YANIS (support), LUNE (recording)',
    '',
  ],
  [
    '4-5 · Never Gonna Give You Up',
    '4',
    '40',
    '13:00 - 13:45',
    "Ouvrir la boîte noire : L'interprétabilité mécaniste des LLMs",
    'David Cardozo',
    'JERWIN (support), ANDY (recording)',
    '',
  ],
  [
    '4-5 · Never Gonna Give You Up',
    '4',
    '40',
    '14:00 - 14:45',
    'Android AppFunctions: Exposing Your App to AI Agents',
    'Nav Singh',
    'JERWIN (support), ANDY (recording)',
    '',
  ],
  [
    '4-5 · Never Gonna Give You Up',
    '4',
    '40',
    '15:00 - 15:45',
    'From Vibe-Coded to Trusted: One Agent Through Build, Scale, Govern and Optimize on Gemini Enterprise Agent Platform',
    'Jonathan Zhuo',
    'NAV (support), JESSY (recording)',
    '',
  ],
  [
    '4-5 · Never Gonna Give You Up',
    '4',
    '40',
    '16:00 - 16:45',
    'Make Your AI Agent Think Fast and Slow: System One Decisions in Google ADK',
    'Thomas Chong',
    'JERWIN (support), JESSY (recording)',
    '',
  ],
  [
    '4-5 · Never Gonna Give You Up',
    '4',
    '40',
    '16:45 - 17:00',
    'Wrap-up',
    '',
    'JERWIN (last staff in room)',
    '',
  ],

  [
    'Photo booth & badge table (4th floor)',
    '4',
    '',
    '10:00 - 12:00',
    'Photo booth & badge table (after 4-2)',
    '',
    'WILSON',
    '',
  ],
  [
    'Photo booth & badge table (4th floor)',
    '4',
    '',
    '13:00 - 14:00',
    'Photo booth & badge table (after 4-2)',
    '',
    'KHASHAYAR',
    '',
  ],
  [
    'Photo booth & badge table (4th floor)',
    '4',
    '',
    '14:00 - 15:00',
    'Photo booth & badge table (after 4-2)',
    '',
    'SAJAD',
    '',
  ],
  [
    'Photo booth & badge table (4th floor)',
    '4',
    '',
    '15:00 - 16:00',
    'Photo booth & badge table (after 4-2)',
    '',
    'SOUAD',
    '',
  ],
  [
    'Photo booth & badge table (4th floor)',
    '4',
    '',
    '16:00 - 16:45',
    'Photo booth & badge table (after 4-2)',
    '',
    'ANDY',
    '',
  ],

  [
    'Sega Genesis & Photo Booth (3rd floor)',
    '3',
    '',
    '10:00 - 11:00',
    'Sega Genesis & Photo Booth',
    '',
    'JESSY',
    '',
  ],
  [
    'Sega Genesis & Photo Booth (3rd floor)',
    '3',
    '',
    '11:00 - 12:00',
    'Sega Genesis & Photo Booth',
    '',
    'JESSY',
    '',
  ],
  [
    'Sega Genesis & Photo Booth (3rd floor)',
    '3',
    '',
    '13:00 - 15:00',
    'Sega Genesis & Photo Booth',
    '',
    'DANIEL TO',
    '',
  ],
  [
    'Sega Genesis & Photo Booth (3rd floor)',
    '3',
    '',
    '15:00 - 16:00',
    'Sega Genesis & Photo Booth',
    '',
    'BRIJ-PAUL',
    '',
  ],
  [
    'Sega Genesis & Photo Booth (3rd floor)',
    '3',
    '',
    '16:00 - 16:45',
    'Sega Genesis & Photo Booth',
    '',
    'BRIJ-PAUL',
    '',
  ],
  [
    'Sega Genesis & Photo Booth (3rd floor)',
    '3',
    '',
    'After 18:30',
    'Wrap-up',
    '',
    'All staff (dispatched on site)',
    '3rd floor wrap-up after 18:30',
  ],

  [
    'Registration & welcome (3rd floor)',
    '3',
    '',
    '08:30 - 09:25',
    'Registration & breakfast',
    '',
    'ARUNESH, FLORIAN, STEFANIA, DANIEL WEI, REBECCA (organizers), WANLIN, SAJAD, LUNE, BRIJ-PAUL, SOUAD, ANDY, NADIA',
    'NADIA is practicing for her own DevFest a week later',
  ],
  [
    'Registration & welcome (3rd floor)',
    '3',
    '',
    '09:25 - 10:00',
    'Registration',
    '',
    'JIHOO (organizer), BRIJ-PAUL, SARA',
    '',
  ],
  [
    'Registration & welcome (3rd floor)',
    '3',
    '',
    '10:00 - 11:00',
    'Registration',
    '',
    'MIMOH (organizer), BRIJ-PAUL, OUMAIMA',
    '',
  ],
  [
    'Registration & welcome (3rd floor)',
    '3',
    '',
    '11:00 - 12:00',
    'Registration',
    '',
    'BRIJ-PAUL, NADIA, DANIEL TO, OUMAIMA',
    '',
  ],
  [
    'Registration & welcome (3rd floor)',
    '3',
    '',
    '12:00 - 13:00',
    'Registration (until 13:00)',
    '',
    'BRIJ-PAUL, NADIA, DANIEL TO',
    '',
  ],
  [
    'Registration & welcome (3rd floor)',
    '3',
    '',
    '14:00 - 15:00',
    'Registration',
    '',
    'MIMOH (organizer), NADIA',
    'NADIA is registration only',
  ],
  [
    'Registration & welcome (3rd floor)',
    '3',
    '',
    '14:00 - 16:00',
    'Registration & sponsors',
    '',
    'KHASHAYAR',
    'Close to registration after his 13:00-14:00 photo booth shift',
  ],

  [
    'Floating org helper',
    'All',
    '',
    '10:00 - 16:45',
    'Floating org helper (quarterback)',
    '',
    'SAMUEL',
    'Helps across rooms all day',
  ],
  [
    'Floating org helper',
    '4',
    '',
    '16:45 - 17:00',
    'Close 4th floor rooms',
    '',
    'LENZ (organizer), SAMUEL',
    'Help close out the 4th floor',
  ],
];

const STAFF_NAMES = [
  'ALI',
  'ANDY',
  'ARUNESH',
  'BILLY',
  'BRIJ-PAUL',
  'DANIEL TO',
  'DANIEL WEI',
  'FLORIAN',
  'JERWIN',
  'JESSY',
  'JHIN',
  'JIHOO',
  'KHASHAYAR',
  'Kanastruk team',
  'LENZ',
  'LUNE',
  'MIMOH',
  'NADIA',
  'NAV',
  'OUMAIMA',
  'REBECCA',
  'SAJAD',
  'SAMUEL',
  'SARA',
  'SOUAD',
  'STEFANIA',
  'WANLIN',
  'WILSON',
  'YANIS',
];

const CAL_LOCATION = 'Espace Ax.c, 800 Rue du Square-Victoria, Montréal, QC';

const ROOM_NAME_FR: Record<string, string> = {
  '4-6 · Hip To Be Square (workshops)': '4-6 · Hip To Be Square (ateliers)',
  '4-1 · Chill Zone, Photo booth & badge table (4th floor)':
    '4-1 · Zone détente, cabine photo et table des badges (4e étage)',
  'Sega Genesis & Photo Booth (3rd floor)':
    'Sega Genesis et cabine photo (3e étage)',
  'Registration & welcome (3rd floor)': 'Inscription et accueil (3e étage)',
  'Floating org helper': 'Aide-organisateur volant',
};

const SESSION_FR: Record<string, string> = {
  Setup: 'Installation et préparation',
  'Wrap-up': 'Rangement et clôture',
  'Chill Zone, Board Games & Community Lounge':
    'Zone détente, jeux de société et salon communautaire',
  'Open Talk Slot — TBC': 'Créneau de conférence ouvert — À confirmer',
  'Photo booth & badge table (after 4-2)':
    'Cabine photo et table des badges (après 4-2)',
  'Sega Genesis & Photo Booth': 'Sega Genesis et cabine photo',
  'Registration & breakfast': 'Inscription et déjeuner',
  Registration: 'Inscription',
  'Registration (until 13:00)': "Inscription (jusqu'à 13h00)",
  'Registration & sponsors': 'Inscription et commanditaires',
  'Floating org helper (quarterback)': 'Aide-organisateur volant (quarterback)',
  'Close 4th floor rooms': 'Fermeture des salles du 4e étage',
};

const NOTES_FR: Record<string, string> = {
  '3rd floor wrap-up after 18:30': 'Rangement du 3e étage après 18h30',
  'Right after last talk at 14:40':
    'Juste après la dernière conférence à 14h40',
  'NADIA is practicing for her own DevFest a week later':
    'NADIA pratique pour son propre DevFest la semaine suivante',
  'NADIA is registration only': "NADIA est affectée uniquement à l'inscription",
  'Close to registration after his 13:00-14:00 photo booth shift':
    "Près de l'inscription après son quart de 13h00 à 14h00 à la cabine photo",
  'Helps across rooms all day': 'Aide dans toutes les salles toute la journée',
  'Help close out the 4th floor': 'Aider à fermer le 4e étage',
};

function localizeRoomName(name: string, locale: Locale): string {
  if (locale === 'en') return name;
  return ROOM_NAME_FR[name] || name;
}

function localizeTime(time: string, locale: Locale): string {
  if (locale === 'en') return time;
  if (/^After\s+18:30$/i.test(time.trim())) return 'Après 18h30';
  return time;
}

function localizeSession(session: string, locale: Locale): string {
  if (locale === 'en') return session;
  if (SESSION_FR[session]) return SESSION_FR[session];
  return session.replace(/\(workshop\)/gi, '(atelier)');
}

function localizeSpeaker(speaker: string, locale: Locale): string {
  if (locale === 'en') return speaker;
  if (speaker === 'Open') return 'Ouvert';
  if (speaker === 'GDG Montreal Community Lounge')
    return 'Salon communautaire GDG Montréal';
  return speaker;
}

function localizeStaff(staff: string, locale: Locale): string {
  if (locale === 'en' || !staff) return staff;
  if (staff === 'Not staffed') return 'Sans bénévole';
  return staff
    .replace(
      /All staff \(dispatched on site\)/gi,
      "Toute l'équipe (répartie sur place)",
    )
    .replace(/Kanastruk team/gi, 'Équipe Kanastruk')
    .replace(/\(support until 16:00\)/gi, "(soutien jusqu'à 16h00)")
    .replace(/\(support\)/gi, '(soutien)')
    .replace(/\(main recorder\)/gi, '(enregistrement principal)')
    .replace(/\(OBS support\)/gi, '(soutien OBS)')
    .replace(/\(recording\)/gi, '(enregistrement)')
    .replace(/\(lead\)/gi, '(responsable)')
    .replace(/\(last staff in room\)/gi, '(dernier bénévole en salle)')
    .replace(/\(organizers\)/gi, '(organisateurs)')
    .replace(/\(organizer\)/gi, '(organisateur/trice)')
    .replace(/Jhin is on talk/gi, 'Jhin est en conférence');
}

function localizeNotes(notes: string, locale: Locale): string {
  if (locale === 'en' || !notes) return notes;
  return NOTES_FR[notes] || notes;
}

function startMin(t: string): number {
  const m = /^(\d{1,2}):(\d{2})/.exec(t);
  return m ? +m[1] * 60 + +m[2] : 99999;
}

function floorOf(f: string): string {
  return f === '3' ? '3' : f === '4' ? '4' : 'other';
}

function displayFloor(f: string, locale: Locale): string {
  if (locale === 'fr') {
    const mapFr: Record<string, string> = {
      '3': '3e étage',
      '4': '4e étage',
      All: 'Tous les étages',
    };
    return mapFr[f] || f;
  }
  const mapEn: Record<string, string> = {
    '3': '3rd floor',
    '4': '4th floor',
    All: 'All floors',
  };
  return mapEn[f] || f;
}

function parseRange(t: string): [[number, number], [number, number]] | null {
  const m = /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/.exec(t);
  if (m)
    return [
      [+m[1], +m[2]],
      [+m[3], +m[4]],
    ];
  if (/^After\s+18:30$/i.test(t.trim()))
    return [
      [18, 30],
      [19, 30],
    ];
  return null;
}

function utcStamp(h: number, mi: number): string {
  const d = new Date(Date.UTC(2026, 10, 6, h + 5, mi));
  return d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

function buildEventFields(
  it: ShiftItem,
  roomName: string,
  selectedStaff: string,
  locale: Locale,
): CalendarEventFields | null {
  const r = parseRange(it.time);
  if (!r) return null;
  const activeStaff =
    selectedStaff !== 'all' ? selectedStaff.toUpperCase() : '';
  const prefix = activeStaff
    ? `[DevFest Staff · ${activeStaff}] `
    : '[DevFest Staff] ';
  const locRoom = localizeRoomName(roomName, locale);
  const locSession =
    localizeSession(it.session, locale) ||
    (locale === 'fr' ? 'Quart' : 'Shift');
  const title = `${prefix}${locSession} — ${locRoom}`;
  const locSpeaker = localizeSpeaker(it.speaker, locale);
  const locStaff = localizeStaff(it.staff, locale);
  const locNotes = localizeNotes(it.notes, locale);
  const details = [
    locSpeaker &&
      `${locale === 'fr' ? 'Conférencier(s)' : 'Speaker'}: ${locSpeaker}`,
    locStaff && `${locale === 'fr' ? 'Équipe' : 'Staff'}: ${locStaff}`,
    locNotes,
  ]
    .filter(Boolean)
    .join('\n');
  return {
    title,
    start: utcStamp(r[0][0], r[0][1]),
    end: utcStamp(r[1][0], r[1][1]),
    location: `${CAL_LOCATION} · ${locRoom}`,
    details,
  };
}

function googleHref(f: CalendarEventFields): string {
  return (
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' +
    encodeURIComponent(f.title) +
    '&dates=' +
    f.start +
    '/' +
    f.end +
    '&location=' +
    encodeURIComponent(f.location) +
    '&details=' +
    encodeURIComponent(f.details) +
    '&ctz=America/Montreal'
  );
}

function icsEventBlock(f: CalendarEventFields): string {
  const e = (s: string) =>
    String(s)
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  const now = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
  return [
    'BEGIN:VEVENT',
    `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@devfest-mtl-2026`,
    `DTSTAMP:${now}`,
    `DTSTART:${f.start}`,
    `DTEND:${f.end}`,
    `SUMMARY:${e(f.title)}`,
    `LOCATION:${e(f.location)}`,
    `DESCRIPTION:${e(f.details)}`,
    'END:VEVENT',
  ].join('\r\n');
}

function downloadIcs(
  events: CalendarEventFields | CalendarEventFields[],
  filenameBase?: string,
) {
  const list = Array.isArray(events) ? events : [events];
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DevFest MTL 2026//Room Assignments//EN',
    'CALSCALE:GREGORIAN',
    ...list.map(icsEventBlock),
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download =
    (filenameBase || 'devfest-shift').replace(/[^\w-]+/g, '_').slice(0, 60) +
    '.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function matchesStaff(staffStr: string, selectedStaff: string): boolean {
  if (selectedStaff === 'all') return true;
  if (!staffStr) return false;
  const lower = staffStr.toLowerCase();
  if (lower.includes('all staff')) return true;
  const escaped = selectedStaff.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, 'i').test(lower);
}

export function StaffAssignmentsView({
  initialLocale = 'en',
}: {
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [search, setSearch] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedRoomIdx, setSelectedRoomIdx] = useState('all');
  const [activeFloor, setActiveFloor] = useState('all');

  const isFr = locale === 'fr';

  const rooms = useMemo<RoomGroup[]>(() => {
    const list: RoomGroup[] = [];
    const byName: Record<string, RoomGroup> = {};
    for (const r of ROWS) {
      const name =
        r[0].includes('Danger Zone') || r[0].includes('Photo booth & badge')
          ? '4-1 · Chill Zone, Photo booth & badge table (4th floor)'
          : r[0];
      if (!byName[name]) {
        const floorCode =
          name.includes('Sega') || name.includes('Registration')
            ? '3'
            : name.includes('Danger Zone') || name.includes('Photo booth')
              ? '4'
              : r[1];
        byName[name] = { name, floor: floorCode, seats: r[2], items: [] };
        list.push(byName[name]);
      }
      byName[name].items.push({
        time: r[3],
        session: r[4],
        speaker: r[5],
        staff: r[6],
        notes: r[7],
        floor:
          name.includes('Sega') || name.includes('Registration')
            ? '3'
            : name.includes('Danger Zone') || name.includes('Photo booth')
              ? '4'
              : r[1],
      });
    }
    list.forEach((room) =>
      room.items.sort((a, b) => startMin(a.time) - startMin(b.time)),
    );
    return list;
  }, []);

  const filteredRooms = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result: Array<{
      room: RoomGroup;
      idx: number;
      items: ShiftItem[];
    }> = [];

    rooms.forEach((room, idx) => {
      if (selectedRoomIdx !== 'all' && String(idx) !== selectedRoomIdx) return;

      const items = room.items.filter((it) => {
        if (
          activeFloor !== 'all' &&
          floorOf(room.floor) !== activeFloor &&
          floorOf(it.floor) !== activeFloor
        ) {
          return false;
        }
        if (!matchesStaff(it.staff, selectedStaff)) return false;
        if (!q) return true;
        const hay = [
          room.name,
          localizeRoomName(room.name, 'fr'),
          it.time,
          localizeTime(it.time, 'fr'),
          it.session,
          localizeSession(it.session, 'fr'),
          it.speaker,
          it.staff,
          localizeStaff(it.staff, 'fr'),
          it.notes,
          localizeNotes(it.notes, 'fr'),
        ]
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });

      if (items.length > 0) {
        result.push({ room, idx, items });
      }
    });

    return result;
  }, [rooms, search, selectedStaff, selectedRoomIdx, activeFloor]);

  const visibleEvents = useMemo(() => {
    const events: CalendarEventFields[] = [];
    filteredRooms.forEach(({ room, items }) => {
      items.forEach((it) => {
        const ev = buildEventFields(it, room.name, selectedStaff, locale);
        if (ev) events.push(ev);
      });
    });
    return events;
  }, [filteredRooms, selectedStaff, locale]);

  return (
    <div className="staff-page-root">
      <style>{`
        .staff-page-root {
          --bg: #f5f7fb;
          --surface: #ffffff;
          --text: #1e1e1e;
          --muted: #5f6368;
          --border: #dfe3ea;
          --blue: #4285f4;
          --blue-bg: #e7f0fd;
          --peach-bg: #fdf0e6;
          --green: #34a853;
          --red: #ea4335;
          --yellow: #e37400;
          --pill: #eef1f6;
          --shadow: 0 1px 2px rgba(0,0,0,.06), 0 2px 8px rgba(0,0,0,.04);
          font-family: "Google Sans", Roboto, system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
          background: var(--bg);
          color: var(--text);
          line-height: 1.4;
          font-size: 15px;
          min-height: 100vh;
        }
        @media (prefers-color-scheme: dark) {
          .staff-page-root {
            --bg: #121417;
            --surface: #1c2026;
            --text: #f0f2f5;
            --muted: #9aa3ad;
            --border: #2c333c;
            --blue-bg: #1d2a40;
            --peach-bg: #3a2a1d;
            --yellow: #fbbc04;
            --pill: #262d36;
            --shadow: none;
          }
        }
        .staff-page-root * { box-sizing: border-box; }
        .staff-safe {
          padding-left: max(14px, env(safe-area-inset-left));
          padding-right: max(14px, env(safe-area-inset-right));
        }
        .staff-header {
          position: sticky;
          top: 0;
          z-index: 10;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding-top: max(10px, env(safe-area-inset-top));
          padding-bottom: 10px;
        }
        .staff-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .staff-header h1 { font-size: 18px; margin: 0 0 2px; font-weight: 700; }
        .staff-header .sub { color: var(--muted); font-size: 13px; }
        .staff-lang-toggle {
          display: inline-flex;
          border: 1px solid var(--border);
          background: var(--bg);
          border-radius: 999px;
          padding: 2px;
          flex-shrink: 0;
        }
        .staff-lang-btn {
          border: none;
          background: transparent;
          color: var(--muted);
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          cursor: pointer;
        }
        .staff-lang-btn[aria-pressed="true"] {
          background: var(--blue);
          color: #fff;
        }
        .staff-controls { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
        .staff-controls input, .staff-controls select {
          font: inherit;
          padding: 9px 12px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          min-width: 0;
        }
        .staff-controls input { flex: 1 1 180px; }
        .staff-controls select { flex: 1 1 180px; }
        .staff-bar-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 10px;
        }
        .staff-tabs {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
        }
        .staff-tabs::-webkit-scrollbar { display: none; }
        .staff-tab {
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          padding: 6px 12px;
          border-radius: 999px;
          font: inherit;
          font-size: 13px;
          white-space: nowrap;
          cursor: pointer;
        }
        .staff-tab[aria-pressed="true"] {
          background: var(--blue);
          border-color: var(--blue);
          color: #fff;
        }
        .staff-bulk-cal {
          border: 1px solid var(--green);
          background: rgba(52, 168, 83, 0.14);
          color: var(--text);
          padding: 6px 12px;
          border-radius: 999px;
          font: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .staff-bulk-cal:hover { background: var(--green); color: #fff; }
        .staff-main {
          padding-top: 14px;
          padding-bottom: max(24px, env(safe-area-inset-bottom));
          display: grid;
          gap: 14px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 900px) {
          .staff-main { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 1300px) {
          .staff-main { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        .staff-room {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: var(--shadow);
          overflow: hidden;
          align-self: start;
        }
        .staff-room-head {
          padding: 12px 14px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: baseline;
          flex-wrap: wrap;
        }
        .staff-room-head h2 { margin: 0; font-size: 16px; font-weight: 700; }
        .staff-room-head .meta { color: var(--muted); font-size: 12px; white-space: nowrap; }
        .staff-room.blue .staff-room-head { background: var(--blue-bg); }
        .staff-room.peach .staff-room-head { background: var(--peach-bg); }
        .staff-item {
          padding: 10px 14px;
          border-bottom: 1px solid var(--border);
          display: grid;
          gap: 3px;
        }
        .staff-item:last-child { border-bottom: none; }
        .staff-item .row1 { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .staff-time {
          font-variant-numeric: tabular-nums;
          font-weight: 700;
          font-size: 13px;
          background: var(--pill);
          padding: 2px 8px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .staff-session { font-weight: 600; }
        .staff-speaker { color: var(--text); font-size: 14px; }
        .staff-line { font-size: 13px; color: var(--text); }
        .staff-val { color: var(--red); font-weight: 700; }
        .spk-lbl { color: var(--yellow); font-weight: 700; }
        .staff-notes { color: var(--muted); font-size: 12px; }
        .unstaffed { color: var(--red); font-weight: 600; }
        .staff-cal { display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap; }
        .staff-cal-btn {
          font: inherit;
          font-size: 12px;
          padding: 5px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          text-decoration: none;
          cursor: pointer;
        }
        .staff-cal-google { color: var(--blue); border-color: var(--blue); }
        .staff-empty { padding: 30px 16px; text-align: center; color: var(--muted); grid-column: 1 / -1; }
        .staff-footer {
          color: var(--muted);
          font-size: 12px;
          text-align: center;
          padding: 10px 0 max(16px, env(safe-area-inset-bottom));
        }
      `}</style>

      <header className="staff-header staff-safe">
        <div className="staff-top-row">
          <div>
            <h1>
              {isFr
                ? 'DevFest Montréal 2026 · Affectations par salle (Équipe)'
                : 'DevFest Montréal 2026 · Staff & Room Assignments'}
            </h1>
            <div className="sub">
              {isFr
                ? 'Vendredi 6 novembre 2026 · Espace Ax.c (800 Square-Victoria) · Vue chronologique par salle'
                : 'Friday 6 November 2026 · Espace Ax.c (800 Square-Victoria) · Chronological view by room'}
            </div>
          </div>

          <div
            className="staff-lang-toggle"
            role="group"
            aria-label="Language switcher"
          >
            <button
              type="button"
              className="staff-lang-btn"
              aria-pressed={locale === 'en'}
              onClick={() => setLocale('en')}
            >
              EN
            </button>
            <button
              type="button"
              className="staff-lang-btn"
              aria-pressed={locale === 'fr'}
              onClick={() => setLocale('fr')}
            >
              FR
            </button>
          </div>
        </div>

        <div className="staff-controls">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isFr
                ? 'Rechercher un conférencier, une session ou un bénévole'
                : 'Search speaker, session or staff'
            }
            aria-label={isFr ? 'Rechercher' : 'Search'}
          />
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            aria-label={
              isFr ? 'Filtrer par membre du staff' : 'Filter by staff member'
            }
          >
            <option value="all">
              {isFr ? "Tous les membres de l'équipe" : 'All staff members'}
            </option>
            {STAFF_NAMES.map((name) => (
              <option key={name} value={name.toLowerCase()}>
                {isFr
                  ? `Équipe : ${name === 'Kanastruk team' ? 'Équipe Kanastruk' : name}`
                  : `Staff: ${name}`}
              </option>
            ))}
          </select>
          <select
            value={selectedRoomIdx}
            onChange={(e) => setSelectedRoomIdx(e.target.value)}
            aria-label={isFr ? 'Filtrer par salle' : 'Filter by room'}
          >
            <option value="all">
              {isFr ? 'Toutes les salles' : 'All rooms'}
            </option>
            {rooms.map((r, i) => (
              <option key={r.name} value={String(i)}>
                {localizeRoomName(r.name, locale)}
              </option>
            ))}
          </select>
        </div>

        <div className="staff-bar-row">
          <div
            className="staff-tabs"
            role="group"
            aria-label={isFr ? 'Filtre par étage' : 'Floor filter'}
          >
            {(
              [
                ['all', isFr ? 'Tous' : 'All'],
                ['3', isFr ? '3e étage' : '3rd floor'],
                ['4', isFr ? '4e étage' : '4th floor'],
                ['other', isFr ? 'Autre' : 'Other'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className="staff-tab"
                aria-pressed={activeFloor === key}
                onClick={() => setActiveFloor(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {selectedStaff !== 'all' && visibleEvents.length > 0 && (
            <button
              type="button"
              className="staff-bulk-cal"
              onClick={() =>
                downloadIcs(
                  visibleEvents,
                  `DevFest-2026-Shifts-${selectedStaff.toUpperCase()}`,
                )
              }
            >
              {isFr
                ? `📅 Télécharger les ${visibleEvents.length} quarts de ${selectedStaff.toUpperCase()} (.ics)`
                : `📅 Download all ${visibleEvents.length} shifts for ${selectedStaff.toUpperCase()} (.ics)`}
            </button>
          )}
        </div>
      </header>

      <main className="staff-main staff-safe">
        {filteredRooms.length === 0 ? (
          <div className="staff-empty">
            {isFr
              ? 'Aucun résultat pour cette recherche.'
              : 'Nothing matches that filter.'}
          </div>
        ) : (
          filteredRooms.map(({ room, idx, items }) => {
            const colorClass = idx % 2 === 0 ? 'blue' : 'peach';
            return (
              <section key={room.name} className={`staff-room ${colorClass}`}>
                <div className="staff-room-head">
                  <h2>{localizeRoomName(room.name, locale)}</h2>
                  <div className="meta">
                    {displayFloor(room.floor, locale)}
                    {room.seats
                      ? ` · ${room.seats} ${isFr ? 'places' : 'seats'}`
                      : ''}
                  </div>
                </div>

                {items.map((it, itemIdx) => {
                  const ev = buildEventFields(
                    it,
                    room.name,
                    selectedStaff,
                    locale,
                  );
                  return (
                    <div
                      key={`${room.name}-${it.time}-${itemIdx}`}
                      className="staff-item"
                    >
                      <div className="row1">
                        <span className="staff-time">
                          {localizeTime(it.time, locale)}
                        </span>
                        {it.session && (
                          <span className="staff-session">
                            {localizeSession(it.session, locale)}
                          </span>
                        )}
                      </div>

                      {it.speaker && (
                        <div className="staff-speaker">
                          <strong className="spk-lbl">
                            {isFr ? 'Conférenciers : ' : 'Speakers: '}
                          </strong>
                          {localizeSpeaker(it.speaker, locale)}
                        </div>
                      )}

                      {it.staff && (
                        <div className="staff-line">
                          <span className="staff-val">
                            {isFr ? 'Équipe : ' : 'Staff: '}
                          </span>
                          {it.staff === 'Not staffed' ? (
                            <span className="unstaffed">
                              {isFr ? 'Sans bénévole' : 'Not staffed'}
                            </span>
                          ) : (
                            localizeStaff(it.staff, locale)
                          )}
                        </div>
                      )}

                      {it.notes && (
                        <div className="staff-notes">
                          {localizeNotes(it.notes, locale)}
                        </div>
                      )}

                      {ev && (
                        <div className="staff-cal">
                          <a
                            className="staff-cal-btn staff-cal-google"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={googleHref(ev)}
                          >
                            + Google
                          </a>
                          <button
                            type="button"
                            className="staff-cal-btn"
                            onClick={() => downloadIcs(ev, ev.title)}
                          >
                            + Apple / .ics
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            );
          })
        )}
      </main>

      <footer className="staff-footer">
        {isFr
          ? "Généré à partir de l'onglet Room Assignments de la feuille de planification. Heures locales (Montréal)."
          : 'Built from the Room Assignments tab of the planning sheet. Times are local (Montréal).'}
      </footer>
    </div>
  );
}
