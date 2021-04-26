import express from 'express';
let pm2 = require('pm2');
const pm2Controller = express.Router();
const CONFIG = require('../config.json');

pm2Controller.route('/startBot').get(
    (req, res) => {
        pm2.connect(function (err) {
            if (err) {
                console.error(err);
                process.exit(2);
            }

            pm2.start({
                script: CONFIG.PM2_SCRIPT,         // Script to be run
                name: CONFIG.PM2_PROC_NAME,
                exec_mode: 'fork',        // Allows your app to be clustered
                instances: 1,                // Optional: Scales your app by 4
                max_memory_restart: '100M'   // Optional: Restarts your app if it reaches 100Mo
            }, function (err, apps) {
                res.status(200).json(
                    {
                        "app-name": apps[0].name,
                        "pm_id": apps[0].pm_id,
                        "status": apps[0].status
                    });
                pm2.disconnect();   // Disconnects from PM2
                if (err) throw err
            });
        });
    }
);

pm2Controller.route('/stopBot').get(
    (req, res) => {
        pm2.connect(function (err) {
            if (err) {
                console.error(err);
                process.exit(2);
            }

            pm2.stop(CONFIG.PM2_PROC_NAME, (err, proc) => {
                res.status(200).json({
                    "name": proc[0].name,
                    "pm_id": proc[0].pm_id,
                    "status": proc[0].status
                });
                pm2.disconnect()
            })

        });
    }
);

pm2Controller.route('/botStatus').get(
    (req, res) => {
        let procList;
        pm2.connect(function (err) {
            if (err) {
                console.error(err);
                process.exit(2);
            }

            pm2.list((err, list) => {
                console.log(err, list)
                res.status(200).json({
                    "pid": list[0].pid,
                    "name": list[0].name,
                    "status": list[0].pm2_env.status,
                    "pm_id": list[0].pm_id,
                    "memory": list[0].monit.memory,
                    "cpu": list[0].monit.cpu
                });
                pm2.disconnect();
            })

        });
    }
);

export default pm2Controller;