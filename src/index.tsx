import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

declare global {
  interface Window { Ipfs: any; }
}


const runIpfsTests = async () => {
  // just some tests using the global ipfs object
  // need to move into utils

  const node = await window.Ipfs.create();

  const uploadResult = await node.add('Hello Terminal '+ Date.now());
  const hash = (await uploadResult.next()).value.path
  console.log('uploaded hash: ' + hash);

  const getResult = await node.get(hash);
  const response = await await getResult.next();
  const content = await response.value.content;
  const buffer = await content.next();
  console.log('got data: ', buffer.value.toString());
  
  await node.pin.add(hash);

  for await (const { cid, type } of node.pin.ls()) {
    console.log({ cid, type })
  }

  return 'done testing';
}

runIpfsTests().then(console.log);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
