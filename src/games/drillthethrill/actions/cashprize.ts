import BigNumber from "bignumber.js";
import { IRandom } from "../../../libs/engine/generic/rng/random";
import { SlotFeaturesState, SlotSpinState, SlotSpinWinsState } from "../../../libs/engine/slots/models/slot_state_model";
import { Cloner } from "../../../libs/engine/slots/utils/cloner";
import { Grid } from "../../../libs/engine/slots/utils/grid";
import { RandomHelper } from "../../../libs/engine/slots/utils/random";
import { DrillTheThrillMath } from "../models/drillthethrill_math";
import { DrillTheThrillState } from "../models/drillthethrill_state";

export class CashPrize {

    static consecutiveCoinPrize( grid:number[][], state :DrillTheThrillState, stake : BigNumber): SlotFeaturesState {
        
        const coinWin : SlotFeaturesState = new SlotFeaturesState();
        coinWin.offsets = [];

        const reel1 = Grid.FindScatterOffsetsInReels( 11, [1], grid);
        if (reel1.length > 0) {
            coinWin.offsets = reel1;
            const reel2 = Grid.FindScatterOffsetsInReels( 11, [2], grid);
            if (reel2.length > 0) {
                coinWin.offsets.concat( reel2);
                const reel3 = Grid.FindScatterOffsetsInReels( 11, [3], grid);
                if (reel2.length > 0) {
                    coinWin.offsets.concat( reel2);
                }
            }
        }

        let multiplier = 0; 
        coinWin.offsets.forEach( offset => {
            const prize = state.cashPrizes.find( prize => prize.offset === offset );
            multiplier += prize.multiplier;
        } )

        coinWin.isActive = (coinWin.offsets.length > 0);
        coinWin.id = "bonus";
        coinWin.symbol = 11;
        coinWin.pay = stake.multipliedBy( BigNumber( multiplier)) ;

        return coinWin;

    }

    // static updateCoinPrizeMath( state :DrillTheThrillState, math :DrillTheThrillMath ){
    //     state.cashPrizes = [];
    // }

    static CalculateMultiplier( state: DrillTheThrillState, spin: SlotSpinState) {
        spin.multiplier = 0;
        state.cashPrizes.forEach( prize => {
            spin.multiplier += prize.multiplier;
        })
    }

    // static FullHouse( state: DrillTheThrillState) {
    //     state.cashPrizes.forEach( prize => {
    //         if ( prize.id.includes("XBET") ) {
    //             prize.multiplier *= 2;
    //         }
    //     })
    // }

    static CoinsMultiplier( rng :IRandom, grid: number[][], state :DrillTheThrillState, math: DrillTheThrillMath ) {

        const coinsOffsets = Grid.FindScatterOffsets( 11, grid);

        coinsOffsets.forEach( offset => {
            const isPresent :boolean = state.cashPrizes.some( prize => prize.offset === offset );
            if (isPresent) {
                return;
            }

            let awardedprize :any = RandomHelper.GetRandomFromList( rng, math.cashMath );
            while( state.awardedJackpots.includes( awardedprize.id ) ){
                awardedprize = RandomHelper.GetRandomFromList( rng, math.cashMath );
            }
            if ( awardedprize.repeat === false ) {
                state.awardedJackpots.push( awardedprize.id);
            }
            if ( isNaN(Number( awardedprize.multiplier)) ){
                const set: any = RandomHelper.GetRandomFromList( rng, awardedprize.multiplier);
                awardedprize = RandomHelper.GetRandomFromList( rng, set.multiplier);
            } 
    
            state.cashPrizes.push( { offset: offset, id: awardedprize.id, multiplier: awardedprize.multiplier} );
        } )

    }

}
