var color = d3.scale.category10();

function Chart(id) {
  this.svg = d3.select('#' + id)
             .append('svg')
             .attr('id', 'c' + id);
  this.rect = this.svg.append('rect')
              .attr('fill', function(){
                return color(id)
              })
}

Chart.prototype.resize = function(width, height) {
  this.rect.attr({
    width: width,
    height: height
  })
}