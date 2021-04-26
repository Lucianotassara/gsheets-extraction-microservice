import express from 'express';
let pm2 = require('pm2');

const viewController = express.Router();
const CONFIG = require('../config.json');

viewController.route('/home').get(
    (req, res) => {
        let procList;
        pm2.connect(function (err) {
            if (err) {
                console.error(err);
                process.exit(2);
            }

            pm2.list((err, list) => {
                console.log(err, list);
                res.render("index", { links: list });
                // res.status(200).json({
                //     "pid": list[0].pid,
                //     "name": list[0].name,
                //     "status": list[0].pm2_env.status,
                //     "pm_id": list[0].pm_id,
                //     "memory": list[0].monit.memory,
                //     "cpu": list[0].monit.cpu
                // });
                pm2.disconnect();
            })

        });
    }
         
);



export default viewController;