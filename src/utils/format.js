export const formatText = (raw) => {
  if (!raw) return '';

  const str = raw
    .replace(/(\d+)([A-Za-z])/g, '$1 $2')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  return str.charAt(0).toUpperCase() + str.slice(1);
};
