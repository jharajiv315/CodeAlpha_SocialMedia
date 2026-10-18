// Seed data for FORGE platform
// Human, believable, grounded technical updates, genuine trade-offs, and realistic early-stage metrics.

import {
  UserProfile,
  Build,
  BuildMilestone,
  Post,
  Comment,
  CollaborationRequest,
  Notification
} from '../types';

export const SEED_PROFILES: UserProfile[] = [
  {
    id: 'usr_rajiv',
    username: 'rajiv',
    displayName: 'Rajiv Mehta',
    headline: 'Software engineer exploring backend systems and databases',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Working with Go, PostgreSQL, and Node.js. Currently spending weekends learning how database isolation levels actually behave under stress.',
    location: 'Bengaluru',
    website: 'https://rajivmehta.dev',
    github: 'https://github.com/rajiv-systems',
    currentlyLearning: ['Raft consensus fundamentals', 'PostgreSQL advisory locks'],
    currentlyBuilding: ['Nexora (ecommerce engine)'],
    currentlyExploring: ['Linux cgroups & memory limits'],
    openToCollaboration: true,
    collaborationPreferences: 'Happy to pair on Go or Postgres concurrency bugs',
    interests: ['Databases', 'Go', 'PostgreSQL', 'Distributed Systems'],
    buildsCount: 1,
    followersCount: 14,
    followingCount: 9,
    appreciationsReceived: 26,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-28T14:30:00Z'
  },
  {
    id: 'usr_elena',
    username: 'elena',
    displayName: 'Elena Rostova',
    headline: 'Computer vision engineer working on edge inference',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    bio: 'Running vision models on small hardware. Finding out where PyTorch exports break when you target low-power embedded chips.',
    location: 'Munich',
    github: 'https://github.com/elena-ai-research',
    currentlyLearning: ['Quantization calibration datasets', 'TensorRT C++ runtime'],
    currentlyBuilding: ['VisionFlow (Jetson pipeline)'],
    currentlyExploring: ['ONNX runtime operators'],
    openToCollaboration: true,
    collaborationPreferences: 'Embedded C++ profiling and model optimization',
    interests: ['Computer Vision', 'PyTorch', 'C++', 'Edge AI'],
    buildsCount: 1,
    followersCount: 22,
    followingCount: 12,
    appreciationsReceived: 38,
    createdAt: '2026-01-15T09:30:00Z',
    updatedAt: '2026-03-30T11:15:00Z'
  },
  {
    id: 'usr_marcus',
    username: 'marcus',
    displayName: 'Marcus Vance',
    headline: 'Systems programmer learning Rust',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Previously writing C. Now building small storage engines and CLI utilities in Rust to understand ownership and async I/O properly.',
    location: 'Seattle',
    website: 'https://marcusvance.io',
    github: 'https://github.com/marcusvance',
    currentlyLearning: ['io_uring async I/O', 'LSM-tree compaction strategies'],
    currentlyBuilding: ['RustKV (embedded key-value engine)'],
    currentlyExploring: ['Zero-copy serialization'],
    openToCollaboration: false,
    collaborationPreferences: '',
    interests: ['Rust', 'Storage Engines', 'Linux'],
    buildsCount: 1,
    followersCount: 18,
    followingCount: 11,
    appreciationsReceived: 32,
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-03-29T16:00:00Z'
  },
  {
    id: 'usr_priya',
    username: 'priyacodes',
    displayName: 'Priya Sharma',
    headline: 'CS student building developer utilities',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    bio: 'Second-year student writing tools in TypeScript to understand how Git internals and AST parsers work.',
    location: 'Delhi',
    github: 'https://github.com/priyasharma-dev',
    currentlyLearning: ['Git object model', 'TypeScript template literal types'],
    currentlyBuilding: ['DevPulse (Git log metrics)'],
    currentlyExploring: ['CLI UX and terminal formatting'],
    openToCollaboration: true,
    collaborationPreferences: 'Feedback on CLI ergonomics and open source issues',
    interests: ['TypeScript', 'Git', 'Open Source', 'Node.js'],
    buildsCount: 1,
    followersCount: 16,
    followingCount: 14,
    appreciationsReceived: 21,
    createdAt: '2026-02-01T12:00:00Z',
    updatedAt: '2026-04-01T09:00:00Z'
  },
  {
    id: 'usr_alex',
    username: 'alexchen',
    displayName: 'Alex Chen',
    headline: 'Frontend engineer & design technologist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: 'Obsessed with fluid canvas rendering, vector graphics, and accessible microinteractions.',
    location: 'San Francisco',
    website: 'https://alexchen.design',
    github: 'https://github.com/alexchen-ui',
    currentlyLearning: ['WebGL path tessellation', 'Bézier math'],
    currentlyBuilding: ['HyperCanvas (vector drawing engine)'],
    currentlyExploring: ['OffscreenCanvas rendering'],
    openToCollaboration: true,
    collaborationPreferences: 'Vector math and shader debugging',
    interests: ['Design Systems', 'Canvas', 'WebGL', 'TypeScript'],
    buildsCount: 1,
    followersCount: 29,
    followingCount: 17,
    appreciationsReceived: 44,
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: '2026-03-25T18:40:00Z'
  }
];

