import unidecode from "unidecode";

export const convertToSlug = (text: string): string => {
  const unidecodeText = unidecode(text);
  return unidecodeText.replace(/\s+/g, "-").toLowerCase();
};