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

d3.json('menu.json').then(data => {
  // -------
  const min = d3.min(data, d => d.orders);
  const max = d3.max(data, d => d.orders);
  const extent = d3.extent(data, d => d.orders);
  // -------
  
  const y = d3.scaleLinear()
    .domain([0, max])          // Actual expected values
    .range([graphHeight, 0]);  // Scaled valued (range of y-values)

  const x = d3.scaleBand()
    .domain(data.map(item => item.name))  // array of name for each bar
    .range([0, 500])                      // range of x-axis
    .paddingInner(0.2)
    .paddingOuter(0.2);

  const rects = graph.selectAll('rect').data(data);
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

  const xAxis = d3.axisBottom(x);
  // Add untis to
  const yAxis = d3.axisLeft(y)
    .ticks(3)  // How many ticks to show
    .tickFormat(d => d + " orders");  // Add units to ticks

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  xAxisGroup.selectAll('text')
  .attr('transform', 'rotate(-40)')  // rotate x labels
  .attr('text-anchor', 'end')        // rotate labels starting at the end
  .attr('fill', 'purple')
});