export const getEnvVariables = () => {
  import.meta.env;

  return { ...import.meta.env } as Record<string, string | boolean | undefined>;
};
