const MongoMapperProvider = require('./mongo-mapper-provider');
const { connectionString: defaultConnectionString } = require('./config');

const mongoMapperProvider = new MongoMapperProvider();

const getMongoMapper = ({
  connectionString = defaultConnectionString,
  useMongoose = false,
  isTesting = true
} = {}) =>
  mongoMapperProvider.getMongoMapper({
    connectionString,
    useMongoose,
    isTesting
  });

module.exports = getMongoMapper;
