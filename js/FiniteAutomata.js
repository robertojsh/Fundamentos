/* ------------------------------------------------------------
    FUNDAMENTOS DE LA COMPUTACION
    PROYECTO FINAL

    CONVERTIR UN AUTOMATA FINITO A GRAMATICA REGULAR Y VICEVERSA

    @author A00226860 GERARDO CÉSAR JUÁREZ LÓPEZ
    @author A00354886 ROBERTO JULIO SALDAÑA HERNÁNDEZ
    @author A00354890 SAÚL DAVID LÓPEZ DELGADO
------------------------------------------------------------ */

const EPSILON = '$';
const PRODUCES = ' => ';
const Z_STATE = 'Z';
const SEPARATOR = ",";
const RULE_SEPARATOR = " | "

class Edge {
    constructor(source, symbol, destination) {
        this.src = source; // char
        this.symbol = symbol; // char
        this.dest = destination; // char
    }
}

class FSA {
    constructor() {
      this.transitions = []; // Edges
      this.epsilonTransitions = []; // int
      this.terminalStates = []; // chars
      this.startSymbol = "";
    }

    addInitalState(initialState) {
        this.startSymbol = initialState;
    }

    getTransitionsBySrc(src){
        return this.transitions.filter(x => x.src == src);
    }

    addEdge(source, symbol, destination) {

        //epsilon o simbolo terminal
        if (!destination) {
            if (symbol == EPSILON){
                this.terminalStates.push(source);
            }else {
                this.addEdgeInternal(source, symbol, Z_STATE);
                this.terminalStates.push(Z_STATE);
            }

        } else
            this.addEdgeInternal(source, symbol, destination);

        if (symbol === EPSILON) {
            this.epsilonTransitions.push(this.transitions.length - 1);
        }
    }

    addEdgeInternal(source, symbol, destination){
        let edge = new Edge(source, symbol, destination);
        this.transitions.push(edge);
    }

    hasTerminal(state) {
        return this.terminalStates.includes(state);
    }

}

class Grammar {
    constructor() {
        this.rules = {}; // char:[string]
    }

    addProduction(nonTerminal, production) {
        if (!(nonTerminal in this.rules)) {
            this.rules[nonTerminal] = [];
        }
        this.rules[nonTerminal].push(production);
    }

    prodHasEpsilon(nonTerminal) {
        return this.hasProduction(nonTerminal,EPSILON)
    }

    hasProduction(nonTerminal,production){
        return this.rules[nonTerminal] && this.rules[nonTerminal].includes(production);
    }

    toString() {
        let grammar = "";
        for (let key in this.rules) {
            grammar = grammar.concat(
                key, PRODUCES, this.rules[key].join(RULE_SEPARATOR), '\n'
            );
        }

        return grammar;
    }

    isTerminalSymbol(symbol) {
        return symbol === symbol.toLowerCase() && symbol.lenght === 1;
    }

    isRegularGrammar() {
        for (let key in this.rules) {
            if (this.isTerminalSymbol(key)) {
                return false;
            }
            for (let prod of this.rules[key]) {
                if (prod.lenght > 2) {
                    return false;
                } else if (prod.lenght === 1 && !this.isTerminalSymbol(prod)) {
                    return false;
                } else {
                    let symbol = prod.charAt(0);
                    let destination = prod.charAt(1);
                    if (!this.isTerminalSymbol(symbol) && this.isTerminalSymbol(destination)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}

class GrammarAutomataConverter {
    constructor() {}

    grammarFromAutomata(fsa) {
        let grammar = new Grammar();

        for (let edge of fsa.transitions) {
            let production = edge.symbol + edge.dest;

            //avoids epsilon transitions
            if (edge.symbol === EPSILON) {
                let subTransitions = fsa.getTransitionsBySrc(edge.dest);
                subTransitions.forEach(item => {
                    if (item.symbol != EPSILON
                        && !grammar.hasProduction(edge.src,item.symbol + item.dest)) {
                        grammar.addProduction(edge.src, item.symbol + item.dest);
                    }

                    if (fsa.hasTerminal(item.dest) && !grammar.prodHasEpsilon(edge.src)) {
                        grammar.addProduction(edge.src, EPSILON);
                    }
                });
            } else if (!grammar.hasProduction(edge.src,production)){
                grammar.addProduction(edge.src, production);
            }

            if (fsa.hasTerminal(edge.src) && !grammar.prodHasEpsilon(edge.src)) {
                grammar.addProduction(edge.src, EPSILON);
            }
        }

        return grammar;
    }

    automataFromGrammar(grammar) {
        let fsa = new FSA();
        for (let key in grammar.rules) {
            for (let prod of grammar.rules[key]) {
                if (prod.lenght === 1) {
                    if (prod === EPSILON) {
                        fsa.terminalStates.push(key);
                    } else {
                        fsa.addEdge(key, prod, Z_STATE);
                    }
                } else {
                    let symbol = prod.charAt(0);
                    let destination = prod.charAt(1);
                    fsa.addEdge(key, symbol, destination)
                }
            }
        }
        return fsa;
    }

    dotgraphFromAutomata(fsa) {
        let dotgraph = 'digraph { rankdir=LR \n'
        for (let edge of fsa.transitions) {
            dotgraph = dotgraph.concat(
                edge.src,'->',edge.dest,'[label="', edge.symbol, '"];\n'
            );
        }
        
        for (let state of fsa.terminalStates) {
            dotgraph = dotgraph.concat(state, '[shape="doublecircle"];\n');
        }

        dotgraph = dotgraph.concat('qi->', fsa.startSymbol, '\n');
        dotgraph = dotgraph.concat('qi[shape="point"];\n');

        return dotgraph + '}'
    }
}
