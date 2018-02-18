import { createElement } from 'react';
const isString = (x: any) => typeof x === 'string';
const isArray = (x: any) => Array.isArray(x);
const isObject = (x: any) => typeof x === 'object' && !isArray(x);

const clean = (a: any, b: any) => (!b ? a : isString(b[0]) ? a.concat([b]) : a.concat(b));
const child = (x: any) => (f: Function) =>
  x || x === 0 ? (isArray(x) ? x.reduce(clean, []).map(f) : x + '') : [];

function build(node: any): any {
  if (!!node && isString(node)) {
    return node;
  }

  if (isObject(node[1])) {
    return createElement(
      node[0], 
      node[1], 
      child(node[2])(build),
    );
  }

  return build([node[0], {}, node[1]]);
}

export default build;
