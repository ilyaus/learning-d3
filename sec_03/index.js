const data = [
    {width: 200, height: 100, fill: 'purple'}
]
const svg = d3.select('svg');

const rect = svg.select('rect')
    .data(data)
    .attr('width', (d, i, n) => {
        //console.log(d);
        //console.log(i);
        console.log(n);

        return d.width;
    })
    .attr('height', function(d) {
        console.log(this);
        return d.height;
    })
    .attr('fill', d => {
        console.log(this);
        return d.fill;
    });