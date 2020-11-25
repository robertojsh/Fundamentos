/* ------------------------------------------------------------
    FUNDAMENTOS DE LA COMPUTACION
    PROYECTO FINAL

    CONVERTIR UN AUTOMATA FINITO A GRAMATICA REGULAR Y VICEVERSA

    @author A00226860 GERARDO CÉSAR JUÁREZ LÓPEZ
    @author A00354886 ROBERTO JULIO SALDAÑA HERNÁNDEZ
    @author A00354890 SAÚL DAVID LÓPEZ DELGADO
------------------------------------------------------------ */

const CANVAS_1 = "#graphCanvas_1";
const CANVAS_2 = "#graphCanvas_2"

function grammar2Automata() {

    // read values from UI
    let rules = $('#grammar').val().split('\n');

    // instantiate FSA object
    let fsa = new FSA();
    
    // process rules
    rules.forEach(rule => {
        fsa = processRule(fsa, rule.trim())
    });

    let graph = new GrammarAutomataConverter().dotgraphFromAutomata(fsa);
    
    drawGraph(graph, CANVAS_1);
}

function automata2Grammar() {

    // read values from UI
    let transitions = $(".transitions");
    let initialState = $("#initialState").val();
    let acceptanceStates = $("#acceptanceStates").val();
    
    // instantiate FSA object
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
    
    let simplifiedFSA = converter.automataFromGrammar(grammar);
    simplifiedFSA.addInitalState(initialState);
    simplifiedFSA = addAcceptanceStates(simplifiedFSA, acceptanceStates);

    let simplifiedGrammar = converter.dotgraphFromAutomata(simplifiedFSA);
    
        
    drawGraph(simplifiedGrammar, CANVAS_2);
    drawGrammar(grammar.toString());
}

function processRule(fsa, rule) {
    // Split rule in 2 parts
    // rule[0] = 
    // rule[1] = aA | bB | $
    rule = rule.split(PRODUCES.trim());

    // alpha: variable
    let src = rule[0];
    if(fsa.startSymbol === "")
        fsa.addInitalState(src);

    // beta = aA | b | $
    //  aA : simbolo terminal seguido de una variable
    //   b : simbolo terminal
    //   $ : palabra vacia
    let part = rule[1].split(RULE_SEPARATOR.trim()); 

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
        let symbol = $(this).attr('data-symbol');
        if(symbol === 'epsilon')
            symbol = EPSILON

        let dests   = $(this).val();
        let destinations = dests.split(",");

        for (let dest of destinations) {
            if (dest !== "" ) {
                if (isValidDest(dest)) {
                    fsa.addEdge(src, symbol, dest);
                } else {
                    alert("Estado invalido");
                    return null;
                }                
            }
        }
    });
    return fsa;
}

function isValidDest(dest) {
    let st = $("#iStates").val().trim();
    let idx = st.indexOf(dest);
    return idx >= 0     
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
    let initialState = $("#initialState").val().trim();

    if (isValidInput(inputLanguage) && isValidInput(inputStates)) {

        // split input
        let language = inputLanguage.split(",");
        let states = inputStates.split(",");
        let shiftStates = reorderStates(states, initialState);
        
        // create table content
        let header = createTableHeader(language);
        let body = createTableBody(language, shiftStates, initialState);
        
        // read template
        let template = $("#templateTT").html().trim();
        
        // replace markers 
        template = template.replace("$t-head", header);
        template = template.replace("$t-body", body);    

        // draw table to UI
        $("#tableContainer").html(template);
        $("#draw-automata").show();

        automata2Grammar();

    } else {
        alert("verify yout inputs");
    }
}

function reorderStates(states, initialState) {
    let temp = removeInitialState(states, initialState);
    temp.unshift(initialState);
    return temp
}

function removeInitialState(states, initialState) {
    return states.filter( function( e ) {
        return e !== initialState;
    });
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
            if(symbol === EPSILON)
                body += "<td>" + "<input type='text' width='70px' class='transitions form-control' oninput='javascript:automata2Grammar()' data-src='" + state + "'" + "data-symbol='epsilon'/>" + "</td>";
            else
                body += "<td>" + "<input type='text' width='70px' class='transitions form-control' oninput='javascript:automata2Grammar()' data-src='" + state + "'" + "data-symbol='" + symbol + "'/>" + "</td>";
        });
        body += ("</tr>")   
    });        
    return body;
}
