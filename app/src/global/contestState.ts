import create from "zustand";
import { devtools } from "zustand/middleware";
import { readAllLocal } from "../utils/localStorage";


export interface contestArea{
    areaName:string,
    ownershipBonus: number,
    currentOwner?: string,
    ownerScore?:number
}

export interface areaUpdate{
    currentOwner:string,
    ownerScore?:number
}

export interface ContestState{
    contestAreas:contestArea[] | never[] ,
    updateContestAreas: (update:contestArea[]) => void
    activeContestNumber: number,
    setActiveContestNumber: (update: number)=>void
    selectedArea: string,
    selectedAreaOwner: string,
    selectedAreaOwnerScore: number
}

export const useContestState = create<ContestState>(
    devtools(
        (set) => ({
            contestAreas:[],
            updateContestAreas(update){
                set(
                    (state)=> ({
                        ...state,
                        contestAreas: { ...state.contestAreas, ...update },
                    }),
                    false,
                    "ContestState/UpdateContestAreas"
                );
            },
            activeContestNumber:0,
            setActiveContestNumber(update){
                set((state)=>({
                    ...state,
                    activeContestNumber:update
                }),
                false,
                "ContestState/SetActiveContestNumber"
                )
            },
            selectedArea:"",
            selectedAreaOwner:"",
            selectedAreaOwnerScore:0,
        })
    )
)