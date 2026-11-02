export const MAX_POST_IMAGES = 5;
export const MAX_POST_LENGTH = 2000;
export const MAX_COMMENT_LENGTH = 500;

export type ReactionType = 'like' | 'dislike';

export type ReportReason = 'misinformation' | 'harassment' | 'spam' | 'inappropriate' | 'other';

export interface Profile {
  id: string;
  name: string;
  handle: string;
  bio: string;
  college?: string;
  courseYear?: string;
  specialty?: string;
  avatar?: string;
  email?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  text: string;
  images: string[];
  college?: string;
  createdAt: string;
  reactions: Record<string, ReactionType>;
  viewers: string[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  text: string;
  createdAt: string;
  likes: string[];
}

export interface Follow {
  id?: string;
  followerId: string;
  followeeId: string;
  createdAt?: string;
}

export interface Report {
  id: string;
  postId: string;
  reporterId: string;
  reason: ReportReason;
  createdAt: string;
}

export interface AppState {
  currentUserId: string | null;
  profiles: Profile[];
  posts: Post[];
  comments: Comment[];
  follows: Follow[];
  reports: Report[];
}
