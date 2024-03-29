import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../error/index.js";
import User from "../model/User.js";

const register = async (req, res) => {
  const { name, password, email } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all required values");
  }

  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    code: 0,
    msg: "REGISTER_USER_SUCCESS",
    user: { email: user.email, name: user.name },
    token: token,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError("Please provide all values");

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new UnauthenticatedError("Invalid credentials");

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  const token = user.createJWT();
  user.password = undefined;

  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};
const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;

  if (!email || !name || !lastName || !location)
    throw new BadRequestError("Please provide all credentials");

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

export { register, login, updateUser };
