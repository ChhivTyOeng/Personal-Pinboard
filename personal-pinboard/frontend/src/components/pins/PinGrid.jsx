import React from 'react';
import PinCard from './PinCard';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function PinGrid({
  pins = [],
  loading = false,
  emptyTitle = 'No pins discovered',
  emptyDescription = 'Be the first to save an idea or upload visual inspiration.',
  onLikeToggle,
  onDelete,
  onOpenModal,
}) {
  const navigate = useNavigate();

  if (loading) {
    return <Loading message="Loading pins..." />;
  }

  if (!pins || pins.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="Create a Pin"
        onAction={() => navigate('/pins/create')}
      />
    );
  }

  return (
    <div className="masonry-grid">
      {pins.map((pin) => (
        <PinCard
          key={pin.id}
          pin={pin}
          onLikeToggle={onLikeToggle}
          onDelete={onDelete}
          onOpenModal={onOpenModal}
        />
      ))}
    </div>
  );
}
