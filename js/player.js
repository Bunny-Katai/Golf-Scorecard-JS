export default class Player {
    name = '';
    outScores = [];
    inScores = [];

    constructor(name){
        this.name = name;
    }

    get name() {
        return this.name;
    }

    get outScores() {
        return this.outScores;
    }

    get inScores() {
        return this.inScores;
    }
}