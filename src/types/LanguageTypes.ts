export const supportedLocales = ["en", "ka"] as const;
export type LocaleType = typeof supportedLocales[number];