const handler = {
  get(target: string, name: string) {
    return name;
  },
};

interface Type {
  [key: string]: any;
}

const actionType: Type = new Proxy({}, handler);
export default actionType;
