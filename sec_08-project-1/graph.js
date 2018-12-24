// Setup dimentions
const dims = {
  height: 300,
  width: 300,
  radius: 150
}
const center = {
  x: (dims.width / 2) + 5,
  y: (dims.height / 2) + 5
}

const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', dims.width + 150)
  .attr('height', dims.height + 150);

const graph = svg.append('g')
  .attr('transform', `translate(${center.x}, ${center.y})`);

const legendGroup = svg.append('g')
  .attr('transform', `translate(${dims.width + 40}, 10)`);

const tip = d3.tip()
  .attr('class', 'tip card')
  .html(d => { 
    let content = `<div class="name">${d.data.name}</div>`;
    content += `<div class="cost">${d.data.cost}</div>`;
    content += `<div class="delete">Click Slice to Delete</div>`;

    return content;
  });

graph.call(tip);

const pie = d3.pie()
  .sort(null)
  .value(d => d.cost);

/*
const angles = pie([
    {name: 'rent', cost: 500},
    {name: 'bills', cost: 300},
    {name: 'gaming', cost: 200}
])
*/

//  console.log(angles);


const arcPath = d3.arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2);

// console.log(arcPath(angles[0])

const colour = d3.scaleOrdinal(d3['schemeSet3'])

const legend = d3.legendColor()
  .shape('circle')
  .shapeRadius(7)
  .shapePadding(10)
  .scale(colour);

const update = (data) => {
  console.log(data);

  // update colour scale domain
  colour.domain(data.map(d => d.name));

  // update and call legend
  legendGroup.call(legend);
  legendGroup.selectAll('text')
    .attr('fill', 'white');

  // join pie data to path elements
  const paths = graph.selectAll('path')
    .data(pie(data))

  console.log(paths.enter());

  paths.exit()
    .transition().duration(750)
      .attrTween("d", arcTweenExit)
      .remove();

  // Don't need to update any attributes except 'd'
  paths
    .attr('d', d => arcPath(d))
    .transition().duration(750)
      .attrTween('d', arcTweenUpdate);

  // Data joined to path is pie data.
  paths.enter()
    .append('path')
      .attr('class', 'arc')
      // .attr('d', d => arcPath(d))  // not needed because d is defined in the tween
      .attr('stroke', "white")
      .attr('stroke-width', 3)
      .attr('fill', d => colour(d.data.name))
      .each(function(d){ this._current = d; })
      .transition().duration(750)
        .attrTween("d", arcTweenEnter);

  // add events:
  graph.selectAll('path')
    .on('mouseover', (d, i, n) => {
      tip.show(d, n[i]);
      handleMouseOver(d, i, n);
    })
    .on('mouseout', (d, i, n) => {
      tip.hide();
      handleMouseOut(d, i, n);
    })
    .on('click', handleClick);
};

// Data array and firestore
var data = [];

db.collection('expenses').onSnapshot(res => {
  res.docChanges().forEach(change => {
    const doc =  { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex(item => item.id == doc.id);
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});

// Tween when adding item
const arcTweenEnter = (d) => {
  var i = d3.interpolate(d.endAngle, d.startAngle);

  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  }
}

// Tween when deleting new item
const arcTweenExit = (d) => {
  var i = d3.interpolate(d.startAngle, d.endAngle);

  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  }
}

// Tween when updating existing items
// Using 'function' so that 'this' keyword may point to current object.
function arcTweenUpdate(d) {
  console.log(this._current, d);

  // var startI = d3.interpolate(this._current.startAngle, d.startAngle);
  // var endI = d3.interpolate(this._current.endAngle, d.endAngle);

  var i = d3.interpolate(this._current, d);

  return function(t) {
    // d.startAngle = startI(t);
    // d.endAngle = endI(t);

    return arcPath(i(t));
  }  
}

// Event handles:
const handleMouseOver = (d, i, n) => {
  console.log(n[i]);

  d3.select(n[i])
    .transition('changeSliceFill').duration(300)  // give id to transition so that it does not interfere with other transitions
      .attr('fill', 'white');
}

const handleMouseOut = (d, i, n) => {
  console.log(n[i]);

  d3.select(n[i])
    .transition('changeSliceFill').duration(300)
      .attr('fill', colour(d.data.name));
}

const handleClick = (d) => {
  console.log(d);

  const id = d.data.id;
  db.collection('expenses').doc(id).delete();

}