const EPSILON = '$';
//const START = 'S';
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

    addEdge(source, symbol, destination) {
        let edge = new Edge(source, symbol, destination);
        this.transitions.push(edge);

        if (symbol === EPSILON) {
            this.epsilonTransitions.push(this.transitions.length - 1);
        }
    }

    hasTerminal(state) {
        return this.terminalStates.includes(state);
    }

    replaceEpsilonTransitions() {
        // TODO: 
        for (let index of this.epsilonTransitions) {
            let srcEpsEdge = this.transitions[index].src;
            let destEpsEdge = this.transitions[index].dest;
            for (let edge of this.transitions) {
                //if (edge.src.name === )
            }
        }
        for (let index of this.epsilonTransitions) {
            delete this.transitions[index]
        }
        this.transitions = this.transitions
            .filter(edge => edge !== undefined)
    }

    automataFromInputData() {
        // TODO:
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
        return this.rules[nonTerminal].includes(EPSILON);
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
            grammar.addProduction(edge.src, production);
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
