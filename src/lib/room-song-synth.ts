export type RoomSongCredits = {
  songTitle: string;
  artist: string;
  year: string;
  youtubeUrl: string;
};

const ROOM_SONG_CREDITS: Record<string, RoomSongCredits> = {
  '3-1': {
    songTitle: "Don't Stop Believin'",
    artist: 'Journey',
    year: '1981',
    youtubeUrl: 'https://music.youtube.com/watch?v=1k8craCGpgs',
  },
  '3-2': {
    songTitle: 'Mr. Roboto',
    artist: 'Styx',
    year: '1983',
    youtubeUrl: 'https://music.youtube.com/watch?v=uc6f_2nPSX8',
  },
  '3-3': {
    songTitle: 'Take On Me',
    artist: 'a-ha',
    year: '1985',
    youtubeUrl: 'https://music.youtube.com/watch?v=djV11Xbc914',
  },
  '3-4': {
    songTitle: 'Call Me',
    artist: 'Blondie',
    year: '1980',
    youtubeUrl: 'https://music.youtube.com/watch?v=StKVS0eI85I',
  },
  '3-5': {
    songTitle: "Just Can't Get Enough",
    artist: 'Depeche Mode',
    year: '1981',
    youtubeUrl: 'https://music.youtube.com/watch?v=_6FBfAQ-NDE',
  },
  '4-1': {
    songTitle: 'The Danger Zone',
    artist: 'Kenny Loggins',
    year: '1986',
    youtubeUrl: 'https://music.youtube.com/watch?v=siwpn14IE7E',
  },
  '4-2': {
    songTitle: 'Money For Nothing',
    artist: 'Dire Straits',
    year: '1985',
    youtubeUrl: 'https://music.youtube.com/watch?v=wTP2RUD_cL0',
  },
  '4-3': {
    songTitle: 'Working For The Weekend',
    artist: 'Loverboy',
    year: '1981',
    youtubeUrl: 'https://music.youtube.com/watch?v=dsgBpsNPQ50',
  },
  '4-4': {
    songTitle: 'Under Pressure',
    artist: 'Queen & David Bowie',
    year: '1981',
    youtubeUrl: 'https://music.youtube.com/watch?v=a01QQZyl-_I',
  },
  '4-5': {
    songTitle: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    year: '1987',
    youtubeUrl: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  '4-6': {
    songTitle: 'Hip To Be Square',
    artist: 'Huey Lewis & The News',
    year: '1986',
    youtubeUrl: 'https://music.youtube.com/watch?v=LB5YkmjalDg',
  },
  '4-7': {
    songTitle: 'Should I Stay Or Should I Go',
    artist: 'The Clash',
    year: '1982',
    youtubeUrl: 'https://music.youtube.com/watch?v=xMaE6toi4mk',
  },
};

export function resolveRoomSongKey(roomIdOrName: string): string | null {
  const key = roomIdOrName.toLowerCase().trim();
  if (ROOM_SONG_CREDITS[key]) return key;

  if (key === 'l3-room-1' || key.includes('believin')) return '3-1';
  if (key === 'l3-room-2' || key.includes('roboto')) return '3-2';
  if (key === 'l3-room-3' || key.includes('take on me')) return '3-3';
  if (key === 'l3-room-4' || key.includes('call me')) return '3-4';
  if (key === 'l3-room-5' || key.includes('get enough')) return '3-5';
  if (key === 'l4-room-1' || key.includes('danger zone')) return '4-1';
  if (key === 'l4-room-2' || key.includes('money for nothing')) return '4-2';
  if (key === 'l4-room-3' || key.includes('working for the weekend'))
    return '4-3';
  if (key === 'l4-room-4' || key.includes('under pressure')) return '4-4';
  if (key === 'l4-room-5' || key.includes('never gonna give you up'))
    return '4-5';
  if (key === 'l4-room-6' || key.includes('hip to be square')) return '4-6';
  if (key === 'l4-room-7' || key.includes('should i stay')) return '4-7';

  return null;
}

export function getRoomSongCredits(
  roomIdOrName: string,
): RoomSongCredits | null {
  const resolved = resolveRoomSongKey(roomIdOrName);
  return resolved ? ROOM_SONG_CREDITS[resolved] : null;
}
