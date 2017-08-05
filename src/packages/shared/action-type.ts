const handler = {
  get(target: string, name: string) {
    return name;
  },
};

export default new Proxy({}, handler);
