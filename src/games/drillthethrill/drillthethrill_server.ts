import BigNumber from "bignumber.js";
import { SlotFeaturesState, SlotSpinState } from "../../libs/engine/slots/models/slot_state_model";
import { RandomHelper } from "../../libs/engine/slots/utils/random";
import { ResponseModel } from "../../libs/platform/base/response_model";
import { BaseSlotGame } from "../../libs/platform/slots/base_slot_game";
import { PlayResponseModel } from "../../libs/platform/slots/play_response_model";
import { DrillTheThrillMath } from "./models/drillthethrill_math";
import { DrillTheThrillConfigResponseV2Model, DrillTheThrillResponseModel } from "./models/drillthethrill_response";
import { DrillTheThrillState } from "./models/drillthethrill_state";
import { CreateStops } from "../../libs/engine/slots/actions/create_stops";
import { CreateGrid } from "../../libs/engine/slots/actions/create_grid";
import { Grid } from "../../libs/engine/slots/utils/grid";
import { EvaluateWins } from "../../libs/engine/slots/actions/evaluate_wins";
import { CalculateWins } from "../../libs/engine/slots/actions/calculate_wins";
import { CashPrize } from "./actions/cashprize";
import { ScatterSymbolCount } from "../../libs/engine/slots/conditions/scatter_symbol_count";
import { Triggerer } from "../../libs/engine/slots/features/triggerer";
import { UpdateFeature } from "../../libs/engine/slots/features/update_feature";


export class GameServer extends BaseSlotGame {

    constructor(){
        super("Drill The Thrill", "0.1");
        this.math = new DrillTheThrillMath();
    }

    protected executeBaseSpin() {
        let state:SlotSpinState = new SlotSpinState(); 

        const wilds:any = RandomHelper.GetRandomFromList( this.rng, this.math.collection["BaseWilds"]);
        let gridLayout = this.math.info.gridLayout;
        if(wilds.numlist[0] == 0) {
            const expand:any = RandomHelper.GetRandomFromList( this.rng, this.math.collection["ReelExpand"]);
            gridLayout[1] = expand.count;
            gridLayout[2] = expand.count;
            gridLayout[3] = expand.count;
        }

        const selectedSet:any = RandomHelper.GetRandomFromList( this.rng, this.math.paidReels );
        state.reelId = selectedSet.id;
        state.stops = CreateStops.StandardStops(this.rng, selectedSet.reels, gridLayout );
        state.initialGrid = CreateGrid.StandardGrid( selectedSet.reels, state.stops);
        
        if(wilds.numlist.length > 0) {
            wilds.numlist.forEach( col => {
                const wildstops: number[][] = CreateStops.StandardStops(this.rng, this.math.paidFeatureReels[0].reels , [3] );
                const wildreel: number[][] = CreateGrid.StandardGrid( this.math.paidFeatureReels[0].reels, wildstops);
                wildreel[0].forEach( (sym:number, index:number) => {
                    if (sym == 0) {
                        state.initialGrid[col][index] = 0;
                    }
                })
            })
        }

        state.finalGrid = Grid.ExpandSymbolInReels( this.math.info.wildSymbols[0], state.initialGrid);

        (this.state as DrillTheThrillState).cashPrizes = [];
        CashPrize.CoinsMultiplier( this.rng, state.finalGrid, this.state as DrillTheThrillState, this.math as DrillTheThrillMath );

        state.wins = EvaluateWins.WaysWins( this.math.info, state.finalGrid, this.state.gameStatus.stakeValue, 1 );
        state.win = CalculateWins.AddPays( state.wins );

        state.features = [];

        const respin: SlotFeaturesState = new SlotFeaturesState();
        respin.isActive = ( wilds.numlist.length == 2 );
        respin.id = "holdspin";
        respin.offsets = Grid.FindScatterOffsets( 11, state.finalGrid);
        respin.symbol = 11;
        respin.triggers = ["respin"];
        state.features.push( respin);

        if( respin.isActive) {
            Triggerer.UpdateFeature(this.state, respin, this.math.actions["respin"]); 
            Triggerer.UpdateNextAction( this.state, this.math.actions["respin"]);
        } else {
            const coinprize: SlotFeaturesState = CashPrize.consecutiveCoinPrize( state.finalGrid, this.state as DrillTheThrillState, this.state.gameStatus.totalBet);
            state.win = state.win.plus( coinprize.pay); 
            state.features = [coinprize ];

            const freespins: SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["FreespinTrigger"], state);
            if (freespins.isActive) {
                Triggerer.UpdateFeature(this.state, freespins, this.math.actions["FreespinTrigger"]);
                Triggerer.UpdateNextAction( this.state, this.math.actions["FreespinTrigger"]); 
            }
            state.features.push( freespins);

        }

