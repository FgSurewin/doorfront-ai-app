import { SECRET } from "./../database/index";
import { LoginBody } from "./../types/index";
import { AppContext, UserBody } from "../types";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import UserModel, {
  UserInterface,
  areaScores,
  userReferred,
} from "../database/models/user";
import ContestModel from "../database/models/contest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  GetUserScoreBody,
  QueryImageBody,
  QueryImageListBody,
  ResetBody,
  SaveActionListBody,
  UpdateCreditBody,
  UpdateLabelCreditBody,
  UpdateContestStats,
  UpdateContestScore,
  getAreaScore,
  ChallengeArea,
  setReferrer,
  GetAccessLevelBody,
} from "../types/user";

// Bcrypt Configuration
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

export class UserService {
  async addUser(ctx: AppContext, body: UserBody) {
    const { res } = ctx;
    const { email, password, nickname } = body;
    const referrer = body.referralCode;
    delete body.referralCode;
    try {
      const checkNickname: UserInterface[] = await UserModel.find({ nickname });
      if (checkNickname.length === 0) {
        const result: UserInterface[] = await UserModel.find({ email });
        if (result.length === 0) {
          const checkCode: UserInterface[] = await UserModel.find({
            referralCode: referrer,
          });
          if (
            checkCode.length > 0 ||
            referrer === undefined ||
            referrer.length === 0
          ) {
            const encodePassword = bcrypt.hashSync(password, salt);
            var ref = "";
            if (checkCode.length > 0) {
              ref = checkCode[0]._id;
            }
            const newUser = {
              ...body,
              password: encodePassword,
              isSent: false,
              isReviewed: true,
              label: 0,
              score: 0,
              modify: 0,
              create: 0,
              review: 0,
              bonus: 0,
              checkOld: 0,
              contestScore: 0,
              referrer: ref,
              accessLevel: "basic",
              hoursCertified: 0,
            };
            const finish = await UserModel.create(newUser);
            if (referrer && referrer.length > 0) {
              const newRefer = { userID: finish.id, bonusRecieved: false };
              await UserModel.findOneAndUpdate(
                { _id: checkCode[0]._id },
                { $addToSet: { usersReferred: newRefer } }
              );
            }
            res.json({
              code: 0,
              message: "Sign Up Successful!",
              data: result,
            });
          } else {
            res.json({
              code: 2000,
              message: "Referral code is invalid!",
            });
          }
        } else {
          res.json({
            code: 2000,
            message: "Email has been registered.",
          });
        }
      } else {
        res.json({
          code: 2000,
          message: "Nickname has been registered.",
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

  async login(ctx: AppContext, body: LoginBody) {
    const { res } = ctx;
    const { email, password } = body;
    try {
      const result: UserInterface[] = await UserModel.find({ email });
      // Check if the user exists
      if (result.length !== 0) {
        const user: UserInterface = result[0];
        const validPass = await bcrypt.compare(password, user.password);
        // Check if the password corrects
        if (validPass) {
          // res.status(400).send("Invalid password");
          if (result[0].isReviewed) {
            const token = jwt.sign(
              {
                id: result[0]._id,
              },
              SECRET!,
              { expiresIn: 60 * 60 * 6 } // 60 * 60 * 3
            );
            res.json({
              code: 0,
              message: "Login Successfully",
              data: {
                token,
                nickname: result[0].nickname,
                id: result[0]._id,
                role: result[0].role,
                accessLevel: result[0].accessLevel,
              },
            });
          } else {
            res.json({
              code: 2000,
              message: "Account review in progress",
            });
          }
        } else {
          res.json({
            code: 2000,
            message: "Password is not correct .",
          });
        }
      } else {
        res.json({
          code: 2000,
          message: "Email doesn't exist.",
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

  async reset(ctx: AppContext, body: ResetBody) {
    const { res } = ctx;
    const { email, newPassword, nickname } = body;
    try {
      const existingUser = await UserModel.findOne({ nickname });
      if (existingUser) {
        if (existingUser.email === email) {
          const result = await UserModel.findOneAndUpdate(
            { _id: existingUser._id },
            {
              password: bcrypt.hashSync(newPassword, salt),
            },
            {
              new: true,
              upsert: true,
              rawResult: true, // Return the raw result from the MongoDB driver
            }
          );
          if (result.ok === 1) {
            res.json({
              code: 0,
              message: "Reset password successfully",
              data: result,
            });
          } else {
            res.json({
              code: 4000,
              message: "Fail to reset password",
            });
          }
        } else {
          res.json({
            code: 2000,
            message: "Email is not correct.",
          });
        }
      } else {
        res.json({
          code: 2000,
          message: "Nickname does not exist.",
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

  async getUnLabelImageList(ctx: AppContext, body: QueryImageListBody) {
    const { res } = ctx;
    console.log(res);
    try {
      const { id } = body;
      const currentUser = await UserModel.findById(id);
      if (currentUser) {
        const unLabel_images = currentUser.unLabel_images;
        res.json({
          code: 0,
          message: "Get unLabel image list successfully",
          data: unLabel_images,
        });
      } else {
        res.json({
          code: 4000,
          message: "User is not existed",
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

  async saveImageToDiffList(ctx: AppContext, body: SaveActionListBody) {
    const { res } = ctx;
    try {
      const { id, data, category } = body;
      const currentUser = await UserModel.findById(id);
      if (currentUser) {
        const result = await UserModel.findOneAndUpdate(
          { _id: id },
          {
            $push: { [category]: data },
          },
          {
            new: true,
            upsert: true,
            rawResult: true, // Return the raw result from the MongoDB driver
          }
        );
        if (result.ok === 1) {
          res.json({
            code: 0,
            message: `Add ${category} successfully`,
            data: result,
          });
        } else {
          res.json({
            code: 4000,
            message: `Fail to add ${category}`,
          });
        }
      } else {
        res.json({
          code: 4000,
          message: "User is not existed",
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

  async deleteImageFromList(ctx: AppContext, body: SaveActionListBody) {
    const { res } = ctx;
    try {
      const { id, data, category } = body;
      const currentUser = await UserModel.findById(id);

      if (currentUser) {
        const result = await UserModel.findOneAndUpdate(
          { _id: id },
          {
            $pull: { [category]: { imageId: data.imageId } },
          },
          {
            new: true,
            upsert: true,
            rawResult: true, // Return the raw result from the MongoDB driver
          }
        );
        if (result.ok === 1) {
          res.json({
            code: 0,
            message: `Delete ${category} successfully`,
            data: result,
          });
        } else {
          res.json({
            code: 4000,
            message: `Fail to delete ${category}`,
          });
        }
      } else {
        res.json({
          code: 4000,
          message: "User is not existed",
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
  async addCredit(ctx: AppContext, body: UpdateCreditBody) {
    const { res } = ctx;
    try {
      const { id, type } = body;
      const currentUser = await UserModel.findById(id);
      if (currentUser) {
        const result = await UserModel.findOneAndUpdate(
          { _id: id },
          {
            [type]: currentUser[type] + 1,
            score: currentUser.score + 1,
          },
          {
            new: true,
            upsert: true,
            rawResult: true, // Return the raw result from the MongoDB driver
          }
        );
        if (result.ok === 1) {
          res.json({
            code: 0,
            message: `Add ${type} credit successfully`,
            data: result,
          });
        } else {
          res.json({
            code: 4000,
            message: "Fail to add credit",
          });
        }
      } else {
        res.json({
          code: 4000,
          message: "User is not existed",
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

  async addLabelCredit(ctx: AppContext, body: UpdateLabelCreditBody) {
    const { res } = ctx;
    try {
      const { id, labelNum } = body;
      const currentUser = await UserModel.findById(id);
      if (currentUser) {
        const result = await UserModel.findOneAndUpdate(
          { _id: id },
          {
            label: currentUser.label + labelNum,
          },
          {
            new: true,
            upsert: true,
            rawResult: true, // Return the raw result from the MongoDB driver
          }
        );
        if (result.ok === 1) {
          res.json({
            code: 0,
            message: `Add label credit successfully`,
            data: result,
          });
        } else {
          res.json({
            code: 4000,
            message: "Fail to add label credit",
          });
        }
      } else {
        res.json({
          code: 4000,
          message: "User is not existed",
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

  async getUserScore(ctx: AppContext, body: GetUserScoreBody) {
    const { res } = ctx;
    try {
      const { id } = body;
      const currentUser = await UserModel.findById(id).lean();
      if (currentUser) {
        res.json({
          code: 0,
          message: "Get user score successfully",
          data: {
            label: currentUser.label,
            score: currentUser.score,
            modify: currentUser.modify,
            create: currentUser.create,
            review: currentUser.review,
            contestScore: currentUser.contestScore,
            bonus: currentUser.bonus,
          },
        });
      } else {
        res.json({
          code: 4000,
          message: "User is not existed",
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

  async addBonusCredit(ctx: AppContext, body: GetUserScoreBody) {
    const { res } = ctx;
    try {
      const { id } = body;
      const currentUser = await UserModel.findById(id);
      if (currentUser) {
        const result = await UserModel.findOneAndUpdate(
          { _id: id },
          {
            bonus: currentUser.bonus + 10,
            score: currentUser.score + 10,
          },
          {
            new: true,
            upsert: true,
          }
        );
        if (result) {
          res.json({
            code: 0,
            message: `Add bonus credit successfully`,
            data: {
              label: result.label,
              score: result.score,
              modify: result.modify,
              create: result.create,
              review: result.review,
              bonus: result.bonus,
            },
          });
        } else {
          res.json({
            code: 4000,
            message: "Fail to add bonus credit",
          });
        }
      } else {
        res.json({
          code: 4000,
          message: "User is not existed",
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

  async getAllUsers(ctx: AppContext) {
    const { res } = ctx;
    try {
      const allUser = await UserModel.find().lean();
      res.json({
        code: 0,
        message: "Get users successfully",
        data: allUser.map((item) => ({
          email: item.email,
          score: item.score,
          username: item.nickname,
          label: item.label,
          review: item.review,
          modify: item.modify,
          create: item.create,
          bonus: item.bonus,
          role: item.role,
          contestScore: item.contestScore,
          institution: item.institution,
          updatedAt: item.updatedAt,
          accessLevel: item.accessLevel,
          hoursCertified: item.hoursCertified,
        })),
      });
    } catch (e) {
      const error = new Error(`${e}`);
      res.json({
        code: 5000,
        message: error.message,
      });
    }
  }

  async getContestScore(ctx: AppContext, body: GetUserScoreBody) {
    const { res } = ctx;
    try {
      const { id } = body;
      const user = await UserModel.findById(id).lean();
      if (user) {
        const contestScore = user.contestScore;
        res.json({
          code: 0,
          message: "Get User Contest Score Successful!",
          data: contestScore,
        });
      } else {
        res.json({
          code: 4000,
          message: "User does not exist",
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

  async getNickname(ctx: AppContext, body: { id: string }) {
    const { res } = ctx;
    try {
      const { id } = body;
      const user = await UserModel.findById(id).lean();
      if (user) {
        const nickname = user.nickname;
        res.json({
          code: 0,
          message: "Get Nickname Successful!",
          data: nickname,
        });
      } else {
        res.json({
          code: 4000,
          message: "User does not exist! Received " + id,
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
  async updateContestStats(ctx: AppContext, body: UpdateContestStats) {
    const { res } = ctx;

    try {
      const { id, areaName, areaScoreIncrement } = body;

      let user = await UserModel.findOne(
        { _id: id },
        { areaScores: true, contestScore: true }
      );
      const contest = await ContestModel.findOne(
        { active: true, "areas.areaName": areaName },
        { areas: { $elemMatch: { areaName: areaName } } }
      );
      if (user && contest) {
        let found: boolean = false;
        let newScore = 0;
        let sentResult = false;
        let message = "";
        let userAreaIndex = -1;
        let userTotal = 0;
        for (let i = 0; i < user.areaScores.length; i++) {
          if (user.areaScores[i].areaName == areaName) {
            user.areaScores[i].areaScore += areaScoreIncrement;
            newScore = user.areaScores[i].areaScore;
            userAreaIndex = i;
            found = true;
            if (user.contestScore)
              userTotal = user.contestScore + areaScoreIncrement;
            else userTotal = areaScoreIncrement;
          }
        }

        if (!found) {
          user.areaScores.push({
            areaName: areaName,
            areaScore: areaScoreIncrement,
          });
          userAreaIndex = user.areaScores.length - 1;
          newScore = areaScoreIncrement;
          if (user.contestScore)
            userTotal = user.contestScore + areaScoreIncrement;
          else userTotal = areaScoreIncrement;
        }

        //need to check if their updated score is more than the current owner's, might need to put in seperate function
        //only recieving one contest area, need to recieve all them

        //look for index of area matching areaName
        const originalOwner = contest.areas[0].currentOwner;
        const areaBonus = contest.areas[0].ownershipBonus;
        if (originalOwner !== undefined && originalOwner != id) {
          const areaLeader = await UserModel.findOne(
            { _id: originalOwner, "areaScores.areaName": areaName },
            {
              areaScores: { $elemMatch: { areaName: areaName } },
              contestScore: true,
            }
          );
          if (areaLeader) {
            const leaderScore = areaLeader.areaScores[0].areaScore;
            if (leaderScore && newScore > leaderScore - areaBonus) {
              //leaderScore.areaScore - areaBonus and update to server
              //contest.areas[i].currentOwner = id and update to server
              user.areaScores[userAreaIndex].areaScore += areaBonus;
              const final = await UserModel.findByIdAndUpdate(
                id,
                {
                  $set: {
                    areaScores: user.areaScores,
                    contestScore: userTotal + areaBonus,
                  },
                },
                { new: true }
              );
              const bonusLoser = await UserModel.findOneAndUpdate(
                { _id: originalOwner, "areaScores.areaName": areaName },
                {
                  $inc: {
                    contestScore: -areaBonus,
                    "areaScores.$.areaScore": -areaBonus,
                  } /*,$inc:{contestScore:(-areaBonus),'areaScores.$.areaScore':(-areaBonus)}*/,
                },
                { new: true }
              );
              //contest.areas[0].currentOwner = id;
              const takeover = await ContestModel.findOneAndUpdate(
                { active: true, "areas.areaName": areaName },
                { $set: { "areas.$.currentOwner": id } },
                { new: true }
              );
              if (takeover && final && bonusLoser) {
                sentResult = true;
                res.json({
                  code: 10,
                  message: "You took ownership of " + areaName + "!",
                  data: {
                    contest: takeover.areas,
                    userTotal: final.contestScore,
                    userArea: final.areaScores[userAreaIndex],
                    oldOwnerUpdated: {
                      bonusLoserid: bonusLoser.id,
                      originalOwner: originalOwner,
                      originalOwnerScore: leaderScore,
                      userTotal: bonusLoser.contestScore,
                      userArea:
                        bonusLoser.areaScores[
                          bonusLoser.areaScores.findIndex(
                            (item) => item.areaName === areaName
                          )
                        ],
                    },
                    other: {
                      myID: id,
                      newScore: newScore,
                      areaBonus: areaBonus,
                      result: user,
                      areaLeader: areaLeader,
                    },
                  },
                });
              } else {
                res.json({
                  code: 400,
                  message: "User contest stats update failed!",
                  data: final,
                });
              }
            } else if (leaderScore) {
              message =
                "Leader has " +
                (leaderScore - areaBonus - newScore) +
                " more points than you";
            }
          }
        }
        //else just take it over yourself
        else if (originalOwner !== id) {
          const takeover = await ContestModel.findOneAndUpdate(
            { active: true, "areas.areaName": areaName },
            { $set: { "areas.$.currentOwner": id } },
            { new: true }
          );
          user.areaScores[userAreaIndex].areaScore += areaBonus;
          const final = await UserModel.findByIdAndUpdate(
            id,
            {
              $set: {
                areaScores: user.areaScores,
                contestScore: userTotal + areaBonus,
              },
            },
            { new: true }
          );
          if (takeover && final) {
            sentResult = true;
            res.json({
              code: 1,
              message: "You took ownership of " + areaName + "!",
              data: {
                contest:
                  takeover.areas[
                    takeover.areas.findIndex(
                      (item) => item.areaName === areaName
                    )
                  ],
                userTotal: final.contestScore,
                userArea:
                  final.areaScores[
                    final.areaScores.findIndex(
                      (item) => item.areaName === areaName
                    )
                  ],
              },
            });
          }
        }

        if (sentResult === false) {
          const finish = await UserModel.findOneAndUpdate(
            { _id: id },
            { $set: { areaScores: user.areaScores, contestScore: userTotal } },
            {
              new: true,
              rawResult: true, // Return the raw result from the MongoDB driver
            }
          );
          if (finish.ok === 1 && finish.value) {
            res.json({
              code: 5,
              message: "You got +1 score in area " + areaName,
              data: {
                user: {
                  total: finish.value.contestScore,
                  expectedTotal: userTotal,
                  areaScores:
                    finish.value.areaScores[
                      finish.value.areaScores.findIndex(
                        (v) => v.areaName === areaName
                      )
                    ],
                },
                contest: contest,
              },
            });
          } else {
            res.json({
              code: 400,
              message: "User contest stats update failed!",
              data: user,
            });
          }
        }
      } else {
        res.json({
          code: 4000,
          message: "User or contest area does not exist",
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

  async getAreaScore(ctx: AppContext, body: getAreaScore) {
    const { res } = ctx;

    try {
      const { id, areaName } = body;
      const user = await UserModel.findOne(
        { _id: id, "areaScores:areaName": areaName },
        { areaScores: { $elemMatch: { areaName: areaName } } }
      ).lean();

      if (user) {
        res.json({
          code: 0,
          message: "User score for " + areaName + " retrieved successfully",
          data: user.areaScores[0].areaScore,
        });
      } else {
        res.json({
          code: 400,
          message: "Failed to get " + areaName + " score for user " + id,
          data: user,
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

  async updateContestScore(ctx: AppContext, body: UpdateContestScore) {
    const { res } = ctx;
    try {
      const { id, contestScore } = body;
      const user = await UserModel.findById(id).lean();
      if (user) {
        const result = await UserModel.findOneAndUpdate(
          { _id: id },
          { $inc: { contestScore } },
          { new: true }
        );
        res.json({
          code: 0,
          message: "User contest score update successfully!",
          data: result,
        });
      } else {
        res.json({
          code: 4000,
          message: "User does not exist",
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

  async resetContestScore(ctx: AppContext, body: GetUserScoreBody) {
    const { res } = ctx;
    try {
      const { id } = body;
      const user = await UserModel.findById(id);
      if (user) {
        const result = await UserModel.findOneAndUpdate(
          { _id: id },
          { $set: { contestScore: 0, areaScores: [] } },
          { new: true }
        );
        if (result) {
          res.json({
            code: 0,
            message: "User contest score cleared successfully!",
            data: {
              areaScores: result.areaScores,
              contestTotal: result.contestScore,
            },
          });
        } else {
          res.json({
            code: 400,
            message: "Error clearing contest",
          });
        }
      } else {
        res.json({
          code: 400,
          message: "User does not exist",
        });
      }
    } catch (e) {
      const error = new Error(`${e}`);
      res.json({
        code: 500,
        message: error.message,
      });
    }
  }

  async getReferralCode(ctx: AppContext, body: { id: string }) {
    const { res } = ctx;
    try {
      const { id } = body;
      const user = await UserModel.findById(id).lean();
      if (user) {
        if (user.referralCode) {
          const code = user.referralCode;
          res.json({
            code: 0,
            message: "Get Referral Code Successful!",
            data: code,
          });
        } else {
          var done = false;
          while (!done) {
            let result = "";
            const characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let counter = 0;
            while (counter < 5) {
              result += characters.charAt(
                Math.floor(Math.random() * characters.length)
              );
              counter += 1;
            }
            const found = await UserModel.findOne({ referralCode: result });
            if (!found) {
              done = true;
              const finish = await UserModel.findOneAndUpdate(
                { _id: id },
                { $set: { referralCode: result } }
              );

              if (finish) {
                res.json({
                  code: 0,
                  message: "New code created!",
                  data: result,
                });
              } else {
                res.json({
                  code: 3000,
                  message:
                    "Something went wrong with code assignment! Tried " +
                    result,
                });
              }
            }
          }
        }
      } else {
        res.json({
          code: 4000,
          message: "User does not exist! Received " + id,
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

  async getReferrer(ctx: AppContext, body: { id: string }) {
    const { res } = ctx;
    try {
      const { id } = body;
      const user = await UserModel.findById(id).lean();
      if (user) {
        if (user.referrer) {
          const name = await UserModel.findById(user.referrer).lean();
          if (name) {
            res.json({
              code: 0,
              message: "Get Referrer Successful!",
              data: name.nickname,
            });
          }
        } else {
          res.json({
            code: 3000,
            message: "Referrer does not exist",
          });
        }
      } else {
        res.json({
          code: 4000,
          message: "User does not exist! Received " + id,
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

  async setReferrer(ctx: AppContext, body: setReferrer) {
    const { res } = ctx;
    try {
      const { id } = body;
      const user = await UserModel.findById(id).lean();
      if (user) {
        if (user.referrer) {
          res.json({
            code: 3000,
            message: "User already has a referrer",
          });
        } else {
          const end = await UserModel.findOneAndUpdate(
            { _id: id },
            { $set: { referrer: body.referrer } }
          );
          if (end) {
            res.json({
              code: 0,
              message: "referrer updated",
            });
          }
        }
      } else {
        res.json({
          code: 4000,
          message: "User does not exist! Received " + id,
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

  async getAllReferredUsers(ctx: AppContext, body: { id: string }) {
    const { id } = body;
    const { res } = ctx;
    try {
      const user = await UserModel.findById(id).lean();
      if (user) {
        res.json({
          code: 0,
          message: "Referred users found",
          data: user.usersReferred,
        });
      } else {
        res.json({
          code: 4000,
          message: "User does not exist! Received " + id,
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

  async updateReferredUserBonus(
    ctx: AppContext,
    body: { referrerId: string; refereeId: string }
  ) {
    const { referrerId, refereeId } = body;
    const { res } = ctx;
    try {
      const OG = await UserModel.findById(referrerId).lean();
      if (OG) {
        const update = await UserModel.findOneAndUpdate(
          { _id: referrerId, "usersReferred.userID": refereeId },
          { $set: { "usersReferred.$.bonusReceived": true } }
        );
        if (update) {
          res.json({
            code: 0,
            message: "Successfully updated referred user bonus received",
            data: update,
          });
        } else {
          res.json({
            code: 5000,
            message: "Error updating referred user bonus received",
          });
        }
      } else {
        res.json({
          code: 5000,
          message: "User not found",
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

  async getAllContestUsersInfo(ctx: AppContext) {
    const { res } = ctx;
    try {
      const allUsers = await UserModel.find(
        { contestScore: { $gt: 0 } },
        { id: true, nickname: true, contestScore: true, areaScores: true }
      );
      if (allUsers) {
        res.json({
          code: 0,
          message: "Users found",
          data: allUsers,
        });
      } else {
        res.json({
          code: 400,
          message: "No users found!",
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

  async getUserAccessLevel({
    req,
    res,
  }: {
    req: Request;
    res: Response;
  }): Promise<void> {
    const { userId } = req.params;

    // Check if userId is provided in the request
    if (!userId) {
      res.status(400).json({
        code: 4001,
        message: "User ID is required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        code: 4002,
        message: "Invalid User ID format",
      });
      return;
    }

    try {
      // Fetch the user by their ID
      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).json({
          code: 4040,
          message: "User not found",
        });
        return;
      }

      // Respond with the user's access level
      res.status(200).json({
        code: 0,
        message: "User access level retrieved successfully",
        data: {
          accessLevel: user.accessLevel || "basic", // Default to "basic" if accessLevel is not set
        },
      });
    } catch (error) {
      // Handle any errors that occur during the fetch operation
      res.status(500).json({
        code: 5000,
        message: "Error retrieving user",
      });
      console.error("Error retrieving user:", error);
    }
  }

  async searchUserByNameOrEmail(ctx: AppContext, body: { searchTerm: string }) {
    const { searchTerm } = body;
    const { res } = ctx;
    console.log(body)
    try {
      if (!searchTerm) {
        return res.json({
          code: 4001,
          message: "Missing search term",
          data: null,
        });
      }

      // Find user by name or email (case-insensitive)
      const users = await UserModel.find({
        $or: [
          { email: new RegExp(`^${searchTerm}$`, "i") },
          { nickname: new RegExp(searchTerm, "i") },
          { accessLevel: new RegExp(`^${searchTerm}$`, "i") }, 
        ],
      })
        .select( "_id nickname email accessLevel role institution score label review create hoursCertified createdAt updatedAt")
        .lean();

      if (users.length === 0) {
        return res.json({
          code: 4002,
          message: `No users found with search term "${searchTerm}"`,
          data: [],
        });
      }
      
      return res.json({
        code: 0,
        message: `${users.length} user(s) found`,
        data: users,
      });
    } catch (e) {
      return res.json({
        code: 5000,
        message: `Internal server error: ${e instanceof Error ? e.message : e}`,
        data: null,
      });
    }
  }

  async grantAdminRight(ctx: AppContext, body: { userId: string }) {
    const { userId } = body;

    try {
      // Check if userId is provided
      if (!userId) {
        throw new Error("Missing user ID");
      }

      // Find user by ID
      const user = await UserModel.findById(userId).lean();

      if (!user) {
        throw new Error(`User not found with ID "${userId}"`);
      }

      // Grant admin rights by updating the access level
      user.accessLevel = "admin";

      // Save the updated user
      const updatedUser = await UserModel.findByIdAndUpdate(userId, user, {
        new: true,
      }).lean();

      return updatedUser; // Return the updated user data to the controller
    } catch (e) {
      throw new Error(
        `Internal server error: ${e instanceof Error ? e.message : e}`
      );
    }
  }

  async revokeAdminRight(ctx: AppContext, body: { userId: string }) {
    const { userId } = body;

    try {
      // Check if userId is provided
      if (!userId) {
        throw new Error("Missing user ID");
      }

      // Find user by ID
      const user = await UserModel.findById(userId).lean();

      if (!user) {
        throw new Error(`User not found with ID "${userId}"`);
      }

      // Grant admin rights by updating the access level
      user.accessLevel = "basic";

      // Save the updated user
      const updatedUser = await UserModel.findByIdAndUpdate(userId, user, {
        new: true,
      }).lean();

      return updatedUser; // Return the updated user data to the controller
    } catch (e) {
      throw new Error(
        `Internal server error: ${e instanceof Error ? e.message : e}`
      );
    }
  }

  async fetchAllAdmins(ctx: AppContext) {
  const { res } = ctx;
  try {
    const adminUsers = await UserModel.find({ accessLevel: "admin" }).lean(); // <-- only admins

    res.json({
      code: 0,
      message: "Get admins successfully",
      data: adminUsers.map((item) => ({
        email: item.email,
        score: item.score,
        username: item.nickname,
        role: item.role,
        institution: item.institution,
        accessLevel: item.accessLevel,
      })),
    });
  } catch (e) {
    const error = new Error(`${e}`);
    res.json({
      code: 5000,
      message: error.message,
    });
  }
}

async addCertifiedHours(
  ctx: AppContext,
  params: { email: string; hours: number }
): Promise<{
  code: number;
  message: string;
  data?: { userId: string; hoursCertified: number };
}> {
  const { email, hours } = params;

  // Validate input
  if (!email || typeof hours !== "number" || hours === 0) {
    return {
      code: 4001,
      message: "Missing or invalid parameters: non-zero number of hours and email are required.",
    };
  }

  try {
    // Find user (ensure no .lean())
    const userDoc = await UserModel.findOne({ email: email.toLowerCase() });

    if (!userDoc) {
      return {
        code: 4004,
        message: "User not found.",
      };
    }

    // Safely get current value
    const currentCertified = userDoc.hoursCertified ?? 0;
    const newCertified = currentCertified + hours;

    // Prevent going negative
    if (newCertified < 0) {
      return {
        code: 4002,
        message: `Cannot remove more hours than certified (${currentCertified}h).`,
      };
    }

    // Update and save
    userDoc.hoursCertified = newCertified;
    await userDoc.save();

    return {
      code: 0,
      message: "Certified hours updated successfully.",
      data: {
        userId: userDoc._id.toString(),
        hoursCertified: userDoc.hoursCertified,
      },
    };
  } catch (e) {
    return {
      code: 5000,
      message: `Internal server error: ${e instanceof Error ? e.message : e}`,
    };
  }
}

  
}
