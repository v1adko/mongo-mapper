import MongoMapperProvider from './mongo-mapper-provider';
import { connectionString as defaultConnectionString } from './config'

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

export default getMongoMapper;
