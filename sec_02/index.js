const a = document.querySelector('div')

// wraps returned div in D3 wrapper
const b = d3.select('div')

console.log(a,b)

const canvas = d3.select(".canvas");
const svg = canvas.append('svg');

svg.attr('height', 600);
svg.attr('width', 600);

// move the whole group down
const group = svg.append('g')
    .attr('transform', 'translate(0,100)');

// append shapes to svg container:
group.append('rect')
    .attr('width', 200)
    .attr('height', 100)
    .attr('fill', 'blue')
    .attr('x', 20)
    .attr('y', 20);

group.append('circle')
    .attr('r', 20)
    .attr('cx', 300)
    .attr('cy', 100)
    .attr('fill', 'pink');

group.append('line')
    .attr('x1', 40)
    .attr('y1', 40)
    .attr('x2', 50)
    .attr('y2', 60)
    .attr('stroke', 'black');

svg.append('text')
    .attr('x', 20)
    .attr('y', 200)
    .attr('fill', 'green')
    .text("Hello Ninjas!")
    .style('font-family', 'arial');


