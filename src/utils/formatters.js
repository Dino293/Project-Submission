// File: src/utils/formatters.js
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate = (dateString) => {
  try {
    if (!dateString) return 'Tidak diketahui';

    const date = parseISO(dateString);
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: id,
    });
  } catch {
    return 'Tidak diketahui';
  }
};

export const formatFullDate = (dateString) => {
  try {
    if (!dateString) return '';

    const date = parseISO(dateString);
    return format(date, 'dd MMMM yyyy, HH:mm', { locale: id });
  } catch {
    return dateString;
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';

  if (text.length <= maxLength) return text;

  const truncated = text.substr(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0 && lastSpace > maxLength * 0.8) {
    return `${truncated.substr(0, lastSpace)}...`;
  }

  return `${truncated}...`;
};

export const formatNumber = (number) => {
  if (number === undefined || number === null) return '0';
  return new Intl.NumberFormat('id-ID').format(number);
};

export const formatVoteCount = (count) => {
  if (count === undefined || count === null) return '0';

  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }

  return count.toString();
};

export const getCategoryColor = (category) => {
  const colors = {
    Programming: 'bg-blue-100 text-blue-800',
    Technology: 'bg-purple-100 text-purple-800',
    Science: 'bg-green-100 text-green-800',
    Education: 'bg-yellow-100 text-yellow-800',
    Entertainment: 'bg-pink-100 text-pink-800',
    Business: 'bg-indigo-100 text-indigo-800',
    Health: 'bg-red-100 text-red-800',
    Sports: 'bg-orange-100 text-orange-800',
    General: 'bg-gray-100 text-gray-800',
    Umum: 'bg-gray-100 text-gray-800',
  };

  return colors[category] || colors.General;
};

export const getUserInitials = (name) => {
  if (!name) return 'U';

  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const getAvatarUrl = (user) => {
  if (!user) {
    return 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff';
  }

  if (user.avatar) {
    return user.avatar;
  }

  const initials = getUserInitials(user.name);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3b82f6&color=fff`;
};

export const getReadingTime = (text, wordsPerMinute = 200) => {
  if (!text) return '1 menit';

  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return `${minutes} menit`;
};

export const getTimeAgo = (dateString) => {
  if (!dateString) return 'Beberapa waktu yang lalu';

  try {
    const date = parseISO(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} tahun yang lalu`;
    if (interval === 1) return '1 tahun yang lalu';

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} bulan yang lalu`;
    if (interval === 1) return '1 bulan yang lalu';

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} hari yang lalu`;
    if (interval === 1) return '1 hari yang lalu';

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} jam yang lalu`;
    if (interval === 1) return '1 jam yang lalu';

    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} menit yang lalu`;
    if (interval === 1) return '1 menit yang lalu';

    return 'Baru saja';
  } catch {
    return formatDate(dateString);
  }
};
