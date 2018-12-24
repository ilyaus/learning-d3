const svg = d3.select("svg");

d3.json('planets.json').then(data => {
    const circles = svg.selectAll('circle').data(data);

    // Add attr to circles already in the DOM
    // this needs to be done in case data is already in the DOM
    // - in case of update.
    circles
        .attr('cy', 200)
        .attr('cx', d => d.distance)
        .attr('r', d => d.radius)
        .attr('fill', d => d.fill);

    circles.enter().append('circle')
        .attr('cy', 200)
        .attr('cx', d => d.distance)
        .attr('r', d => d.radius)
        .attr('fill', d => d.fill);
});