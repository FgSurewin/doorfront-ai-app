import { SECRET } from "./../database/index";
import { LoginBody } from "./../types/index";
import { AppContext, UserBody } from "../types";

import UserModel, { UserInterface } from "../database/models/user";
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
  UpdateContestScore
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
      const currentUser = await UserModel.findById(id);
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

  async getContestScore(ctx:AppContext, body: GetUserScoreBody){
    const {res} = ctx;
    try{
      const {id} = body;
      const user = await UserModel.findById(id);
      if (user){
        const contestScore = user.contestScore;
        res.json({
          code:0,
          message: "Get User Contest Score Successful!",
          data:contestScore
        })
      }
      else {
        res.json({
          code: 4000,
          message: "User does not exist",
        });
      }

    } catch(e) {
      const error = new Error(`${e}`);
      res.json({
        code: 5000,
        message: error.message,
      });
    }
    
  }

  async updateContestStats(ctx:AppContext, body:UpdateContestStats) {
    const {res} = ctx;

    try{
      const {id, areaName, areaScore} = body;
      const user = await UserModel.findById(id);
      if(user) {
        const result = await UserModel.findOneAndUpdate(
          {_id: id, areaScores: {$elemMatch: {areaName:areaName}}},
          {$set: {areaScore:areaScore}},
          {upsert:true, new:true, rawResult:true}
        )
        if(result.ok){
          res.json({
            code:0,
            message: "User contest stats update successfully!",
            data:result
          })
        }
        else {
          res.json({
            code:500,
            message: "User contest stats update failed!"
          })
        }
      } else {
        res.json({
          code: 4000,
          message: "User does not exist",
        });
      }

    } catch(e) {
      const error = new Error(`${e}`);
      res.json({
        code: 5000,
        message: error.message,
      });
    }
  }

  async updateContestScore(ctx:AppContext,body:UpdateContestScore) {
    const {res} = ctx;
    try{
      const {id,contestScore} = body;
      const user = await UserModel.findById(id);
      if(user){
        const result = await UserModel.findOneAndUpdate(
          {_id:id},
          {$inc: {contestScore:contestScore}},
          {new:true,}
        )
        res.json({
          code:0,
          message: "User contest score update successfully!",
          data:result
        })

      }
      else{
        res.json({
          code: 4000,
          message: "User does not exist",
        });
      }
    } catch(e) {
        const error = new Error(`${e}`);
        res.json({
          code: 5000,
          message: error.message,
        });
    }
  }

  async resetContestScore(ctx:AppContext,body:GetUserScoreBody){
    const {res} = ctx;
    try{
      const {id} = body;
      const user = await UserModel.findById(id);
      if(user){
        const result = await UserModel.findOneAndUpdate(
          {_id:id},
          {contestScore:0},
          {new:true,}
        )
        res.json({
          code:0,
          message: "User contest score cleared successfully!",
          data:result
        })

      } else{
        res.json({
          code: 4000,
          message: "User does not exist",
        });
      }
    } catch(e){
        const error = new Error(`${e}`);
        res.json({
          code: 5000,
          message: error.message,
        });
    }
  }
}
