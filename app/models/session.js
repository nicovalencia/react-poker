import mongoose from 'mongoose';
import _ from 'lodash';

import User from './user';
import {tableSchema} from './table';

function generateToken() {
  return `${_.random(1e10)}-${_.random(1e10)}-${_.random(1e10)}`;
}

let sessionSchema = mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tables: [tableSchema]
});

sessionSchema.statics.create = function() {

  let user = new User({
    name: `New Player`
  });

  return new Promise((resolve, reject) => {
    user.save((err) => {

      if (err) reject(err);

      let session = new Session({
        token: generateToken(),
        user: user._id
      });

      session.save((err) => {

        if (err) reject(err);

        console.log(`saved session ${session.token} and user ${user._id}`);
        resolve(session);

      });

    });
  });

};

sessionSchema.statics.findOrCreate = function(token) {

  return new Promise((resolve, reject) => {
    this.findOne({ token }, (err, session) => {

      if (err) reject(err);

      if (session) {
        resolve(session);
      } else {
        sessionSchema.statics.create().then(resolve);
      }

    });
  });

};

let Session = mongoose.model('Session', sessionSchema);

export default Session;