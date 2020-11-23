$(document).ready(function () {
    $("#iLanguage").change(function (value) {
        createTT();
    });

    $("#iStates").change(function (value) {
        createTT();
    });    
});


const CANVAS_1 = "#graphCanvas_1";
const CANVAS_2 = "#graphCanvas_2"

function grammar2Automata() {

    let rules = $('#grammar').val().split('\n');
    let fsa = new FSA();

    rules.forEach(rule => {
        fsa = processRule(fsa, rule.trim())
    });

    let converter = new GrammarAutomataConverter();
    let graph = converter.dotgraphFromAutomata(fsa)
    drawGraph(graph, CANVAS_1);
}

function automata2Grammar() {

    // read values from UI
    let transitions = $(".transitions");
    let acceptanceStates = $("#acceptanceStates").val();
    
    let fsa = new FSA();

    // 1. Add Acceptance States
    fsa = addAcceptanceStates(fsa, acceptanceStates);

    // 2. Add Transitions
    fsa = addTransitions(fsa, transitions);

    // 3. Instantiate Grammar Converter
    let converter = new GrammarAutomataConverter();

    // 4. get Graph (convert fsa objet to dot graph)
    let graph = converter.dotgraphFromAutomata(fsa);

    // 5. get Grammar (convert fsa objet to grammar rules)
    let grammar = converter.grammarFromAutomata(fsa);
        
    drawGraph(graph, CANVAS_2);
    drawGrammar(grammar.toString());
}

function processRule(fsa, rule) {
    // Split rule in 2 parts
    // rule[0] = 
    // rule[1] = aA | bB | $
    rule = rule.split(PRODUCES.trim());

    // alpha: variable
    let src = rule[0];

    // beta = aA | b | $
    //  aA : simbolo terminal seguido de una variable
    //   b : simbolo terminal
    //   $ : palabra vacia
    let part = rule[1].split(RULE_SEPARATOR); 

    part.forEach(element => {
        let symbol = element[0];
        let dest = element[1];
        fsa.addEdge(src, symbol, dest);    
    });
    return fsa;
}

function addAcceptanceStates(fsa, acceptanceStates) {
    let states = acceptanceStates.split(SEPARATOR);
    states.forEach(state => {
        fsa.terminalStates.push(state);
    });
    return fsa;
}

function addTransitions(fsa, transitions) {
    transitions.each(function () {
        let src    = $(this).attr('data-src');
        let symbol = $(this).attr('data-symbol');;
        let dest   = $(this).val();

        fsa.addEdge(src, symbol, dest);
    });

    return fsa;
}

function drawGraph(graph, canvas) {
    d3.select(canvas).graphviz().renderDot(graph);
}

function drawGrammar(grammar) {
    $("#grammar_2").html(grammar);
}


function createTT() {

    // read inputs from UI
    let inputLanguage = $("#iLanguage").val().trim();
    let inputStates = $("#iStates").val().trim();

    if (isValidInput(inputLanguage) && isValidInput(inputStates)) {

        // split input
        let language = inputLanguage.split(",");
        let states = inputStates.split(",");
        
        // create table content
        let header = createTableHeader(language);
        let body = createTableBody(language, states);
        
        // read template
        let template = $("#templateTT").html().trim();
        
        // replace markers 
        template = template.replace("$t-head", header);
        template = template.replace("$t-body", body);    

        // draw table to UI
        $("#tableContainer").html(template);
        $("#draw-automata").show();

    } else {
        alert("verify yout inputs");
    }
}

function isValidInput(input) {
    return (input.length > 0 && input.charAt(0) != "," && input.charAt(input.length - 1) != ",")
}

function createTableHeader(language) {
    let header = "<tr><th scope='col'>@</th>"
    language.forEach(symbol => {
        header += "<th scope='col'>" + symbol + "</th>";
    });
    return header + ("</tr>");
}

