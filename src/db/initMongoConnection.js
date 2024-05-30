import checkEnvFor from '../utils/env.js';
import mongoose from 'mongoose';

const initMongoConnection = async () => {
  try {
    const user = checkEnvFor('MONGODB_USER');
    const pwd = checkEnvFor('MONGODB_PASSWORD');
    const url = checkEnvFor('MONGODB_URL');
    const nameDB = checkEnvFor('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${nameDB}?retryWrites=true&w=majority`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log('Something went wrong: ', error.message);
  }
};

export default initMongoConnection;
