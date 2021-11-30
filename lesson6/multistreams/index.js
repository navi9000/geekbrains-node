const worker_threads = require('worker_threads');

const passwordGenerator = (data) => {
  return new Promise((resolve, reject) => {
      const worker = new worker_threads.Worker('./worker.js', {
          workerData: data,
      });

      worker.on('message', resolve);
      worker.on('error', reject);
  });
};

(async () => {
    const passwordBytesSize = 4;
    const password = await passwordGenerator(passwordBytesSize);

    console.log(password);
})();
