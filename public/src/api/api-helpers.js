import reqwest from 'reqwest';

export function authReqwest(opts) {
  opts.headers = opts.headers || {};
  opts.headers['x-token'] = localStorage.getItem('token');
  return reqwest(opts);
}