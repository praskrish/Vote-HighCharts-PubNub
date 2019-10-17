var chart = Highcharts.chart('chart-container', { // Build the chart.
    colors: ['#660000', '#DDAABB', '#D02129'],
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'What\'s your favorite type of Superhero?'
    },
    tooltip: {
        pointFormat: '<b>{point.percentage:.1f}% - {point.y} Vote(s)</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    subtitle: {
        text: '* Refreshing page will reset chart.',
        floating: true,
        align: 'right',
        x: -10,
        verticalAlign: 'bottom',
        y: -75
    },
    series: [{
        name: 'Flavors',
        colorByPoint: true,
        data: [{
            name: 'Good',
            y: 1
        }, {
            name: 'Evil',
            y: 1
        }, {
            name: 'Neither :)',
            y: 1
        }]
    }]
});

var voteChannel = "ice_cream_flavor_votes"; // Channel for counting votes.

pubnub = new PubNub({ // Your PubNub keys here. Get them from https://dashboard.pubnub.com.
  publishKey : 'pub-c-d5e6d9df-24a6-4951-abfa-dbd6aabfdcee',
  subscribeKey : 'sub-c-d760e400-f0c0-11e9-ad72-8e6732c0d56b'
});

function publishVote(flavor) { // Publish a vote with PubNub.
    var publishConfig = {
        channel: voteChannel, 
        message: flavor // Send the flavor of the vote.
    };
    pubnub.publish(publishConfig, function(status, response) { // Publish message.
        console.log(status, response);
    });
};

pubnub.addListener({
    message: function(vote) {
        var chartData = chart.series[0].data[vote.message];
        chartData.update(chartData.y + 1); // Add vote.
    },
});

pubnub.subscribe({
    channels: [voteChannel] // Listen for votes.
});