function createTableBody(language, states) {        
    let body = "";
    states.forEach(state => {
        body += "<tr><th scope='row'>" + state + "</th>";
        language.forEach(symbol => {
            body += "<td>" + "<input type='text' width='70px' class='transitions form-control' data-src='" + state + "'" + "data-symbol='" + symbol + "'/>" + "</td>";
        });
        body += ("</tr>")   
    });        
    return body;
}



















































// // $(document).ready(function () {
// //     // Read dot graph from service
// //     $.getJSON("./graph.json", function (data) {
// //         $("#data").val(data.graph);
// //         drawGraphic();
// //     });
// // });

// var emptyAutomata = {
//     "sts": [
//         { "name" : "a"}
//     ],
//     "trs" : [/*{
//         edge : "",
//         val : ""
//     }*/]
// }

// const STATE_Z = "Z";
// const EPSILON = "$";


// function processAllRules() {
//     finalStates = "";
//     emptyAutomata.trs = [];
//     var arrayOfLines = $('#grammar').val().split('\n');
//     $.each(arrayOfLines, function (index, item) {
//         if (item.length > 0) {
//             processRule(item)
//         }
//     });
// }

// function processRule(rule) {
//     console.log(rule);
//     rule = ("" + rule).trim();
//     cmps = rule.split("=>");


//     initialState = cmps[0]
//     ind = cmps[1].split("|")    
//     $.each(ind, function (i, item) {

//         console.log(">" + item);

//         if (item.length == 1) {

//             if (item == EPSILON) {
//                 finalStates += initialState + ",";
//             } else {
//                 finalStates += STATE_Z + ",";
//                 currentTrsGroup = emptyAutomata.trs.find(e => e && e.edge == item);
//                 if (!currentTrsGroup) {
//                     newOne = { "edge": item[0], "val": initialState + "->" + STATE_Z };
//                     emptyAutomata.trs.push(newOne);
//                 } else {
//                     currentTrsGroup.val += " " + initialState + "->" + STATE_Z
//                 }
//             }


//         } if (item.length == 2) {

//             //console.log(item[0]);
//             //console.log(item[1]);

//             //if(emptyAutomata.trs.length > 0){
//             currentTrsGroup = emptyAutomata.trs.find(e => e && e.edge == item[0]);
//             if (!currentTrsGroup) {
//                 newOne = { "edge": item[0], "val": initialState + "->" + item[1] };
//                 emptyAutomata.trs.push(newOne);
//             } else {
//                 currentTrsGroup.val += " " + initialState + "->" + item[1]
//             }
//             /*}else{
//                 newOne = { "edge" : item[0] , "val" : initialState + "->" + item[1] };
//                 emptyAutomata.trs.push(newOne);
//             }*/

//         }
//     });

//     console.log(JSON.stringify(emptyAutomata));
// }



// // function addState(name) {
// //     emptyAutomata.sts.push({ "name": name });
// // }

// function drawGraphic(custom) {

//     if (!custom)
//         custom = $("#data").val();

//     // render graph
//     d3.select("#graphCanvas")
//         .graphviz()
//         .renderDot(custom);
// }

// function drawCustom(){

//     data = templateData;
//     transitions = "edge[label=\"$\"] S0->S ";
//     currentEdge = "$";
//     $.each(emptyAutomata.trs,function(i,item){
//         if(currentEdge !== item.edge)
//             transitions += "edge[label="+item.edge+"] ";

//         transitions += item.val + " ";
//     });

//     // final states
//     let sizeFS = finalStates.length;
//     if (finalStates.length > 0) {
//         if (finalStates[sizeFS-1] == ",") {
//             finalStates = finalStates.slice(0,-1) + " [shape=doublecircle]";
//             data = data.replace("$$finalStates", finalStates);
//             console.log(finalStates);
//         }
//     }

//     data = data.replace("$$transitions", transitions);    
//     console.log(data);
//     drawGraphic(data);
// }


// var templateData =  "digraph { rankdir=LR {node [margin=0 width=0.5 shape=circle] $$finalStates S0 [shape=rarrow  fontcolor=blue style=filled ] } $$transitions }";