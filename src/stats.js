/**
 * Chart handling
 * @module stats
 * @author Basile Pesin
 */

var utils = require('./utils.js')

var statsChart

/**
 * Calculate the stats based on the data from the query
 * @param data data from the query
 * @param startTime stats start from this time
 * @param endTime stats end on this time
 * @return the stats
 */
function calculateStats(data, startTime=new Date(), endTime=new Date()) {
    let timespan = Math.floor((endTime.getTime()-startTime.getTime())/1000)
    if(timespan<0) return {labels: [], data: []}

    labels = []
    chartData = []
    for(var i=0; i<timespan; i+=600) {
        let time = new Date(startTime.getTime()+i*1000)
        labels.push(time.toLocaleString().split(' ')[1].split(':').splice(0,2).join(':'))
        nb_repos = utils.numberOfRepos(data, startTime, time)
        chartData.push(Object.values(nb_repos).map(user => user['repo_count']).reduce((x, y) => x + y))
    }

    return {
        labels: labels,
        data: chartData
    }
}

/**
 * Create a Chart.js chart
 */
function createChart() {
    var ctx = document.getElementById('chart').getContext('2d')
    statsChart = new Chart(ctx, {
        type: 'line',
        options: {
            legend: {
                position: 'bottom'
            }
        },
        data: {
            labels: [],
            datasets: [{
                label: "Total number of repos created",
                backgroundColor: 'rgb(0, 255, 0, 0.2)',
                borderColor: 'rgb(0, 255, 0, 1)',
                data: []
            }]
        }
    })
}

function updateChart(labels, data) {
    statsChart.data.labels = labels
    statsChart.data.datasets.forEach(dataset => {
        dataset.data = data
    })
    statsChart.update()
}

module.exports = {
    createChart: createChart,
    calculateStats: calculateStats,
    updateChart: updateChart
}
