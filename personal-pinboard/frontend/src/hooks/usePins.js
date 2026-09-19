import { useState, useEffect, useCallback } from 'react';
import { pinService } from '../services/pinService';

export function usePins(initialParams = {}) {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchPins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pinService.getAllPins(params);
      setPins(data);
    } catch (err) {
      console.error('Failed to load pins:', err);
      setError(err.message || 'Failed to fetch pins');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  const updatePinLike = (pinId, isLiked, likesCount) => {
    setPins(prev =>
      prev.map(pin =>
        pin.id === pinId
          ? {
              ...pin,
              is_liked: isLiked,
              likes_count: likesCount !== undefined ? likesCount : (isLiked ? pin.likes_count + 1 : Math.max(0, pin.likes_count - 1)),
            }
          : pin
      )
    );
  };

  const removePin = (pinId) => {
    setPins(prev => prev.filter(p => p.id !== pinId));
  };

  return {
    pins,
    loading,
    error,
    params,
    setParams,
    refetch: fetchPins,
    updatePinLike,
    removePin,
  };
}