        this.state.gameStatus.currentWin = state.win;
        this.state.gameStatus.totalWin = state.win;

        this.state.paidSpin = [state];
    }

    protected executeBuyBonus() {
        let state:SlotSpinState = new SlotSpinState(); 
        this.state.paidSpin = [state];
    }


    protected executeFreeSpin() {
        let state:SlotSpinState = new SlotSpinState(); 

        const wilds:any = RandomHelper.GetRandomFromList( this.rng, this.math.collection["BaseWilds"]);
        let gridLayout = this.math.info.gridLayout;
        if(wilds.numlist[0] == 0) {
            const expand:any = RandomHelper.GetRandomFromList( this.rng, this.math.collection["ReelExpand"]);
            gridLayout[1] = expand.count;
            gridLayout[2] = expand.count;
            gridLayout[3] = expand.count;
        }

        const selectedSet:any = RandomHelper.GetRandomFromList( this.rng, this.math.paidReels );
        state.reelId = selectedSet.id;
        state.stops = CreateStops.StandardStops(this.rng, selectedSet.reels, gridLayout );
        state.initialGrid = CreateGrid.StandardGrid( selectedSet.reels, state.stops);
        
        if(wilds.numlist.length > 0) {
            wilds.numlist.forEach( col => {
                const wildstops: number[][] = CreateStops.StandardStops(this.rng, this.math.paidFeatureReels[0].reels , [3] );
                const wildreel: number[][] = CreateGrid.StandardGrid( this.math.paidFeatureReels[0].reels, wildstops);
                wildreel[0].forEach( (sym:number, index:number) => {
                    if (sym == 0) {
                        state.initialGrid[col][index] = 0;
                    }
                })
            })
        }

        state.finalGrid = Grid.ExpandSymbolInReels( this.math.info.wildSymbols[0], state.initialGrid);

        (this.state as DrillTheThrillState).cashPrizes = [];
        CashPrize.CoinsMultiplier( this.rng, state.finalGrid, this.state as DrillTheThrillState, this.math as DrillTheThrillMath );

        state.wins = EvaluateWins.WaysWins( this.math.info, state.finalGrid, BigNumber(this.state.gameStatus.stakeValue), 1 );
        state.win = CalculateWins.AddPays( state.wins );


        const freeRespin: SlotFeaturesState = new SlotFeaturesState();
        freeRespin.isActive = ( wilds.numlist.length == 2 );

        if( freeRespin.isActive) {
            Triggerer.UpdateFeature(this.state, freeRespin, this.math.actions["freerespin"]); 
            Triggerer.UpdateNextAction( this.state, this.math.actions["freerespin"]);
        } else {
            const coinprize: SlotFeaturesState = CashPrize.consecutiveCoinPrize( state.finalGrid, this.state as DrillTheThrillState, BigNumber(this.state.gameStatus.totalBet));
            state.win = state.win.plus( coinprize.pay); 
            state.features = [coinprize ];
        }

        this.state.gameStatus.totalWin = new BigNumber( this.state.gameStatus.totalWin ).plus (state.win);
        this.state.freespin.accumulated = new BigNumber( this.state.freespin.accumulated ).plus (state.win);
        
        const freespins: SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["FreespinTrigger"], state);
        if (freespins.isActive) {
            Triggerer.UpdateFeature(this.state, freespins, this.math.actions["FreespinReTrigger"]);
            Triggerer.UpdateNextAction( this.state, this.math.actions["FreespinReTrigger"]); 
        }
        UpdateFeature.updateFreeSpinCount( this.state);
        
        state.features.push( freespins);
        this.state.freespins.push( [state] );

    }


    protected executeReSpin() {
        const prevState :SlotSpinState = this.state.respins.length === 0 ? this.state.paidSpin[0] : this.state.respins[this.state.respins.length-1][0]
        let state:SlotSpinState = new SlotSpinState();

        const selectedSet: any = RandomHelper.GetRandomFromList( this.rng, this.math.reSpinReels );
        state.reelId = selectedSet.id;
        state.initialGrid = CreateGrid.WeightedSymbolGrid( this.rng, selectedSet.symbols, this.math.info.gridLayout);
        state.initialGrid[ 0].fill( 0);
        state.initialGrid[ 4].fill( 0);

        state.finalGrid = Grid.UpdateSymbolsInOffsetsWithPrevGrid(prevState.features[0].offsets, state.initialGrid,  prevState.finalGrid)
        state.wins = [];
        state.win = BigNumber(0);

        const coins: SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["HoldSpin"], state);
        CashPrize.CoinsMultiplier( this.rng, state.finalGrid, this.state as DrillTheThrillState, this.math as DrillTheThrillMath );

        const maxCoins = state.finalGrid[1].length + state.finalGrid[2].length + state.finalGrid[2].length;

        coins.isActive = (coins.offsets.length > prevState.features[0].offsets.length ) && coins.offsets.length < maxCoins;
        if (coins.isActive) {
            Triggerer.UpdateFeature(this.state, coins, this.math.actions["respin"]); 
        } else {
            UpdateFeature.updateReSpinCount( this.state);
            if ( this.state.respin.left === 0 || coins.offsets.length === maxCoins) {
                this.state.respin.left = 0;

                const freespins: SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["FreespinTrigger"], this.state.paidSpin[0]);
                if (freespins.isActive) {
                    Triggerer.UpdateFeature(this.state, freespins, this.math.actions["FreespinTrigger"]);
                    Triggerer.UpdateNextAction( this.state, this.math.actions["FreespinTrigger"]); 
                } else {
                    this.state.gameStatus.nextAction = ["spin"];
                }
                
                CashPrize.CalculateMultiplier( this.state as DrillTheThrillState, state);
                state.win = BigNumber(state.multiplier).multipliedBy( this.state.gameStatus.totalBet);
            }
        }
        
        this.state.gameStatus.currentWin = state.win;
        this.state.gameStatus.totalWin = BigNumber(this.state.gameStatus.totalWin).plus( state.win);
        coins.isActive = true;

        state.features = [coins ];
        this.state.respins.push( [state] );

    }

    protected executeFreeReSpin () {
        const prevState :SlotSpinState = this.state.freerespins.length === 0 
                                            ? this.state.freespins [this.state.freespins.length-1] [0] 
                                            : this.state.freerespins [this.state.freerespins.length-1] [0]
        
        let state:SlotSpinState = new SlotSpinState();

        const selectedSet: any = RandomHelper.GetRandomFromList( this.rng, this.math.reSpinReels );
        state.reelId = selectedSet.id;
        state.initialGrid = CreateGrid.WeightedSymbolGrid( this.rng, selectedSet.symbols, this.math.info.gridLayout);
        state.initialGrid[ 0].fill( 0);
        state.initialGrid[ 4].fill( 0);

        state.finalGrid = Grid.UpdateSymbolsInOffsetsWithPrevGrid(prevState.features[0].offsets, state.initialGrid,  prevState.finalGrid)
        state.wins = [];
        state.win = BigNumber(0);

        const coins: SlotFeaturesState = ScatterSymbolCount.checkCondition( this.math.conditions["HoldSpin"], state);
        CashPrize.CoinsMultiplier( this.rng, state.finalGrid, this.state as DrillTheThrillState, this.math as DrillTheThrillMath );

        const maxCoins = state.finalGrid[1].length + state.finalGrid[2].length + state.finalGrid[2].length;

        coins.isActive = (coins.offsets.length > prevState.features[0].offsets.length ) && coins.offsets.length < maxCoins;
        if (coins.isActive) {
            Triggerer.UpdateFeature(this.state, coins, this.math.actions["freerespin"]); 
        } else {
            UpdateFeature.updateReSpinCount( this.state);
            if ( this.state.respin.left === 0 || coins.offsets.length === maxCoins) {
                this.state.respin.left = 0;

                this.state.gameStatus.nextAction = ["spin"];

                CashPrize.CalculateMultiplier( this.state as DrillTheThrillState, state);
                state.win = BigNumber(state.multiplier).multipliedBy( this.state.gameStatus.totalBet);
            }
        }
        
        this.state.gameStatus.currentWin = state.win;
        this.state.gameStatus.totalWin = BigNumber(this.state.gameStatus.totalWin).plus( state.win);
        coins.isActive = true;

        state.features = [coins ];
        this.state.respins.push( [state] );

    }

    protected getPlayResponse():ResponseModel {
        return new DrillTheThrillResponseModel( this.version, this.name, this.math, this.state as DrillTheThrillState);
    }

    protected getConfigResponse( response:PlayResponseModel):ResponseModel {
        return new DrillTheThrillConfigResponseV2Model( this.version, this.name, this.math, this.state as DrillTheThrillState);
    }

    protected defaultEmptyState():DrillTheThrillState{
        return new DrillTheThrillState()
    }

}
