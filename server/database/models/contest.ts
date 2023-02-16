import mongoose, { Schema } from "mongoose";

export interface contestArea {
areaName: string;
currentOwner: string;
percentCompleted: number;
ownershipBonus: number;
}

const contestAreaSchema = new Schema<contestArea> ({
    areaName: {type:String, required:true},
    currentOwner: {type:String, required:true},
    percentCompleted: {type:Number, required:true},
    ownershipBonus: {type:Number, required:true}

})

export interface contestInterface {
    contestNumber: Number;
    areas: contestArea[];
    endDate: Date;
} 


const ContestSchema = new Schema<contestArea> ({
   areaName: {type:String, required: true},
   currentOwner: {type:String,required:true},
   percentCompleted: {type:Number, required: true},
   ownershipBonus: {type:Number, required:true}
});

export default mongoose.model<contestArea>(
    "contestInfo",ContestSchema,"contest_information"
)

