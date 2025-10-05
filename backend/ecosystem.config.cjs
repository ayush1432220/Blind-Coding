module.exports = {
  apps: [
    {
      name: "api",
      script: "index.js",
      instances: "max", 
      exec_mode: "cluster",
    },
    {
      name: "worker",
      script: "worker.js",
    },
  ],
};