const data = [
    {width: 200, height: 100, fill: 'purple'},
    {width: 100, height: 60, fill: 'pink'},
    {width: 50, height: 30, fill: 'red'}
]
const svg = d3.select('svg');

const rect = svg.selectAll('rect')
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