export const SEED_BUILDS: Build[] = [
  {
    id: 'build_nexora',
    ownerId: 'usr_rajiv',
    title: 'Nexora Commerce Engine',
    slug: 'nexora-commerce',
    summary: 'An electronics store backend built to study checkout concurrency and inventory race conditions.',
    description: `I started Nexora because I wanted to see what actually breaks when dozens of people try to purchase the same inventory item at the exact same millisecond.
    
In the first version, using basic SELECT ... UPDATE in PostgreSQL led to deadlocks under high concurrency. I ended up implementing transaction-scoped advisory locks keyed by item hash: \`pg_try_advisory_xact_lock(item_id)\`.

If a lock isn't granted, the worker immediately yields and responds with a retry notice rather than keeping the database connection blocked. It made the entire checkout flow significantly more predictable under load testing.`,
    category: 'Web Systems',
    technologies: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    status: 'SHIPPED',
    visibility: 'PUBLIC',
    coverImage: '',
    gallery: [],
    proof: {
      githubUrl: 'https://github.com/rajiv-systems/nexora-commerce',
      liveDemoUrl: 'https://demo-nexora.rajivmehta.dev',
      documentationUrl: 'https://docs-nexora.rajivmehta.dev'
    },
    collabPosting: {
      isOpen: false,
      rolesNeeded: [],
      skillsRequired: [],
      estimatedDuration: '',
      locationType: 'REMOTE',
      description: 'Project is published. Open for bug reports and questions.'
    },
    milestonesCount: 4,
    updatesCount: 4,
    collaboratorsCount: 1,
    appreciationsCount: 12,
    savesCount: 6,
    followersCount: 8,
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-03-28T14:00:00Z'
  },
  {
    id: 'build_visionflow',
    ownerId: 'usr_elena',
    title: 'VisionFlow Edge Pipeline',
    slug: 'visionflow-edge',
    summary: 'Real-time object detection and tracking pipeline running locally on an NVIDIA Jetson Orin Nano.',
    description: `I needed a reliable camera pipeline that could run continuous object tracking without melting an edge board or dropping frames after 4 hours.
    
Standard OpenCV pipelines were consuming nearly 80% CPU just decoding frames. I rewrote the ingest using GStreamer hardware decoders and converted the YOLO model weights to TensorRT INT8.

The hardest part was calibration: standard post-training quantization caused bounding boxes to jitter around small objects. I had to build a custom calibration set reflecting the camera's actual lighting conditions.`,
    category: 'AI & Machine Learning',
    technologies: ['Python', 'TensorRT', 'CUDA', 'C++'],
    status: 'BETA',
    visibility: 'PUBLIC',
    coverImage: '',
    gallery: [],
    proof: {
      githubUrl: 'https://github.com/elena-ai-research/visionflow-pipeline',
      documentationUrl: 'https://visionflow.readthedocs.io'
    },
    collabPosting: {
      isOpen: true,
      rolesNeeded: ['Embedded C++ Developer'],
      skillsRequired: ['C++', 'CUDA', 'Linux'],
      estimatedDuration: '3-4 weeks',
      locationType: 'REMOTE',
      description: 'Looking to profile memory copy overhead between the camera frame buffer and CUDA unified memory.'
    },
    milestonesCount: 3,
    updatesCount: 3,
    collaboratorsCount: 1,
    appreciationsCount: 15,
    savesCount: 8,
    followersCount: 11,
    createdAt: '2026-01-25T11:00:00Z',
    updatedAt: '2026-03-30T18:20:00Z'
  },
  {
    id: 'build_rustkv',
    ownerId: 'usr_marcus',
    title: 'RustKV Storage Engine',
    slug: 'rustkv-engine',
    summary: 'A minimalist embedded key-value store built in Rust to learn log-structured merge trees.',
    description: `I wanted to understand how modern LSM storage engines like Pebble and RocksDB actually organize files on disk. RustKV is my experiment in building one from first principles.
    
It has an append-only write-ahead log (WAL), an in-memory skip-list memtable, and a simple background compaction thread that merges sorted string tables (SSTables) into leveled tiers.

Still working through edge cases with disk flush errors and handling crash recovery cleanly.`,
    category: 'Developer Tooling',
    technologies: ['Rust', 'Linux', 'I/O Profiling'],
    status: 'IN_PROGRESS',
    visibility: 'PUBLIC',
    coverImage: '',
    gallery: [],
    proof: {
      githubUrl: 'https://github.com/marcusvance/rustkv-storage'
    },
    collabPosting: {
      isOpen: false,
      rolesNeeded: [],
      skillsRequired: [],
      estimatedDuration: '',
      locationType: 'REMOTE',
      description: 'Building solo as a deep learning exercise.'
    },
    milestonesCount: 3,
    updatesCount: 3,
    collaboratorsCount: 1,
    appreciationsCount: 18,
    savesCount: 9,
    followersCount: 12,
    createdAt: '2026-01-12T09:00:00Z',
    updatedAt: '2026-03-29T16:00:00Z'
  },
  {
    id: 'build_devpulse',
    ownerId: 'usr_priya',
    title: 'DevPulse Git Analytics',
    slug: 'devpulse-analytics',
    summary: 'A small local CLI tool that parses commit reflogs to show churn rates across files.',
    description: `I wanted a way to spot which files in a repository change constantly alongside bug-fix commits without sending code or metadata to an external cloud service.
    
DevPulse runs directly in your terminal, parses the local git commit history, and outputs a simple summary of files that have high churn but low test touchpoints.`,
    category: 'Developer Tooling',
    technologies: ['TypeScript', 'Node.js', 'Git CLI'],
    status: 'SHIPPED',
    visibility: 'PUBLIC',
    coverImage: '',
    gallery: [],
    proof: {
      githubUrl: 'https://github.com/priyasharma-dev/devpulse-cli',
      liveDemoUrl: 'https://www.npmjs.com/package/devpulse-cli'
    },
    collabPosting: {
      isOpen: true,
      rolesNeeded: ['CLI Contributor'],
      skillsRequired: ['TypeScript', 'Git'],
      estimatedDuration: 'Flexible',
      locationType: 'REMOTE',
      description: 'Would love help adding SVG flame-graph generation for file churn.'
    },
    milestonesCount: 3,
    updatesCount: 2,
    collaboratorsCount: 1,
    appreciationsCount: 9,
    savesCount: 4,
    followersCount: 6,
    createdAt: '2026-02-05T14:00:00Z',
    updatedAt: '2026-04-01T12:00:00Z'
  },
  {
    id: 'build_hypercanvas',
    ownerId: 'usr_alex',
    title: 'HyperCanvas Vector Engine',
    slug: 'hypercanvas-vector',
    summary: 'A WebGL infinite canvas experiment for rendering smooth Bézier paths at 60 FPS.',
    description: `DOM-based SVGs choke when you draw more than a few thousand paths on a pannable canvas. HyperCanvas tessellates cubic Bézier curves directly on the GPU using a vertex shader and instanced line buffers.
    
Currently tackling anti-aliased path stroking at high zoom levels without producing halo artifacts on transparent backgrounds.`,
    category: 'Design Engineering',
    technologies: ['TypeScript', 'WebGL2', 'GLSL', 'Vite'],
    status: 'BETA',
    visibility: 'PUBLIC',
    coverImage: '',
    gallery: [],
    proof: {
      githubUrl: 'https://github.com/alexchen-ui/hypercanvas',
      liveDemoUrl: 'https://hypercanvas.alexchen.design'
    },
    collabPosting: {
      isOpen: true,
      rolesNeeded: ['Shader Engineer'],
      skillsRequired: ['GLSL', 'WebGL'],
      estimatedDuration: '2 weeks',
      locationType: 'REMOTE',
      description: 'Looking to optimize fragment shader anti-aliasing for thin strokes.'
    },
    milestonesCount: 3,
    updatesCount: 2,
    collaboratorsCount: 1,
    appreciationsCount: 21,
    savesCount: 11,
    followersCount: 15,
    createdAt: '2026-01-22T15:00:00Z',
    updatedAt: '2026-03-25T20:10:00Z'
  }
];

