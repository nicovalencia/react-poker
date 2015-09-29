import Session from '../models/session';

export default function auth(req, res, next) {
  req.currentSession = Session.find({
    token: req.headers['x-token']
  });
  next();
}