import { useState, useMemo } from 'react';
import { Search, X, Building2, Sparkles, Filter } from 'lucide-react';
import { Composer } from '@/components/feed/Composer';
import { PostFeed } from '@/components/feed/PostFeed';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/common/Avatar';

const POPULAR_COLLEGES = [
  'MGM Indore',
  'AIIMS New Delhi',
  'KGMU Lucknow',
  'GMC Mumbai',
  'SMS Jaipur',
];

export function HomePage() {
  const { state } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize query for flexible, clean matching
  const cleanQuery = searchQuery.trim().toLowerCase().replace(/^@/, '');

  function handleSelectCollege(college: string | null) {
    if (college) {
      setSearchQuery(college);
    } else {
      setSearchQuery('');
    }
  }

  // 1. Check if the search query matches any student username
  const matchedProfile = useMemo(() => {
    if (!cleanQuery) return null;
    return state.profiles.find(
      (p) =>
        p.handle.toLowerCase() === cleanQuery ||
        p.handle.toLowerCase().includes(cleanQuery) ||
        p.name.toLowerCase().includes(cleanQuery),
    );
  }, [cleanQuery, state.profiles]);

  // 2. Strict Filter Engine
  // "जब कोई यूजर सर्च बार में किसी 'College Name' (जैसे: MGM Indore) को लिखकर सर्च करे,
  // तो फ़ीड फ़िल्टर हो जाए और स्क्रीन पर केवल और केवल उसी कॉलेज के सारे पोस्ट
  // (All posts of that college only) एक साथ आने चाहिए। उसमें किसी अन्य कॉलेज का एक भी पोस्ट मिक्स नहीं होना चाहिए।"
  const filteredPosts = useMemo(() => {
    if (!cleanQuery) {
      return state.posts;
    }

    // Check if query is targeting a username
    const isUsernameSearch =
      searchQuery.trim().startsWith('@') ||
      (matchedProfile && matchedProfile.handle.toLowerCase() === cleanQuery);

    if (isUsernameSearch && matchedProfile) {
      return state.posts.filter((post) => post.authorId === matchedProfile.id);
    }

    // Strict College Search
    return state.posts.filter((post) => {
      const author = state.profiles.find((p) => p.id === post.authorId);
      const postCollege = (post.college || '').toLowerCase();
      const authorCollege = (author?.college || '').toLowerCase();

      const matchesCollege =
        postCollege.includes(cleanQuery) ||
        authorCollege.includes(cleanQuery) ||
        cleanQuery.includes(postCollege && postCollege.length > 2 ? postCollege : '___') ||
        cleanQuery.includes(authorCollege && authorCollege.length > 2 ? authorCollege : '___');

      if (matchesCollege) return true;

      if (
        author &&
        (author.handle.toLowerCase().includes(cleanQuery) ||
          author.name.toLowerCase().includes(cleanQuery))
      ) {
        return true;
      }

      return false;
    });
  }, [cleanQuery, searchQuery, matchedProfile, state.posts, state.profiles]);

  const isFiltering = Boolean(cleanQuery);

  return (
    <div className="space-y-5">
      {/* Search Header Section */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
              <Filter className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Campus & College Search
            </h2>
          </div>
          {isFiltering && (
            <button
              type="button"
              onClick={() => handleSelectCollege(null)}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Reset All
            </button>
          )}
        </div>

        {/* Clean Modern Search Bar */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search College (e.g. MGM Indore) or Username (@praveen_neet)..."
            aria-label="Search posts by college or username"
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 py-3 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-500/15 transition shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick College Filter Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Colleges:
          </span>
          <button
            type="button"
            onClick={() => handleSelectCollege(null)}
            className={`shrink-0 rounded-full px-3 py-1 font-semibold transition ${
              !searchQuery
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Campus Feed
          </button>
          {POPULAR_COLLEGES.map((col) => {
            const isSelected =
              cleanQuery.includes(col.toLowerCase()) || col.toLowerCase().includes(cleanQuery);
            return (
              <button
                key={col}
                type="button"
                onClick={() => handleSelectCollege(col)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-600/30'
                    : 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-900/60 hover:bg-teal-100 dark:hover:bg-teal-900/60'
                }`}
              >
                <Building2 className="h-3 w-3" />
                <span>{col}</span>
              </button>
            );
          })}
        </div>

        {/* Highlighted student profile if username searched */}
        {matchedProfile && (
          <div className="mt-3 rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/80 dark:bg-teal-950/40 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar
                name={matchedProfile.name}
                seed={matchedProfile.id}
                avatarUrl={matchedProfile.avatar}
                size="sm"
              />
              <div className="min-w-0">
                <span className="block truncate font-bold text-xs text-slate-900 dark:text-white">
                  {matchedProfile.name}{' '}
                  <span className="font-semibold text-teal-700 dark:text-teal-400">
                    @{matchedProfile.handle}
                  </span>
                </span>
                <span className="block truncate text-[11px] text-slate-600 dark:text-slate-400">
                  {matchedProfile.college ? `🏛️ ${matchedProfile.college}` : 'Campus Member'} ·{' '}
                  {matchedProfile.specialty || matchedProfile.courseYear || 'Student'}
                </span>
              </div>
            </div>
            <a
              href={`#/profile/${matchedProfile.id}`}
              className="shrink-0 rounded-xl bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700 transition shadow-sm"
            >
              View Profile
            </a>
          </div>
        )}

        {/* Filter Summary Banner */}
        {isFiltering && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>
                Showing posts from: <strong>"{searchQuery}"</strong> ({filteredPosts.length}{' '}
                {filteredPosts.length === 1 ? 'post' : 'posts'} found)
              </span>
            </span>
            <button
              type="button"
              onClick={() => handleSelectCollege(null)}
              className="font-bold text-teal-700 dark:text-teal-400 hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </section>

      {/* Modern Composer */}
      <Composer />

      {/* Filtered Posts Feed */}
      <PostFeed
        posts={filteredPosts}
        onFilterCollege={(col) => handleSelectCollege(col)}
        emptyTitle={
          isFiltering
            ? `No posts found from "${searchQuery}"`
            : 'No campus posts yet'
        }
        emptyText={
          isFiltering
            ? 'Only posts strictly from this college or user are displayed. Be the first from your college to post!'
            : 'Be the first student to share what is happening in your college, confessions, memes, or study updates!'
        }
        emptyAction={
          isFiltering ? (
            <button
              type="button"
              onClick={() => handleSelectCollege(null)}
              className="inline-flex rounded-full bg-slate-900 dark:bg-slate-100 px-4 py-2 text-xs font-semibold text-white dark:text-slate-900 shadow hover:bg-slate-800 dark:hover:bg-slate-200 transition"
            >
              Reset Filter & Show All Posts
            </button>
          ) : undefined
        }
      />
    </div>
  );
}
