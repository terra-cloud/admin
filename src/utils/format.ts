export const formatText = (raw: string): string => {
  if (!raw) return '';

  return raw
    .replace(/(\d+)([A-Za-z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
};
