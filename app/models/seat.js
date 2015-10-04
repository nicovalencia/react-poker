import mongoose from 'mongoose';
import _ from 'lodash';

let _seats = [];
let seatIdCounter = 1;

let schema = mongoose.Schema({
  position: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

schema.statics.create = function(opts, cb) {
  let seat = new Seat(opts);

  seat.save((err) => {
    if (err) cb(err);
    console.log(`seat created ${seat._id}`);
    cb(null, seat);
  });
};

schema.methods.userSit = function userSit(user) {

  return new Promise((resolve, reject) => {

    if (this.user) {

      reject('A user is already sitting in this seat!');

    } else {

      this.user = user._id;
      this.save((err) => {
        if (err) reject(err);
        resolve(user);
      });

    }

  });

    // if (!this.table.hasUser(user.id)) { // removed method hasUser
    //   console.error('User is not at table. Cannot sit here.')
    //   return false;
    // } else if (this.user) {
    //   console.error('Another user is sitting at this seat.')
    //   return false;
    // } else {

    //   this.user = user;
      
    //   console.log(`> ${user.name} sat in seat #${this.id}`);
    //   this.table.broadcast('USER_SIT', {
    //     seat: this,
    //     user
    //   });

    //   return this;
    // }
};

schema.methods.userStand = function userStand(cb) {
  this.user = null;
  this.save((err) => {
    if (err) cb(err);
    cb(null, this);
  });

    // this.table.broadcast('USER_STAND', {
    //   seat: this,
    //   user: this.user
    // });
    // console.log(`> ${this.user.name} stood up from seat #${this.id}`);

    // this.user = null;
    // return this;
};

let Seat = mongoose.model('Seat', schema);

export { schema as seatSchema };
export default Seat;