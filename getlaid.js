function getlaid(id){

    var step = 5;

    var node_id = 0;
    var gen_node_id = function(){
        return node_id++;
    }

    var update = function(nodes){
        var root = d3.select(id);
        update_recursive(nodes, 0, root);
    };

    var update_recursive = function(nodes, depth, dom_element){

        var node = dom_element.selectAll('.node'+depth)
            .data(nodes, function(d,i) {
                d['index'] = i;
                return d.id;
            }).each(function(d){
                if(d.d == null){
                    d3.select(this).on('click', null);
                }
            }).classed('childnode', function(d){
                return d.children.length == 0;
            });

        var div_styling = {
            'top': function(d,i){
                if(d.split == 'horizontal'){
                    return d3.sum(_.take(nodes, i),function(n){ return n.size.value}) + '%';
                }
            },
            'left': function(d,i){
                if(d.split == 'vertical'){
                    return d3.sum(_.take(nodes, i),function(n){ return n.size.value}) + '%';
                }
            },
            'height': function(d,i){
                if(d.split == 'horizontal'){
                    return d.size.value + '%';
                }
            },
            'width': function(d,i){
                if(d.split == 'vertical'){
                    return d.size.value + '%';
                }
            }
        };

        node.style(div_styling)

        var node_enter = node.enter()
            .append('div')
            .attr('class', 'node' + depth + ' node')
            .classed('childnode', function(d){
                return d.children.length == 0;
            })
            .each(function(d){
                var self = d3.select(this);
                if(d.children.length == 0){
                    self.on('click', function(){
                        d3.selectAll('div').classed('selected', false);
                        self.classed('selected', true);
                    });
                    if(d.d == null){
                        var parent = self.append('div')
                            .attr('class', 'vis')
                        d.d = vis(parent);
                    }
                } else {

                }
            }).style(div_styling);

        node.exit().remove();

        node.each(function(d){
            update_recursive(d.children, depth+1, d3.select(this));
        });
    };

    var on_selected = function(fun){
        d3.select('.selected').each(function(child){
            d3.select(this.parentNode).each(function(parent){
                d3.select(this.parentNode).each(function(grandparent){
                    fun(child, parent, grandparent);
                });
            });
        });
        update(tree);
    };

    var resize_node = function(op_name){
        on_selected(function(selected, parent, grandparent){
            if(op_name == 'enlarge'){
                selected.size.value += step;
                parent.children[selected.index^1].size.value -= step;
            } else if(op_name == 'shrink'){
                selected.size.value -= step;
                parent.children[selected.index^1].size.value += step;
            } else { throw 'Invalid operation'; }
        });
    };

    var remove_node = function(){
        on_selected(function(selected, parent, grandparent){
            if(parent.children[selected.index^1].children == 0){
                grandparent.children[parent.index] =
                    {d: null, id: gen_id(), children: [],
                     split: parent.split,size: parent.size };
                parent.id = gen_id();
            } else {
                if(grandparent == undefined){
                    tree[0] = parent.children[selected.index^1];
                    tree[0].size = gen_id();
                    tree[0].children.forEach(function(d){
                        d.d = null;
                    })
                } else {
                    grandparent = parent.children[selected.index^1];
                    grandparent = gen_id();
                    grandparent.children.forEach(function(d){
                        d.d = null;
                    })
                }
            }
        });
    };

    var split_node = function(split){
        on_selected(function(selected, parent, grandparent){
            if(selected.d != null){
                selected.d = null;
                var d0 = {d: null, id: gen_id(), children: [],
                          split: split, size: {value: 50}};
                var d1 = {d: null, id: gen_id(), children: [],
                          split: split, size: {value: 50}};
                selected.children = [d0,d1];
                var sel = d3.select('.selected');
                sel.select('.vis').remove();
                sel.classed('selected', false);
            }
        });
    };

    d3.select('body').on('keypress', function() {
        var code = d3.event.keyCode;
        if(code == 114) { // r, remove node
            remove_node();
        } else if (code == 104) { // h, horizontal split
            split_node('horizontal');
        } else if (code == 118) { // v, vertical split
            split_node('vertical');
        } else if (code == 119) { // w, enlarge
            resize_node('enlarge');
        } else if (code == 115) { // s, shrink
            resize_node('shrink');
        }
    });

    return {
        update: update,
        gen_node_id: gen_node_id
    }
}
