const svg = d3.select('.canvas').append('svg')
  .attr('width', 600)
  .attr('height', 600);

const margin = {
  top: 20,
  right: 20,
  bottom: 100,
  left: 100
};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight =  600 - margin.bottom - margin.top;

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// transform xAxis to start from the bottom
const xAxisGroup = graph.append('g').attr('transform', `translate(0, ${graphHeight})`)
const yAxisGroup = graph.append('g');

// setup scales (only options that do not depend on data):
const y = d3.scaleLinear()
  .range([graphHeight, 0]);  // Scaled valued (range of y-values)

const x = d3.scaleBand()
  .range([0, 500])                      // range of x-axis
  .paddingInner(0.2)
  .paddingOuter(0.2);

// create axis
const xAxis = d3.axisBottom(x);
// Add untis to
const yAxis = d3.axisLeft(y)
  .ticks(3)  // How many ticks to show
  .tickFormat(d => d + " orders");  // Add units to ticks

xAxisGroup.selectAll('text')
  .attr('transform', 'rotate(-40)')  // rotate x labels
  .attr('text-anchor', 'end')        // rotate labels starting at the end
  .attr('fill', 'purple')

// update function
const update = (data) => {

  // setup scales (only options that do depend on data)
  y.domain([0, d3.max(data, d => d.orders)]);          // Actual expected values

  x.domain(data.map(item => item.name));  // array of name for each bar

  // join data to rects
  const rects = graph.selectAll('rect').data(data);

  // remove exit selection
  rects.exit().remove()

  // update current shapes in DOM
  rects
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.orders))
    .attr('width', x.bandwidth)
    .attr('height', d => graphHeight - y(d.orders))
    .attr('fill', 'blue');

  rects.enter().append('rect')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.orders))
    .attr('width', x.bandwidth)
    .attr('height', d => graphHeight - y(d.orders))
    .attr('fill', 'blue');
  
  // call axis
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
}

// get data from firestore
db.collection('dishes').get().then(response => {
  
  var data = [];
  response.docs.forEach(doc => {
    data.push(doc.data());
  });

  d3.interval(() => {
    data[0].orders += 50;
    // update(data);
  }, 1000);

  update(data);
});