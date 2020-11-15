const EPSILON = '$';
const INITIAL = 'S';
const PRODUCES = ' => ';

class State {
    constructor(name, isTerminal) {
        this.name = name; // char
        this.isTerminal = isTerminal; // bool
    }
}

class Edge {
    constructor(source, symbol, destination) {
        this.src = source; // State
        this.symbol = symbol; // char
        this.dest = destination; // State
    }
}

class FSA {
    constructor() {
      this.transitions = []; // Edges
    }

    addEdge(source, symbol, destination) {
        let edge = new Edge(source, symbol, destination);
        this.transitions.push(edge);
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

    toString() {
        let grammar = "";
        for (let key in this.rules) {
            grammar = grammar.concat(
                key, PRODUCES, this.rules[key].join('|'), '\n'
            );
        }

        return grammar;
    }

    isRegularGrammar() {
        // TODO:
        return true;
    }
}

class GrammarAutomataConverter {
    constructor() {}

    grammarFromAutomata(fsa) {
        let grammar = new Grammar();



        return grammar;
    }

    automataFromGrammar(grammar) {
        let fsa = new FSA();
        // TODO:
        return fsa;
    }

    dotgraphFromAutomata(fsa) {
        let dotgraph = 'digraph{'
        // TODO:
        return dotgraph + '}'
    }
}
