import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconUsers,
  IconUser,
  IconLock,
  IconArrowLeft,
  IconArrowRight,
  IconSearch,
  IconSparkles,
  IconX,
} from '@tabler/icons-react';
import CategoryCard from '../../components/categories/CategoryCard';
import CategoryForm from '../../components/categories/CategoryForm';
import Loading from '../../components/common/Loading';
import { categoryService } from '../../services/categoryService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../../context/ToastContext';

export default function Categories() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('group'); // 'group' or 'personal'
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'group', 'personal'
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCats = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(Array.isArray(data) ? data : (data?.categories || []));
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/categories', { replace: true });
      return;
    }
    fetchCats();

    const handleStoreUpdate = () => {
      fetchCats();
    };

    window.addEventListener('pinboard-store-update', handleStoreUpdate);
    window.addEventListener('storage', handleStoreUpdate);
    return () => {
      window.removeEventListener('pinboard-store-update', handleStoreUpdate);
      window.removeEventListener('storage', handleStoreUpdate);
    };
  }, []);

  const handleOpenCreate = (type = 'group') => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCreateCategory = async (formData) => {
    setSubmitting(true);
    try {
      const created = await categoryService.createCategory(formData);
      setCategories((prev) => [...prev, created]);
      setModalOpen(false);
      const isGroup = created.type === 'group';
      toast.success(
        isGroup
          ? `Group Category "${created.name}" created with ${created.members?.length || 0} friends!`
          : `Personal Category "${created.name}" created!`
      );
    } catch (err) {
      toast.error(err.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    let result = categories;

    // Filter by tab
    if (activeTab === 'group') {
      result = result.filter(
        (c) => c.type === 'group' || (Array.isArray(c.members) && c.members.length > 0)
      );
    } else if (activeTab === 'personal') {
      result = result.filter(
        (c) => c.type === 'personal' || (!c.type && (!c.members || c.members.length === 0))
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [categories, activeTab, searchQuery]);

  const groupCount = useMemo(
    () =>
      categories.filter(
        (c) => c.type === 'group' || (Array.isArray(c.members) && c.members.length > 0)
      ).length,
    [categories]
  );

  const personalCount = useMemo(
    () =>
      categories.filter(
        (c) => c.type === 'personal' || (!c.type && (!c.members || c.members.length === 0))
      ).length,
    [categories]
  );

  if (loading) return <Loading message="Loading categories..." />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Back to Admin if applicable */}
      {isAdmin && (
        <button
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-slate-700 transition-all cursor-pointer"
        >
          <IconArrowLeft size={15} />
          Back to Admin Dashboard
        </button>
      )}

      {/* Clean Mobile-First Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore Categories
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-black">
              {categories.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Browse pins categorized by disciplines, personal spaces, and collaborative group circles.
          </p>
        </div>

        {/* Action Buttons: Responsive & Touch-Friendly */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Primary: Create Group Category Button */}
          <button
            type="button"
            onClick={() => handleOpenCreate('group')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <IconUsers size={16} stroke={2.5} />
            <span>+ Create Group</span>
          </button>

          {/* Secondary: Create Personal Category Button */}
          <button
            type="button"
            onClick={() => handleOpenCreate('personal')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold border border-slate-200/80 dark:border-slate-700/80 active:scale-95 transition-all cursor-pointer"
          >
            <IconLock size={15} />
            <span>+ Personal</span>
          </button>
        </div>
      </div>

      {/* Category Sharing Rule Banner: Clean, Informative & Mobile-Friendly */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-brand-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200/80 dark:border-rose-900/60">
            <IconUsers size={20} stroke={2.5} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Category Sharing Rule
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 dark:bg-rose-950/60 text-brand-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60">
                Max 5 People Per Group
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Invite and share pins with up to <strong>5 people</strong> per group category to exchange ideas, moodboards, and inspiration privately.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleOpenCreate('group')}
          className="self-start sm:self-center px-4 py-2 rounded-full text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-2xs hover:shadow-xs transition-all cursor-pointer shrink-0 inline-flex items-center gap-1.5 group"
        >
          <span>New Shared Group</span>
          <IconArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Filter Tabs & Quick Search Bar (Mobile Optimized) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Scope Filter Pills: All / Group / Personal */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/80 dark:bg-slate-600 font-extrabold">
              {categories.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('group')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'group'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <IconUsers size={14} />
            <span>Group Sharing</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold">
              {groupCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'personal'
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <IconLock size={13} />
            <span>Personal Solo</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/80 dark:bg-slate-600 font-extrabold">
              {personalCount}
            </span>
          </button>
        </div>

        {/* Lightweight Search Input */}
        <div className="relative w-full sm:w-64">
          <IconSearch
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter categories..."
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <IconX size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Categories Responsive Grid */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-50/70 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto shadow-2xs">
            {activeTab === 'group' ? <IconUsers size={28} /> : <IconLock size={28} />}
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            No {activeTab !== 'all' ? activeTab : ''} categories found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No categories matching "${searchQuery}". Try a different search term.`
              : activeTab === 'group'
              ? 'You haven’t created any group categories for sharing yet. Start collaborating with friends!'
              : 'Create a category to begin grouping your personal bookmarks and ideas.'}
          </p>

          <div className="pt-2 flex items-center justify-center gap-2">
            {activeTab === 'group' ? (
              <button
                type="button"
                onClick={() => handleOpenCreate('group')}
                className="px-4 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                + Create Group Category
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenCreate('personal')}
                className="px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                + Create Personal Category
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCategories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}

      {/* Create / Edit Category Modal */}
      <CategoryForm
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateCategory}
        initialType={modalType}
        loading={submitting}
      />
    </div>
  );
}
