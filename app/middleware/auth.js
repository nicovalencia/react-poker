import Session from '../models/session';

export function authorize(req, res, next) {
  Session.findOne()
    .where('token').equals(req.headers['x-token'])
    .populate('user')
    .exec((err, session) => {

      if (err) next(err);

      if (session && session.user) {
        req.currentSession = session;
        return next();
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    });
}