let _userid = 0;
const userid = () => `${++_userid}`;
const todoid = () => Math.random().toString(36).slice(2);

function User(name, todos = []) {
  this.id = userid();
  this.name = name;
  this.todos = todos;
}

function Todo(title, description, isDone = false) {
  this.id = todoid();
  this.title = title;
  this.description = description;
  this.isDone = isDone;
}

const jsonDb = {
  users: [
    new User("Dude", [new Todo("Build stuff", "You should really build some stuff")]),
    new User("Guy")
  ],
  scan({ attributes }) {
    if (!attributes) {
      return this.users;
    }

    return this.users.reduce((users, user) => {
      const result = {};
      for (const attribute of attributes) {
        result[attribute] = user[attribute];
      }

      users.push(result);
      return users;
    }, []);
  },
  get({ attributes, id }) {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      return null;
    }
    if (!attributes) {
      return user;
    }

    const result = {};
    for (const attribute of attributes) {
      result[attribute] = user[attribute];
    }

    return result;
  },
  update({ id, update, value }) {
    const user = this.users.find(u => u.id === id);
    user[update] = value;

    return user[update];
  },
  add({ id, update, value }) {
    console.log(id, update, value);
    const user = this.users.find(u => u.id === id);
    user[update].push(value);

    return user[update];
  }
}

/**
 * Scan the table for all the results.
 * Options:
 * [attributes]   Array   An array of fields to get
 */
const getAll = async (_options = {}) => {
  const params = {};
  if (Array.isArray(_options.attributes)) {
    params.attributes = _options.attributes;
  }


  const results = await jsonDb.scan(params);
  return results;
};

/**
 * Gets one record from the table.
 * Returns null if record is not found.
 * Options:
 * key             String|Number     The object identifier
 * [attributes]    Array             An array of fields to get
 */
const getOne = async (_options = {}) => {
  if (_options.key == null) {
    throw new Error('Parameter \'key\' is required.');
  }

  const params = {
    id: _options.key,
  };
  if (Array.isArray(_options.attributes)) {
    params.attributes = _options.attributes;
  }

  const result = await jsonDb.get(params);
  if (result) {
    return result;
  }

  return null;
};

const addListItem = async (_options = {}) => {
  if (_options.key == null) {
    throw new Error('Parameter \'key\' is required.');
  }
  if (_options.listName == null) {
    throw new Error('Parameter \'listName\' is required.');
  }
  if (_options.listItem == null) {
    throw new Error('Parameter \'listItem\' is required.');
  }

  const params = {
    id: _options.key,
    update: _options.listName,
    value: _options.listItem,
  };

  if (Array.isArray(_options.attributes)) {
    params.attributes = _options.attributes;
  }

  const results = await jsonDb.add(params);

  return results;
};

const updateListItem = async (_options = {}) => {
  if (_options.key == null) {
    throw new Error('Parameter \'key\' is required.');
  }
  if (_options.listName == null) {
    throw new Error('Parameter \'listName\' is required.');
  }
  if (_options.listItem == null) {
    throw new Error('Parameter \'listItem\' is required.');
  }

  const parent = await getOne({
    key: _options.key,
  });
  if (!parent) {
    return null;
  }
  const items = parent[_options.listName];
  if (!items) {
    return null;
  }
  const editedIndex = items.findIndex(item => item.id === _options.listItem.id);
  if (editedIndex === -1) {
    return null;
  }
  
  const newItems = JSON.parse(JSON.stringify(items));

  newItems[editedIndex] = {
    ...items[editedIndex],
    ..._options.listItem,
  };

  const params = {
    id: _options.key,
    update: _options.listName,
    value: newItems,
  };
  if (Array.isArray(_options.attributes)) {
    params.attributes = _options.attributes;
  }

  await jsonDb.update(params);

  return newItems[editedIndex];
};

const deleteListItem = async (_options = {}) => {
  if (_options.key == null) {
    throw new Error('Parameter \'key\' is required.');
  }
  if (_options.listName == null) {
    throw new Error('Parameter \'listName\' is required.');
  }
  if (_options.listItem == null) {
    throw new Error('Parameter \'listItem\' is required.');
  }

  const parent = await getOne({
    key: _options.key,
  });
  if (!parent) {
    return null;
  }
  const items = parent[_options.listName];
  if (!items) {
    return null;
  }
  const editedIndex = items.findIndex(item => item.id === _options.listItem.id);
  if (editedIndex === -1) {
    return null;
  }
  
  const newItems = items.slice().splice(editedIndex, 1);

  const params = {
    id: _options.key,
    update: _options.listName,
    value: newItems
  };

  if (Array.isArray(_options.attributes)) {
    params.attributes = _options.attributes;
  }

  await jsonDb.update(params);

  return true;
};

module.exports = {
  getAll,
  getOne,
  addListItem,
  updateListItem,
  deleteListItem,
};