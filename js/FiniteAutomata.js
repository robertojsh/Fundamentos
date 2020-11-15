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
      this.epsilonTransitions = []; // int
    }

    addEdge(source, symbol, destination) {
        let edge = new Edge(source, symbol, destination);
        this.transitions.push(edge);

        if (symbol === EPSILON) {
            this.epsilonTransitions.push(this.transitions.length - 1);
        }
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

        for (let edge of fsa.transitions) {
            let production = edge.symbol + edge.dest.name;
            grammar.addProduction(edge.src.name, production);
            if (edge.src.isTerminal && !grammar.prodHasEpsilon(edge.src.name)) {
                grammar.addProduction(edge.src.name, EPSILON);
            }
        }

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
