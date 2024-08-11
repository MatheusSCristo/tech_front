type Options = {
  method: string;
  headers: {
    "Content-Type": string;
  };
  body: string;
};

const fetchWithAuth = async (url: string, options: Options = {} as Options) => {
  const token = localStorage.getItem("access_token");

  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };

  return fetch(url, authOptions);
};
