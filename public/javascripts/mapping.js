/* eslint-env jquery, browser */
const data_values = [];

$(document).ready(() => {
    var items = [];


var json = $.getJSON('http://api.luftdaten.info/static/v2/data.24h.json', function(data){
    var counter = 0

    $.each(data, function(key, val){
        if ((val.location.longitude > -1.58) && (val.location.longitude < -1.34) && (val.location.latitude <= 53.468) && (val.location.latitude >= 53.29)){
            if(val.sensordatavalues[0].value_type == "P1"){
                items.push([key, val.location.latitude, val.location.longitude, val.sensordatavalues[0].value, val.sensordatavalues[1].value, val.sensor.id, val.sensor.sensor_type.name]);

            }
        }

        counter ++;
    });
    var mymap = L.map('mapid', {
        minZoom: 12
        // maxZoom: 10
    })
    mymap.setView([53.382, -1.47], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Sensor Data <a href="https://luftdaten.info/en/home-en/">Luftdaten</a> | Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZGFtYmVtIiwiYSI6ImNqczgyZmZ3MzEzOTMzeXJuODFmbjRrbjYifQ.cerkLIWoRAz2aGASHP_VaQ'
    }).addTo(mymap);
    console.log(items)
    circles = []
    for (var i = 0; i < items.length; i++) {
        console.log(items[i][3])
        if (items[i][3] >= 20 || items[i][4] >= 10){
            colour = '#FDE74C'
        }
        else if (items[i][3] >= 30 || items[i][4] >= 15){
            colour = '#FA7921'
        }
        else if (items[i][3] >= 50 || items[i][4] >= 25){
            colour = '#E55934'
        }
        else if (items[i][3] >= 70 || items[i][4] >= 35){
            colour = '#D62839'
        }
        else {
            colour ='#4392F1'
        }
        circles.push(L.circle([items[i][1], items[i][2]], {
            color: 'black',
            fillColor: colour,
            fillOpacity: 0.4,
            radius: 225,
            p10: [items[i][3]],
            p2: [items[i][4]],
            choice_id: i
        }).addTo(mymap));
    }
    for (var i = 0; i < circles.length; i++) {
        circles[i].bindPopup("<h4><b>Past 24 Hour Average</b></h4><h4>pm10: "+items[i][3]+"</h4> <h4>pm2.5: "+items[i][4]+"</h4><p></p>");
        data_values.push([items[i][0], items[i][1]]);
        circles[i].on('click', function(event) {
            circle_chosen = event.target.options.choice_id

        })
    }


    var popup = L.popup()
        .setLatLng([53.382, -1.47])
        .setContent("<b>Click on a circle to view sensor info</b>")
        .openOn(mymap);

    // var marker = L.marker([53.382, -1.47]).addTo(mymap);
    // marker.bindTooltip("blahblah").openTooltip()
    temp = []

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

    console.log("before")
    last7 = Array(7);
    $.each(items, function(key, val){
        temp = []
        $.each(last7, function(key2, val2){
            console.log(key)
            var date = new Date();
            date.setDate(date.getDate() - (key2 + 1));
            yesterdays_date = date.toJSON()
            correct_date = yesterdays_date.substring(0, 10)
            url = "http://archive.luftdaten.info/" + correct_date + "/" + correct_date + "_" + (val[6]).toLowerCase() + "_sensor_" + val[5] + ".csv"
            console.log(url)
            temp.push[date, url]
        });
    });
});


});
