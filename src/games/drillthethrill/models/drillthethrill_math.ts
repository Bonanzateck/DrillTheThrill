import BigNumber from "bignumber.js";
import { PlatformMath } from "../../../libs/platform/base/platform_math";

export class DrillTheThrillMath extends PlatformMath {

    cashMultipliers = [];
    cashMath = [];

    constructor(){
        super();

        this.defaultgrid = [
            [8, 12, 9],
            [6, 4, 2],
            [7, 7, 5],
            [4, 7, 2],
            [12, 11, 4]
        ];
        this.info = {
            betMultiplier: BigNumber(10),
            gridLayout:[3, 3, 3, 3, 3],
            wildSymbols:[0],
            skipEval:[10, 11],
            payLines:[],
            symbols:[
                { name:"wild", key:"WILD", id:0, payout:[] },
                { name:"HV1", key:"HIGH", id:1, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(10), this.bd(20), this.bd(50)] },
                { name:"HV2", key:"HIGH", id:2, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(6), this.bd(10), this.bd(25)] },
                { name:"HV3", key:"HIGH", id:3, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(6), this.bd(10), this.bd(25)] },
                { name:"HV4", key:"HIGH", id:4, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(2), this.bd(10), this.bd(20)] },
                { name:"LV1", key:"LOW", id:5, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(1), this.bd(2), this.bd(10)] },
                { name:"LV2", key:"LOW", id:6, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(1), this.bd(2), this.bd(10)] },
                { name:"LV3", key:"LOW", id:7, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(1), this.bd(2), this.bd(10)] },
                { name:"LV4", key:"LOW", id:8, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(1), this.bd(2), this.bd(10)] },
                { name:"LV5", key:"LOW", id:9, payout:[ this.bd(0), this.bd(0), this.bd(0), this.bd(1), this.bd(2), this.bd(10)] },
                { name:"Scatter", key:"SCATTER", id:10, payout:[] },
                { name:"Cash", key:"SCATTER", id:11, payout:[] },
            ]
        };

        this.buyBonus = [ { "id" : "buybonus", "cost" : 50 }];

        this.paidReels = [{
            id:"b1", weight: 6,
            reels: [
                [5, 5, 5, 4, 7, 7, 7, 9, 9, 9, 8, 8, 8, 2, 6, 6, 6, 3, 4, 9, 5, 5, 5, 1, 8, 2, 3, 9, 5, 5, 5, 7, 4, 8, 6, 9, 9, 9, 1, 1, 1, 7, 6, 5, 3, 8, 8, 8, 2, 9, 9, 9, 5, 7, 6, 6, 6, 8, 1, 5, 7, 7, 7, 9, 2, 2, 2, 6, 6, 6, 1, 9, 9, 9, 8, 8, 8, 5, 5, 5, 3, 3, 3, 6, 7, 7, 7, 4, 4, 4, 6, 6, 6, 7, 7, 7, 8, 8, 8],
                [5, 5, 5, 4, 10, 7, 9, 11, 8, 2, 5, 9, 3, 8, 11, 9, 5, 5, 5, 1, 7, 8, 2, 5, 3, 9, 10, 5, 5, 5, 8, 8, 10, 9, 9, 9, 8, 11, 11, 11, 7, 8, 5, 3, 8, 8, 8, 10, 6, 2, 9, 9, 9, 5, 6, 6, 6, 8, 5, 9, 2, 2, 2, 8, 5, 9, 9, 6, 11, 11, 11, 9, 9, 9, 8, 5, 6, 3, 3, 3, 8, 9, 5, 6, 6, 6, 8, 8, 8],
                [4, 7, 9, 8, 2, 6, 7, 9, 11, 11, 11, 11, 3, 6, 4, 9, 1, 7, 10, 8, 6, 3, 11, 11, 9, 7, 4, 6, 6, 6, 6, 1, 1, 1, 7, 6, 3, 10, 9, 9, 9, 7, 11, 6, 6, 6, 8, 1, 7, 7, 7, 11, 9, 5, 10, 6, 6, 6, 1, 7, 7, 7, 10, 5, 3, 3, 3, 6, 7, 7, 7, 4, 4, 4, 11, 9, 5, 6, 6, 6, 7, 7, 7],
                [5, 5, 5, 4, 7, 11, 9, 8, 2, 5, 10, 6, 7, 3, 8, 11, 4, 5, 5, 5, 1, 7, 8, 2, 6, 9, 10, 8, 5, 5, 5, 11, 11, 11, 7, 4, 8, 1, 1, 1, 7, 6, 5, 8, 8, 8, 11, 2, 7, 8, 1, 5, 7, 7, 7, 11, 11, 9, 8, 10, 5, 2, 2, 2, 1, 8, 10, 5, 7, 7, 7, 8, 4, 4, 4, 5, 7, 7, 7, 11, 8, 8, 8],
                [5, 5, 5, 4, 7, 9, 8, 2, 6, 7, 9, 3, 8, 6, 4, 9, 5, 5, 5, 1, 7, 8, 2, 6, 3, 9, 8, 5, 5, 5, 7, 4, 8, 6, 9, 9, 9, 1, 1, 1, 7, 6, 5, 3, 8, 8, 8, 2, 9, 9, 9, 5, 7, 6, 6, 6, 8, 1, 5, 7, 7, 7, 9, 2, 2, 2, 8, 5, 6, 6, 6, 1, 9, 9, 9, 8, 5, 3, 3, 3, 6, 7, 7, 7, 8, 4, 4, 4, 9, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
            ]
        }, {
            id:"b2", weight: 4,
            reels: [
                [6, 6, 6, 3, 8, 8, 8, 9, 9, 9, 7, 7, 7, 1, 5, 5, 5, 4, 3, 9, 6, 6, 6, 2, 7, 1, 4, 9, 6, 6, 6, 8, 3, 7, 5, 9, 9, 9, 2, 2, 2, 8, 5, 6, 4, 7, 7, 7, 1, 9, 9, 9, 6, 8, 5, 5, 5, 7, 2, 6, 8, 8, 8, 9, 1, 1, 1, 5, 5, 5, 2, 9, 9, 9, 7, 7, 7, 6, 6, 6, 4, 4, 4, 5, 8, 8, 8, 3, 3, 3, 5, 5, 5, 8, 8, 8, 7, 7, 7],
                [6, 6, 6, 3, 10, 8, 9, 11, 7, 1, 6, 9, 4, 7, 11, 9, 6, 6, 6, 2, 8, 7, 1, 6, 4, 9, 6, 6, 6, 7, 7, 10, 9, 9, 9, 7, 11, 11, 11, 8, 7, 6, 4, 7, 7, 7, 5, 1, 9, 9, 9, 10, 6, 5, 5, 5, 7, 6, 9, 1, 1, 1, 7, 6, 9, 9, 5, 11, 11, 11, 9, 9, 9, 7, 6, 5, 4, 4, 4, 7, 9, 6, 5, 5, 5, 7, 7, 7],
                [3, 8, 9, 7, 1, 5, 8, 9, 11, 11, 11, 11, 4, 5, 3, 9, 2, 8, 10, 7, 5, 4, 11, 11, 9, 8, 3, 5, 5, 5, 5, 2, 2, 2, 8, 5, 4, 10, 9, 9, 9, 8, 11, 5, 5, 5, 7, 2, 8, 8, 8, 11, 9, 6, 10, 5, 5, 5, 2, 8, 8, 8, 6, 4, 4, 4, 5, 8, 8, 8, 3, 3, 3, 11, 9, 6, 5, 5, 5, 8, 8, 8],
                [6, 6, 6, 3, 8, 11, 9, 7, 1, 6, 10, 5, 8, 4, 7, 11, 3, 6, 6, 6, 2, 8, 7, 1, 5, 9, 10, 7, 6, 6, 6, 11, 11, 11, 8, 3, 7, 2, 2, 2, 8, 5, 6, 7, 7, 7, 11, 1, 8, 7, 2, 6, 8, 8, 8, 11, 11, 9, 7, 10, 6, 1, 1, 1, 2, 7, 6, 8, 8, 8, 7, 3, 3, 3, 6, 8, 8, 8, 11, 7, 7, 7],
                [6, 6, 6, 3, 8, 9, 7, 1, 5, 8, 9, 4, 7, 5, 3, 9, 6, 6, 6, 2, 8, 7, 1, 5, 4, 9, 7, 6, 6, 6, 8, 3, 7, 5, 9, 9, 9, 2, 2, 2, 8, 5, 6, 4, 7, 7, 7, 1, 9, 9, 9, 6, 8, 5, 5, 5, 7, 2, 6, 8, 8, 8, 9, 1, 1, 1, 7, 6, 5, 5, 5, 2, 9, 9, 9, 7, 6, 4, 4, 4, 5, 8, 8, 8, 7, 3, 3, 3, 9, 6, 5, 5, 5, 8, 8, 8, 7, 7, 7]
            ]
        }];

        this.freeReels = [{
            id:"f1", weight: 45,
            reels: [
                [5, 5, 5, 4, 7, 7, 7, 9, 9, 9, 8, 8, 8, 2, 6, 6, 6, 3, 4, 9, 5, 5, 5, 1, 8, 2, 3, 9, 5, 5, 5, 7, 4, 8, 6, 9, 9, 9, 1, 1, 1, 7, 6, 5, 3, 8, 8, 8, 2, 9, 9, 9, 5, 7, 6, 6, 6, 8, 1, 5, 7, 7, 7, 9, 2, 2, 2, 6, 6, 6, 1, 9, 9, 9, 8, 8, 8, 5, 5, 5, 3, 3, 3, 6, 7, 7, 7, 4, 4, 4, 6, 6, 6, 7, 7, 7, 8, 8, 8],
                [5, 5, 5, 4, 10, 7, 9, 11, 8, 2, 5, 9, 3, 8, 11, 9, 5, 5, 5, 1, 7, 8, 2, 5, 3, 9, 5, 5, 5, 8, 8, 10, 9, 9, 9, 8, 11, 11, 11, 7, 8, 5, 3, 8, 8, 8, 10, 6, 2, 9, 9, 9, 5, 6, 6, 6, 8, 5, 9, 2, 2, 2, 8, 5, 9, 9, 6, 11, 11, 11, 9, 9, 9, 8, 5, 6, 3, 3, 3, 8, 9, 5, 6, 6, 6, 8, 8, 8],
                [4, 7, 9, 8, 2, 6, 7, 9, 11, 11, 11, 11, 3, 6, 4, 9, 1, 7, 10, 8, 6, 3, 11, 11, 9, 7, 4, 6, 6, 6, 6, 1, 1, 1, 7, 6, 3, 10, 9, 9, 9, 7, 11, 6, 6, 6, 8, 1, 7, 7, 7, 11, 9, 5, 10, 6, 6, 6, 1, 7, 7, 7, 5, 3, 3, 3, 6, 7, 7, 7, 4, 4, 4, 11, 9, 5, 6, 6, 6, 7, 7, 7],
                [5, 5, 5, 4, 7, 11, 9, 8, 2, 5, 10, 6, 7, 3, 8, 11, 4, 5, 5, 5, 1, 7, 8, 2, 6, 9, 10, 8, 5, 5, 5, 11, 11, 11, 7, 4, 8, 1, 1, 1, 7, 6, 5, 8, 8, 8, 11, 2, 7, 8, 1, 5, 7, 7, 7, 11, 11, 9, 8, 10, 5, 2, 2, 2, 1, 8, 5, 7, 7, 7, 8, 4, 4, 4, 5, 7, 7, 7, 11, 8, 8, 8],
                [5, 5, 5, 4, 7, 9, 8, 2, 6, 7, 9, 3, 8, 6, 4, 9, 5, 5, 5, 1, 7, 8, 2, 6, 3, 9, 8, 5, 5, 5, 7, 4, 8, 6, 9, 9, 9, 1, 1, 1, 7, 6, 5, 3, 8, 8, 8, 2, 9, 9, 9, 5, 7, 6, 6, 6, 8, 1, 5, 7, 7, 7, 9, 2, 2, 2, 8, 5, 6, 6, 6, 1, 9, 9, 9, 8, 5, 3, 3, 3, 6, 7, 7, 7, 8, 4, 4, 4, 9, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
            ]
        },{
            id:"f2", weight: 45,
            reels: [
                [6, 6, 6, 3, 8, 8, 8, 9, 9, 9, 7, 7, 7, 1, 5, 5, 5, 4, 3, 9, 6, 6, 6, 2, 7, 1, 4, 9, 6, 6, 6, 8, 3, 7, 5, 9, 9, 9, 2, 2, 2, 8, 5, 6, 4, 7, 7, 7, 1, 9, 9, 9, 6, 8, 5, 5, 5, 7, 2, 6, 8, 8, 8, 9, 1, 1, 1, 5, 5, 5, 2, 9, 9, 9, 7, 7, 7, 6, 6, 6, 4, 4, 4, 5, 8, 8, 8, 3, 3, 3, 5, 5, 5, 8, 8, 8, 7, 7, 7],
                [6, 6, 6, 3, 10, 8, 9, 11, 7, 1, 6, 9, 4, 7, 11, 9, 6, 6, 6, 2, 8, 7, 1, 6, 4, 9, 6, 6, 6, 7, 7, 10, 9, 9, 9, 7, 11, 11, 11, 8, 7, 6, 4, 7, 7, 7, 5, 1, 9, 9, 9, 6, 5, 5, 5, 7, 6, 9, 1, 1, 1, 7, 6, 9, 9, 5, 11, 11, 11, 9, 9, 9, 7, 6, 5, 4, 4, 4, 7, 9, 6, 5, 5, 5, 7, 7, 7],
                [3, 8, 9, 7, 1, 5, 8, 9, 11, 11, 11, 11, 4, 5, 3, 9, 2, 8, 10, 7, 5, 4, 11, 11, 9, 8, 3, 5, 5, 5, 5, 2, 2, 2, 8, 5, 4, 10, 9, 9, 9, 8, 11, 5, 5, 5, 7, 2, 8, 8, 8, 11, 9, 6, 10, 5, 5, 5, 2, 8, 8, 8, 6, 4, 4, 4, 5, 8, 8, 8, 3, 3, 3, 11, 9, 6, 5, 5, 5, 8, 8, 8],
                [6, 6, 6, 3, 8, 11, 9, 7, 1, 6, 10, 5, 8, 4, 7, 11, 3, 6, 6, 6, 2, 8, 7, 1, 5, 9, 10, 7, 6, 6, 6, 11, 11, 11, 8, 3, 7, 2, 2, 2, 8, 5, 6, 7, 7, 7, 11, 1, 8, 7, 2, 6, 8, 8, 8, 11, 11, 9, 7, 10, 6, 1, 1, 1, 2, 7, 6, 8, 8, 8, 7, 3, 3, 3, 6, 8, 8, 8, 11, 7, 7, 7],
                [6, 6, 6, 3, 8, 9, 7, 1, 5, 8, 9, 4, 7, 5, 3, 9, 6, 6, 6, 2, 8, 7, 1, 5, 4, 9, 7, 6, 6, 6, 8, 3, 7, 5, 9, 9, 9, 2, 2, 2, 8, 5, 6, 4, 7, 7, 7, 1, 9, 9, 9, 6, 8, 5, 5, 5, 7, 2, 6, 8, 8, 8, 9, 1, 1, 1, 7, 6, 5, 5, 5, 2, 9, 9, 9, 7, 6, 4, 4, 4, 5, 8, 8, 8, 7, 3, 3, 3, 9, 6, 5, 5, 5, 8, 8, 8, 7, 7, 7]
            ]
        },{
            id:"f3", weight: 10,
            reels: [
                [6, 6, 6, 1, 7, 7, 7, 9, 2, 2, 2, 8, 8, 3, 6, 6, 4, 9, 2, 5, 5, 5, 8, 1, 3, 7, 9, 4, 6, 9, 8, 8, 2, 5, 9, 6, 6, 6, 4, 9, 9, 9, 8, 3, 1, 1, 1, 7, 7, 7, 5, 9, 6, 8, 8, 8, 3, 3, 3, 7, 7, 7, 9, 4, 4, 4, 5, 8],
                [6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 8, 9, 7, 7, 7, 2, 2, 2, 8, 8, 3, 6, 6, 4, 9, 2, 5, 5, 5, 3, 7, 9, 4, 6, 9, 8, 8, 2, 5, 9, 6, 6, 6, 4, 8, 9, 9, 9, 3, 7, 7, 7, 5, 9, 6, 8, 8, 8, 3, 3, 3, 9, 7, 7, 7, 4, 4, 4, 5, 8],
                [6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 9, 7, 7, 7, 9, 5, 8, 3, 6, 6, 11, 11, 11, 4, 4, 4, 9, 2, 6, 3, 9, 7, 8, 4, 9, 11, 11, 2, 5, 6, 6, 6, 9, 9, 9, 4, 3, 7, 7, 7, 8, 9, 6, 3, 3, 3, 11, 7, 7, 7, 9, 4, 6, 6, 6, 9, 7, 7, 7, 9, 5, 8, 3, 6, 6, 4, 4, 4, 9, 2, 6, 3, 9, 7, 8, 4, 9, 11, 11, 2, 5, 6, 6, 6, 9, 9, 9, 4, 3, 7, 7, 7, 8, 9, 6, 3, 3, 3, 11, 7, 7, 7, 9, 4],
                [6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 9, 7, 2, 2, 2, 8, 8, 9, 3, 6, 6, 9, 11, 11, 11, 9, 8, 2, 5, 5, 5, 3, 9, 7, 4, 6, 11, 11, 8, 8, 9, 2, 5, 6, 6, 6, 8, 9, 9, 11, 3, 7, 5, 9, 6, 8, 8, 8, 3, 3, 3, 9, 4, 5, 8, 6, 6, 6, 9, 7, 2, 2, 2, 8, 8, 9, 3, 6, 6, 9, 9, 8, 2, 5, 5, 5, 3, 9, 7, 4, 6, 11, 11, 8, 8, 9, 2, 5, 6, 6, 6, 8, 9, 9, 11, 3, 7, 5, 9, 6, 8, 8, 8, 3, 3, 3, 9, 4, 5, 8],
                [6, 7, 7, 7, 2, 2, 2, 3, 8, 8, 9, 11, 11, 11, 4, 4, 4, 8, 9, 2, 3, 5, 5, 5, 7, 9, 4, 6, 8, 8, 2, 5, 8, 11, 11, 4, 7, 7, 7, 5, 11, 6, 8, 8, 8, 1, 1, 1, 7, 7, 7, 11, 11, 11, 4, 5, 8, 6, 7, 7, 7, 2, 2, 2, 3, 8, 8, 9, 4, 4, 4, 8, 9, 2, 3, 5, 5, 5, 7, 9, 4, 6, 8, 8, 2, 5, 8, 11, 11, 4, 7, 7, 7, 5, 11, 6, 8, 8, 8, 7, 7, 7, 4, 5, 8]
            ]
        } ]

        this.reSpinReels = [{
            id: "c1", weight: 0,
            symbols : [ 
                {symbol: 11, weight: 1 }, 
                {symbol: -1, weight: 13 }
            ]
        }];

        this.paidFeatureReels = [{
            id: "wild", weight: 0,
            reels: [[ 0, 0, 0, -1, -1]]
        }];

        this.conditions["FreespinTrigger"] = { id:"freespin", symbol:10, minCount:3 };

        this.actions["respin"] = { triggers: ["respin"], id: "respin", spins: 3 };
        this.actions["FreespinTrigger"] = { triggers: ["freespin"], id: "freespin", spins: 6 };
        this.actions["FreespinReTrigger"] = { triggers: ["retrigger"], id: "retrigger", spins: 6 };

        this.collection["ReelExpand"] = [
            { weight: 60, count : 5 },
            { weight: 20, count : 6 },
            { weight: 15, count : 7 },
            { weight: 5,  count : 8 }
        ]
        this.collection["BaseWilds"] = [
            { weight: 920, numlist: [] },
            { weight: 63, numlist: [0] },
            { weight: 12, numlist: [4] },
            { weight: 5, numlist: [0,4] }
        ]
        this.collection["FreeWilds"] = [
            { weight: 751, numlist: [0] },
            { weight: 249, numlist: [0,4] }
        ]


        this.cashMultipliers = [
            { 
                id:"set1", weight: 80, multiplier: [
                    { id:"XBET", weight: 50, multiplier: 1 },
                    { id:"XBET", weight: 30, multiplier: 2 },
                    { id:"XBET", weight: 20, multiplier: 3 }
                ] 
            }, { 
                id:"set2", weight: 15, multiplier: [
                    { id:"XBET", weight: 50, multiplier: 4 },
                    { id:"XBET", weight: 20, multiplier: 5 },
                    { id:"XBET", weight: 15, multiplier: 6 },
                    { id:"XBET", weight: 10, multiplier: 8 },
                    { id:"XBET", weight: 5,  multiplier: 10 }
                ] 
            }, { 
                id:"set3", weight: 5,  multiplier: [
                    { id:"XBET", weight: 40, multiplier: 12 },
                    { id:"XBET", weight: 30, multiplier: 15 },
                    { id:"XBET", weight: 10, multiplier: 20 },
                    { id:"XBET", weight: 5, multiplier: 25 },
                    { id:"XBET", weight: 11, multiplier: 30 },
                    { id:"XBET", weight: 4, multiplier: 50 },
                ] 
            }
        ]

        this.cashMath = [
            { id:"XBET", weight: 14997, multiplier: this.cashMultipliers, repeat: true },
            { id:"Big", weight: 2, multiplier: 500, repeat: false } ,
            { id:"Grand", weight: 1, multiplier: 1000, repeat: false } 
        ]

    }

}