module.exports = {
  apps: [
    {
      name: "api",
      script: "index.js",
      instances: 2, 
      exec_mode: "cluster",
    },
    {
      name: "worker",
      script: "worker.js",
    },
  ],
};
