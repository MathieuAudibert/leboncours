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
  { name: 'Programming', icon: MdCode, color: '#3B82F6', count: 234 },
  { name: 'Music', icon: MdMusicNote, color: '#8B5CF6', count: 187 },
  { name: 'Languages', icon: MdTranslate, color: '#10B981', count: 312 },
  { name: 'Mathematics', icon: MdCalculate, color: '#F59E0B', count: 156 },
  { name: 'Science', icon: MdScience, color: '#EF4444', count: 98 },
  { name: 'Art & Design', icon: MdBrush, color: '#EC4899', count: 145 },
  { name: 'Academics', icon: MdSchool, color: '#6366F1', count: 203 },
  { name: 'Fitness', icon: MdFitnessCenter, color: '#14B8A6', count: 76 },
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