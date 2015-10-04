export function authorize(req, res, next) {
  Session.findOne()
    .where('token').equals(req.headers['x-token'])
    .populate('user')
    .exec((err, session) => {

      if (err) console.log(err);

      req.currentSession = session;
      if (req.currentSession && req.currentSession.user) {
        return next();
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    });
}