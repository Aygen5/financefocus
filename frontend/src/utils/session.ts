/**
 * Utility to verify if an async API request response belongs to the currently active logged-in user session.
 * Prevents race conditions and cross-user data bleeding when switching accounts or logging out.
 */
export const getActiveUserId = (): string | undefined => {
  try {
    const savedUserStr = localStorage.getItem("user");
    if (!savedUserStr) return undefined;
    const user = JSON.parse(savedUserStr);
    return user?.id;
  } catch {
    return undefined;
  }
};

export const isCurrentSessionUser = (requestingUserId?: string): boolean => {
  if (!requestingUserId) return true;
  const currentActiveId = getActiveUserId();
  if (!currentActiveId) return false; // User logged out while request was in flight
  return currentActiveId === requestingUserId;
};

/**
 * Completely purges all user data and fallback database keys from localStorage.
 */
export const purgeAllSessionStorage = (): void => {
  try {
    const keysToPreserve = ["theme_mode"];
    Object.keys(localStorage).forEach((key) => {
      if (!keysToPreserve.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // Ignore storage access errors
  }
};
