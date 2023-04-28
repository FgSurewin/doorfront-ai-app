import mongoose, { Schema } from "mongoose";

export interface contestArea {
areaName: string;
currentOwner?: string;
ownershipBonus: number;
}

const contestAreaSchema = new Schema<contestArea> ({
    areaName: {type:String, required:true},
    currentOwner: {type:String, required:false},
    ownershipBonus: {type:Number, required:true}
})

export interface contestInterface {
    contestNumber: number;
    areas: contestArea[];
    endDate: string;
    leader?: string;
    active: boolean;
}

const ContestInterfaceSchema = new Schema<contestInterface> ({
    contestNumber: {type:Number, required: true},
    areas: [contestAreaSchema],
    endDate: {type:String, required:true},
    leader: {type:String,required:false},
    active: {type:Boolean, required: true}
})


const ContestSchema = new Schema<contestArea> ({
   areaName: {type:String, required: true},
   currentOwner: {type:String,required:false},
   ownershipBonus: {type:Number, required:true}
});

export default mongoose.model<contestInterface>(
    "contestInfo",ContestInterfaceSchema,"contest_information"
)

