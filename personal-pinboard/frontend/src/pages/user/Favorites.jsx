import React, { useState, useEffect } from 'react';
import { Modal } from '@mantine/core';
import PageHeader from '../../components/common/PageHeader';
import PinGrid from '../../components/pins/PinGrid';
import PinDetails from '../../components/pins/PinDetails';
import { pinService } from '../../services/pinService';
import { useAuth } from '../../hooks/useAuth';

export default function Favorites() {
  const { user } = useAuth();
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPin, setSelectedPin] = useState(null);

  useEffect(() => {
    async function loadFavorites() {
      setLoading(true);
      try {
        const data = await pinService.getAllPins({
          likedByUserId: user?.id || 2,
        });
        setPins(Array.isArray(data) ? data : (data?.pins || []));
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, [user]);

  const handleLikeToggle = (pinId, isLiked) => {
    if (!isLiked) {
      // If unliked, remove from favorites list
      setPins((prev) => prev.filter((p) => p.id !== pinId));
    }
  };

  const handleDeletePin = (pinId) => {
    setPins((prev) => prev.filter((p) => p.id !== pinId));
    if (selectedPin?.id === pinId) {
      setSelectedPin(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Favorites"
        description="All pins and inspirations you've saved with a heart."
      />

      <PinGrid
        pins={pins}
        loading={loading}
        onLikeToggle={handleLikeToggle}
        onDelete={handleDeletePin}
        onOpenModal={(pin) => setSelectedPin(pin)}
        emptyTitle="No favorites saved yet"
        emptyDescription="Explore visual ideas and click the heart or Save button to collect them here."
      />

      {/* Smooth Inline Modal for Pin Details */}
      <Modal
        opened={!!selectedPin}
        onClose={() => setSelectedPin(null)}
        size="72rem"
        radius="2xl"
        padding="lg"
        centered
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.65,
          blur: 4,
        }}
        classNames={{
          content: 'bg-transparent shadow-none',
          body: 'p-0',
        }}
      >
        {selectedPin && (
          <div className="relative">
            <PinDetails
              pin={selectedPin}
              isModal={true}
              onClose={() => setSelectedPin(null)}
              onDelete={handleDeletePin}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
