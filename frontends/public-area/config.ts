enum Environment {
  Development = "development",
  Production = "production",
}

export const getConfig = () => {
  const env = (process.env.BUILD_ENV as Environment) || Environment.Development;

  const config = {
    [Environment.Development]: {
      baseUrl: "http://localhost:3000",
      apiUrl: "http://localhost:1337",
    },
    [Environment.Production]: {
      baseUrl: "https://artur-schuetz.com",
      apiUrl: "https://api.artur-schuetz.com",
    },
  };

  return config[env];
};
