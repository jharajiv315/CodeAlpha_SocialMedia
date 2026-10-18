// Core domain types for FORGE - Professional Social Platform
// Core statement: "Show what you're building."
// Core philosophy: PROOF > CLAIMS

export type BuildStatus = 'IDEA' | 'IN_PROGRESS' | 'BETA' | 'SHIPPED' | 'ARCHIVED';

export type PostType = 'BUILD' | 'UPDATE' | 'INSIGHT' | 'QUESTION' | 'MILESTONE' | 'COLLAB';

export type CollabRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export type NotificationType =
  | 'FOLLOW'
  | 'APPRECIATION'
  | 'COMMENT'
  | 'COLLAB_REQUEST'
  | 'COLLAB_ACCEPTED'
  | 'BUILD_UPDATE'
  | 'MILESTONE';

export interface UserProfile {
  id: string; // matches auth UID
  username: string; // unique handle
  displayName: string;
  headline: string;
  avatar: string;
  bio: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  
  // Professional identity primitives
  currentlyLearning: string[];
  currentlyBuilding: string[];
  currentlyExploring: string[];
  openToCollaboration: boolean;
  collaborationPreferences?: string; // what kinds of projects they want to build
  interests: string[];
  
  // Counters (cached for O(1) profile render)
  buildsCount: number;
  followersCount: number;
  followingCount: number;
  appreciationsReceived: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface BuildMilestone {
  id: string;
  buildId: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  externalUrl?: string;
  createdAt: string;
}

export interface BuildCollaborator {
  id: string;
  buildId: string;
  userId: string;
  role: string;
  joinedAt: string;
  status: 'ACTIVE' | 'PAST';
  userProfile?: UserProfile; // populated
}

export interface CollabPosting {
  isOpen: boolean;
  rolesNeeded: string[];
  skillsRequired: string[];
  estimatedDuration: string;
  locationType: 'REMOTE' | 'HYBRID' | 'ONSITE';
  description: string;
}

export interface BuildProof {
  githubUrl?: string;
  liveDemoUrl?: string;
  documentationUrl?: string;
  designUrl?: string;
  researchPaperUrl?: string;
}

export interface Build {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  technologies: string[];
  status: BuildStatus;
  visibility: 'PUBLIC' | 'DRAFT';
  coverImage?: string;
  gallery: string[];
  
  proof: BuildProof;
  collabPosting?: CollabPosting;
  
  milestonesCount: number;
  updatesCount: number;
  collaboratorsCount: number;
  appreciationsCount: number;
  savesCount: number;
  followersCount: number;
  
  createdAt: string;
  updatedAt: string;
  
  // Populated fields
  owner?: UserProfile;
  milestones?: BuildMilestone[];
  collaborators?: BuildCollaborator[];
  isAppreciated?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  buildId?: string; // linked build, if update/milestone
  type: PostType;
  title?: string;
  content: string;
  mediaUrls: string[];
  tags: string[];
  milestoneId?: string;
  
  appreciationsCount: number;
  commentsCount: number;
  savesCount: number;
  
  createdAt: string;
  updatedAt: string;
  
  // Populated
  author?: UserProfile;
  build?: Build;
  isAppreciated?: boolean;
  isSaved?: boolean;
}

export interface Comment {
  id: string;
  targetId: string; // postId or buildId
  targetType: 'POST' | 'BUILD';
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  
  // Populated
  author?: UserProfile;
}

export interface CollaborationRequest {
  id: string;
  buildId: string;
  applicantId: string;
  ownerId: string;
  roleApplied: string;
  message: string;
  proofLinks?: string[];
  status: CollabRequestStatus;
  createdAt: string;
  updatedAt: string;
  
  // Populated
  applicant?: UserProfile;
  build?: Build;
}

export interface Notification {
  id: string;
  recipientId: string;
  actorId: string;
  type: NotificationType;
  targetId: string;
  targetType: 'BUILD' | 'POST' | 'COMMENT' | 'COLLAB_REQUEST' | 'USER';
  summary: string;
  read: boolean;
  createdAt: string;
  
  // Populated
  actor?: UserProfile;
}

export interface SearchResults {
  builds: Build[];
  people: UserProfile[];
  topics: string[];
}
