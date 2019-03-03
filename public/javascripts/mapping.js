/* eslint-env jquery, browser */
const data_values = [];

$(document).ready(() => {
    var items = [];
var json = $.getJSON('http://api.luftdaten.info/static/v2/data.24h.json', function(data){
    var counter = 0

    $.each(data, function(key, val){
        if ((val.location.longitude > -2) && (val.location.longitude < -1) && (val.location.latitude <= 55) && (val.location.latitude >= 52)){
            if(val.sensordatavalues[0].value_type == "P1"){
                items.push([key, val.location.latitude, val.location.longitude, val.sensordatavalues[0].value, val.sensordatavalues[1].value]);

            }
        }
        counter ++;
    });

    var mymap = L.map('mapid').setView([53.382, -1.47], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZGFtYmVtIiwiYSI6ImNqczgyZmZ3MzEzOTMzeXJuODFmbjRrbjYifQ.cerkLIWoRAz2aGASHP_VaQ'
    }).addTo(mymap);

    circles = []
    for (var i = 0; i < items.length; i++) {

        circles.push(L.circle([items[i][1], items[i][2]], {
            color: 'blue',
            fillColor: 'blue',
            fillOpacity: 0.2,
            radius: 225,
            p10: [items[i][3]],
            p2: [items[i][4]],
            choice_id: i
        }).addTo(mymap));
    }
    for (var i = 0; i < circles.length; i++) {
        circles[i].bindPopup("<h4><b>Past 24 Hour Average</b></h4><h4>pm10: "+items[i][3]+"</h4> <h4>pm2.5: "+items[i][4]+"</h4><p><a>What does this mean?</a></p>");
        data_values.push([items[i][0], items[i][1]]);
        circles[i].on('click', function(event) {
            circle_chosen = event.target.options.choice_id

            document.getElementById('details').innerHTML = "LAT: " + items[circle_chosen][1] + " LON: " + items[circle_chosen][2];
        })
    }


    var popup = L.popup()
        .setLatLng([53.382, -1.47])
        .setContent("<h4>Click on a circle to view sensor info</h4> <a>What does this mean?</a>")
        .openOn(mymap);

    // var marker = L.marker([53.382, -1.47]).addTo(mymap);
    // marker.bindTooltip("blahblah").openTooltip()

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["8am", "12am", "4pm", "8pm", "12pm"],
            datasets: [{
                label: 'CO2 Level (%)',
                data: [18, 19, 12, 13, 5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                ],
                borderWidth: 1
            },
                {
                    label:"National Average",
                    data: [17, 16, 10, 10, 1],
                    backgroundColor: [
                        'rgba(108, 219, 10, 0.5 )',
                    ],
                    borderColor: [
                        'rgba(108, 219, 10, 1)',
                    ],
                    borderWidth: 1
                },
                {
                    label:"WHO 24 Hour Guidelines PM2.5",
                    data: [25, 25, 25, 25, 25],
                    backgroundColor: [
                        'rgba(108, 219, 10, 0.5 )',
                    ],
                    borderColor: [
                        'rgba(108, 219, 10, 1)',
                    ],
                    borderWidth: 1
                }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

    var ctx = document.getElementById("myChart2").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["8am", "12am", "4pm", "8pm", "12pm"],
            datasets: [{
                label: 'CO2 Level (%)',
                data: [18, 19, 12, 13, 5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                ],
                borderWidth: 1
            },
                {
                    label:"National Average",
                    data: [17, 16, 10, 10, 1],
                    backgroundColor: [
                        'rgba(108, 219, 10, 0.5 )',
                    ],
                    borderColor: [
                        'rgba(108, 219, 10, 1)',
                    ],
                    borderWidth: 1
                },
                {
                    label:"WHO 24 Hour Guidelines PM10",
                    data: [50, 50, 50, 50, 50],
                    backgroundColor: [
                        'rgba(108, 219, 10, 0.5 )',
                    ],
                    borderColor: [
                        'rgba(108, 219, 10, 1)',
                    ],
                    borderWidth: 1
                }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

});
var yesterday = new Date(Date.now() - 864e5);

console.log(yesterday)
console.log(yesterday.getDay())
console.log(yesterday.getMonth())
console.log(yesterday.toDateString())
});