export const SEED_MILESTONES: BuildMilestone[] = [
  // Nexora Milestones
  {
    id: 'ms_nex_1',
    buildId: 'build_nexora',
    title: 'PostgreSQL schema & transactional model',
    description: 'Designed the core orders, line items, and inventory balances tables with strict foreign keys.',
    date: 'Jan 2026',
    createdAt: '2026-01-20T14:00:00Z'
  },
  {
    id: 'ms_nex_2',
    buildId: 'build_nexora',
    title: 'Switched from row locking to advisory locks',
    description: 'Replaced blocking row locks with non-blocking transaction advisory locks to avoid holding open connection pools.',
    date: 'Feb 2026',
    createdAt: '2026-02-12T16:00:00Z'
  },
  {
    id: 'ms_nex_3',
    buildId: 'build_nexora',
    title: 'k6 concurrency stress testing',
    description: 'Ran 2,000 concurrent checkout attempts against single-stock items. Verified zero duplicate orders or overselling.',
    date: 'Mar 2026',
    createdAt: '2026-03-05T12:00:00Z'
  },
  {
    id: 'ms_nex_4',
    buildId: 'build_nexora',
    title: 'Production demo deployment',
    description: 'Deployed the API and database on a single droplet with health monitoring and automated backup scripts.',
    date: 'Mar 2026',
    createdAt: '2026-03-28T09:00:00Z'
  },

  // VisionFlow Milestones
  {
    id: 'ms_vf_1',
    buildId: 'build_visionflow',
    title: 'Hardware video decode via GStreamer',
    description: 'Bypassed OpenCV frame copies by hooking GStreamer directly into the Jetson hardware decoder.',
    date: 'Feb 2026',
    createdAt: '2026-02-05T10:00:00Z'
  },
  {
    id: 'ms_vf_2',
    buildId: 'build_visionflow',
    title: 'INT8 calibration with custom frames',
    description: 'Generated an entropy calibration dataset matching the target camera optics, recovering small object precision.',
    date: 'Mar 2026',
    createdAt: '2026-03-10T17:00:00Z'
  },
  {
    id: 'ms_vf_3',
    buildId: 'build_visionflow',
    title: 'Continuous 24-hour test run',
    description: 'Processed video streams for 24 uninterrupted hours without memory growth or dropped frames.',
    date: 'Mar 2026',
    createdAt: '2026-03-28T11:00:00Z'
  },

  // RustKV Milestones
  {
    id: 'ms_rkv_1',
    buildId: 'build_rustkv',
    title: 'Memtable skip-list implementation',
    description: 'Built an in-memory concurrent skip list that allows reads while background flushes prepare SSTables.',
    date: 'Feb 2026',
    createdAt: '2026-02-01T14:00:00Z'
  },
  {
    id: 'ms_rkv_2',
    buildId: 'build_rustkv',
    title: 'Append-only WAL with CRC32 verification',
    description: 'Implemented checksum verification on write-ahead log records to safely detect partial writes after crashes.',
    date: 'Mar 2026',
    createdAt: '2026-03-01T18:00:00Z'
  },
  {
    id: 'ms_rkv_3',
    buildId: 'build_rustkv',
    title: 'Two-tier SSTable compaction',
    description: 'Added a simple leveled compaction step that merges overlapping key ranges into fresh SSTable blocks.',
    date: 'Mar 2026',
    createdAt: '2026-03-27T10:00:00Z'
  }
];

