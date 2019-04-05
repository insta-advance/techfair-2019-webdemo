const AWS = require('aws-sdk');

// Get the table name from the table arn
const tableName = process.env.DYNAMODB_TABLE_ARN ?
  process.env.DYNAMODB_TABLE_ARN.split('/')[1] : '';
const defaultParams = {
  TableName: tableName,
};

// Create the DocumentClient with the default params containing the table name
const dynamoDb = new AWS.DynamoDB.DocumentClient(defaultParams);

/**
 * Scan the table for all the results.
 * Options:
 * [attributes]   Array   An array of fields to get
 */
const getAll = async (_options = {}) => {
  const params = {};
  if (Array.isArray(_options.attributes)) {
    params.AttributesToGet = _options.attributes;
  }

  const callParams = {
    ...defaultParams,
    ...params,
  };
  const results = await dynamoDb.scan(callParams).promise();
  return results.Items;
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
    Key: {
      id: _options.key,
    },
  };
  if (Array.isArray(_options.attributes)) {
    params.AttributesToGet = _options.attributes;
  }

  const callParams = {
    ...defaultParams,
    ...params,
  };
  const results = await dynamoDb.get(callParams).promise();
  if (results.Item) {
    return results.Item;
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
    Key: {
      id: _options.key,
    },
    UpdateExpression: `SET ${_options.listName} = list_append(${_options.listName}, :val1)`,
    ExpressionAttributeValues: {
      ':val1': [_options.listItem],
    },
  };
  if (Array.isArray(_options.attributes)) {
    params.AttributesToGet = _options.attributes;
  }

  const callParams = {
    ...defaultParams,
    ...params,
  };
  const results = await dynamoDb.update(callParams).promise();

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
  items[editedIndex] = {
    ...items[editedIndex],
    ..._options.listItem,
  };

  const params = {
    Key: {
      id: _options.key,
    },
    UpdateExpression: `SET ${_options.listName} = :val1`,
    ExpressionAttributeValues: {
      ':val1': items,
    },
  };
  if (Array.isArray(_options.attributes)) {
    params.AttributesToGet = _options.attributes;
  }

  const callParams = {
    ...defaultParams,
    ...params,
  };
  await dynamoDb.update(callParams).promise();

  return items[editedIndex];
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
  items.splice(editedIndex, 1);

  const params = {
    Key: {
      id: _options.key,
    },
    UpdateExpression: `SET ${_options.listName} = :val1`,
    ExpressionAttributeValues: {
      ':val1': items,
    },
  };
  if (Array.isArray(_options.attributes)) {
    params.AttributesToGet = _options.attributes;
  }

  const callParams = {
    ...defaultParams,
    ...params,
  };
  await dynamoDb.update(callParams).promise();

  return true;
};

module.exports = {
  getAll,
  getOne,
  addListItem,
  updateListItem,
  deleteListItem,
};
