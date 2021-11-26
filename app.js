'use strict';

import express from "express";
import fetch from 'node-fetch';

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

const host = "https://goplay.co.id/";
const path = "/api/v1/live/event/";

const getEventUrl = (eventSlug) => {
    return new URL(`${path}${eventSlug}`, host);
}

const getEventDetail = async (eventSlug) => {
    return await fetch(getEventUrl(eventSlug), {
        method: "GET",
        headers: {
            Cookie: "gp_fgp=0;"
        }
    })
}

app.get('/:eventSlug', async (req, res) => {
    try {
        const response = await getEventDetail(req.params.eventSlug);
        const data = await response.json();
        const guardUrl = data?.data?.guard_url;
        if (guardUrl) {
            res.status(200).send(guardUrl).end();
        } else {
            res.status(404).end();
        }
    } catch (e) {
        res.status(500).end();
    }

});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});