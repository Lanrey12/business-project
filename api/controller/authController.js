import User from "../models/user-model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, userExist.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET);
    //the line below is to destructure password from the response data so the password is not seen
    const { password: passwordValue, ...userData} = userExist._doc
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(userData);
  } catch (error) {
    next(error);
  }
};
