import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user";
import {
  UserBody,
  LoginBody,
  UpdateImageBody,
  UpdateUserLabelsBody,
} from "../types";
import {
  ChallengeArea,
  getAreaScore,
  GetUserScoreBody,
  QueryImageBody,
  QueryImageListBody,
  ResetBody,
  SaveActionListBody,
  UpdateContestScore,
  UpdateContestStats,
  UpdateCreditBody,
  UpdateLabelCreditBody,
} from "../types/user";

const userService = new UserService();

export class UserController {
  async addUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // await imageService.getAllImages({ req, res, next });
    const body: UserBody = req.body;
    await userService.addUser({ req, res, next }, body);
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    // await imageService.getAllImages({ req, res, next });
    const body: LoginBody = req.body;
    await userService.login({ req, res, next }, body);
  }

  async reset(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body: ResetBody = req.body;
    await userService.reset({ req, res, next }, body);
  }

  async getUnLabelImageList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const body: QueryImageListBody = req.body;
    await userService.getUnLabelImageList({ req, res, next }, body);
  }

  /* -------------------------------------------------------------------------- */
  /*                          New Action List Functions                         */
  /* -------------------------------------------------------------------------- */
  async saveImageToDiffList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const body: SaveActionListBody = req.body;
    await userService.saveImageToDiffList({ req, res, next }, body);
  }
  async deleteImageFromList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const body: SaveActionListBody = req.body;
    await userService.deleteImageFromList({ req, res, next }, body);
  }

  /* -------------------------------------------------------------------------- */
  // async addLabelImage(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const body: QueryImageBody = req.body;
  //   await userService.addLabelImage({ req, res, next }, body);
  // }
  // async deleteLabelImage(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const body: QueryImageBody = req.body;
  //   await userService.deleteLabelImage({ req, res, next }, body);
  // }
  // async addUnLabelImage(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const body: QueryImageBody = req.body;
  //   await userService.addUnLabelImage({ req, res, next }, body);
  // }
  // async deleteUnLabelImage(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const body: QueryImageBody = req.body;
  //   await userService.deleteUnLabelImage({ req, res, next }, body);
  // }

  /* -------------------------------------------------------------------------- */
  async addCredit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const body: UpdateCreditBody = req.body;
    await userService.addCredit({ req, res, next }, body);
  }
  async addLabelCredit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const body: UpdateLabelCreditBody = req.body;
    await userService.addLabelCredit({ req, res, next }, body);
  }
  async getUserScore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const body: GetUserScoreBody = req.body;
    await userService.getUserScore({ req, res, next }, body);
  }
  async addBonusCredit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const body: GetUserScoreBody = req.body;
    await userService.addBonusCredit({ req, res, next }, body);
  }
  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await userService.getAllUsers({ req, res, next });
  }

  async getContestScore(   
     req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const body: GetUserScoreBody = req.body;
    await userService.getContestScore({req,res,next},body)
  }
  
  async getNickname(   
    req: Request,
   res: Response,
   next: NextFunction
 ): Promise<void> {
   const body: {id:string} = req.body;
   await userService.getNickname({req,res,next},body)
 }
  async updateContestScore(   
    req: Request,
   res: Response,
   next: NextFunction
 ): Promise<void> {
   const body: UpdateContestScore = req.body;
   await userService.updateContestScore({req,res,next},body)
 }

 async updateContestStats(
  req: Request,
  res: Response,
  next: NextFunction
 ): Promise<void> {
  const body: UpdateContestStats = req.body;
  await userService.updateContestStats({req,res,next},body)
}

async resetContestScore(
  req: Request,
  res: Response,
  next: NextFunction
 ): Promise<void> {
  const body: GetUserScoreBody = req.body;
  await userService.resetContestScore({req,res,next},body)
}

async getAreaScore (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const body: getAreaScore = req.body;
  await userService.getAreaScore({req,res,next},body)
}

async getReferralCode(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> { 
  const body:{id:string} = req.body;
  await userService.getReferralCode({req,res,next},body)
}

async getReferrer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> { 
  const body:{id:string} = req.body;
  await userService.getReferrer({req,res,next},body)
}
async getAllReferredUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> { 
  const body:{id:string} = req.body;
  await userService.getAllReferredUsers({req,res,next},body)
}

async updateReferredUserBonus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> { 
  const body:{referrerId: string,refereeId:string} = req.body;
  await userService.updateReferredUserBonus({req,res,next},body)
}
async getAllContestUsersInfo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> { 
  await userService.getAllContestUsersInfo({req,res,next})
}
}
