const React = require('react');
const { createChart } = require('@mui/x-charts');
const { renderToStaticMarkup } = require('react-dom/server');
const cors = require('cors');

const corsHandler = cors({ origin: '*' });

const renderChart = (data) => {
    const chart = createChart(
        <BarChart data={data} width={600} height={300}>
            <BarSeries dataKey="completed" stackId="a" color="#8884d8" />
            <BarSeries dataKey="notCompleted" stackId="a" color="#82ca9d" />
        </BarChart>
    );

    const html = renderToStaticMarkup(
        <div>
            {chart}
        </div>
    );

    return html;
};

module.exports = (req, res) => {
    // Handle CORS
    corsHandler(req, res, async () => {
        const data = [
            { day: 'Monday', completed: 10, notCompleted: 5 },
            { day: 'Tuesday', completed: 8, notCompleted: 7 },
            { day: 'Wednesday', completed: 12, notCompleted: 3 },
            { day: 'Thursday', completed: 6, notCompleted: 9 },
            { day: 'Friday', completed: 15, notCompleted: 2 },
            { day: 'Saturday', completed: 9, notCompleted: 6 },
            { day: 'Sunday', completed: 11, notCompleted: 4 },
        ];

        const chartHTML = renderChart(data);

        res.setHeader('Content-Type', 'text/html');
        res.send(chartHTML);
    });
};