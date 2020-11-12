$(document).ready(function () {

    // Read dot graph from service
    $.getJSON("./graph.json", function (data) {

        // render graph
        d3.select("#graphCanvas")
            .graphviz()
            .renderDot(data.graph);
    });
});


