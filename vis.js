function vis(parent){
    var counter = 0;
    var vis = parent.append('div').text(counter++);
    setInterval(function(){
        vis.text(counter++);
    }, 1000);
    return {

    }
}
