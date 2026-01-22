export interface Chakra {
  id: string;
  name: string;
  sanskritName: string;
  color: string;
  colorClass: string;
  affirmation: string;
  affirmationBg: string;
  location: string;
}

export const chakras: Chakra[] = [
  {
    id: 'root',
    name: 'Root',
    sanskritName: 'Muladhara',
    color: 'hsl(0, 70%, 45%)',
    colorClass: 'chakra-root',
    affirmation: 'I am grounded, safe, and secure.',
    affirmationBg: 'Аз съм заземен/а, в безопасност и сигурност.',
    location: 'Base of spine',
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
  },
  {
    id: 'crown',
    name: 'Crown',
    sanskritName: 'Sahasrara',
    color: 'hsl(280, 65%, 60%)',
    colorClass: 'chakra-crown',
    affirmation: 'I am connected to the divine.',
    affirmationBg: 'Свързан/а съм с божественото.',
    location: 'Top of head',
  },
];

export const musicTracks = [
  {
    id: 'ambient',
    name: 'Reiki Healing Music',
    nameBg: 'Рейки лечебна музика',
    description: 'Emotional & physical healing music',
    icon: '🎵',
    soundcloudUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1153020259&color=%23aabbcc&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
  },
  {
    id: 'nature',
    name: 'Relaxing Nature',
    nameBg: 'Релаксираща природа',
    description: 'Stress relief, healing & meditation',
    icon: '🌿',
    soundcloudUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/263906303&color=%23aabbcc&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
  },
  {
    id: 'frequencies',
    name: 'Healing Frequencies',
    nameBg: 'Лечебни честоти',
    description: '528Hz Love Frequency',
    icon: '✨',
    soundcloudUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1201113973&color=%23aabbcc&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false',
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
