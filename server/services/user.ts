import { SECRET } from "./../database/index";
import { LoginBody } from "./../types/index";
import { AppContext, UserBody } from "../types";

import UserModel, { UserInterface, areaScores } from "../database/models/user";
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
} from "../types/user";

// Bcrypt Configuration
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

export class UserService {
  async addUser(ctx: AppContext, body: UserBody) {
    const { res } = ctx;
    const { email, password, nickname } = body;
    try {
      const checkNickname: UserInterface[] = await UserModel.find({ nickname });
      if (checkNickname.length === 0) {
        const result: UserInterface[] = await UserModel.find({ email });
        if (result.length === 0) {
          const encodePassword = bcrypt.hashSync(password, salt);
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
          };
          await UserModel.create(newUser);
          res.json({
            code: 0,
            message: "Sign Up Successfully!",
            data: result,
          });
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
              data: { token, nickname: result[0].nickname, id: result[0]._id },
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

  // async addLabelImage(ctx: AppContext, body: QueryImageBody) {
  //   const { res } = ctx;
  //   try {
  //     const { id, data } = body;
  //     const currentUser = await UserModel.findById(id);
  //     if (currentUser) {
  //       const newLabelImages = [...currentUser.label_images, data];
  //       const result = await UserModel.findOneAndUpdate(
  //         { _id: id },
  //         {
  //           label_images: newLabelImages,
  //         },
  //         {
  //           new: true,
  //           upsert: true,
  //           rawResult: true, // Return the raw result from the MongoDB driver
  //         }
  //       );
  //       if (result.ok === 1) {
  //         res.json({
  //           code: 0,
  //           message: "Add label image successfully",
  //           data: result,
  //         });
  //       } else {
  //         res.json({
  //           code: 4000,
  //           message: "Fail to add label image",
  //         });
  //       }
  //     } else {
  //       res.json({
  //         code: 4000,
  //         message: "User is not existed",
  //       });
  //     }
  //   } catch (e) {
  //     const error = new Error(`${e}`);
  //     res.json({
  //       code: 5000,
  //       message: error.message,
  //     });
  //   }
  // }

  // async deleteLabelImage(ctx: AppContext, body: QueryImageBody) {
  //   const { res } = ctx;
  //   try {
  //     const { id, data } = body;
  //     const currentUser = await UserModel.findById(id);
  //     if (currentUser) {
  //       const trimLabelImages = currentUser.label_images.filter(
  //         (item) => item.imageId !== data.imageId
  //       );
  //       const result = await UserModel.findOneAndUpdate(
  //         { _id: id },
  //         {
  //           label_images: trimLabelImages,
  //         },
  //         {
  //           new: true,
  //           upsert: true,
  //           rawResult: true, // Return the raw result from the MongoDB driver
  //         }
  //       );
  //       if (result.ok === 1) {
  //         res.json({
  //           code: 0,
  //           message: "Delete label image successfully",
  //           data: result,
  //         });
  //       } else {
  //         res.json({
  //           code: 4000,
  //           message: "Fail to delete label image",
  //         });
  //       }
  //     } else {
  //       res.json({
  //         code: 4000,
  //         message: "User is not existed",
  //       });
  //     }
  //   } catch (e) {
  //     const error = new Error(`${e}`);
  //     res.json({
  //       code: 5000,
  //       message: error.message,
  //     });
  //   }
  // }

  // async addUnLabelImage(ctx: AppContext, body: QueryImageBody) {
  //   const { res } = ctx;
  //   try {
  //     const { id, data } = body;
  //     const currentUser = await UserModel.findById(id);
  //     if (currentUser) {
  //       const newUnLabelImages = [...currentUser.unLabel_images, data];
  //       const result = await UserModel.findOneAndUpdate(
  //         { _id: id },
  //         {
  //           unLabel_images: newUnLabelImages,
  //         },
  //         {
  //           new: true,
  //           upsert: true,
  //           rawResult: true, // Return the raw result from the MongoDB driver
  //         }
  //       );
  //       if (result.ok === 1) {
  //         res.json({
  //           code: 0,
  //           message: "Add unLabel image successfully",
  //           data: result,
  //         });
  //       } else {
  //         res.json({
  //           code: 4000,
  //           message: "Fail to add unLabel image",
  //         });
  //       }
  //     } else {
  //       res.json({
  //         code: 4000,
  //         message: "User is not existed",
  //       });
  //     }
  //   } catch (e) {
  //     const error = new Error(`${e}`);
  //     res.json({
  //       code: 5000,
  //       message: error.message,
  //     });
  //   }
  // }

  // async deleteUnLabelImage(ctx: AppContext, body: QueryImageBody) {
  //   const { res } = ctx;
  //   try {
  //     const { id, data } = body;
  //     const currentUser = await UserModel.findById(id);
  //     if (currentUser) {
  //       const trimUnLabelImages = currentUser.unLabel_images.filter(
  //         (item) => item.imageId !== data.imageId
  //       );
  //       const result = await UserModel.findOneAndUpdate(
  //         { _id: id },
  //         {
  //           unLabel_images: trimUnLabelImages,
  //         },
  //         {
  //           new: true,
  //           upsert: true,
  //           rawResult: true, // Return the raw result from the MongoDB driver
  //         }
  //       );
  //       if (result.ok === 1) {
  //         res.json({
  //           code: 0,
  //           message: "Delete unLabel image successfully",
  //           data: result,
  //         });
  //       } else {
  //         res.json({
  //           code: 4000,
  //           message: "Fail to delete unLabel image",
  //         });
  //       }
  //     } else {
  //       res.json({
  //         code: 4000,
  //         message: "User is not existed",
  //       });
  //     }
  //   } catch (e) {
  //     const error = new Error(`${e}`);
  //     res.json({
  //       code: 5000,
  //       message: error.message,
  //     });
  //   }
  // }

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
          labels: item.label,
          review: item.review,
          modify: item.modify,
          create: item.create,
          contestScore: item.contestScore,
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

  async getNickname(ctx: AppContext, body: {id:string}) {
    const { res } = ctx;
    try {
      const {id}  = body;
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
/*
  async assertOwnership(ctx: AppContext, body: ChallengeArea) {
    const { res } = ctx;

    try {
      const { id, areaName, areaScore } = body;
      const contest = await ContestModel.findOne({ active: true });
      let findIndex = -1;
      if (contest) {
        for (var i = 0; i < contest.areas.length; i++) {
          if (contest.areas[i].areaName === areaName) {
            findIndex = i;
            break;
          }
        }

        if (
          findIndex !== -1 &&
          contest.areas[findIndex].currentOwner === undefined
        ) {
          const takeover = await ContestModel.findOneAndUpdate(
            { active: true, areas: { $elemMatch: { areaName: areaName } } },
            { $set: { "areas.$.currentOwner": id } },
            { new: true }
          );

          // const bonusScore = await ContestModel.findOne({active:true,"areas.areaName": areaName})

          if (takeover) {
            res.json({
              code: 0,
              message: "Successfully attained ownership of area " + areaName,
              data: takeover,
            });
          } else {
            res.json({
              code: 400,
              message: "Error taking over " + areaName,
              data: takeover,
            });
          }
        } else {
          res.json({
            code: 400,
            message: areaName + " already has an owner",
            data: contest.areas.find((item) => item.areaName === areaName),
          });
        }
      } else {
        res.json({
          code: 400,
          message: "Contest does not have " + areaName + " as an area!",
          data: contest,
        });
      }
    } catch (e) {
      const error = new Error(`${e}`);
      //console.log(e)

      res.json({
        code: 5000,
        message: error.message,
      });
    }
  }
*/
  async updateContestStats(ctx: AppContext, body: UpdateContestStats) {
    const { res } = ctx;

    try {
      const { id, areaName, areaScoreIncrement } = body;
 
      let user = await UserModel.findOne({ _id: id }, { areaScores: true, contestScore:true });
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
            found = true  
            if(user.contestScore) userTotal = user.contestScore + areaScoreIncrement;
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
          if(user.contestScore) userTotal = user.contestScore + areaScoreIncrement;
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
              { areaScores: { $elemMatch: { areaName: areaName } }, contestScore:true }
            );
            if (areaLeader) {
              const leaderScore = areaLeader.areaScores[0].areaScore;
              if (leaderScore && newScore > (leaderScore - areaBonus)) {
                //leaderScore.areaScore - areaBonus and update to server
                //contest.areas[i].currentOwner = id and update to server
                user.areaScores[userAreaIndex].areaScore += areaBonus;
                const final = await UserModel.findByIdAndUpdate(
                  id,
                  {
                    $set: { areaScores: user.areaScores, contestScore: userTotal+areaBonus },
                  },
                  { new: true }
                );
                const bonusLoser = await UserModel.findOneAndUpdate(
                  { _id: originalOwner, "areaScores.areaName": areaName },
                  {
                    $inc: {
                      contestScore: (-areaBonus),
                      "areaScores.$.areaScore": (-areaBonus),
                    } /*,$inc:{contestScore:(-areaBonus),'areaScores.$.areaScore':(-areaBonus)}*/,
                  },
                  { new: true }
                );
                //contest.areas[0].currentOwner = id;
                const takeover = await ContestModel.findOneAndUpdate(
                  { active: true, "areas.areaName": areaName  },
                  { $set: { "areas.$.currentOwner": id } },
                  { new: true }
                );
                if (takeover && final && bonusLoser) {
                  sentResult = true;
                  res.json({
                    code: 10,
                    message:
                      "You took ownership of "+areaName+"!",
                    data: {
                      contest:
                        takeover.areas,
                      userTotal: final.contestScore,
                      userArea:
                        final.areaScores[userAreaIndex],
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
                        areaLeader:areaLeader
                      },
                    },
                  });
                }
                else {
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
                  " more points than you"
              }
            }
          }
          //else just take it over yourself
          else if(originalOwner !== id){
            //contest.areas[i].currentOwner = id and update to server
            //const areaIndexUser = result.areaScores.findIndex(item=>item.areaName === areaName)
            //const areaIndexContest = contest.areas.findIndex(item=>item.areaName ===areaName)
            //contest.areas[0].currentOwner = id;
            const takeover = await ContestModel.findOneAndUpdate(
              { active: true, "areas.areaName": areaName  },
              { $set: { "areas.$.currentOwner": id } },
              { new: true }
            );
            user.areaScores[userAreaIndex].areaScore += areaBonus;
            const final = await UserModel.findByIdAndUpdate(
              id,
              {
                $set: { areaScores: user.areaScores , contestScore: userTotal+areaBonus},
              },
              { new: true }
            );
            if (takeover && final) {
              sentResult = true;
              res.json({
                code: 1,
                message:
                "You took ownership of "+areaName+"!",
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
            { $set:{areaScores: user.areaScores, contestScore:userTotal} },
            {
              new: true,
              rawResult: true, // Return the raw result from the MongoDB driver
            }
          );
          if (finish.ok === 1 && finish.value) {
            res.json({
              code: 5,
              message: "You got +1 score in area "+areaName,
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
      } 
      else {
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
      const user = await UserModel.findOne({ _id: id, "areaScores:areaName": areaName }, { areaScores: {$elemMatch: {areaName:areaName}} }).lean();

      if (user) {
        res.json({
          code: 0,
          message: "User score for " + areaName + " retrieved successfully",
          data: user.areaScores[0].areaScore,
        });

        /*
        var found = false;
        var value = 0;
        user.areaScores.forEach(function (area) {
          if (area.areaName == areaName) {
            found = true;
            value = area.areaScore;
          }
        });

        if (found) {
          res.json({
            code: 0,
            message: "User score for " + areaName + " retrieved successfully",
            data: value,
          });
        } else {
          res.json({
            code: 400,
            message: "User has no value for area " + areaName,
            data: user,
          });
        }*/
      }
      else{
        res.json({
          code: 400,
          message: "Failed to get "+ areaName + " score for user " + id,
          data: user,
        })
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
}
