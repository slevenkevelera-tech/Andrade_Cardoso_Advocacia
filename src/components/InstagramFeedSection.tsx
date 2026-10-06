import React, { useState } from 'react';
import { INSTAGRAM_POSTS_DATA } from '../data/mockData';
import { InstagramPost } from '../types';
import { Instagram, Heart, MessageCircle, ExternalLink, CheckCircle } from 'lucide-react';

export const InstagramFeedSection: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>(INSTAGRAM_POSTS_DATA);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const toggleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setLikedPosts((prev) => {
      const isLiked = !prev[postId];
      setPosts((current) =>
        current.map((p) =>
          p.id === postId ? { ...p, likes: p.likes + (isLiked ? 1 : -1) } : p
        )
      );
      return { ...prev, [postId]: isLiked };
    });
  };

  return (
    <section className="py-24 sm:py-32 bg-[#090D15] border-b border-[#1E2638]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header with Profile Summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-[#1E2638]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A880] mb-2">
              <Instagram className="w-4 h-4 text-[#C5A880]" />
              <span>Feed & Conexão em Tempo Real</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                @andradecardosoadv
              </h2>
              <span className="p-0.5 rounded-full bg-[#3B82F6] text-white" title="Perfil Verificado">
                <CheckCircle className="w-3.5 h-3.5 fill-current" />
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 font-sans-luxury max-w-xl">
              Acompanhe debates sobre julgamentos históricos, bastidores nos tribunais de Belém e Brasília e inovações em automação jurídica com Dr. Maurilo Cardoso e Lorenzo Cardoso.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold font-mono-luxury text-white">24.8k</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider">Seguidores</div>
            </div>
            <a
              href="https://instagram.com/andradecardosoadv"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 transition-opacity flex items-center gap-2 shadow-md"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Seguir no Instagram</span>
            </a>
          </div>
        </div>

        {/* Live Instagram Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => {
            const isLiked = likedPosts[post.id];

            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-[#1E2638] bg-[#0C121E] hover:border-[#C5A880]/60 transition-all duration-300 shadow-md flex flex-col justify-between"
              >
                {/* Image Slot */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#151D2C]">
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Top Tag */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono-luxury text-[#F3E5D0] border border-white/10">
                    {post.tag}
                  </span>

                  {/* Hover Interaction Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <button
                      onClick={(e) => toggleLike(e, post.id)}
                      className="flex items-center gap-1.5 text-white font-mono-luxury text-sm font-semibold hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                      <span>{post.likes}</span>
                    </button>
                    <div className="flex items-center gap-1.5 text-white font-mono-luxury text-sm font-semibold">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>

                {/* Caption Snippet & Footer */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-300 font-sans-luxury line-clamp-3 leading-relaxed">
                    {post.caption}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#1E2638] flex items-center justify-between text-[11px] text-slate-500">
                    <span>{post.timestamp}</span>
                    <span className="text-[#C5A880] group-hover:underline flex items-center gap-1">
                      Ver no Instagram <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Full Post Preview */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-[#2B374E] bg-[#0C121E] shadow-2xl">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/2 flex flex-col bg-black">
                  <div className="aspect-video sm:aspect-square relative bg-black">
                    <img
                      src={selectedPost.imageUrl}
                      alt={selectedPost.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="sm:w-1/2 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-[#1E2638]">
                      <span className="font-cinzel text-xs font-bold text-white">
                        andradecardosoadv
                      </span>
                      <CheckCircle className="w-3 h-3 text-blue-400" />
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-slate-300 font-sans-luxury leading-relaxed whitespace-pre-line">
                      {selectedPost.caption}
                    </p>

                    <div className="mt-3 text-xs text-[#C5A880] font-mono-luxury">
                      {selectedPost.tag}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1E2638] mt-6">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span className="font-mono-luxury font-semibold text-white">
                        {selectedPost.likes} curtidas
                      </span>
                      <span>{selectedPost.timestamp}</span>
                    </div>

                    <a
                      href={selectedPost.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded text-xs font-semibold uppercase tracking-wider text-center text-white bg-[#C5A880] hover:bg-[#D4AF37] text-slate-900 transition-colors block"
                    >
                      Abrir no Instagram Oficial
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

