import contest, { contestInterface,contestArea } from "../database/models/contest";
import contestModel from "../database/models/contest"
import { AppContext } from "../types";
import { updateArea } from "../types/contest";


export class ContestService{

    async createArea(ctx:AppContext, body: contestArea) {
        const {res} = ctx;
        const newContest = body;
        try{
            const exists = await contestModel.find({areaName: newContest.areaName})
            if(exists.length != 0){
                res.json({
                    code:500,
                    message: "Area already exists!"
                })
            }
            else {
                const result = await contestModel.create(newContest);
                res.json({
                    code:0,
                    message: "Contest created successfully!",
                    data: result
                });
            }
        } catch(e) {
            const error = new Error(`${e}`);
            res.json({
                code:500,
                message: error.message
            })
        }
    }

    async updateArea(ctx:AppContext, body: updateArea) {
        const {res} = ctx;
        try{
            const {areaName, data:areaAttrs } = body;
            const result = await contestModel.findOneAndUpdate(
                {areaName: areaName},
                {...areaAttrs},
                {  rawResult: true, new:true }  
            );

            if (result.value != null) {
                res.json({
                  code: 0,
                  message: "Area update successful",
                  data: result,
                });
              } else {
                res.json({
                  code: 4000,
                  message: "Area update failed",
                });
              }
        }
        catch (e){
            const error = new Error(`${e}`);
            res.json({
              code: 5000,
              message: error.message,
            });
        }
    } 

    async getAreaOwner(ctx:AppContext, body:updateArea) {
        const {res} = ctx;
        try {
            const {areaName} = body;
            const result = await contestModel.findOne(
                {areaName:areaName}
            );
            if(result) {
                res.json({
                  code: 0,
                  message: "Get Area owner successful",
                  data: result.currentOwner
                });
              } else {
                res.json({
                  code: 4000,
                  message: "Get Area Owner failed",
                });
              }
            
        } catch (e) {
            const error = new Error(`${e}`);
            res.json({
              code: 5000,
              message: error.message,
            });
        }
    }

    async getAreaBonus(ctx:AppContext, body:updateArea) {
        const {res} = ctx;
        try {
            const {areaName} = body;
            const result = await contestModel.findOne(
                {areaName:areaName}
            );
            if(result) {
                res.json({
                  code: 0,
                  message: "Get Area owner successful",
                  data: result.ownershipBonus
                });
              } else {
                res.json({
                  code: 4000,
                  message: "Get Area Owner failed",
                });
              }
            
        } catch (e) {
            const error = new Error(`${e}`);
            res.json({
              code: 5000,
              message: error.message,
            });
        }
    }

    async clearContest(ctx:AppContext) {
        const {res} = ctx;
        try {
            const result = await contestModel.deleteMany({});
            if (result) {
                res.json({
                  code: 0,
                  message: "Contest deleted!",
                  data: result,
                });
              } else {
                res.json({
                  code: 4000,
                  message: "Contest delete failed!",
                });
              }
            
        } catch (e) {
            const error = new Error(`${e}`);
            res.json({
              code: 5000,
              message: error.message,
            });
        }
    }
}