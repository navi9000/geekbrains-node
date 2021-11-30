const worker_threads = require('worker_threads');
const crypto = require('crypto');

const passwordBytesSize = worker_threads.workerData;
const password = crypto
    .randomBytes(passwordBytesSize)
    .toString('hex');

worker_threads.parentPort.postMessage(password);
