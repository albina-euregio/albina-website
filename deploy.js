var fs = require("fs");
var path = require("path");
var node_ssh = require("node-ssh");
var ssh = new node_ssh();
let Client = require("ssh2-sftp-client");
let sftp = new Client();

sftp
  .connect({
    host: "data1.geo.univie.ac.at",
    port: 22,
    username: "karto",
    password: "karto"
  })
  .then(() => {
    return sftp.list("./../../var/www/html/projects");
  })
  .then(list => {
    console.log(list.map(l => l.name));
    sftp.fastPut("dist", "./../../var/www/html/projects/deploy-test");
  })
  .then(data => {
    console.log(data);
  });

/*
console.log(files);
*/
