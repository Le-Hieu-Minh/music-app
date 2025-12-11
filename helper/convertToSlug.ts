import unidecode from "unidecode";
export const convertToSlug = (text: string): string => {
  const unidecodeText = unidecode(text);
  console.log(unidecodeText);

  // let slug = unidecodeText.replaceAll(" ", "-");

  let slug = unidecodeText.replace(/\s+/g, "-");

  return slug;
}