export const SEED_POSTS: Post[] = [
  {
    id: 'post_1',
    authorId: 'usr_rajiv',
    buildId: 'build_nexora',
    type: 'UPDATE',
    title: 'Why standard row locks failed under flash-sale checkout simulation',
    content: `When simulating flash sales for Nexora, our first approach was standard \`SELECT ... FOR UPDATE\` in PostgreSQL.

It worked fine in local tests with 10 users, but once we threw a k6 test with 2,000 concurrent requests at the same 5 items in inventory, the connection pool was completely starved. Connections were waiting tens of seconds just to fail on a sold-out check.

We switched to \`SELECT pg_try_advisory_xact_lock(item_id)\`. If the lock isn't granted instantly, we return a 429 Retry response immediately instead of blocking a pool worker. The database CPU dropped from 95% to 28% under the exact same traffic spike.`,
    mediaUrls: [],
    tags: ['PostgreSQL', 'Databases', 'Concurrency'],
    appreciationsCount: 8,
    commentsCount: 2,
    savesCount: 4,
    createdAt: '2026-03-28T14:15:00Z',
    updatedAt: '2026-03-28T14:15:00Z'
  },
  {
    id: 'post_2',
    authorId: 'usr_elena',
    buildId: 'build_visionflow',
    type: 'INSIGHT',
    title: 'What broke when quantizing YOLO to INT8 for Jetson',
    content: `Standard post-training quantization tools tell you INT8 gives 3x speedups for free. What they don't emphasize is how easily small objects disappear from the activation maps when dynamic range is clipped.

Our vehicle detections were stable, but pedestrian bounding boxes flickered constantly. The fix wasn't more training data — it was curating a 200-frame calibration set that specifically included varied lighting and small distant objects rather than random bright frames. Precision returned to within 1% of FP32.`,
    mediaUrls: [],
    tags: ['AI/ML', 'Computer Vision', 'TensorRT'],
    appreciationsCount: 11,
    commentsCount: 3,
    savesCount: 6,
    createdAt: '2026-03-29T10:30:00Z',
    updatedAt: '2026-03-29T10:30:00Z'
  },
  {
    id: 'post_3',
    authorId: 'usr_marcus',
    buildId: 'build_rustkv',
    type: 'UPDATE',
    title: 'Handling partial disk writes in the WAL recovery loop',
    content: `Spent the evening testing crash recovery in RustKV by deliberately killing the process midway through a batch write.

Found that when a power loss happens mid-write, the WAL file has trailing zero bytes or corrupted records that cause the recovery parser to panic. Adding a 4-byte CRC32 checksum to every header record lets the recovery loop detect the corrupt point cleanly, truncate the file to the last valid transaction, and start up without panicking.`,
    mediaUrls: [],
    tags: ['Rust', 'Storage Engines', 'Crash Recovery'],
    appreciationsCount: 9,
    commentsCount: 1,
    savesCount: 5,
    createdAt: '2026-03-30T16:00:00Z',
    updatedAt: '2026-03-30T16:00:00Z'
  },
  {
    id: 'post_4',
    authorId: 'usr_priya',
    buildId: 'build_devpulse',
    type: 'UPDATE',
    title: 'Published DevPulse v1.1 — local Git churn detection',
    content: `Published v1.1 to npm. It's a single CLI command that parses your git log to show which files change most frequently alongside commit messages containing 'fix', 'bug', or 'revert'.

Running it on my own projects immediately highlighted two helper files that were involved in 40% of all regressions. No cloud tokens or signups needed — runs 100% locally in the terminal.`,
    mediaUrls: [],
    tags: ['TypeScript', 'Git', 'CLI'],
    appreciationsCount: 5,
    commentsCount: 1,
    savesCount: 2,
    createdAt: '2026-04-01T08:45:00Z',
    updatedAt: '2026-04-01T08:45:00Z'
  },
  {
    id: 'post_5',
    authorId: 'usr_alex',
    buildId: 'build_hypercanvas',
    type: 'INSIGHT',
    title: 'Moving Bézier curve subdivision from CPU to GPU shaders',
    content: `When building an infinite vector canvas, subdividing smooth curves on the CPU with De Casteljau's algorithm becomes a frame-rate killer once you have more than a few thousand paths on screen.

We moved curve evaluation into a vertex shader using instanced line strips. The CPU only passes the 4 control points per curve, and the vertex shader computes the polynomial points on the fly. 60 FPS is maintained even when panning through complex vector drawings.`,
    mediaUrls: [],
    tags: ['WebGL', 'Canvas', 'Graphics'],
    appreciationsCount: 14,
    commentsCount: 2,
    savesCount: 7,
    createdAt: '2026-03-27T19:20:00Z',
    updatedAt: '2026-03-27T19:20:00Z'
  }
];

