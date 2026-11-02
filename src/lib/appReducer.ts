import {
  MAX_COMMENT_LENGTH,
  MAX_POST_IMAGES,
  MAX_POST_LENGTH,
  type AppState,
  type Comment,
  type ReactionType,
  type ReportReason,
} from '@/types';

export type Action =
  | { type: 'session/set'; userId: string | null }
  | { type: 'profile/create'; name: string; handle: string; bio: string; college?: string; specialty?: string; avatar?: string }
  | { type: 'profile/update'; name: string; bio: string; college?: string; specialty?: string }
  | { type: 'post/create'; text: string; images: string[]; college?: string }
  | { type: 'post/delete'; postId: string }
  | { type: 'post/react'; postId: string; reaction: ReactionType }
  | { type: 'post/view'; postId: string }
  | { type: 'post/report'; postId: string; reason: ReportReason }
  | { type: 'comment/add'; postId: string; parentId: string | null; text: string }
  | { type: 'comment/like'; commentId: string }
  | { type: 'comment/delete'; commentId: string }
  | { type: 'follow/toggle'; userId: string }
  | { type: 'state/sync'; payload: Partial<AppState> };

export function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function appReducer(state: AppState, action: Action): AppState {
  const me = state.currentUserId;
  const now = new Date().toISOString();

  switch (action.type) {
    case 'state/sync':
      return { ...state, ...action.payload };

    case 'session/set':
      return { ...state, currentUserId: action.userId };

    case 'profile/create': {
      const profile = {
        id: action.handle || newId(),
        name: action.name.trim(),
        handle: action.handle.trim().toLowerCase(),
        bio: action.bio.trim(),
        college: action.college ? action.college.trim() : undefined,
        specialty: action.specialty,
        avatar: action.avatar,
        createdAt: now,
      };
      return {
        ...state,
        profiles: [...state.profiles.filter((p) => p.id !== profile.id), profile],
        currentUserId: profile.id,
      };
    }

    case 'profile/update': {
      if (!me) return state;
      return {
        ...state,
        profiles: state.profiles.map((p) =>
          p.id === me
            ? {
                ...p,
                name: action.name.trim(),
                bio: action.bio.trim(),
                college: action.college !== undefined ? action.college.trim() : p.college,
                specialty: action.specialty || p.specialty,
              }
            : p,
        ),
      };
    }

    case 'post/create': {
      const text = action.text.trim().slice(0, MAX_POST_LENGTH);
      const images = action.images.slice(0, MAX_POST_IMAGES);
      if (!me || (!text && images.length === 0)) return state;
      const author = state.profiles.find((p) => p.id === me);
      const post = {
        id: newId(),
        authorId: me,
        text,
        images,
        college: action.college || author?.college || '',
        createdAt: now,
        reactions: {},
        viewers: [],
      };
      return { ...state, posts: [post, ...state.posts] };
    }

    case 'post/delete': {
      const target = state.posts.find((p) => p.id === action.postId);
      if (!target || target.authorId !== me) return state;
      return {
        ...state,
        posts: state.posts.filter((p) => p.id !== action.postId),
        comments: state.comments.filter((c) => c.postId !== action.postId),
        reports: state.reports.filter((r) => r.postId !== action.postId),
      };
    }

    case 'post/react': {
      if (!me) return state;
      return {
        ...state,
        posts: state.posts.map((p) => {
          if (p.id !== action.postId) return p;
          const reactions = { ...p.reactions };
          if (reactions[me] === action.reaction) delete reactions[me];
          else reactions[me] = action.reaction;
          return { ...p, reactions };
        }),
      };
    }

    case 'post/view': {
      if (!me) return state;
      const target = state.posts.find((p) => p.id === action.postId);
      if (!target || target.authorId === me || (target.viewers && target.viewers.includes(me))) return state;
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.postId ? { ...p, viewers: [...(p.viewers || []), me] } : p,
        ),
      };
    }

    case 'post/report': {
      if (!me) return state;
      const alreadyReported = state.reports.some((r) => r.postId === action.postId && r.reporterId === me);
      if (alreadyReported) return state;
      const report = { id: newId(), postId: action.postId, reporterId: me, reason: action.reason, createdAt: now };
      return { ...state, reports: [...state.reports, report] };
    }

    case 'comment/add': {
      const text = action.text.trim().slice(0, MAX_COMMENT_LENGTH);
      if (!me || !text) return state;
      const parent = action.parentId ? state.comments.find((c) => c.id === action.parentId) : undefined;
      if (action.parentId && (!parent || parent.postId !== action.postId)) return state;
      const comment: Comment = {
        id: newId(),
        postId: action.postId,
        authorId: me,
        parentId: parent ? (parent.parentId ?? parent.id) : null,
        text,
        createdAt: now,
        likes: [],
      };
      return { ...state, comments: [...state.comments, comment] };
    }

    case 'comment/like': {
      if (!me) return state;
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id === action.commentId ? { ...c, likes: toggle(c.likes || [], me) } : c,
        ),
      };
    }

    case 'comment/delete': {
      const target = state.comments.find((c) => c.id === action.commentId);
      if (!target || target.authorId !== me) return state;
      const removed = new Set([target.id, ...state.comments.filter((c) => c.parentId === target.id).map((c) => c.id)]);
      return { ...state, comments: state.comments.filter((c) => !removed.has(c.id)) };
    }

    case 'follow/toggle': {
      if (!me || action.userId === me) return state;
      const exists = state.follows.some((f) => f.followerId === me && f.followeeId === action.userId);
      return {
        ...state,
        follows: exists
          ? state.follows.filter((f) => !(f.followerId === me && f.followeeId === action.userId))
          : [...state.follows, { followerId: me, followeeId: action.userId }],
      };
    }

    default:
      return state;
  }
}
