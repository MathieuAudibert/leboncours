import { Search, CalendarCheck, Video } from 'lucide-react';
import {
  MdSchool,
  MdMusicNote,
  MdCode,
  MdBrush,
  MdScience,
  MdCalculate,
  MdTranslate,
  MdFitnessCenter,
} from 'react-icons/md';

export const CATEGORIES = [
  { name: 'Programming', icon: MdCode, color: '#0071E3', count: 234 },
  { name: 'Music', icon: MdMusicNote, color: '#AF52DE', count: 187 },
  { name: 'Languages', icon: MdTranslate, color: '#34C759', count: 312 },
  { name: 'Mathematics', icon: MdCalculate, color: '#FF9F0A', count: 156 },
  { name: 'Science', icon: MdScience, color: '#FF3B30', count: 98 },
  { name: 'Art & Design', icon: MdBrush, color: '#FF2D55', count: 145 },
  { name: 'Academics', icon: MdSchool, color: '#5856D6', count: 203 },
  { name: 'Fitness', icon: MdFitnessCenter, color: '#30D158', count: 76 },
];

export const STEPS = [
  {
    icon: Search,
    title: 'Find your mentor',
    desc: 'Browse through skill cards and find the perfect mentor for your needs.',
  },
  {
    icon: CalendarCheck,
    title: 'Book a session',
    desc: 'Pick a time that suits you from your mentor\'s available slots.',
  },
  {
    icon: Video,
    title: 'Learn & grow',
    desc: 'Join a one-on-one video call and gain practical knowledge instantly.',
  },
];
