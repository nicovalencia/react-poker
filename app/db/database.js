import mongoose from 'mongoose';

class Database {

  constructor(dbName) {
    this.dbName = dbName;
  }

  connect(errCb, successCb) {

    mongoose.connect(`mongodb://localhost/${this.dbName}`);

    this.connection = mongoose.connection;
    this.connection.on('error', errCb);
    this.connection.once('open', successCb);
  }

}

export default Database;