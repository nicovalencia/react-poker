import Session from '../models/session';

export function authorize(req, res, next) {
  req.currentSession = Session.find({
    token: req.headers['x-token']
  });

  if (req.currentSession && req.currentSession.user) {
    return next();
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
}