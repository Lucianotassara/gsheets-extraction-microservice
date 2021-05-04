import express from 'express';
let pm2 = require('pm2');

const viewController = express.Router();
const CONFIG = require('../config.json');

viewController.route('/bot').get(
    (req, res) => {
        let procList;
        pm2.connect(function (err) {
            if (err) {
                console.error(err);
                process.exit(2);
            }

            pm2.list((err, list) => {
                console.log(err, list);

                const proc = list.filter(ps => ps.name === CONFIG.PM2_PROC_NAME)

                res.render("index", { data: proc });
               
                pm2.disconnect();
            })

        });

    }
         
);



export default viewController;