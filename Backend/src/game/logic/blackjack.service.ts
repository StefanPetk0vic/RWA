import { Injectable } from '@nestjs/common';
import { Round } from 'src/round/entities/round.entity';


@Injectable()
export class BlackjackService {

    Types = ["♣", "♠", "♦", "♥"];
    CardNames = ["A", "J", "Q", "K"];
    GenerateDeck() {
        const deck: CardObject[] = [];
        for (let index = 2; index <= 10; index++) {
            for (let j = 0; j < this.Types.length; j++) {
                let Card = new CardObject(index.toString(), this.Types[j]);
                deck.push(Card);
            }
        }
        for (let ind = 0; ind < this.CardNames.length; ind++) {
            for (let j = 0; j < this.Types.length; j++) {
                let Card = new CardObject(this.CardNames[ind], this.Types[j]);
                deck.push(Card);
            }
        }
        return deck;
    }

    async playRound(round: Round): Promise<'win' | 'lose' | 'draw'> {

        const dealer = [];
        const player = [];


        return 'draw';
    }

}
class CardObject {
    private _name: string;
    private _type: string;

    constructor(name: string, type: string) {
        this._name = name;
        this._type = type;
    }

    get Name(): string {
        return this._name;
    }

    get Type(): string {
        return this._type;
    }

    set Name(newName: string) {
        this._name = newName;
    }

    set Type(newType: string) {
        this._type = newType;
    }
}
