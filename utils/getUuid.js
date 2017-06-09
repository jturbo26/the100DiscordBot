const uuidV1 = require('uuid/v1');

const getUuid = () => {
  const uuid = uuidV1();
  return uuid;
}

module.exports = getUuid;
