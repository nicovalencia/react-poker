import reqwest from 'reqwest';

export function authReqwest(opts) {
  opts.headers = opts.headers || {};
  opts.headers['x-token'] = localStorage.getItem('token');
  opts.headers['x-table-id'] = localStorage.getItem('tableId');
  return reqwest(opts);
}