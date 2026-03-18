import { Zap, Shield, Globe, Users, Target, Lightbulb, Server } from 'lucide-react';
import { MdHandshake, MdSpeed, MdDiversity3 } from 'react-icons/md';
import { GoRocket } from 'react-icons/go';
import { SiRust, SiReact, SiPostgresql } from 'react-icons/si';

export const VALUES = [
  {
    icon: Zap,
    title: 'Speed',
    desc: 'Instant session booking. No bureaucracy, no delays — just connect and learn.',
    color: '#FF9F0A',
  },
  {
    icon: MdHandshake,
    title: 'Simplicity',
    desc: 'A clean interface that makes finding the right mentor effortless.',
    color: '#0071E3',
  },
  {
    icon: Shield,
    title: 'Trust',
    desc: 'Verified mentors, transparent reviews, and secure payments.',
    color: '#34C759',
  },
  {
    icon: MdDiversity3,
    title: 'Diversity',
    desc: 'Hundreds of skills from programming to music to languages and beyond.',
    color: '#AF52DE',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    desc: 'Learn from anywhere via video calls. No location limits.',
    color: '#30D158',
  },
  {
    icon: MdSpeed,
    title: 'Performance',
    desc: 'Built with Rust on the backend for blazing-fast response times.',
    color: '#FF3B30',
  },
];

export const TIMELINE = [
  {
    icon: Lightbulb,
    title: 'The Idea',
    desc: 'We noticed casual learners struggled to find quick, affordable expert help. Universities and existing platforms were either too formal or too expensive.',
  },
  {
    icon: Target,
    title: 'The Mission',
    desc: 'Build a decentralized marketplace where anyone with a skill can teach, and anyone eager to learn can book a session in seconds.',
  },
  {
    icon: GoRocket,
    title: 'The Launch',
    desc: 'Leboncours was born — combining the simplicity of a classified-ad platform with professional tutoring management tools.',
  },
  {
    icon: Users,
    title: 'The Community',
    desc: 'Today, thousands of mentors and students connect through our platform every day, across dozens of skill categories.',
  },
];

export const TECH = [
  { icon: SiRust, name: 'Rust', desc: 'Backend engine', color: '#DEA584' },
  { icon: Server, name: 'Axum', desc: 'Web framework', color: '#7C3AED' },
  { icon: SiReact, name: 'React', desc: 'Frontend UI', color: '#61DAFB' },
  { icon: SiPostgresql, name: 'PostgreSQL', desc: 'Database (Aiven)', color: '#336791' },
];
