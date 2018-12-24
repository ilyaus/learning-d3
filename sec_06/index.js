

const update = (data) => {
  // 1. update scales if they rely on data
  y.domain([0, d3.max(data, d => d.orders)]);

  // 2. join updated data to elements
  const rect = graph.selectAll('rect').data(data);

  // 3. remove unwanted (if any) shapes using the exit select
  rects.exit().remove();

  // 4. update current shapes in the DOM
  rects.attr(...etc);

  // 5. append the enter selection to the DOM
  rects.enter().append('rect').attr(...etc);
};