// Platform constants and controlled enumerations for FORGE

import { BuildStatus, PostType } from '../types';

export const APP_NAME = 'FORGE';
export const APP_TAGLINE = "Show what you're building.";
export const APP_PHILOSOPHY = 'PROOF > CLAIMS';

export const BUILD_CATEGORIES = [
  'AI & Machine Learning',
  'Web Systems & Distributed',
  'Developer Tooling',
  'Cloud & Infrastructure',
  'Mobile & Ubiquitous',
  'Open Source Libraries',
  'Design Engineering',
  'Security & Cryptography',
  'Robotics & Embedded Systems'
] as const;

export const POPULAR_TOPICS = [
  'TypeScript',
  'React',
  'Python',
  'Rust',
  'PyTorch',
  'PostgreSQL',
  'Go',
  'Next.js',
  'Docker',
  'Kubernetes',
  'GraphQL',
  'TailwindCSS',
  'WASM',
  'Distributed Systems',
  'LLMs',
  'Computer Vision'
] as const;

export const BUILD_STATUS_CONFIG: Record<
  BuildStatus,
  { label: string; description: string; variant: 'idea' | 'progress' | 'beta' | 'shipped' | 'archived' }
> = {
  IDEA: {
    label: 'Idea',
    description: 'Conceptualizing, architectural design & prototyping',
    variant: 'idea'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    description: 'Active development and milestone execution',
    variant: 'progress'
  },
  BETA: {
    label: 'Beta',
    description: 'Early preview testing with real users',
    variant: 'beta'
  },
  SHIPPED: {
    label: 'Shipped',
    description: 'Released to production with accessible proof',
    variant: 'shipped'
  },
  ARCHIVED: {
    label: 'Archived',
    description: 'Preserved as an open technical reference',
    variant: 'archived'
  }
};

export const POST_TYPES_CONFIG: Record<
  PostType,
  { label: string; description: string; badge: string }
> = {
  BUILD: { label: 'Build Announced', description: 'A new project launched on Forge', badge: 'Build' },
  UPDATE: { label: 'Progress Update', description: 'Work completed, metrics, or technical changes', badge: 'Update' },
  INSIGHT: { label: 'Technical Insight', description: 'Learnings, architectural choices & discoveries', badge: 'Insight' },
  QUESTION: { label: 'Architectural Question', description: 'Seeking technical peer advice or feedback', badge: 'Question' },
  MILESTONE: { label: 'Milestone Reached', description: 'Significant project checkpoint achieved', badge: 'Milestone' },
  COLLAB: { label: 'Collaboration Call', description: 'Seeking builders, designers, or engineers', badge: 'Collab' }
};

export const VALIDATION = {
  USERNAME_REGEX: /^[a-zA-Z0-9_]{3,24}$/,
  USERNAME_RULES: '3-24 characters, letters, numbers, and underscores only.',
  MAX_TITLE_LENGTH: 80,
  MAX_SUMMARY_LENGTH: 160,
  MAX_BIO_LENGTH: 300,
  MAX_UPDATE_LENGTH: 2000,
  MAX_COMMENT_LENGTH: 1000
};
