export interface Chakra {
  id: string;
  name: string;
  sanskritName: string;
  color: string;
  colorClass: string;
  affirmation: string;
  affirmationBg: string;
  location: string;
  number: number;
}

// Chakras ordered from Crown (7) to Root (1) for meditation flow
export const chakras: Chakra[] = [
  {
    id: 'crown',
    name: 'Crown',
    sanskritName: 'Sahasrara',
    color: 'hsl(280, 65%, 60%)',
    colorClass: 'chakra-crown',
    affirmation: 'I am connected to the divine.',
    affirmationBg: 'Свързан/а съм с божественото.',
    location: 'Top of head',
    number: 7,
  },
  {
    id: 'third-eye',
    name: 'Third Eye',
    sanskritName: 'Ajna',
    color: 'hsl(240, 60%, 55%)',
    colorClass: 'chakra-third-eye',
    affirmation: 'I trust my intuition and inner wisdom.',
    affirmationBg: 'Доверявам се на интуицията и вътрешната си мъдрост.',
    location: 'Between eyebrows',
    number: 6,
  },
  {
    id: 'throat',
    name: 'Throat',
    sanskritName: 'Vishuddha',
    color: 'hsl(195, 80%, 50%)',
    colorClass: 'chakra-throat',
    affirmation: 'I speak my truth with clarity.',
    affirmationBg: 'Изразявам истината си с яснота.',
    location: 'Throat',
    number: 5,
  },
  {
    id: 'heart',
    name: 'Heart',
    sanskritName: 'Anahata',
    color: 'hsl(145, 55%, 45%)',
    colorClass: 'chakra-heart',
    affirmation: 'I give and receive love freely.',
    affirmationBg: 'Давам и приемам любов свободно.',
    location: 'Center of chest',
    number: 4,
  },
  {
    id: 'solar',
    name: 'Solar Plexus',
    sanskritName: 'Manipura',
    color: 'hsl(45, 95%, 55%)',
    colorClass: 'chakra-solar',
    affirmation: 'I am confident and powerful.',
    affirmationBg: 'Аз съм уверен/а и силен/а.',
    location: 'Upper abdomen',
    number: 3,
  },
  {
    id: 'sacral',
    name: 'Sacral',
    sanskritName: 'Svadhisthana',
    color: 'hsl(25, 90%, 55%)',
    colorClass: 'chakra-sacral',
    affirmation: 'I embrace pleasure and creativity.',
    affirmationBg: 'Приемам удоволствието и творчеството.',
    location: 'Lower abdomen',
    number: 2,
  },
  {
    id: 'root',
    name: 'Root',
    sanskritName: 'Muladhara',
    color: 'hsl(0, 70%, 45%)',
    colorClass: 'chakra-root',
    affirmation: 'I am grounded, safe, and secure.',
    affirmationBg: 'Аз съм заземен/а, в безопасност и сигурност.',
    location: 'Base of spine',
    number: 1,
  },
];

export const musicTracks = [
  {
    id: 'ambient',
    name: 'Reiki Healing Music',
    nameBg: 'Рейки лечебна музика',
    description: 'Emotional & physical healing music',
    icon: '🎵',
    soundcloudUrl: 'https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2FRelaxingRecords%2F3-hours-reiki-music-energy-healing-nature-sounds-zen-meditation%2F',
  },
  {
    id: 'nature',
    name: 'Relaxing Nature',
    nameBg: 'Релаксираща природа',
    description: 'Stress relief, healing & meditation',
    icon: '🌿',
    soundcloudUrl: 'https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2FRelaxationAmbientMusic%2Frelaxing-music-for-stress-relief-meditation-music%2F',
  },
  {
    id: 'frequencies',
    name: 'Healing Frequencies',
    nameBg: 'Лечебни честоти',
    description: '528Hz Love Frequency',
    icon: '✨',
    soundcloudUrl: 'https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2FHealingMusicOfficial%2F528hz-miracle-tone-love-frequency-healing-music%2F',
  },
  {
    id: 'cleanse',
    name: '396Hz Cleanse Energy',
    nameBg: '396Hz Пречистване',
    description: 'Cleanse negative energy, positive vibration',
    icon: '🔮',
    soundcloudUrl: 'https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2FMeditationRelaxMusic%2F396hz-music-for-meditation-and-healing%2F',
  },
  {
    id: 'silence',
    name: 'Silence',
    nameBg: 'Тишина',
    description: 'Meditate in peaceful silence',
    icon: '🤫',
    soundcloudUrl: null,
  },
];

export const transitionSounds = [
  {
    id: 'tibetan-small',
    name: 'Small Tibetan Bowl',
    nameBg: 'Малка тибетска купа',
    icon: '🔔',
    soundcloudUrl: 'https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2FTibetanBowls%2Ftibetan-singing-bowl-sound%2F',
  },
  {
    id: 'white-tara',
    name: 'White Tara Bowl',
    nameBg: 'Бяла Тара купа',
    icon: '🎐',
    soundcloudUrl: 'https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2FSingingBowlSounds%2Fhealing-tibetan-bowl-meditation%2F',
  },
  {
    id: 'singing-bowl',
    name: 'Singing Bowl Hit',
    nameBg: 'Пеещa купа',
    icon: '🔊',
    soundcloudUrl: 'https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2FMeditationSounds%2Fsinging-bowl-meditation-sound%2F',
  },
  {
    id: 'none',
    name: 'No Sound',
    nameBg: 'Без звук',
    icon: '🔇',
    soundcloudUrl: null,
  },
];
