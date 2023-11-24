var mouseclick = function (d,e, t) {
    document.getElementById("audiow0").currentTime = d.start;
    //todo: deselect bar
    // d3.select(d.target)
    //     .transition()
    //     .duration(500)
    //     .style("fill", 'blue')
    // d.target.setAttribute("fill", "red")
    //a.html('')
   // var widget = '#' + d.target.parentElement.parentElement.parentElement.id;

    createPoint(d, t[e].attributes.fill.nodeValue);
    //chargeradar(d.target.__data__.emotion, widget == '#widget1_1' ? 'Speaker 1' : 'Speaker 2');

    d3.selectAll('#widget0_1 rect').style('outline', 'rgb(247, 247, 247)')
    d3.select(t[e])
        // .transition()
        // .duration(500)
        .style("outline", '2px solid #595959');

  
    // d.target.setAttribute("fill", "thin solid red")
  //  if (widget == '#widget1_1') {
    //clica e muda por enquanto não, ideia é reproduzir tudo e ir seguindo
        //let source = document.getElementById('audioSrcw0');
        //source.src = 'audios/' + d.target.__data__.name;
        //source.parentElement.load();
        document.getElementById('transcrypt_w1').innerHTML = d.text;

        d3.select('#lblshowchart').html('selected sentence emotion (%)')
        if (d3.select("#widget3_1_0 svg"))
            d3.select("#widget3_1_0 svg").remove()
        loadSentenceBarsEmotion(d.emotion, "#widget3_1_0");
        if (d3.select("#widget3_3 svg"))
            d3.select("#widget3_3 svg").remove()
     //   chargeWordcloud(d, t[e].attributes.fill.nodeValue);

       
   /* } else {
        let source = document.getElementById('audioSrcw2');
        source.src = 'audios/' + d.target.__data__.name;
        source.parentElement.load();
        document.getElementById('transcrypt_w2').innerHTML = d.target.__data__.transcription;

        d3.select('#widget2_2 span').html('selected sentence emotion (%)')
        if (d3.select("#widget2_2 svg"))
            d3.select("#widget2_2 svg").remove()

        loadSentenceBarsEmotion(d.target.__data__.name, "#widget2_2");
    }*/
}

//-------------------------------widget0_1--------------------------------------
const margin0_1 = { top: 25, right: 20, bottom: 0, left: 110 },
    widthw0_1 = 900 - margin0_1.left - margin0_1.right,
    heightw0_1 = 150 - margin0_1.top - margin0_1.bottom;

const miniHeight = 20, //laneLength * 12 + 50,
    mainHeight = heightw0_1 - miniHeight +15;

