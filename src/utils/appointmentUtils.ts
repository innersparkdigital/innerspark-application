/**
 * Appointment Utilities
 * Helpers for resolving session types and formatting appointment data
 */

export const SESSION_TYPE_MAP: Record<string, string> = {
  '1': 'Individual Video Session',
  '2': 'Chat Consultation Session',
  '10': 'Friendly Chat',
};

/**
 * Resolves a session type ID into a human-readable name.
 * Backward compatible: if the input is already a name, returns it as is.
 * 
 * @param sessionType - The session type ID (string or number) or name
 * @param dynamicTypes - Optional list of dynamic session types from backend
 * @returns The resolved human-readable session name
 */
export const resolveSessionType = (
  sessionType: string | number | undefined | null,
  dynamicTypes: any[] = []
): string => {
  if (!sessionType) return 'Individual Session';
  
  const typeStr = sessionType.toString();
  
  // 1. Try to find in dynamic types from backend
  if (dynamicTypes && dynamicTypes.length > 0) {
    const dynamicMatch = dynamicTypes.find(t => t.id.toString() === typeStr);
    if (dynamicMatch) return dynamicMatch.name;
  }
  
  // 2. Fallback to hardcoded map
  if (SESSION_TYPE_MAP[typeStr]) {
    return SESSION_TYPE_MAP[typeStr];
  }
  
  // 3. If it's a numeric ID but not in our map, return generic label
  if (/^\d+$/.test(typeStr)) {
    return `Session Type ${typeStr}`;
  }
  
  // 4. Otherwise, it's likely already a name
  return typeStr;
};
