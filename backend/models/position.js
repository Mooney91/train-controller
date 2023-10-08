const fetch = require('node-fetch');

const trainPosition = {
    getTrainPosition: function getTrainPosition(req, res) {
        const query = `
            <REQUEST>
                <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
                <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0">
                    <FILTER>
                        <EQ name="Train.OperationalTrainNumber" value="${req.query.train}" />
                    </FILTER>
                </QUERY>
            </REQUEST>`;

        fetch("https://api.trafikinfo.trafikverket.se/v2/data.json", {
            method: "POST",
            body: query,
            headers: { "Content-Type": "text/xml" }
        }).then(function(response) {
            return response.json();
        }).then(function(result) {
            const changedPosition = result.RESPONSE.RESULT[0].TrainPosition[0];
            const matchCoords = /(\d*\.\d+|\d+),?/g;
            const position = changedPosition.Position.WGS84.match(matchCoords)
                .map((t=>parseFloat(t))).reverse();
            const trainObject = {
                trainnumber: changedPosition.Train.OperationalTrainNumber,
                position: position,
                timestamp: changedPosition.TimeStamp,
                bearing: changedPosition.Bearing,
                status: !changedPosition.Deleted,
                speed: changedPosition.Speed,
            };
            return res.json({
                data: trainObject
            });
        });
    }
};

module.exports = trainPosition;