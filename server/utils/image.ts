import { ImageField } from "../types";

export const getField = (count: number): ImageField => {
  let result: ImageField = "user_one";
  switch (count) {
    case 1:
      result = "user_one";
      break;
    case 2:
      result = "user_two";
      break;
    case 3:
      result = "user_three";
      break;
    default:
      break;
  }
  return result;
};
