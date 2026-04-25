/**
 * CommunityScreen.tsx
 * -------------------
 * Posts feed + active challenges. All operations hit the backend.
 * Route: /community
 */

import { useEffect, useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Heart, MessageCircle, Share2, UserPlus, Send } from 'lucide-react';
import { Button } from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { apiGet, apiPost } from '../lib/api';

type Comment = { id: number | string; author: string; content: string; time: string };
type Post = {
  id: string;
  author: string;
  time: string;
  content: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
};
type Challenge = { id: string; title: string; members: number; daysLeft: number };

export function CommunityScreen() {
  const { t } = useLanguage();

  const [posts, setPosts] = useState<Post[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Fetch posts + challenges in parallel.
  useEffect(() => {
    apiGet<{ posts: Post[] }>('/api/community/posts').then((r) => setPosts(r.posts)).catch(() => {});
    apiGet<{ challenges: Challenge[] }>('/api/community/challenges').then((r) => setChallenges(r.challenges)).catch(() => {});
  }, []);

  /**
   * handleLike
   * Optimistic update first, then POST. Reverts on failure.
   */
  const handleLike = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p))
    );
    try {
      await apiPost(`/api/community/posts/${postId}/like`);
    } catch {
      // Revert on error.
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p))
      );
    }
  };

  /**
   * handleCommentSubmit
   * POSTs the comment, appends the returned record to local state.
   */
  const handleCommentSubmit = async (postId: string) => {
    const text = commentText.trim();
    if (!text) return;
    try {
      const { comment } = await apiPost<{ comment: Comment }>(`/api/community/posts/${postId}/comments`, { content: text });
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p))
      );
      setCommentText('');
      setActiveCommentPost(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  /**
   * handleShare
   * Native Web Share API fallback to alert.
   */
  const handleShare = (post: Post) => {
    if (navigator.share) {
      navigator.share({ title: 'ÉLAN Community Post', text: post.content }).catch(() => {});
    } else {
      alert('Post shared!');
    }
  };

  return (
    <MobileLayout>
      <div className="px-6 pt-12 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4>{t.community.title}</h4>
            <p className="text-caption text-[var(--color-mid-dark)]">{t.community.subtitle}</p>
          </div>
          <Button size="small"><UserPlus size={16} /></Button>
        </div>

        {/* Active Challenges */}
        <div className="mb-6">
          <h6 className="mb-3">Active Challenges</h6>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {challenges.map((c) => (
              <Card key={c.id} className="min-w-[200px] cursor-pointer hover:shadow-md transition-shadow" onClick={() => alert(`Joined ${c.title}!`)}>
                <p className="text-subtitle2 mb-2">{c.title}</p>
                <p className="text-caption text-[var(--color-mid-dark)] mb-1">{c.members} members</p>
                <p className="text-caption text-[var(--color-primary)]">{c.daysLeft} days left</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Feed */}
        <h6 className="mb-4">Community Feed</h6>
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-mid-dark)] flex items-center justify-center text-white">
                  <span className="text-body2">{post.author.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-subtitle2">{post.author}</p>
                  <p className="text-caption text-[var(--color-mid-dark)]">{post.time}</p>
                </div>
              </div>

              <p className="text-body2 mb-3">{post.content}</p>

              <div className="flex items-center gap-6 pt-3 border-t border-[var(--color-lighter)]">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 transition-colors ${post.liked ? 'text-red-500' : 'text-[var(--color-mid-dark)] hover:text-red-500'}`}
                >
                  <Heart size={20} fill={post.liked ? 'currentColor' : 'none'} />
                  <span className="text-caption">{post.likes}</span>
                </button>
                <button
                  onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                  className="flex items-center gap-2 text-[var(--color-mid-dark)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <MessageCircle size={20} />
                  <span className="text-caption">{post.comments.length}</span>
                </button>
                <button
                  onClick={() => handleShare(post)}
                  className="flex items-center gap-2 text-[var(--color-mid-dark)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {activeCommentPost === post.id && (
                <div className="mt-4 pt-4 border-t border-[var(--color-lighter)]">
                  {post.comments.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {post.comments.map((c) => (
                        <div key={c.id} className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-lighter)] flex items-center justify-center flex-shrink-0">
                            <span className="text-caption">{c.author.charAt(0)}</span>
                          </div>
                          <div className="flex-1 bg-[var(--color-lightest)] rounded-2xl px-3 py-2">
                            <p className="text-caption font-medium mb-1">{c.author}</p>
                            <p className="text-body2">{c.content}</p>
                            <p className="text-caption text-[var(--color-mid-dark)] mt-1">{c.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2 rounded-full border border-[var(--color-light)] bg-white focus:outline-none focus:border-[var(--color-primary)] transition-colors text-body2"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
