//let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
//let req = new XMLHttpRequest
let values = [] //values from api will be here
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
.then(res => res.json())
.then(data => {
    values = data;
    console.log(values)
    drawCanvas()
    getScales()
    drawCircles()
    generateAxis()
})
.catch(error => console.error(error))

let xScale
let yScale

let width = 800
let height = 400
let padding = 60

let svg = d3.select('#graph')
let tooltip = d3.select('#tooltip')

const drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

const getScales = () => {
    // - and + 1 are to prevent the circles from beginning and ending exactly on the xScale start and end
    xScale = d3.scaleLinear()
        .domain([d3.min(values, item => {
            return item.Year
        }) - 1, d3.max(values, item => {
            return item.Year
        }) + 1])
        .range([padding, width - padding])

    yScale = d3.scaleTime()
        .domain([d3.min(values, item => {
            return new Date(item.Seconds * 1000) //new Date works with miliseconds so I convert seconds to miliseconds * 1000
        }), d3.max(values, item => {
            return new Date(item.Seconds * 1000)
        })])
        .range([padding, height - padding])
}

const drawCircles = () => {
    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 5)
        //this data-xvalue and data-yvalue are like data_name tags in HTML.
            //I'm already inside the array, Item reps each array obj. I'm using dot notation to access the specific prop of the obj
        .attr('data-xvalue', item => {
            return item.Year
        })
        .attr('data-yvalue', item => {
            return new Date(item.Seconds * 1000)
        })
        // correctly horizontally align each dot
        .attr('cx', item => {
            return xScale(item.Year)
        })
        // correctly vertically align each dot
        .attr('cy', item => {
            return yScale(new Date(item.Seconds * 1000))
        })
        .attr('fill', item => item.URL != '' ? "orange" : "blue")
        .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible')
            
            if(item['Doping'] != ""){
                tooltip.html(`${item.Name}: ${item.Nationality}</br>Year:${item.Year}, Time:${item.Time}</br></br>${item.Doping}`);

            }else{
                tooltip.html(`${item.Name}: ${item.Nationality}</br>Year:${item.Year}, Time:${item.Time}</br></br>No allegations`)
            }
            
            tooltip.attr('data-year', item.Year)
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
}

const generateAxis = () => {
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d')) // to remove commas btw d years. Rounds up nos.
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`)

    let yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%M:%S'))
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`)
}

/*req.open('GET', url, true)
req.onload = () => {
    values = JSON.parse(req.responseText)
    console.log(values)
    drawCanvas()
    getScales()
    drawCircles()
    generateAxis()
}
req.send()*/
