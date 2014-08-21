var color = d3.scale.category10();

function Chart(id) {
  this.c = color(id);
  this.create(id);
}

Chart.prototype.create = function(id) {
  var self = this;
  this.svg = d3.select('#' + id)
             .append('svg')
             .attr('id', 'c' + id);

  this.svg.append('rect')
  .attr('fill', self.c);
}

Chart.prototype.resize = function(width, height) {
  this.svg.select('rect')
  .attr({
    width: width,
    height: height

  })
}