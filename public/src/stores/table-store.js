import EventEmitter from 'events';
import _ from 'lodash';

import TableApi from 'src/api/table-api';

const CHANGE_EVENT = 'change';

var _tables = [];
var _currentTableId = null;

class TableStore extends EventEmitter {

  bootstrap(currentTableId) {
    _currentTableId = currentTableId;

    // load _currentTable:
    return TableApi.get(currentTableId).then((table) => {
      _tables.push(table);
      this.emitChange();
    });
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  get(_id) {
    return _.find(_tables, { _id });
  }

  getAll() {
    return _tables;
  }

  getCurrent() {
    return this.get(_currentTableId);
  }

}

let tableStoreInstance = new TableStore();
tableStoreInstance.setMaxListeners(20);
// tableStoreInstance.dispatchToken = TableDispatcher.register(function(action) {

//   switch(action.type) {

//     case ActionTypes.TABLE_ACTION:
//       _tableActionHandler(action);
//       tableStoreInstance.emitChange();
//       break;

//     default:
//       // do nothing
//   }

// });

export default tableStoreInstance;