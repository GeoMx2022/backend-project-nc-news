const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;").then((topics) => {
        const topicsData = topics.rows;
        if (!topicsData) {
            return Promise.reject({ status: 404, msg: "Not Found - Invalid Path"});
        }
        return topicsData;
    });
};