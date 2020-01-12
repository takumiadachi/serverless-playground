import * as Firebase from 'firebase/app';
import axios from 'axios';
import 'firebase/database';


module.exports.hello = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.x.x! Your function executed successfully!!!',
        input: event
      },
      null,
      2
    )
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

// Setup HN
let API: any;
const version = '/v0';
const config = {
  databaseURL: 'https://hacker-news.firebaseio.com'
};

if (Firebase.apps.length == 0) {
  Firebase.initializeApp(config); // <---Important!!! In lambda, it will cause double initialization.
  API = Firebase.database().ref(version);
  // console.log(Firebase.database().ref(version))
}

module.exports.fetchItem = async (event: any, context: any, callback: any) => {
  context['callbackWaitsForEmptyEventLoop'] = false;
  let id: number = null

  if (event.id) {
    id = event.id
  }
  // console.log(context)
  try {
    // console.log(id)
    const item = await fetchItem(id);
    console.log(item)
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          // message: `${Firebase.database().ref(config.version)}`,
          message: item,
          input: event
        },
        null,
        2
      )
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          // message: `${Firebase.database().ref(config.version)}`,
          message: error,
          input: event
        },
        null,
        2
      )
    };
  }
};

async function fetch(child: string) {
  try {
    const snapshot = await API.child(child).once('value');
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
}

async function fetchItem(id: number) {
  return await fetch(`item/${id}`);
}
