import { useEffect, useReducer, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '@/firebase';
import { appReducer, newId, type Action } from '@/lib/appReducer';
import { StoreContext } from '@/store/storeContext';
import { encryptPayload, decryptPayload } from '@/lib/cipher';
import type { AppState, Comment, Follow, Post, Profile, Report, ReportReason } from '@/types';

// 100% Real Firebase data - Zero dummy/mock profiles or posts
const EMPTY_INITIAL_STATE: AppState = {
  currentUserId: null,
  profiles: [],
  posts: [],
  comments: [],
  follows: [],
  reports: [],
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, localDispatch] = useReducer(appReducer, EMPTY_INITIAL_STATE);
  const [storageError, setStorageError] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Dark Mode Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stethoconnect_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('stethoconnect_theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  // 1. Firebase Auth listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      setAuthLoading(false);

      if (user) {
        try {
          // Check if profile exists in Firestore for this authenticated user
          const profileSnap = await getDoc(doc(db, 'profiles', user.uid));
          if (profileSnap.exists()) {
            const profileData = profileSnap.data() as Profile;
            localDispatch({ type: 'session/set', userId: profileData.id });
          } else {
            // No profile yet: user must fill the create profile screen after Google login
            localDispatch({ type: 'session/set', userId: null });
          }
        } catch (error) {
          console.warn('Error checking user profile in Firestore:', error);
          localDispatch({ type: 'session/set', userId: null });
        }
      } else {
        localDispatch({ type: 'session/set', userId: null });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time Live Firestore Listeners for Public Collections (Profiles, Posts, Comments, Follows)
  useEffect(() => {
    const unsubProfiles = onSnapshot(
      collection(db, 'profiles'),
      (snapshot) => {
        setFirebaseConnected(true);
        const fetched: Profile[] = [];
        snapshot.forEach((d) => {
          const pData = d.data() as Profile;
          fetched.push({
            ...pData,
            id: d.id,
            bio: decryptPayload(pData.bio || ''),
          });
        });
        localDispatch({ type: 'state/sync', payload: { profiles: fetched } });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'profiles');
      },
    );

    const unsubPosts = onSnapshot(
      collection(db, 'posts'),
      (snapshot) => {
        setFirebaseConnected(true);
        const fetched: Post[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          fetched.push({
            id: d.id,
            authorId: data.authorId || '',
            college: data.college || '',
            text: decryptPayload(data.text || ''),
            images: data.images || [],
            createdAt: data.createdAt || new Date().toISOString(),
            reactions: data.reactions || {},
            viewers: data.viewers || [],
          });
        });
        // Sort newest first
        fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        localDispatch({ type: 'state/sync', payload: { posts: fetched } });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'posts');
      },
    );

    const unsubComments = onSnapshot(
      collection(db, 'comments'),
      (snapshot) => {
        const fetched: Comment[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          fetched.push({
            id: d.id,
            postId: data.postId || '',
            authorId: data.authorId || '',
            parentId: data.parentId || null,
            text: decryptPayload(data.text || ''),
            createdAt: data.createdAt || new Date().toISOString(),
            likes: data.likes || [],
          });
        });
        localDispatch({ type: 'state/sync', payload: { comments: fetched } });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'comments');
      },
    );

    const unsubFollows = onSnapshot(
      collection(db, 'follows'),
      (snapshot) => {
        const fetched: Follow[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          fetched.push({
            id: d.id,
            followerId: data.followerId,
            followeeId: data.followeeId,
            createdAt: data.createdAt,
          });
        });
        localDispatch({ type: 'state/sync', payload: { follows: fetched } });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'follows');
      },
    );

    return () => {
      unsubProfiles();
      unsubPosts();
      unsubComments();
      unsubFollows();
    };
  }, []);

  // 3. User Reports listener: Scoped strictly to the authenticated user via query where clause
  useEffect(() => {
    if (!authUser) {
      localDispatch({ type: 'state/sync', payload: { reports: [] } });
      return;
    }

    const reportsQuery = query(
      collection(db, 'reports'),
      where('reporterId', '==', authUser.uid),
    );

    const unsubReports = onSnapshot(
      reportsQuery,
      (snapshot) => {
        const fetched: Report[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          fetched.push({
            id: d.id,
            postId: data.postId,
            reporterId: data.reporterId,
            reason: (decryptPayload(data.reason || '') as ReportReason) || 'inappropriate',
            createdAt: data.createdAt,
          });
        });
        localDispatch({ type: 'state/sync', payload: { reports: fetched } });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'reports');
      },
    );

    return () => unsubReports();
  }, [authUser]);

  // 4. Dispatch wrapper that writes directly to Firestore
  async function dispatch(action: Action) {
    localDispatch(action);

    try {
      const now = new Date().toISOString();
      const me = state.currentUserId || auth.currentUser?.uid;

      switch (action.type) {
        case 'profile/create': {
          const id = auth.currentUser?.uid || action.handle || newId();
          const profileDoc: Record<string, unknown> = {
            id,
            name: action.name.trim(),
            handle: action.handle.trim().toLowerCase(),
            bio: encryptPayload(action.bio.trim()),
            college: action.college ? action.college.trim() : '',
            createdAt: now,
          };
          if (action.specialty) {
            profileDoc.specialty = action.specialty;
          }
          if (action.avatar || auth.currentUser?.photoURL) {
            profileDoc.avatar = action.avatar || auth.currentUser?.photoURL;
          }
          if (auth.currentUser?.email) {
            profileDoc.email = auth.currentUser.email;
          }
          await setDoc(doc(db, 'profiles', id), profileDoc);
          localDispatch({ type: 'session/set', userId: id });
          break;
        }

        case 'profile/update': {
          if (!me) return;
          const updatePayload: Record<string, unknown> = {
            name: action.name.trim(),
            bio: encryptPayload(action.bio.trim()),
          };
          if (action.specialty) updatePayload.specialty = action.specialty;
          if (action.college !== undefined) updatePayload.college = action.college.trim();
          await updateDoc(doc(db, 'profiles', me), updatePayload);
          break;
        }

        case 'post/create': {
          if (!me) return;
          const author = state.profiles.find((p) => p.id === me);
          const postId = newId();
          const collegeName = action.college || author?.college || '';
          const postDoc: Record<string, unknown> = {
            id: postId,
            authorId: me,
            college: collegeName,
            text: encryptPayload(action.text.trim()),
            images: action.images || [],
            createdAt: now,
            reactions: {},
            viewers: [me],
          };
          await setDoc(doc(db, 'posts', postId), postDoc);
          break;
        }

        case 'post/delete': {
          await deleteDoc(doc(db, 'posts', action.postId));
          break;
        }

        case 'post/react': {
          if (!me) return;
          const post = state.posts.find((p) => p.id === action.postId);
          if (!post) return;
          const updatedReactions = { ...(post.reactions || {}) };
          if (updatedReactions[me] === action.reaction) {
            delete updatedReactions[me];
          } else {
            updatedReactions[me] = action.reaction;
          }
          await updateDoc(doc(db, 'posts', action.postId), {
            reactions: updatedReactions,
          });
          break;
        }

        case 'post/view': {
          if (!me) return;
          const post = state.posts.find((p) => p.id === action.postId);
          if (!post || post.authorId === me || (post.viewers && post.viewers.includes(me))) return;
          const updatedViewers = [...(post.viewers || []), me];
          await updateDoc(doc(db, 'posts', action.postId), {
            viewers: updatedViewers,
          });
          break;
        }

        case 'post/report': {
          if (!me) return;
          const reportId = newId();
          const reportDoc: Record<string, unknown> = {
            id: reportId,
            postId: action.postId,
            reporterId: me,
            reason: encryptPayload(action.reason),
            createdAt: now,
          };
          await setDoc(doc(db, 'reports', reportId), reportDoc);
          break;
        }

        case 'comment/add': {
          if (!me) return;
          const commentId = newId();
          const commentDoc: Record<string, unknown> = {
            id: commentId,
            postId: action.postId,
            authorId: me,
            parentId: action.parentId || null,
            text: encryptPayload(action.text.trim()),
            createdAt: now,
            likes: [],
          };
          await setDoc(doc(db, 'comments', commentId), commentDoc);
          break;
        }

        case 'comment/like': {
          if (!me) return;
          const comment = state.comments.find((c) => c.id === action.commentId);
          if (!comment) return;
          const likes = comment.likes || [];
          const updatedLikes = likes.includes(me) ? likes.filter((uid) => uid !== me) : [...likes, me];
          await updateDoc(doc(db, 'comments', action.commentId), {
            likes: updatedLikes,
          });
          break;
        }

        case 'comment/delete': {
          await deleteDoc(doc(db, 'comments', action.commentId));
          break;
        }

        case 'follow/toggle': {
          if (!me || action.userId === me) return;
          const existing = state.follows.find((f) => f.followerId === me && f.followeeId === action.userId);
          const followId = `${me}_${action.userId}`;
          if (existing) {
            await deleteDoc(doc(db, 'follows', existing.id || followId));
          } else {
            await setDoc(doc(db, 'follows', followId), {
              id: followId,
              followerId: me,
              followeeId: action.userId,
              createdAt: now,
            });
          }
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.error('Firestore mutation error:', error);
      setStorageError(true);
    }
  }

  async function handleSignInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
      localDispatch({ type: 'session/set', userId: null });
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  }

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch,
        storageError,
        firebaseConnected,
        authUser,
        authLoading,
        theme,
        toggleTheme,
        signInWithGoogle: handleSignInWithGoogle,
        signOutUser: handleSignOut,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
