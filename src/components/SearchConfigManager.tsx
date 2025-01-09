import { useEffect } from 'react';
import { initializeConfig } from '@/config/searchConfig';

export const SearchConfigManager = () => {
  useEffect(() => {
    initializeConfig();
  }, []);

  return null;
};