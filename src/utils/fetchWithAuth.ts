
type Options = {
  method: string;
  headers: {
    "Content-Type": string;
  };
  body?: string;
};

export const fetchWithAuth = async (url: string, options: Options = {} as Options,token:string) => {
  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };

  return fetch(url, authOptions);
};
