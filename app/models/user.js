import mongoose from 'mongoose';
import _ from 'lodash';

let schema = mongoose.Schema({
  id: Number,
  name: String
});

schema.methods.changeName = function(name, cb) {
  this.name = name;
  this.save((err) => {
    if (err) cb(err);
    cb(null, this);
  });
};

let User = mongoose.model('User', schema);

export {schema as userSchema};
export default User;