export const isValidNpmPackageName = (projectName: string): boolean => {
  const pattern = /^(?:(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)?\/[a-z0-9-._~])|[a-z0-9-~])[a-z0-9-._~]*$/;
  return pattern.test(projectName);
};