d3.csv("https://raw.githubusercontent.com/LuanDopke/files/main/iemocap.csv").then(function (data) {
    var lanes = [];
    var items = [];
    data.forEach(value =>{
        lanes.push(value.speaker);
        //var time = {};
        value.lane = parseInt(value.speaker.split('_')[1]);
        value.ending_time =value.end* 1000;
        value.starting_time = value.start * 1000;
        value.id = items.length;
        value.emotion = value.disc_emo;
        items.push(value);
    })

   lanes = [...new Set(lanes)];
   var laneLength = lanes.length;

    var timeBegin = d3v4.min(items, function (d) {
        return d.starting_time;
    });
    var timeEnd = d3v4.max(items, function (d) {
        return d.ending_time;
    });

    //scales
    // for the mini axis
    var x = d3v4.scaleTime()
        .range([0, widthw0_1])
        .domain([0, timeEnd]);
    // for the top axis
    var xTop = d3v4.scaleTime()
        .range([0, widthw0_1])
        .domain([0, timeEnd]);
    // for the item squares
    // identical to xTop, except it is a scaleLinear, not a scaleTime.
    var x1 = d3v4.scaleLinear()
        .range([0, widthw0_1]);
    var y1 = d3v4.scaleLinear()
        .range([0, mainHeight])
        .domain([0, laneLength]);
    var y2 = d3v4.scaleLinear()
        .range([0, miniHeight])
        .domain([0, laneLength]);

    var xAxis = d3v4.axisBottom(x)//utcFormat("%M:%S");
        .ticks(d3v4.timeSecond.every(10))
        .tickFormat(d => d3v4.utcFormat("%M:%S")(d));

    /*var xAxisTop = d3v4.axisBottom(xTop)
        .ticks(d3v4.timeMonth)
        .tickFormat(d => d3v4.timeFormat("%Y-%m-%d")(d));*/

    var scaleFactor = (1 / (timeEnd - timeBegin)) * (widthw0_1);

    var chart = d3v4.select('#widget0_1')
        .append("svg")
        //  .attr("width", chartWidth)
        // .attr("height", chartHeight)
        //.attr("viewBox", "0 0 " + chartWidth + " " + chartHeight)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", `0 0 ${widthw0_1 + margin0_1.left + margin0_1.right} ${heightw0_1 + margin0_1.top + margin0_1.bottom}`)
        .append("g")
        .attr("class", "timelinechartg");

    chart.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", widthw0_1)
        .attr("height", mainHeight);

    var main = chart.append("g")
        .attr("transform", "translate(" + margin0_1.left + "," + (margin0_1.top) + ")")
        .attr("width", widthw0_1)
        .attr("height", mainHeight)
        .attr("class", "main");

    var mini = chart.append("g")
        .attr("transform", "translate(" + margin0_1.left + "," + 0 + ")")
        //   .attr("transform", "translate(" +  margin0_1.left + "," + (mainHeight + margin0_1.top) + ")")
        .attr("width", widthw0_1)
        .attr("height", miniHeight)
        .attr("class", "mini");

    var gX = chart.append("g")
        .attr("class", "base axis")
        .attr("transform", "translate(" + margin0_1.left + "," + 0 + ")")
        // .attr("transform", "translate(" +  margin0_1.left + "," + (mainHeight + miniHeight) + ")")
        .call(xAxis);

    gX.selectAll('.tick text');

    var div = d3v4.select("#widget0_1").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

  //  var defs = main.append('svg:defs');
    //main lanes and texts
    main.append("g")
        .attr("class", "core-chart")
        .selectAll(".laneLines")
        .data(items)
        .enter().append("line")
        .attr("x1", 0)
        .attr("y1", function (d) {
            return y1(d.lane);
        })
        .attr("x2", widthw0_1)
        .attr("y2", function (d) {
            return y1(d.lane);
        })
        .attr("stroke", "lightgray")

    main.append("g")
        .attr("class", "core-labels")
        .selectAll(".laneText")
        .data(lanes)
        .enter().append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", (-100))
        .attr("y", function (d, i) {
            return y1(i + .5);
        })
        .attr("dy", ".5ex")
        .attr("text-anchor", "start")
        .attr("class", "laneText");

    var itemRects = main.append("g")
        .attr("clip-path", "url(#clip)");

    var currentLine = main.append('line')
        .attr('class', "currentLine")
        .attr("clip-path", "url(#clip)");

    var brush = d3v4.brushX()
        .extent([
            [0, 0],
            [widthw0_1, miniHeight]
        ])
        .on("brush", brushed);

    var playline = main
        .append("line")
            .attr("x1", x1(0))
            .attr("x2", x1(0))
            .attr("y1", y1(0))
            .attr("y2", y1(laneLength))
            .attr("stroke", "#595959")
            .attr("stroke-dasharray", "5")
            .attr("stroke-width", "2");

    var gBrush = mini.append("g")
        .attr("class", "x brush")
        .call(brush)
        .call(brush.move, x.range());

 //corta
    gBrush
        .transition(d3v4.transition()
            .duration(750))
        .delay(500)
        .call(brush.move, [widthw0_1 * 0.0, widthw0_1 * 0.25]);

    function drawBrush(minExtent, maxExtent) {

        var visItems = items.filter(function (d) {
            return d.starting_time < maxExtent && d.ending_time > minExtent;
        });


        var toolTipDateFormat = d3v4.utcFormat("%M:%S");

        x1.domain([minExtent, maxExtent]);
        xTop.domain([minExtent, maxExtent]);
        //gXTop.call(xAxisTop);

        var now = Date.now();
        currentLine.attr("x1", x1(now)).attr("x2", x1(now)).attr("y1", 0).attr("y2", mainHeight);

        //update main item rects
        var rects = itemRects.selectAll("rect")
            .data(visItems, function (d) {
                return d.id;
            })
            .attr("x", function (d) {
                return x1(d.starting_time);
            })
            .attr("width", function (d) {
                return x1(d.ending_time) - x1(d.starting_time);
            });

        const hatch = (color)=> {
            main.append("defs")
                .append("pattern")
                .attr("id", "diagonalHatch" + color) // ID for the pattern
                .attr("patternUnits", "userSpaceOnUse")
                .attr("width", 8)
                .attr("height", 8)
                .append("path")
                .attr("d", "M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2")
                .attr("stroke", color)
                .attr("stroke-width", 5.5);
            return "url(#diagonalHatch"+color+")"
        }
        rects.enter().append("rect")
            .attr("class", function (d) {
                return "miniItem " + d.lane;
            })
            .style('fill', function (d) {
                let data =parseStringToArray(d.emotion)
                data.sort((a,b)  => (b.Score - a.Score))
                switch (data[0].Emotion) {
                    case "anger":
                        return (d.loud_voice == 'False') ? "#f9003f" : hatch('#f9003f');
                    case "happiness":
                        return (d.loud_voice == 'False') ? "orange" :  hatch('orange');
                    case 'disgust':
                        return (d.loud_voice == 'False') ? "#a0bf48" : hatch('#a0bf48');
                    case "sadness":
                        return (d.loud_voice == 'False') ? "#00b2ff" : hatch('#00b2ff');
                    case "fear":
                        return (d.loud_voice == 'False') ? "#ac3bff" : hatch('#ac3bff');
                    default:
                }
            })
            .attr("x", function (d) {
                return x1(d.starting_time);
            })
            .attr("y", function (d) {
                return y1(d.lane + 0.07);
            })
            .attr("width", function (d) {
                return x1(d.ending_time) - x1(d.starting_time);
            })
            .attr("height", function (d) {
                return y1(1 - 2 * 0.07);
            })
            .attr("fill", d => {
                   let data =parseStringToArray(d.emotion)
                   data.sort((a,b)  => (b.Score - a.Score))
                switch (data[0].Emotion) {
                    case 'neutral':
                        return "#b9b9b9";
                    case "anger":
                        return "#f9003f";
                    case "happiness":
                        return "orange";
                    case 'disgust':
                        return "#a0bf48";
                    case "sadness":
                        return "#00b2ff";
                    case "fear":
                        return "#ac3bff";
                    default:
                    // code block
                }
            })
            .on("mouseover", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", .8);
                div.html(d.loud_voice == 'True'? (toolTipDateFormat(d.starting_time) + ' - ' +  toolTipDateFormat(d.ending_time) + "<br>Loud Voice") :
                    ("Start Time " + toolTipDateFormat(d.starting_time) + "<br>" + "End Time " + toolTipDateFormat(d.ending_time)))
                    .style("left", (d3v4.event.pageX) + "px")
                    .style("top", (d3v4.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", mouseclick);

        rects.exit().remove();
        document.getElementById("audiow0").currentTime =     document.getElementById("audiow0").currentTime ;
    }


    function brushed() {
        var selection = d3v4.event.selection;
        var timeSelection = selection.map(x.invert, x);

        var minExtent = timeSelection[0];
        var maxExtent = timeSelection[1];

        drawBrush(minExtent, maxExtent);

    }

    const audio = document.getElementById("audiow0");
    audio.ontimeupdate = ()=>{
        let totaltime = timeEnd- timeBegin;
        let scala = widthw0_1 / totaltime; 
        if((audio.currentTime * 1000) >= xTop.domain()[1].getTime()){
       //     drawBrush(xTop.domain()[1],xTop.domain()[1].setTime(xTop.domain()[1].getTime() + xTop.domain()[1].getTime() - xTop.domain()[0].getTime()))

            gBrush
            .transition(d3v4.transition()
                .duration(750))
           // .delay(500)
            .call(brush.move, [(xTop.domain()[1].getTime()) * scala, (xTop.domain()[1].getTime() + (xTop.domain()[1].getTime() - xTop.domain()[0].getTime())) * scala]);
        } 
        
       // if(audio.currentTime*1000 >timeBegin) {
            playline.transition()
            .attr('x1', x1((audio.currentTime *1000)))
            .attr('x2',x1((audio.currentTime*1000)));
      //  }
        console.log(audio.currentTime*1000)
    }
})
//-------------------------------widget1_1--------------------------------------
const margin1_1 = { top: 20, right: 10, bottom: 0, left: 10 },
    widthw1_1 = 600 - margin1_1.left - margin1_1.right,
    heightw1_1 = 150 - margin1_1.top - margin1_1.bottom;

const svgw1_1 = d3.select("#widget1_1")
    .append("svg")
    //  .attr("width", widthw1_2 + margin1_2.left + margin1_2.right)
    // .attr("height", heightw1_2 + margin1_2.top + margin1_2.bottom)
    .attr("viewBox", `0 0 ${widthw1_1 + margin1_1.left + margin1_1.right} ${heightw1_1 + margin1_1.top + margin1_1.bottom}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("transform", `translate(${margin1_1.left},${margin1_1.top})`);

// Parse the Data
d3.csv("https://raw.githubusercontent.com/LuanDopke/files/main/output_header.csv").then(function (data) {

    data = data.filter(d => d.name.startsWith('SPEAKER_00'))
    data.sort((a, b) => {
        return parseInt(a.name.split('-')[1].split('.wav')[0]) - parseInt(b.name.split('-')[1].split('.wav')[0]);
    });

    // X axis
    const x = d3.scaleBand()
        .range([0, widthw1_1])
        .domain(data.map(d => d.name))
        .padding(0.2);


    const y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.transcription.length })])
        .range([heightw1_1, 0]);
    //  svgw1_1.append("g")
    //   .call(d3.axisLeft(y));

    // Bars
    svgw1_1.selectAll("mybar")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.name))
        .attr("width", x.bandwidth())
        .attr("fill", d => {
            let data = JSON.parse(d.emotion.replaceAll(';', ','));
            switch (data[0].label) {
                case 'neu':
                    return "#b9b9b9";
                case 'ang':
                    return "#f9003f";
                case 'hap':
                    return "orange";
                case 'disgust':
                    return "#a0bf48";
                case 'sad':
                    return "#00b2ff";
                default:
                // code block
            }
        })

        .on("click", mouseclick)
        // no bar at the beginning thus:
        .attr("height", d => heightw1_1 - y(0)) // always equal to 0
        .attr("y", d => y(0))

    // Animation
    svgw1_1.selectAll("rect")
        .transition()
        .duration(300)
        .attr("y", d => y(d.transcription.length))
        .attr("height", d => heightw1_1 - y(d.transcription.length))
        .delay((d, i) => { return i * 100 })

})
//-------------------------------widget3_1--------------------------------------
var margin = { top: 20, right: 20, bottom: 0, left: 50 },
    width = 600 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;
var padding = 30;
height = 270
// create an svg container
var vis = d3v3.select("#widget3_1")
    .append("svg:svg")
    .attr("viewBox", `0 0 ${270} ${270}`)
    .attr("preserveAspectRatio", "xMinYMin meet")

var xScale = d3v3.scale.linear().domain([1, -1]).range([height - padding, padding]);
var yScale = d3v3.scale.linear().domain([-1, 1]).range([height - padding, padding]);

// define the y axis
var yAxis = d3v3.svg.axis()
    .orient("left")
    .scale(yScale);

// define the y axis
var xAxis = d3v3.svg.axis()
    .orient("bottom")
    .scale(xScale);

var xAxisPlot = vis.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height / 2) + ")")
    .call(xAxis.tickSize(-height, 0, 0));

var yAxisPlot = vis.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + (height / 2) + ",0)")
    .call(yAxis.tickSize(-height, 0, 0));


xAxisPlot.selectAll(".tick line")
    .attr("y1", (height - (2 * padding)) / 2 * -1)
    .attr("y2", (height - (2 * padding)) / 2 * 1);

yAxisPlot.selectAll(".tick line")
    .attr("x1", (height - (2 * padding)) / 2 * -1)
    .attr("x2", (height - (2 * padding)) / 2 * 1);

// Adicionar rótulos
vis.append("text")
    .attr("x", height + 115)
    .attr("y", padding - 20)
    .attr("text-anchor", "end")
    .attr("transform", "rotate(90, " + (height - padding) + ", " + (padding - 10) + ")")
    .text("Arousal");

vis.append("text")
    .attr("x", height - 165)
    .attr("y", padding - 10)
    .attr("text-anchor", "start")
    .text("Valence");

//-------------------------------widget3_2--------------------------------------
//https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
let features = ["happiness", "anger", "sadness", "neutral"];

let widthw3_2 = 250;
let heightw3_2 = 250;
let svgw3_2 = d3.select("#widget3_2").append("svg")
    .attr("viewBox", `0 0 ${widthw3_2} ${heightw3_2}`)
    .attr("preserveAspectRatio", "xMinYMin meet")

let radialScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 90]);
let ticks = [2, 4, 6, 8, 10];

svgw3_2.selectAll("circle")
    .data(ticks)
    .join(
        enter => enter.append("circle")
            .attr("cx", widthw3_2 / 2)
            .attr("cy", heightw3_2 / 2)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("r", d => radialScale(d))
    );

let featureData = features.map((f, i) => {
    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    return {
        "name": f,
        "angle": angle,
        "line_coord": angleToCoordinate(angle, 10),
        "label_coord": angleToCoordinate(angle, 10.5)
    };
});

// draw axis line
svgw3_2.selectAll("line")
    .data(featureData)
    .join(
        enter => enter.append("line")
            .attr("x1", widthw3_2 / 2)
            .attr("y1", heightw3_2 / 2)
            .attr("x2", d => d.line_coord.x)
            .attr("y2", d => d.line_coord.y)
            .attr("stroke", "black")
            .attr("stroke-opacity", 0.5)
    );

// draw axis label
svgw3_2.selectAll(".axislabel")
    .data(featureData)
    .join(
        enter => enter.append("text")
            .attr("x", d => {
                if (d.name == 'happiness')
                    return d.label_coord.x - 35;
                else if ((d.name == 'sadness'))
                    return d.label_coord.x - 25;
                else
                    return d.label_coord.x;
            })
            .attr("y", d => {
                if (d.name == 'happiness')
                    return d.label_coord.y - 3;
                else if ((d.name == 'sadness'))
                    return d.label_coord.y + 12;
                else
                    return d.label_coord.y;
            })
            .text(d => d.name)
            .attr("transform", d => {
                if (d.name == 'anger')
                    return "rotate(270, " + (38) + ", " + (138) + ")";
                else if ((d.name == 'neutral'))
                    return "rotate(90, " + (235) + ", " + (115) + ")";
                else
                    return "rotate(0)";
            })
    );


//-------------------------------widget3_3--------------------------------------
var marginw3_3 = { top: 10, right: 10, bottom: 10, left: 10 },
    widthw3_3 = 250 - marginw3_3.left - marginw3_3.right,
    heightw3_3 = 250 - marginw3_3.top - marginw3_3.bottom;

//-------------------------------widget3_4--------------------------------------
var marginw3_4 = { top: 10, right: 15, bottom: 30, left: 0 },
    widthw3_4 = 250 - marginw3_4.left - marginw3_4.right,
    heightw3_4 = 250 - marginw3_4.top - marginw3_4.bottom;

d3.csv("https://raw.githubusercontent.com/LuanDopke/files/main/iemocap.csv").then(function (data) {
       
  data = data.filter(d=> (d.speaker == 'SPEAKER_00' && d.topic != '[]'))
    .map(d => {
        let item = [];
        item.topic = d.topic;
        item.time = parseFloat(d.end) - parseFloat(d.start);
        return item;
    });

    makeLollipop(groupAndSum(data, 'topic', 'time'), "#widget3_4");
});


d3.csv("https://raw.githubusercontent.com/LuanDopke/files/main/iemocap.csv").then(function (data) {
       
  data = data.filter(d=> (d.speaker == 'SPEAKER_01' && d.topic != '[]'))
    .map(d => {
        let item = [];
        item.topic = d.topic;
        item.time = parseFloat(d.end) - parseFloat(d.start);
        return item;
    });

    makeLollipop(groupAndSum(data, 'topic', 'time'), "#widget3_5");
});

//-------------------------------widget4_1--------------------------------------

const marginw4_1 = {top: 10, right: 20, bottom: 30, left: 25},
    widthw4_1 = 260 - marginw4_1.left - marginw4_1.right,
    heightw4_1 = 260 - marginw4_1.top - marginw4_1.bottom;

   /* d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv").then( function(data2) {
console.log(data2.columns.slice(1))});*/

const svgw4_1 = d3.select("#widget3_6")
.append("svg")
.attr("viewBox", `0 0 ${widthw4_1 + marginw4_1.left + marginw4_1.right} ${heightw4_1 + marginw4_1.top + marginw4_1.bottom}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
.append("g")
    .attr("transform",`translate(${marginw4_1.left},${marginw4_1.top})`);

  d3.csv("https://raw.githubusercontent.com/LuanDopke/files/main/iemocap.csv").then( function(data) {

  var a =data//.filter(d=> (d.speaker == 'SPEAKER_01' && d.topic != '[]'))
  .map(d => {
      let item = [];
      item.speaker = d.speaker;
      item.time = parseFloat(d.end) - parseFloat(d.start);
      item.emo_class = d.emo_class;
      return item;
  }).sort();

  const groups = Object.entries(groupAndSum(a, 'speaker', 'time'))
  .map(d=> {
      d[1].time = d[1].time.toPrecision(3);
      return d[1];
  })
 
  // List of subgroups = header of the csv files = soil condition here
  const subgroups = ['anger', 'disgust', 'fear', 'happiness', 'sadness']//data.columns.slice(1)

  // Add X axis
  const x = d3.scaleBand()
      .domain(groups.map(d => d.speaker)) //groups
      .range([0, widthw4_1])
      .padding([0.2])
    svgw4_1.append("g")
    .attr("transform", `translate(0, ${heightw4_1})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(groups, d => +d.time)])
    .range([ heightw4_1, 0 ]);
    svgw4_1.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#f9003f','#a0bf48','#ac3bff','orange', '#00b2ff'])

  //stack the data? --> stack per subgroup
  const stackedData = d3.stack()
    .keys(subgroups)
    (groups.map(d=> {
        return Object.assign({group: d.speaker}, groupAndSum2(a.filter(e=> e.speaker == d.speaker), 'emo_class', 'time'));
    }));

  const tooltip = d3.select("#widget3_6")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Show the bars
  svgw4_1.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
        .attr("x", d =>  x(d.data.group))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())
       // .attr("stroke", "grey")
        .on("mouseover", function (event, d) {
            const subgroupName = d3.select(this.parentNode).datum().key;
            const subgroupValue = d.data[subgroupName];

            tooltip.transition()
                .duration(100)
                .style("opacity", .8);
                tooltip.html(subgroupName + "<br>" + "value: " + parseFloat(subgroupValue).toPrecision(3)  + 's')
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
      .on("mousemove",  function(event, d) {
            tooltip.style("transform","translateY(-55%)")
            .style("left",(event.x + 10)+"px")
            .style("top",(event.y)+"px")
      })
})

//----------------functions--------------//

function angleToCoordinate(angle, value) {
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return { "x": widthw3_2 / 2 + x, "y": heightw3_2 / 2 - y };
}

function getPathCoordinates(data_point) {
    let coordinates = [];
    for (var i = 0; i < features.length; i++) {
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
}

function loadSentenceBarsEmotion(data, widgetId) {
    var margin1_2 = { top: 20, right: 20, bottom: 30, left: 25 },
        widthw1_2 = 250 - margin1_2.left - margin1_2.right,
        heightw1_2 = 250 - margin1_2.top - margin1_2.bottom;

    const svgw1_2 = d3.select(widgetId)
        .append("svg")
        .attr("viewBox", `0 0 ${widthw1_2 + margin1_2.left + margin1_2.right} ${heightw1_2 + margin1_2.top + margin1_2.bottom}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .append("g")
        .attr("transform", `translate(${margin1_2.left},${margin1_2.top})`);

      //  data = data.find(d => d.name == cut)
        data =parseStringToArray(data)
       // data = JSON.parse(data.emotion.replaceAll(';', ','));

        // X axis
        const x = d3.scaleBand()
            .range([0, widthw1_2])
            .domain(data.map(d => d.Emotion))
            .padding(0.2);

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([heightw1_2, 0]);
        svgw1_2.append("g")
            .call(d3.axisLeft(y));

        svgw1_2.selectAll("mybar")
            .data(data)
            .join("rect")
            .attr("x", d => x(d.Emotion))
            .attr("width", x.bandwidth())
            .attr("fill", d => {
             switch (d.Emotion) {
                 case 'neutral':
                     return "#b9b9b9";
                 case "anger":
                     return "#f9003f";
                 case "happiness":
                     return "orange";
                 case 'disgust':
                     return "#a0bf48";
                 case "sadness":
                     return "#00b2ff";
                 case "fear":
                     return "#ac3bff";
                 default:
                 // code block
             }
            })
            // no bar at the beginning thus:
            .attr("height", d => heightw1_2 - y(0)) // always equal to 0
            .attr("y", d => y(0));

        // Animation
        svgw1_2.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y", d => y(d.Score))
            .attr("height", d => heightw1_2 - y(d.Score ))
            .delay((d, i) => { return i * 100 });
  //  })
}

function createPoint(data, fill) {
    let ids = data.lane;

    vis.selectAll('#circle' + ids).remove();
    vis.selectAll('#lblspeak' + ids).remove()

    vis.selectAll('#circle' + ids)
        .data('1')
        .enter()
        .append("circle")
        .attr("id", 'circle' + ids)
        .attr("cx", (d) =>  xScale(parseFloat(data.act)))//arousal
        .attr("cy", (d)  => yScale(parseFloat(data.val)))//valence
        .attr("r", 8)
        .style("fill", fill);

    vis.selectAll("text2")
        .data('1')
        .enter()
        .append("text")
        .attr("id", 'lblspeak' + ids)
        .attr("x", function (d) { return xScale(parseFloat(parseFloat(data.act))); })
        .attr("y", function (d) { return yScale(parseFloat(parseFloat(data.val))) - 10; })
        .text(function (d) { return "(Speaker " + data.lane + ")"; })  // Texto do rótulo
        .style("font-size", "9px");
}

function chargeWordcloud(data, fill){
    /*var a = data.filter(e => {
        let emot = JSON.parse(e.emotion.replaceAll(';', ','));
        return emot[0].label == 'hap'
    }).map(e => e.transcription).join();*/

    var svgw3_3 = d3.select("#widget3_3").append("svg")
    .attr("viewBox", `0 0 ${widthw3_3} ${heightw3_3}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("transform",
        "translate(" + marginw3_3.left + "," + marginw3_3.top + ")");

    let stopwords = new Set("going,i,yeah,me,my,myself,know,just,well,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall".split(","))

    var words = data.text.split(/[\s.]+/g)
        .map(w => w.replace(/^[“‘"\-—()\[\]{}]+/g, ""))
        .map(w => w.replace(/[;:.!?()\[\]{},"'’”\-—]+$/g, ""))
        .map(w => w.replace(/['’]s$/g, ""))
        .map(w => w.substring(0, 30))
        .map(w => w.toLowerCase())
        .filter(w => w && !stopwords.has(w))

    const uniqueElements = [...new Set(words)];

    const myWords = uniqueElements.map(function (element) {
        return {
            "word": element,
            "size": words.filter(el => el === element).length
        };
    });//.filter(el => el.size > 1);

    var drawClouds = words => {
        svgw3_3.append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return d.size; })
            .style("fill", fill)
            .attr("text-anchor", "middle")
            .style("font-family", "monospace") //Impact
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }
    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
        .size([widthw3_3, heightw3_3])
        .words(myWords.map(function (d) { return { text: d.word, size: d.size }; }))
        .padding(5)        //space between words
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .fontSize(function (d) { return (d.size +1) * 8; })      // font size of words
        .on("end", drawClouds);
    layout.start();
}

function chargeradar(data, speaker) {
    let data2 = [];
    var point = {}
    data = JSON.parse(data.replaceAll(';', ','));
    features.forEach(f => point[f] = data.find(e => e.label == f.substring(0, 3)).score * 10);
    data2.push(point);

    let id = speaker.split(' ')[1];
    svgw3_2.selectAll('#path' + id).remove();

    let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    svgw3_2.selectAll("path" + id)
        .data(data2)
        .join(
            enter => enter.append("path")
                .datum(d => getPathCoordinates(d))
                .attr("d", line)
                // .attr("stroke-width", 3)
                //   .attr("stroke", speaker == 'Speaker 1' ? "green" : "navy")
                .attr("fill", 'white')
                // .attr("stroke-opacity", 1)
                .attr("opacity", 0.3)
        )
        .attr("id", 'path' + id);


    svgw3_2.selectAll('#path' + id)
        .transition()
        .duration(1000)
        .attr("fill", speaker == 'Speaker 1' ? "green" : "navy")

        .delay((d, i) => { return i * 100 });
}

function parseStringToArray(inputString) {
    // Remove os colchetes e as aspas da string de entrada
    const cleanedString = inputString.replace(/[[\]']/g, "");
  
    // Use uma expressão regular para dividir a string em objetos
    const objectRegex = /{[^}]*}/g;
    const objectStrings = cleanedString.match(objectRegex);
  
    // Inicializa um array para armazenar os objetos resultantes
    const resultArray = [];
  
    // Loop sobre as strings de objeto
    for (const objectStr of objectStrings) {
      // Divide a string do objeto em propriedades usando a vírgula como delimitador
      const properties = objectStr.split(", ");
  
      // Inicializa um objeto vazio para armazenar as propriedades
      const object = {};
  
      // Loop sobre as propriedades e divide-as em chave e valor
      for (const prop of properties) {
        const [key, value] = prop.split(': ');
  
        // Se o valor tiver o símbolo '%', remova-o e converta em número
        object[key.replace('\{', '')] = value.includes('%') ? parseFloat(value) : value;
      }
  
      // Adicione o objeto ao resultado
      resultArray.push(object);
    }
  
    return resultArray;
  }
  
  function tabulate(data, columns, widget) {
    
      data = Object.entries(data)
      .map(d=> {
          d[1].time = d[1].time.toPrecision(3);
          return d[1];
      })
      .sort((a,b)  => (b.time - a.time))
      .slice(0,10);

      var table = d3.select(widget).append('table')
      var thead = table.append('thead')
      var	tbody = table.append('tbody');
  
      // append the header row
      thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
          .text(function (column) { return column; });
  
      // create a row for each object in the data
      var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');
  
      // create a cell in each row for each column
      var cells = rows.selectAll('td')
        .data(function (row) {
          return columns.map(function (column) {
            return {column: column, value: row[column]};
          });
        })
        .enter()
        .append('td')
          .text(function (d) { return d.value; });
  
    return table;
  }

  const groupAndSum = (array, property1, propertyToSum) => {
    const tmp = {};
    array.reduce((result, object) => {
        const group = object[property1];
        if (!tmp[group]) {
            tmp[group] = Object.assign({}, object);
            result.push(tmp[group]);
        } else {
            tmp[group][propertyToSum] += object[propertyToSum];
        }
        return result;
    }, []);
    return tmp;
};

const groupAndSum2 = (array, property1, propertyToSum) => {
    const tmp = {};
    array.reduce((result, object) => {
        const group = object[property1];
        if (!tmp[group]) {
            tmp[group] = object[propertyToSum];
            result.push(tmp[group]);
        } else {
            tmp[group] += object[propertyToSum];
        }
        return result;
    }, []);
    return tmp;
};

function makeLollipop(data, widget){
    data = Object.entries(data)
    .map(d=> {
        d[1].time = d[1].time.toPrecision(3);
        return d[1];
    })
    .sort((a,b)  => (b.time - a.time))
    .slice(0,10);

    marginw3_4.left =  d3.max(data,d => +d.topic.length) * 7;

    const svgw3_4 = d3.select(widget)
  .append("svg")
    .attr("viewBox", `0 0 ${widthw3_2} ${heightw3_2}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
  .append("g")
    .attr("transform", `translate(${marginw3_4.left}, ${marginw3_4.top})`);

    const x = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return +d.time })])
    .range([ 0, widthw3_4 - marginw3_4.left]);
    svgw3_4.append("g")
    .attr("transform", `translate(0, ${heightw3_4})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
  
  const y = d3.scaleBand()
    .range([ 0, heightw3_4 ])
    .domain(data.map(function(d) { return d.topic; }))
    .padding(1);
    svgw3_4.append("g")
    .call(d3.axisLeft(y))

    svgw3_4.selectAll("myline")
    .data(data)
    .join("line")
      .attr("x1", x(0))
      .attr("x2", x(0))
      .attr("y1", function(d) { return y(d.topic); })
      .attr("y2", function(d) { return y(d.topic); })
      .attr("stroke", "grey")
  
  // Circles
  svgw3_4.selectAll("mycircle")
        .data(data)
        .join("circle")
        .attr("cx", x(0))
        .attr("cy", function(d) { return y(d.topic); })
        .attr("r", "4")
        .style("fill", "#69b3a2")
        .attr("stroke", "black");

    svgw3_4.selectAll("circle")
    .transition()
    .duration(1500)
    .attr("cx", function(d) { return x(d.time); });

    svgw3_4.selectAll("line")
    .transition()
    .duration(1500)
    .attr("x1", function(d) { return x(d.time); });

}

 // const inputString = "[{'Emotion': 'anger', 'Score': '0.1%'}, {'Emotion': 'disgust', 'Score': '69.5%'}, {'Emotion': 'fear', 'Score': '8.2%'}, {'Emotion': 'happiness', 'Score': '4.9%'}, {'Emotion': 'sadness', 'Score': '17.2%'}]";
 
//drawBrush(timeBegin, timeEnd);

//console.log("mapppp", [0, 1].map(x1))

//gBrush.call(brush.move, [0, 1].map(x1))

//gBrush.call(brush.move, [0.3, 0.5].map(x1));

