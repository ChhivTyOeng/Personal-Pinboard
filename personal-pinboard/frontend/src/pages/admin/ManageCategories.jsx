import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Button,
  TextInput,
  Textarea,
  Modal,
  Badge,
  ActionIcon,
  Group,
  Tooltip,
  Table,
} from '@mantine/core';
import {
  IconPlus,
  IconArrowLeft,
  IconCategory,
  IconEdit,
  IconTrash,
  IconSearch,
  IconPhoto,
  IconTag,
  IconHash,
  IconExternalLink,
} from '@tabler/icons-react';
import PageHeader from '../../components/common/PageHeader';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { categoryService } from '../../services/categoryService';
import { pinService } from '../../services/pinService';
import { appStore } from '../../services/store';
import { toast } from '../../context/ToastContext';

export default function ManageCategories({ defaultTab }) {
  const location = useLocation();
  const initialTab = defaultTab || (location.pathname.includes('tags') ? 'tags' : 'categories');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingCat, setDeletingCat] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCategoriesAndTags();
  }, []);

  const loadCategoriesAndTags = async () => {
    try {
      setLoading(true);
      const [catsData, pinsData] = await Promise.all([
        categoryService.getCategories(),
        pinService.getAllPins({ includeHidden: true }),
      ]);
      setCategories(catsData || []);

      // Aggregate tags
      const counts = {};
      const safePins = Array.isArray(pinsData) ? pinsData : (pinsData?.pins || []);
      safePins.forEach((p) => {
        (p.tags || []).forEach((t) => {
          const lower = t.toLowerCase().trim();
          if (lower) counts[lower] = (counts[lower] || 0) + 1;
        });
      });
      const customSaved = JSON.parse(localStorage.getItem('pinboard_system_tags') || '[]');
      customSaved.forEach((t) => {
        if (!counts[t]) counts[t] = 0;
      });
      const tagList = Object.keys(counts).map((tag) => ({
        name: tag,
        count: counts[tag],
      })).sort((a, b) => b.count - a.count);
      setTags(tagList);
    } catch (err) {
      console.error('Failed to load categories and tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCat(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || '');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      if (editingCat) {
        const updated = await categoryService.updateCategory(editingCat.id, {
          name: name.trim(),
          description: description.trim(),
          image_url: imageUrl.trim(),
        });
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCat.id ? { ...c, ...updated } : c))
        );
      } else {
        const created = await categoryService.createCategory({
          name: name.trim(),
          description: description.trim(),
          image_url:
            imageUrl.trim() ||
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600',
        });
        setCategories((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save category:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCat) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(deletingCat.id);
      setCategories((prev) => prev.filter((c) => c.id !== deletingCat.id));
      setDeleteConfirmOpen(false);
    } catch (err) {
      console.error('Failed to delete category:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateTag = (e) => {
    e.preventDefault();
    const cleanTag = newTagInput.trim().toLowerCase().replace(/^#/, '');
    if (!cleanTag) return;
    if (tags.some((t) => t.name === cleanTag)) {
      toast.error('Tag already exists');
      return;
    }
    const customSaved = JSON.parse(localStorage.getItem('pinboard_system_tags') || '[]');
    if (!customSaved.includes(cleanTag)) {
      customSaved.push(cleanTag);
      localStorage.setItem('pinboard_system_tags', JSON.stringify(customSaved));
    }
    setTags((prev) => [{ name: cleanTag, count: 0 }, ...prev]);
    setNewTagInput('');
    toast.success(`Tag #${cleanTag} created!`);
  };

  const handleDeleteTag = (tagName) => {
    const customSaved = JSON.parse(localStorage.getItem('pinboard_system_tags') || '[]').filter(
      (t) => t !== tagName
    );
    localStorage.setItem('pinboard_system_tags', JSON.stringify(customSaved));

    const pins = appStore.getPins();
    pins.forEach((p) => {
      if (p.tags && p.tags.includes(tagName)) {
        appStore.updatePin(p.id, {
          tags: p.tags.filter((t) => t.toLowerCase() !== tagName.toLowerCase()),
        });
      }
    });
    setTags((prev) => prev.filter((t) => t.name !== tagName));
    toast.success(`Tag #${tagName} deleted.`);
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-slate-700 transition-all"
      >
        <IconArrowLeft size={16} />
        Back to Admin Dashboard
      </Link>

      <PageHeader
        title={activeTab === 'categories' ? 'Admin Category Governance' : 'System Tags Governance'}
        description={
          activeTab === 'categories'
            ? 'Organize content themes, create new categories, and configure discovery exploration.'
            : 'Manage hashtags across the pin network, prune stale tags, and establish official topics.'
        }
        action={
          activeTab === 'categories' ? (
            <Button
              leftSection={<IconPlus size={16} />}
              color="brandRed"
              radius="xl"
              onClick={handleOpenCreate}
              className="bg-brand-600 hover:bg-brand-700 shadow-sm"
            >
              Create Category
            </Button>
          ) : null
        }
      />

      {/* Tabs Switcher: Categories vs Tags */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <IconCategory size={16} />
          <span>Categories ({categories.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'tags'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <IconTag size={16} />
          <span>Tags ({tags.length})</span>
        </button>
      </div>

      {/* Search & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs max-w-md flex-1">
          <TextInput
            placeholder={activeTab === 'categories' ? 'Filter categories...' : 'Filter tags by keyword...'}
            leftSection={<IconSearch size={16} className="text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            radius="md"
          />
        </div>

        {activeTab === 'tags' && (
          <form onSubmit={handleCreateTag} className="flex items-center gap-2">
            <TextInput
              placeholder="New tag (e.g. typography)"
              leftSection={<IconHash size={15} className="text-slate-400" />}
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.currentTarget.value)}
              radius="xl"
              size="sm"
            />
            <Button
              type="submit"
              color="brandRed"
              radius="xl"
              size="sm"
              leftSection={<IconPlus size={15} />}
              className="bg-brand-600 hover:bg-brand-700 shadow-xs shrink-0 font-bold"
            >
              Add Tag
            </Button>
          </form>
        )}
      </div>

      {loading ? (
        <Loading message="Loading category management..." />
      ) : activeTab === 'categories' ? (
        filtered.length === 0 ? (
          <EmptyState
            title="No Categories Found"
            message="Create your first content classification category."
            actionText="Create Category"
            onAction={handleOpenCreate}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cat) => (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="h-36 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <IconPhoto size={32} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge color="red" variant="filled" size="sm">
                        {cat.pins_count || 0} Pins
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">/{cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {cat.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <Button
                    variant="default"
                    size="xs"
                    radius="xl"
                    leftSection={<IconEdit size={14} />}
                    onClick={() => handleOpenEdit(cat)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    radius="xl"
                    leftSection={<IconTrash size={14} />}
                    onClick={() => {
                      setDeletingCat(cat);
                      setDeleteConfirmOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Tags Governance View */
        filteredTags.length === 0 ? (
          <EmptyState
            title="No Tags Found"
            message="No system tags match your search. You can add a new tag above."
          />
        ) : (
        <div>
          {/* Mobile Card List (< md) */}
          <div className="md:hidden space-y-2.5">
            {filteredTags.map((tag) => (
              <div
                key={tag.name}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center shrink-0">
                    <IconHash size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      #{tag.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {tag.count} {tag.count === 1 ? 'Pin associated' : 'Pins associated'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Tooltip label="Browse Pins with this Tag" withArrow>
                    <Link
                      to={`/pins?tag=${tag.name}`}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 active:scale-95 transition-all inline-flex items-center justify-center"
                    >
                      <IconExternalLink size={15} />
                    </Link>
                  </Tooltip>
                  <Tooltip label="Delete Tag" withArrow>
                    <button
                      type="button"
                      onClick={() => handleDeleteTag(tag.name)}
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 active:scale-95 transition-all inline-flex items-center justify-center cursor-pointer"
                    >
                      <IconTrash size={15} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover className="min-w-[500px]">
                <Table.Thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <Table.Tr>
                    <Table.Th className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Hashtag Name</Table.Th>
                    <Table.Th className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Pins Using Tag</Table.Th>
                    <Table.Th className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap text-right">Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredTags.map((tag) => (
                    <Table.Tr key={tag.name}>
                      <Table.Td>
                        <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <IconHash size={15} className="text-brand-600" />
                          {tag.name}
                        </span>
                      </Table.Td>
                      <Table.Td>
                        <Badge size="sm" variant="light" color={tag.count > 0 ? 'red' : 'gray'}>
                          {tag.count} {tag.count === 1 ? 'Pin' : 'Pins'}
                        </Badge>
                      </Table.Td>
                      <Table.Td align="right">
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip label="Browse Pins with this Tag" withArrow>
                            <Link to={`/pins?tag=${tag.name}`}>
                              <ActionIcon variant="subtle" color="gray" radius="xl">
                                <IconExternalLink size={16} />
                              </ActionIcon>
                            </Link>
                          </Tooltip>
                          <Tooltip label="Delete Tag" withArrow>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              radius="xl"
                              onClick={() => handleDeleteTag(tag.name)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        </div>
      )
      )}

      {/* Create / Edit Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          <span className="font-bold text-slate-900 text-base">
            {editingCat ? 'Edit Category' : 'Create New Category'}
          </span>
        }
        radius="lg"
        centered
      >
        <form onSubmit={handleSave} className="space-y-4">
          <TextInput
            label="Category Name"
            placeholder="e.g. Architecture & Spaces"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            radius="md"
          />

          <Textarea
            label="Description"
            placeholder="Describe the category content..."
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            minRows={2}
            radius="md"
          />

          <TextInput
            label="Cover Image URL"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.currentTarget.value)}
            radius="md"
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="default" radius="xl" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="brandRed"
              radius="xl"
              className="bg-brand-600 hover:bg-brand-700"
              loading={isSaving}
            >
              {editingCat ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        opened={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingCat?.name}"?`}
        loading={isDeleting}
      />
    </div>
  );
}
