import RequestModel from "../database/models/request";
import {AppContext, RequestBody} from "../types";
import UserModel from "../database/models/user";
import {LocationType} from "../database/models/request";

export class RequestService{
  async addRequest(ctx: AppContext, body: RequestBody) {
    const { res } = ctx
    const { requestedBy, type, address, deadline, location: LocationType } = body
    try{
      if(!requestedBy || !address || !type) {
        return res.status(400).json({
          code: 400,
          message: "Need a requestedBy id, address, and type"
        })
      }
      // check if the requestedBy id is a valid user
      const validUser = await UserModel.findById(requestedBy)
     // console.log(validUser)
      if(!validUser)
        return res.status(400).json({
          code:400,
          message: "User does not exist!"
        })
      // add date that is {deadline} days after today
      const addNewRequest = {...body, deadline: new Date(new Date().getTime()+(deadline*24*60*60*1000)).toISOString()
      };
      const newRequest = RequestModel.create(addNewRequest)
      if(!newRequest)
        return res.status(500).json({
          code:500,
          message: "Request Failed!"
        })
      res.status(200).json({
        code:200,
        message: "Add Request Successful!"
      })
    }
    catch (e){
      const error = new Error(`${e}`);
      res.status(500).json({
        code: 500,
        message: error.message,
      });
    }
  }

  async addLabeler(ctx: AppContext, body: {requestId: string, labelerId: string}) {
    const {res} = ctx
    try{
      const { requestId, labelerId } = body;
      if(!requestId || !labelerId)
        return res.status(400).json({
          code:400,
          message: "Need a requestId and labelerId!"
        })

      const validUser = await UserModel.findById(labelerId)
      // console.log(validUser)
      if(!validUser)
        return res.status(400).json({
          code:400,
          message: "User does not exist!"
        })
      const update = await RequestModel.findOneAndUpdate({_id: requestId, labelers: {$nin: [labelerId]}}, {$push: {labelers: labelerId}}, {new: true})
      if(!update)
        return res.status(200).json({
          code:200,
          message: "Labeler already exists in this request or request id invalid"
        })

      return res.status(200).json({
        code:200,
        message: "Successfully updated labeler!"
      })
    }
    catch (e){
      const error = new Error(`${e}`);
      res.status(500).json({
        code: 500,
        message: error.message,
      });
    }
  }

  async getOpenRequests(ctx:AppContext){
    const {res} = ctx
    try{
      const result = await RequestModel.find({deadline:{$gt: new Date()}}).lean()
      res.status(200).json({
        code:200,
        data: result
      })
    }
    catch (e){
      const error = new Error(`${e}`);
      res.status(500).json({
        code: 500,
        message: error.message,
      });
    }
  }

  async getUserRequests(ctx:AppContext, body:{userId: string}){
    const {res} = ctx
    try{
      const { userId } = body
      const result = await RequestModel.find({requestedBy:userId}).lean()
      res.status(200).json({
        code:200,
        data: result
      })
    }
    catch (e){
      const error = new Error(`${e}`);
      res.status(500).json({
        code: 500,
        message: error.message,
      });
    }
  }

}