export const templateRe = /\{ *([\w_ -]+) *\}/g;

export function template(str: string, data: Record<string, string>) {
  return str.replace(templateRe, (str, key) => {
    const value = data[key];
    if (value === undefined) {
      throw new Error("No value provided for variable " + str);
    }
    return value;
  });
}
