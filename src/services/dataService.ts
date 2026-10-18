// Data Service for FORGE Platform
// Implements production data access patterns for Builds, Updates, Collaboration, Reactions, and Profiles.
// Seamlessly delegates to live Firestore when configured or local persistent storage.

import {
  Build,
  BuildMilestone,
  BuildCollaborator,
  Post,
  Comment,
  UserProfile,
  CollaborationRequest,
  Notification,
  SearchResults,
  BuildStatus,
  PostType
} from '../types';
import {
  SEED_PROFILES,
  SEED_BUILDS,
  SEED_MILESTONES,
  SEED_POSTS,
  SEED_COMMENTS,
  SEED_COLLAB_REQUESTS,
  SEED_NOTIFICATIONS
} from './seedData';
import { db, isFirebaseConfigured } from '../config/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';

const STORAGE_KEYS = {
  PROFILES: 'forge_db_profiles_v2',
  BUILDS: 'forge_db_builds_v2',
  MILESTONES: 'forge_db_milestones_v2',
  POSTS: 'forge_db_posts_v2',
  COMMENTS: 'forge_db_comments_v2',
  COLLAB_REQUESTS: 'forge_db_collab_reqs_v2',
  NOTIFICATIONS: 'forge_db_notifications_v2',
  APPRECIATIONS: 'forge_db_appreciations_v2',
  SAVES: 'forge_db_saves_v2',
  FOLLOWS: 'forge_db_follows_v2',
  BUILD_FOLLOWS: 'forge_db_build_follows_v2'
};

class DataStore {
  private profiles: Map<string, UserProfile> = new Map();
  private builds: Map<string, Build> = new Map();
  private milestones: Map<string, BuildMilestone> = new Map();
  private posts: Map<string, Post> = new Map();
  private comments: Map<string, Comment> = new Map();
  private collabRequests: Map<string, CollaborationRequest> = new Map();
  private notifications: Map<string, Notification> = new Map();
  
  // Deterministic set indices
  private appreciations: Set<string> = new Set(); // format: `${userId}_${targetId}`
  private saves: Set<string> = new Set(); // format: `${userId}_${targetId}`
  private follows: Set<string> = new Set(); // format: `${followerId}_${followingId}`
  private buildFollows: Set<string> = new Set(); // format: `${userId}_${buildId}`

  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;