export const SEED_COMMENTS: Comment[] = [
  {
    id: 'cm_1',
    targetId: 'post_1',
    targetType: 'POST',
    authorId: 'usr_marcus',
    content: 'Using pg_try_advisory_xact_lock is such a clean solution. Holding open connection pools waiting for row locks is usually what takes Postgres clusters down during spikes. Did you set up a retry backoff in the client?',
    createdAt: '2026-03-28T15:00:00Z'
  },
  {
    id: 'cm_2',
    targetId: 'post_1',
    targetType: 'POST',
    authorId: 'usr_rajiv',
    content: 'Thanks Marcus! Yes, the client uses an exponential backoff with jitter (between 50ms and 300ms) before checking item status again.',
    createdAt: '2026-03-28T15:30:00Z'
  },
  {
    id: 'cm_3',
    targetId: 'post_2',
    targetType: 'POST',
    authorId: 'usr_priya',
    content: 'This explains why our bounding boxes were jumping when running edge tests on Jetson. How many frames did you end up needing in the calibration set?',
    createdAt: '2026-03-29T11:15:00Z'
  }
];

export const SEED_COLLAB_REQUESTS: CollaborationRequest[] = [
  {
    id: 'cr_1',
    buildId: 'build_visionflow',
    applicantId: 'usr_marcus',
    ownerId: 'usr_elena',
    roleApplied: 'Embedded C++ Developer',
    message: 'Hey Elena, I have experience profiling CUDA memory copies and would love to help optimize the frame buffer ingest on the Jetson Orin.',
    proofLinks: ['https://github.com/marcusvance/rustkv-storage'],
    status: 'ACCEPTED',
    createdAt: '2026-03-25T14:00:00Z',
    updatedAt: '2026-03-26T09:30:00Z'
  },
  {
    id: 'cr_2',
    buildId: 'build_devpulse',
    applicantId: 'usr_alex',
    ownerId: 'usr_priya',
    roleApplied: 'CLI UX Contributor',
    message: 'Hi Priya, I can help design an interactive terminal layout or SVG export for the churn reports.',
    proofLinks: ['https://github.com/alexchen-ui/hypercanvas'],
    status: 'PENDING',
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-01T10:00:00Z'
  }
];

export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    recipientId: 'usr_rajiv',
    actorId: 'usr_marcus',
    type: 'COMMENT',
    targetId: 'post_1',
    targetType: 'POST',
    summary: 'commented on your checkout concurrency update',
    read: false,
    createdAt: '2026-03-28T15:00:00Z'
  },
  {
    id: 'notif_2',
    recipientId: 'usr_rajiv',
    actorId: 'usr_priya',
    type: 'APPRECIATION',
    targetId: 'build_nexora',
    targetType: 'BUILD',
    summary: 'appreciated your build Nexora Commerce Engine',
    read: false,
    createdAt: '2026-03-29T10:15:00Z'
  },
  {
    id: 'notif_3',
    recipientId: 'usr_elena',
    actorId: 'usr_marcus',
    type: 'COLLAB_REQUEST',
    targetId: 'cr_1',
    targetType: 'COLLAB_REQUEST',
    summary: 'applied to collaborate on VisionFlow Edge Pipeline',
    read: true,
    createdAt: '2026-03-25T14:00:00Z'
  }
];
