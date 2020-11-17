$(document).ready(function () {

    // Read dot graph from service
    $.getJSON("./graph.json", function (data) {

        $("#data").val(data.graph);

        drawGraphic();



    });


});




function processAllRules() {
    emptyAutomata.trs = [];
    var arrayOfLines = $('#grammar').val().split('\n');
    $.each(arrayOfLines, function (index, item) {
        processRule(item)
    });

}

function processRule(rule) {
    console.log(rule);
    rule = (""+rule).trim();
    cmps = rule.split("=>");

    initialState = cmps[0]
    ind = cmps[1].split("|")
    $.each(ind,function(i,item){
        console.log(item);//aA
        console.log(item[0]);//a -> T   //$
        console.log(item[1]);


        //length == 0 (terminal or epsilon)  > 1 (both terminal + var "aA")
        //aA case sensitive
        //mark down rules that aren't valid/passing

        //gramatica -> automata

        //automata -> gramatica
        //a A->B   A=>aB|aC
        //a A->C  
        //$ A->F
 

        //if(emptyAutomata.trs.length > 0){
            currentTrsGroup = emptyAutomata.trs.find(e=> e && e.edge == item[0]);
            if(!currentTrsGroup){
                newOne = { "edge" : item[0] , "val" : initialState + "->" + item[1] };
                emptyAutomata.trs.push(newOne);
            }else{
                currentTrsGroup.val += " " +  initialState + "->" + item[1]
            }
        /*}else{
            newOne = { "edge" : item[0] , "val" : initialState + "->" + item[1] };
            emptyAutomata.trs.push(newOne);
        }*/

        
    });

    console.log(JSON.stringify(emptyAutomata));

 

}

var emptyAutomata = {
    "sts": [
        {}
    ],
    "trs" : [/*{
        edge : "",
        val : ""
    }*/]
}

var a = new node();
a.s = "a";


var node = {
    s,
    stateA,
    stateB,
}


function addState(name) {
    emptyAutomata.sts.push({ "name": name });
}

function drawGraphic(custom) {

    if (!custom)
        custom = $("#data").val();

    // render graph
    d3.select("#graphCanvas")
        .graphviz()
        .renderDot(custom);
}

function drawCustom(){

    data = templateData;
    transitions = "edge[label=\"$\"] S0->S ";
    currentEdge = "$";
    $.each(emptyAutomata.trs,function(i,item){
        if(currentEdge !== item.edge)
            transitions += "edge[label="+item.edge+"] ";

        transitions += item.val + " ";
    });

    console.log(transitions);

    drawGraphic(data.replace("$$transitions",transitions));
}


var templateData =  "digraph { rankdir=LR {node [margin=0 width=0.5 shape=circle]  S0 [shape=rarrow  fontcolor=blue style=filled ]  } $$transitions }";