    try {
      // 1. Profiles
      const storedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
      if (storedProfiles) {
        JSON.parse(storedProfiles).forEach((p: UserProfile) => this.profiles.set(p.id, p));
      } else {
        SEED_PROFILES.forEach((p) => this.profiles.set(p.id, p));
        this.saveProfiles();
      }

      // 2. Builds
      const storedBuilds = localStorage.getItem(STORAGE_KEYS.BUILDS);
      if (storedBuilds) {
        JSON.parse(storedBuilds).forEach((b: Build) => this.builds.set(b.id, b));
      } else {
        SEED_BUILDS.forEach((b) => this.builds.set(b.id, b));
        this.saveBuilds();
      }

      // 3. Milestones
      const storedMilestones = localStorage.getItem(STORAGE_KEYS.MILESTONES);
      if (storedMilestones) {
        JSON.parse(storedMilestones).forEach((m: BuildMilestone) => this.milestones.set(m.id, m));
      } else {
        SEED_MILESTONES.forEach((m) => this.milestones.set(m.id, m));
        this.saveMilestones();
      }

      // 4. Posts
      const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      if (storedPosts) {
        JSON.parse(storedPosts).forEach((p: Post) => this.posts.set(p.id, p));
      } else {
        SEED_POSTS.forEach((p) => this.posts.set(p.id, p));
        this.savePosts();
      }

      // 5. Comments
      const storedComments = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      if (storedComments) {
        JSON.parse(storedComments).forEach((c: Comment) => this.comments.set(c.id, c));
      } else {
        SEED_COMMENTS.forEach((c) => this.comments.set(c.id, c));
        this.saveComments();
      }

      // 6. Collab Requests
      const storedCollabs = localStorage.getItem(STORAGE_KEYS.COLLAB_REQUESTS);
      if (storedCollabs) {
        JSON.parse(storedCollabs).forEach((r: CollaborationRequest) => this.collabRequests.set(r.id, r));
      } else {
        SEED_COLLAB_REQUESTS.forEach((r) => this.collabRequests.set(r.id, r));
        this.saveCollabRequests();
      }

      // 7. Notifications
      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (storedNotifs) {
        JSON.parse(storedNotifs).forEach((n: Notification) => this.notifications.set(n.id, n));
      } else {
        SEED_NOTIFICATIONS.forEach((n) => this.notifications.set(n.id, n));
        this.saveNotifications();
      }

      // 8. Relational Sets
      const rawApprec = localStorage.getItem(STORAGE_KEYS.APPRECIATIONS);
      if (rawApprec) this.appreciations = new Set(JSON.parse(rawApprec));
      else {
        // Initial seed appreciations
        this.appreciations.add('usr_rajiv_build_visionflow');
        this.appreciations.add('usr_priya_post_1');
        this.saveAppreciations();
      }

      const rawSaves = localStorage.getItem(STORAGE_KEYS.SAVES);
      if (rawSaves) this.saves = new Set(JSON.parse(rawSaves));

      const rawFollows = localStorage.getItem(STORAGE_KEYS.FOLLOWS);
      if (rawFollows) this.follows = new Set(JSON.parse(rawFollows));
      else {
        this.follows.add('usr_priya_usr_alex');
        this.follows.add('usr_rajiv_usr_marcus');
        this.saveFollows();
      }

      const rawBuildFollows = localStorage.getItem(STORAGE_KEYS.BUILD_FOLLOWS);
      if (rawBuildFollows) this.buildFollows = new Set(JSON.parse(rawBuildFollows));
      else {
        this.buildFollows.add('usr_priya_build_nexora');
        this.saveBuildFollows();
      }

      this.initialized = true;
    } catch {
      // Storage initialization fallback
    }
  }

  // Persist methods
  private saveProfiles() {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(Array.from(this.profiles.values())));
  }
  private saveBuilds() {
    localStorage.setItem(STORAGE_KEYS.BUILDS, JSON.stringify(Array.from(this.builds.values())));
  }
  private saveMilestones() {
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(Array.from(this.milestones.values())));
  }
  private savePosts() {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(Array.from(this.posts.values())));
  }
  private saveComments() {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(Array.from(this.comments.values())));
  }
  private saveCollabRequests() {
    localStorage.setItem(STORAGE_KEYS.COLLAB_REQUESTS, JSON.stringify(Array.from(this.collabRequests.values())));
  }
  private saveNotifications() {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(Array.from(this.notifications.values())));
  }
  private saveAppreciations() {
    localStorage.setItem(STORAGE_KEYS.APPRECIATIONS, JSON.stringify(Array.from(this.appreciations)));
  }
  private saveSaves() {
    localStorage.setItem(STORAGE_KEYS.SAVES, JSON.stringify(Array.from(this.saves)));
  }
  private saveFollows() {
    localStorage.setItem(STORAGE_KEYS.FOLLOWS, JSON.stringify(Array.from(this.follows)));
  }
  private saveBuildFollows() {
    localStorage.setItem(STORAGE_KEYS.BUILD_FOLLOWS, JSON.stringify(Array.from(this.buildFollows)));
  }

  // --- PROFILES ---
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'users', userId);
        const snap = await getDoc(docRef);
        if (snap.exists()) return snap.data() as UserProfile;
      } catch {
        // Fallback to local store
      }
    }
    return this.profiles.get(userId) || null;
  }

  async getProfileByUsername(username: string): Promise<UserProfile | null> {
    const clean = username.replace(/^@/, '').toLowerCase();
    for (const p of this.profiles.values()) {
      if (p.username.toLowerCase() === clean) return p;
    }
    return null;
  }

  async saveProfile(profile: UserProfile): Promise<UserProfile> {
    profile.updatedAt = new Date().toISOString();
    this.profiles.set(profile.id, profile);
    this.saveProfiles();

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'users', profile.id), profile);
      } catch {
        // Silently handled in local mode
      }
    }
    return profile;
  }

  async isUsernameAvailable(username: string, currentUserId?: string): Promise<boolean> {
    const clean = username.trim().toLowerCase();
    for (const p of this.profiles.values()) {
      if (p.username.toLowerCase() === clean && p.id !== currentUserId) {
        return false;
      }
    }
    return true;
  }

  // --- BUILDS ---
  async getBuilds(options?: {
    category?: string;
    status?: BuildStatus;
    ownerId?: string;
    limit?: number;
    currentUserId?: string;
  }): Promise<Build[]> {
    let list = Array.from(this.builds.values());

    // Filters
    if (options?.ownerId) {
      list = list.filter((b) => b.ownerId === options.ownerId);
    } else {
      // If browsing public directory, exclude drafts unless owned by current user
      list = list.filter((b) => b.visibility === 'PUBLIC' || (options?.currentUserId && b.ownerId === options.currentUserId));
    }

    if (options?.category) {
      list = list.filter((b) => b.category === options.category);
    }

    if (options?.status) {
      list = list.filter((b) => b.status === options.status);
    }

    // Sort by recent update
    list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    if (options?.limit) {
      list = list.slice(0, options.limit);
    }

    // Populate owner & interaction state
    return list.map((b) => this.populateBuild(b, options?.currentUserId));
  }

  async getBuildBySlug(slug: string, currentUserId?: string): Promise<Build | null> {
    const build = Array.from(this.builds.values()).find((b) => b.slug === slug || b.id === slug);
    if (!build) return null;
    return this.populateBuild(build, currentUserId);
  }

  async createBuild(buildData: Omit<Build, 'id' | 'createdAt' | 'updatedAt' | 'milestonesCount' | 'updatesCount' | 'collaboratorsCount' | 'appreciationsCount' | 'savesCount' | 'followersCount'>): Promise<Build> {
    const now = new Date().toISOString();
    const id = `build_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    // Slug generation
    let baseSlug = buildData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (Array.from(this.builds.values()).some((b) => b.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newBuild: Build = {
      ...buildData,
      id,
      slug,
      milestonesCount: 0,
      updatesCount: 0,
      collaboratorsCount: 1, // Owner is first collaborator
      appreciationsCount: 0,
      savesCount: 0,
      followersCount: 0,
      createdAt: now,
      updatedAt: now
    };

    this.builds.set(id, newBuild);
    this.saveBuilds();

    // Increment owner's buildsCount
    const owner = this.profiles.get(newBuild.ownerId);
    if (owner) {
      owner.buildsCount = (owner.buildsCount || 0) + 1;
      this.saveProfiles();
    }

    // Automatically create an announcement post
    await this.createPost({
      authorId: newBuild.ownerId,
      buildId: newBuild.id,
      type: 'BUILD',
      title: `Announced Build: ${newBuild.title}`,
      content: newBuild.summary,
      mediaUrls: newBuild.coverImage ? [newBuild.coverImage] : [],
      tags: newBuild.technologies.slice(0, 4)
    });

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'builds', id), newBuild);
      } catch {
        // Silently handled in local mode
      }
    }

    return this.populateBuild(newBuild);
  }

  async updateBuild(id: string, updates: Partial<Build>, currentUserId: string): Promise<Build> {
    const build = this.builds.get(id);
    if (!build) throw new Error('Build not found.');
    if (build.ownerId !== currentUserId) throw new Error('Unauthorized: only owner can edit build.');

    const updated: Build = {
      ...build,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.builds.set(id, updated);
    this.saveBuilds();

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'builds', id), updates);
      } catch {
        // Silently handled in local mode
      }
    }

    return this.populateBuild(updated, currentUserId);
  }

  async deleteBuild(id: string, currentUserId: string): Promise<boolean> {
    const build = this.builds.get(id);
    if (!build) return false;
    if (build.ownerId !== currentUserId) throw new Error('Unauthorized');

    this.builds.delete(id);
    this.saveBuilds();

    // Clean up milestones
    for (const [mId, m] of this.milestones.entries()) {
      if (m.buildId === id) this.milestones.delete(mId);
    }
    this.saveMilestones();

    // Clean up owner build count
    const owner = this.profiles.get(build.ownerId);
    if (owner) {
      owner.buildsCount = Math.max(0, (owner.buildsCount || 1) - 1);
      this.saveProfiles();
    }

    return true;
  }

  // --- MILESTONES ---
  async getMilestones(buildId: string): Promise<BuildMilestone[]> {
    return Array.from(this.milestones.values())
      .filter((m) => m.buildId === buildId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createMilestone(data: Omit<BuildMilestone, 'id' | 'createdAt'>, currentUserId: string): Promise<BuildMilestone> {
    const build = this.builds.get(data.buildId);
    if (!build) throw new Error('Build not found');
    if (build.ownerId !== currentUserId) throw new Error('Unauthorized: only build owner can create milestones');

    const id = `ms_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const milestone: BuildMilestone = { ...data, id, createdAt: now };

    this.milestones.set(id, milestone);
    this.saveMilestones();

    build.milestonesCount = (build.milestonesCount || 0) + 1;
    build.updatedAt = now;
    this.saveBuilds();

    // Create an automatic milestone update post
    await this.createPost({
      authorId: currentUserId,
      buildId: build.id,
      milestoneId: id,
      type: 'MILESTONE',
      title: `Milestone Achieved: ${milestone.title}`,
      content: milestone.description,
      mediaUrls: milestone.imageUrl ? [milestone.imageUrl] : [],
      tags: [build.category, 'Milestone']
    });

    return milestone;
  }

  // --- POSTS & UPDATES ---
  async getPosts(options?: {
    type?: PostType;
    buildId?: string;
    authorId?: string;
    topic?: string;
    currentUserId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ posts: Post[]; hasMore: boolean }> {
    let list = Array.from(this.posts.values());

    if (options?.buildId) {
      list = list.filter((p) => p.buildId === options.buildId);
    }
    if (options?.authorId) {
      list = list.filter((p) => p.authorId === options.authorId);
    }
    if (options?.type) {
      list = list.filter((p) => p.type === options.type);
    }
    if (options?.topic) {
      const tLower = options.topic.toLowerCase();
      list = list.filter((p) =>
        p.tags.some((tag) => tag.toLowerCase() === tLower) ||
        p.content.toLowerCase().includes(tLower) ||
        (p.title && p.title.toLowerCase().includes(tLower))
      );
    }

    // Sort descending by date
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const offset = options?.offset || 0;
    const takeLimit = options?.limit || 10;
    const paginated = list.slice(offset, offset + takeLimit);
    const hasMore = offset + takeLimit < list.length;

    const populated = paginated.map((p) => this.populatePost(p, options?.currentUserId));

    return { posts: populated, hasMore };
  }

  async getFollowingFeed(userId: string, options?: { limit?: number; offset?: number }): Promise<{ posts: Post[]; hasMore: boolean }> {
    // Get list of followed authors and followed builds
    const followedAuthors = new Set<string>();
    for (const key of this.follows) {
      if (key.startsWith(`${userId}_`)) {
        followedAuthors.add(key.replace(`${userId}_`, ''));
      }
    }

    const followedBuilds = new Set<string>();
    for (const key of this.buildFollows) {
      if (key.startsWith(`${userId}_`)) {
        followedBuilds.add(key.replace(`${userId}_`, ''));
      }
    }

    let list = Array.from(this.posts.values()).filter((p) =>
      followedAuthors.has(p.authorId) || (p.buildId && followedBuilds.has(p.buildId)) || p.authorId === userId
    );

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const offset = options?.offset || 0;
    const takeLimit = options?.limit || 10;
    const paginated = list.slice(offset, offset + takeLimit);
    const hasMore = offset + takeLimit < list.length;

    return {
      posts: paginated.map((p) => this.populatePost(p, userId)),
      hasMore
    };
  }

  async createPost(data: {
    authorId: string;
    buildId?: string;
    milestoneId?: string;
    type: PostType;
    title?: string;
    content: string;
    mediaUrls?: string[];
    tags?: string[];
  }): Promise<Post> {
    const id = `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newPost: Post = {
      id,
      authorId: data.authorId,
      buildId: data.buildId,
      milestoneId: data.milestoneId,
      type: data.type,
      title: data.title?.trim() || undefined,
      content: data.content.trim(),
      mediaUrls: data.mediaUrls || [],
      tags: data.tags || [],
      appreciationsCount: 0,
      commentsCount: 0,
      savesCount: 0,
      createdAt: now,
      updatedAt: now
    };

    this.posts.set(id, newPost);
    this.savePosts();

    // If associated with a build, increment update count
    if (data.buildId) {
      const build = this.builds.get(data.buildId);
      if (build) {
        build.updatesCount = (build.updatesCount || 0) + 1;
        build.updatedAt = now;
        this.saveBuilds();
      }
    }

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'posts', id), newPost);
      } catch {
        // Silently handled in local mode
      }
    }

    return this.populatePost(newPost, data.authorId);
  }

  async deletePost(postId: string, currentUserId: string): Promise<boolean> {
    const post = this.posts.get(postId);
    if (!post) return false;
    if (post.authorId !== currentUserId) throw new Error('Unauthorized');

    this.posts.delete(postId);
    this.savePosts();

    // Delete associated comments
    for (const [cId, c] of this.comments.entries()) {
      if (c.targetId === postId) this.comments.delete(cId);
    }
    this.saveComments();

    return true;
  }

  // --- COMMENTS ---
  async getComments(targetId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter((c) => c.targetId === targetId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((c) => ({
        ...c,
        author: this.profiles.get(c.authorId)
      }));
  }

  async addComment(targetId: string, targetType: 'POST' | 'BUILD', authorId: string, content: string): Promise<Comment> {
    const id = `cm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const comment: Comment = {
      id,
      targetId,
      targetType,
      authorId,
      content: content.trim(),
      createdAt: now
    };

    this.comments.set(id, comment);
    this.saveComments();

    // Increment target counter
    if (targetType === 'POST') {
      const post = this.posts.get(targetId);
      if (post) {
        post.commentsCount = (post.commentsCount || 0) + 1;
        this.savePosts();

        // Notify post author if not self
        if (post.authorId !== authorId) {
          this.createNotification({
            recipientId: post.authorId,
            actorId: authorId,
            type: 'COMMENT',
            targetId: post.id,
            targetType: 'POST',
            summary: `commented on your ${post.type.toLowerCase()}`
          });
        }
      }
    }

    return {
      ...comment,
      author: this.profiles.get(authorId)
    };
  }

  async deleteComment(commentId: string, currentUserId: string): Promise<boolean> {
    const comment = this.comments.get(commentId);
    if (!comment) return false;
    if (comment.authorId !== currentUserId) throw new Error('Unauthorized');

    this.comments.delete(commentId);
    this.saveComments();

    if (comment.targetType === 'POST') {
      const post = this.posts.get(comment.targetId);
      if (post && post.commentsCount > 0) {
        post.commentsCount -= 1;
        this.savePosts();
      }
    }
    return true;
  }

  // --- SOCIAL INTERACTIONS (Appreciate, Save, Follow) ---
  async toggleAppreciation(targetId: string, targetType: 'POST' | 'BUILD', userId: string): Promise<{ isAppreciated: boolean; newCount: number }> {
    const key = `${userId}_${targetId}`;
    const exists = this.appreciations.has(key);

    let newCount = 0;
    if (exists) {
      this.appreciations.delete(key);
    } else {
      this.appreciations.add(key);
    }
    this.saveAppreciations();

    if (targetType === 'POST') {
      const post = this.posts.get(targetId);
      if (post) {
        post.appreciationsCount = Math.max(0, post.appreciationsCount + (exists ? -1 : 1));
        newCount = post.appreciationsCount;
        this.savePosts();

        if (!exists && post.authorId !== userId) {
          this.createNotification({
            recipientId: post.authorId,
            actorId: userId,
            type: 'APPRECIATION',
            targetId: post.id,
            targetType: 'POST',
            summary: `appreciated your ${post.type.toLowerCase()}`
          });
        }
      }
    } else {
      const build = this.builds.get(targetId);
      if (build) {
        build.appreciationsCount = Math.max(0, build.appreciationsCount + (exists ? -1 : 1));
        newCount = build.appreciationsCount;
        this.saveBuilds();

        if (!exists && build.ownerId !== userId) {
          this.createNotification({
            recipientId: build.ownerId,
            actorId: userId,
            type: 'APPRECIATION',
            targetId: build.id,
            targetType: 'BUILD',
            summary: `appreciated your build "${build.title}"`
          });
        }
      }
    }

    return { isAppreciated: !exists, newCount };
  }

  async toggleSave(targetId: string, userId: string): Promise<boolean> {
    const key = `${userId}_${targetId}`;
    const exists = this.saves.has(key);
    if (exists) this.saves.delete(key);
    else this.saves.add(key);
    this.saveSaves();
    return !exists;
  }

  async toggleFollowUser(targetUserId: string, currentUserId: string): Promise<{ isFollowing: boolean; newFollowerCount: number }> {
    if (targetUserId === currentUserId) throw new Error('Cannot follow yourself');

    const key = `${currentUserId}_${targetUserId}`;
    const exists = this.follows.has(key);

    const targetUser = this.profiles.get(targetUserId);
    const currentUser = this.profiles.get(currentUserId);

    if (exists) {
      this.follows.delete(key);
      if (targetUser) targetUser.followersCount = Math.max(0, (targetUser.followersCount || 1) - 1);
      if (currentUser) currentUser.followingCount = Math.max(0, (currentUser.followingCount || 1) - 1);
    } else {
      this.follows.add(key);
      if (targetUser) targetUser.followersCount = (targetUser.followersCount || 0) + 1;
      if (currentUser) currentUser.followingCount = (currentUser.followingCount || 0) + 1;

      // Notify
      this.createNotification({
        recipientId: targetUserId,
        actorId: currentUserId,
        type: 'FOLLOW',
        targetId: currentUserId,
        targetType: 'USER',
        summary: 'started following your builds and updates'
      });
    }

    this.saveFollows();
    this.saveProfiles();

    return {
      isFollowing: !exists,
      newFollowerCount: targetUser ? targetUser.followersCount : 0
    };
  }

  async toggleFollowBuild(buildId: string, currentUserId: string): Promise<{ isFollowing: boolean; newCount: number }> {
    const key = `${currentUserId}_${buildId}`;
    const exists = this.buildFollows.has(key);
    const build = this.builds.get(buildId);

    if (exists) {
      this.buildFollows.delete(key);
      if (build) build.followersCount = Math.max(0, (build.followersCount || 1) - 1);
    } else {
      this.buildFollows.add(key);
      if (build) build.followersCount = (build.followersCount || 0) + 1;
    }

    this.saveBuildFollows();
    this.saveBuilds();

    return {
      isFollowing: !exists,
      newCount: build ? build.followersCount : 0
    };
  }

  isFollowingUser(currentUserId: string, targetUserId: string): boolean {
    return this.follows.has(`${currentUserId}_${targetUserId}`);
  }

  isFollowingBuild(currentUserId: string, buildId: string): boolean {
    return this.buildFollows.has(`${currentUserId}_${buildId}`);
  }

  // --- COLLABORATION WORKFLOW ---
  async requestCollaboration(data: {
    buildId: string;
    applicantId: string;
    roleApplied: string;
    message: string;
    proofLinks?: string[];
  }): Promise<CollaborationRequest> {
    const build = this.builds.get(data.buildId);
    if (!build) throw new Error('Build not found');
    if (build.ownerId === data.applicantId) throw new Error('Cannot apply to your own build');

    // Prevent duplicate pending requests
    for (const r of this.collabRequests.values()) {
      if (r.buildId === data.buildId && r.applicantId === data.applicantId && r.status === 'PENDING') {
        throw new Error('You already have a pending collaboration request for this build.');
      }
    }

    const id = `cr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const request: CollaborationRequest = {
      id,
      buildId: data.buildId,
      applicantId: data.applicantId,
      ownerId: build.ownerId,
      roleApplied: data.roleApplied.trim(),
      message: data.message.trim(),
      proofLinks: data.proofLinks || [],
      status: 'PENDING',
      createdAt: now,
      updatedAt: now
    };

    this.collabRequests.set(id, request);
    this.saveCollabRequests();

    // Notify build owner
    this.createNotification({
      recipientId: build.ownerId,
      actorId: data.applicantId,
      type: 'COLLAB_REQUEST',
      targetId: id,
      targetType: 'COLLAB_REQUEST',
      summary: `requested to join "${build.title}" as ${request.roleApplied}`
    });

    return {
      ...request,
      applicant: this.profiles.get(data.applicantId),
      build
    };
  }

  async respondToCollaboration(requestId: string, status: 'ACCEPTED' | 'REJECTED', currentUserId: string): Promise<CollaborationRequest> {
    const request = this.collabRequests.get(requestId);
    if (!request) throw new Error('Request not found');
    if (request.ownerId !== currentUserId) throw new Error('Unauthorized');

    request.status = status;
    request.updatedAt = new Date().toISOString();
    this.saveCollabRequests();

    const build = this.builds.get(request.buildId);

    if (status === 'ACCEPTED' && build) {
      build.collaboratorsCount = (build.collaboratorsCount || 1) + 1;
      this.saveBuilds();

      // Notify applicant
      this.createNotification({
        recipientId: request.applicantId,
        actorId: currentUserId,
        type: 'COLLAB_ACCEPTED',
        targetId: build.id,
        targetType: 'BUILD',
        summary: `accepted your collaboration request for "${build.title}"!`
      });
    }

    return {
      ...request,
      applicant: this.profiles.get(request.applicantId),
      build
    };
  }

  async getCollabRequestsForBuild(buildId: string): Promise<CollaborationRequest[]> {
    return Array.from(this.collabRequests.values())
      .filter((r) => r.buildId === buildId)
      .map((r) => ({
        ...r,
        applicant: this.profiles.get(r.applicantId),
        build: this.builds.get(r.buildId)
      }));
  }

  async getCollabRequestsForUser(userId: string): Promise<{ received: CollaborationRequest[]; sent: CollaborationRequest[] }> {
    const received: CollaborationRequest[] = [];
    const sent: CollaborationRequest[] = [];

    for (const r of this.collabRequests.values()) {
      if (r.ownerId === userId) {
        received.push({
          ...r,
          applicant: this.profiles.get(r.applicantId),
          build: this.builds.get(r.buildId)
        });
      }
      if (r.applicantId === userId) {
        sent.push({
          ...r,
          applicant: this.profiles.get(r.applicantId),
          build: this.builds.get(r.buildId)
        });
      }
    }

    received.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    sent.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { received, sent };
  }

  // --- NOTIFICATIONS ---
  async getNotifications(userId: string): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const list = Array.from(this.notifications.values())
      .filter((n) => n.recipientId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((n) => ({
        ...n,
        actor: this.profiles.get(n.actorId)
      }));

    const unreadCount = list.filter((n) => !n.read).length;
    return { notifications: list, unreadCount };
  }

  async markNotificationRead(notifId: string, userId: string): Promise<void> {
    const notif = this.notifications.get(notifId);
    if (notif && notif.recipientId === userId) {
      notif.read = true;
      this.saveNotifications();
    }
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    let changed = false;
    for (const notif of this.notifications.values()) {
      if (notif.recipientId === userId && !notif.read) {
        notif.read = true;
        changed = true;
      }
    }
    if (changed) this.saveNotifications();
  }

  private createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
    if (data.recipientId === data.actorId) return; // Never self-notify

    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const notif: Notification = {
      ...data,
      id,
      read: false,
      createdAt: new Date().toISOString()
    };

    this.notifications.set(id, notif);
    this.saveNotifications();
  }

  // --- SEARCH & EXPLORE ---
  async search(rawQuery: string): Promise<SearchResults> {
    const q = rawQuery.trim().toLowerCase();
    if (!q) return { builds: [], people: [], topics: [] };

    // Search builds
    const matchedBuilds = Array.from(this.builds.values())
      .filter((b) =>
        b.title.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q) ||
        b.technologies.some((t) => t.toLowerCase().includes(q)) ||
        b.category.toLowerCase().includes(q)
      )
      .slice(0, 10)
      .map((b) => this.populateBuild(b));

    // Search people
    const matchedPeople = Array.from(this.profiles.values())
      .filter((p) =>
        p.displayName.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.headline.toLowerCase().includes(q) ||
        p.interests.some((i) => i.toLowerCase().includes(q))
      )
      .slice(0, 10);

    // Filter topics
    const allTopics = new Set<string>();
    for (const b of this.builds.values()) {
      b.technologies.forEach((t) => allTopics.add(t));
    }
    const matchedTopics = Array.from(allTopics).filter((t) => t.toLowerCase().includes(q)).slice(0, 8);

    return { builds: matchedBuilds, people: matchedPeople, topics: matchedTopics };
  }

  async getExploreSections(): Promise<{
    trendingBuilds: Build[];
    recentlyShipped: Build[];
    risingBuilders: UserProfile[];
    openCollaborations: Build[];
  }> {
    const allBuilds = Array.from(this.builds.values());

    // 1. Trending Builds: score = appreciations * 2 + updates
    const trending = [...allBuilds]
      .sort((a, b) => ((b.appreciationsCount * 2) + b.updatesCount) - ((a.appreciationsCount * 2) + a.updatesCount))
      .slice(0, 6)
      .map((b) => this.populateBuild(b));

    // 2. Recently Shipped: status === 'SHIPPED', ordered by updatedAt
    const recentlyShipped = [...allBuilds]
      .filter((b) => b.status === 'SHIPPED')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6)
      .map((b) => this.populateBuild(b));

    // 3. Open Collaborations: collabPosting.isOpen === true
    const openCollaborations = [...allBuilds]
      .filter((b) => b.collabPosting && b.collabPosting.isOpen)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6)
      .map((b) => this.populateBuild(b));

    // 4. Rising Builders: users with shipped builds or high appreciation
    const risingBuilders = Array.from(this.profiles.values())
      .sort((a, b) => (b.appreciationsReceived + (b.buildsCount * 10)) - (a.appreciationsReceived + (a.buildsCount * 10)))
      .slice(0, 6);

    return {
      trendingBuilds: trending,
      recentlyShipped,
      risingBuilders,
      openCollaborations
    };
  }

  // --- POPULATE HELPERS ---
  private populateBuild(build: Build, currentUserId?: string): Build {
    const owner = this.profiles.get(build.ownerId);
    const milestones = Array.from(this.milestones.values()).filter((m) => m.buildId === build.id);
    
    // Look up collaborators
    const collaborators: BuildCollaborator[] = [
      {
        id: `collab_owner_${build.id}`,
        buildId: build.id,
        userId: build.ownerId,
        role: 'Creator & Lead',
        joinedAt: build.createdAt,
        status: 'ACTIVE',
        userProfile: owner
      }
    ];

    // Add accepted applicants
    for (const req of this.collabRequests.values()) {
      if (req.buildId === build.id && req.status === 'ACCEPTED') {
        collaborators.push({
          id: `collab_${req.id}`,
          buildId: build.id,
          userId: req.applicantId,
          role: req.roleApplied,
          joinedAt: req.updatedAt,
          status: 'ACTIVE',
          userProfile: this.profiles.get(req.applicantId)
        });
      }
    }

    return {
      ...build,
      owner,
      milestones,
      collaborators,
      isAppreciated: currentUserId ? this.appreciations.has(`${currentUserId}_${build.id}`) : false,
      isSaved: currentUserId ? this.saves.has(`${currentUserId}_${build.id}`) : false,
      isFollowing: currentUserId ? this.buildFollows.has(`${currentUserId}_${build.id}`) : false
    };
  }

  private populatePost(post: Post, currentUserId?: string): Post {
    const author = this.profiles.get(post.authorId);
    const build = post.buildId ? this.builds.get(post.buildId) : undefined;

    return {
      ...post,
      author,
      build: build ? this.populateBuild(build, currentUserId) : undefined,
      isAppreciated: currentUserId ? this.appreciations.has(`${currentUserId}_${post.id}`) : false,
      isSaved: currentUserId ? this.saves.has(`${currentUserId}_${post.id}`) : false
    };
  }
}

export const dataService = new DataStore();
