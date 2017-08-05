const handler = {
  get(target, name) {
    return name;
  },
};

export default new Proxy({}, handler);
