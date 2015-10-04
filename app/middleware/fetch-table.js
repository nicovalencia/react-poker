import Table from '../models/table';

export function fetchTable(req, res, next) {
  Table.findById(req.headers['x-table-id'], (err, table) => {

    if (err) next(err);

    if (table) {
      req.table = table;
      return next();
    } else {
      return res.status(404).json({ error: "Could not find table" });
    }
  });
}