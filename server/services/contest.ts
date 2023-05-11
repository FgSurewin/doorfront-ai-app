import contest, { contestArea, contestInterface } from "../database/models/contest";
import contestModel from "../database/models/contest"
import { AppContext } from "../types";
import { changeAreas, getAreaInfo, updateArea, updateAreaOwner } from "../types/contest";


export class ContestService{

    async createContest(ctx:AppContext, body: contestInterface ){
      const {res} = ctx;
      const newContest = body;
      try{
          const exists = await contestModel.findOne({contestNumber: newContest.contestNumber}).lean()
          if(exists){
              res.json({
                  code:500,
                  message: "Contest already exists!"
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

    async createArea(ctx:AppContext, body: updateArea) {
        const {res} = ctx;
        const newArea = body.area;

        try{
            const result = await contestModel.findOne({contestNumber: body.contestNumber }).lean()
            if(result){
             // var areaUpdate = result.areas;
              var found = false;
              //const areaExists = await contestModel.findOne({areas: { $elemMatch: {areaName:body.area.areaName}}})
              result.areas.forEach(element => {
                if(element.areaName === body.area.areaName){
                  found = true;
                }
              })
    
              if(found){
                  res.json({
                    code:500,
                    message: "Area already exists!",
                    data: result
                })
              }
              
              else{
                const finish = await contestModel.findOneAndUpdate({contestNumber: body.contestNumber }, {$push:{areas:newArea}}, {new:true,upsert:true})
                res.json({
                  code:0,
                  message: "Area created successfully!",
                  data: finish
              });
              }
            }
            else {
                res.json({
                    code:500,
                    message: "Contest does not exist!"
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
    async setAreas(ctx:AppContext, body: changeAreas){
      const {res} = ctx;
      const {contestNumber, areas} = body;

      try{
        const contest = await contestModel.findOne({contestNumber:contestNumber}).lean();
        if(contest){
          const update = await contestModel.findOneAndUpdate({contestNumber:contestNumber}, {$set:{areas:areas}} , {new:true})
          if(update){
            res.json({
              code:500,
              message: "Successfully Updated Contest Areas",
              data:update.areas
            })
          } else{
              res.json({
                code:500,
                message: "Failed to Update Contest Areas"
              })
            }

        }
        else{
          res.json({
            code:500,
            message: "Contest Does Not Exist"
        })
        }
      } catch(e) {
        const error = new Error(`${e}`);
        res.json({
            code:500,
            message: error.message
        })
    }
    }
   
    async updateAreaOwner(ctx:AppContext, body: updateAreaOwner ){
      const {res} = ctx;
      try{
        const result = await contestModel.findOne({contestNumber:body.contestNumber}).lean()
        if(result){
          var found = false;
          result.areas.forEach(element => {
            if(element.areaName === body.areaName){
              element.currentOwner = body.owner;
              found = true;
            }
          })

          if(found){
            const finish = await contestModel.findOneAndUpdate({contestNumber:body.contestNumber}, {areas:result.areas}, {new:true,upsert:true});
            res.json({
              code: 0,
              message: "Area update successful",
              data: finish,
            });

          }
          else{
            res.json({
              code: 4000,
              message: "Area update failed",
            });
          }
        }

      }catch (e) {
        const error = new Error(`${e}`);
        res.json({
          code: 5000,
          message: error.message,
        });
    }
    }

    async getAreaOwner(ctx:AppContext, body:getAreaInfo) {
        const {res} = ctx;
        try {
            const {areaName,contestNumber} = body;
            const result = await contestModel.findOne(
                {contestNumber: contestNumber, "areas.areaName": areaName},
                {areas: {$elemMatch:{areaName:areaName}}}
            ).lean();
            if(result) {
              if(result.areas[0].currentOwner){
              res.json({
                code:0,
                message:"Get Area Owner Successful",
                data: result.areas[0].currentOwner
              })
            }
            else{
              res.json({
                code: 4000,
                message: "Area has no owner!",
              });
            }
              } else {
                res.json({
                  code: 4000,
                  message: "Get Area Owner failed",
                  data:body
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
    async getArea(ctx:AppContext, body: getAreaInfo) {
      const {res} = ctx;
      try {
          const {areaName,contestNumber} = body;
          const result = await contestModel.findOne(
              {contestNumber: contestNumber, "areas.areaName":areaName },
              {areas: {$elemMatch: {areaName:areaName}}}
          ).lean();
          if(result) {
              res.json({
                code: 0,
                message: "Get area successful",
                data: result.areas[0]
              });

            } else {
              res.json({
                code: 4000,
                message: "Get Area failed",
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

    async getAreaBonus(ctx:AppContext, body:getAreaInfo) {
      const {res} = ctx;
      try {
          const area = body;
          const result = await contestModel.findOne(
              {contestNumber: area.contestNumber}
          ).lean();
          if(result) {
            result.areas.forEach(item=>{
              if(item.areaName === body.areaName){
              res.json({
                code: 0,
                message: "Get area bonus successful",
                data: item.ownershipBonus
              });
            }
            })
            } else {
              res.json({
                code: 4000,
                message: "Get Area Bonus failed",
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

    async getLeader(ctx:AppContext,body:{contestNumber:number}){
      const {res} = ctx;
      try{
        const result = await contestModel.findOne({contestNumber:body.contestNumber}).lean()
        if(result){
          res.json({
            code: 0,
            message: "Got Leader Successfully!",
            data: result.leader,
          });
        } else {
          res.json({
            code: 500,
            message: "Contest does not exist!",
            data: result,
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

    async getEndDate(ctx:AppContext,body:{contestNumber:number}){
      const {res} = ctx;
      try{
        const result = await contestModel.findOne({contestNumber:body.contestNumber}).lean()
        if(result){
          res.json({
            code: 0,
            message: "Got End Date Successfully!",
            data: result.endDate,
          });
        } else {
          res.json({
            code: 500,
            message: "Contest does not exist! Can't get End Date! Receieved " + body.contestNumber,
            data: {result:result, input:body.contestNumber},
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

    async getContestState(ctx:AppContext,body:{contestNumber:number}){
      const {res} = ctx;
      try{
        const result = await contestModel.findOne({contestNumber:body.contestNumber}).lean()
        if(result){
          res.json({
            code: 0,
            message: "Got Contest State Successfully",
            data: result.active,
          });
        } else {
          res.json({
            code: 500,
            message: "Contest does not exist!",
            data: result,
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
    async updateLeader(ctx:AppContext,body: {contestNumber:number, leader:string}){
      const {res} = ctx;
      try{
        const result = await contestModel.findOneAndUpdate({contestNumber: body.contestNumber}, {leader:body.leader}, {upsert:true,new:true})

        if(result){
          res.json({
            code: 0,
            message: "Leader Updated!",
            data: result,
          });
        } else {
          res.json({
            code: 500,
            message: "Contest does not exist!",
            data: result,
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
    async changeContestState(ctx:AppContext,body: {contestNumber:number, active:boolean}){
      const {res} = ctx;
      try{
        const result = await contestModel.findOneAndUpdate({contestNumber: body.contestNumber}, {active:body.active}, {upsert:false,new:true})

        if(result){
          res.json({
            code: 0,
            message: "Active State Updated!",
            data: result,
          });
        } else {
          res.json({
            code: 500,
            message: "Contest does not exist!",
            data: result,
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

    async getActiveContest(ctx:AppContext){
      const {res} = ctx;
      try{
        const result = await contestModel.findOne({active:true}).lean()
        if(result){
          res.json({
            code: 0,
            message: "Got Active Contest",
            data: result.contestNumber,
          });
        } else {
          res.json({
            code: 500,
            message: "No contests active!",
            data: result,
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

    async getAllAreas(ctx:AppContext, body: {contestNumber:number}){
      const {res} = ctx;
      const {contestNumber} = body
      try{
        const allAreas = await contestModel.findOne({contestNumber:contestNumber}, {areas:1}).lean()
        if(allAreas){
          res.json({
            code:0,
            message:"Got all areas of contest #" + contestNumber,
            data:allAreas
          })
        }
        else{
          res.json({
            code:500,
            message:"Failed to get areas",
            data:allAreas
          })
        }

      } catch (e){
        const error = new Error(`${e}`);
        res.json({
          code: 5000,
          message: error.message,
        });
      }
    }

    async clearContest(ctx:AppContext, body: {contestNumber: number}) {
        const {res} = ctx;
        try {
            const result = await contestModel.deleteOne({contestNumber:body.contestNumber});
            if (result.deletedCount > 0) {
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