import Job from "../model/Job.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../error/index.js";
import checkPermissions from "../util/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company)
    throw new BadRequestError("Please provide all values");

  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const { company, position } = req.body;

  if (!company || !position)
    throw new BadRequestError("Please provide all values");

  const job = await Job.findOne({ _id: id });

  if (!job) throw new NotFoundError(`No job with ID ${id}`);

  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findOne({ _id: id });

  if (!job) throw new NotFoundError(`No job with ID ${id}`);

  checkPermissions(req.user, job.createdBy);

  await job.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Job deleted" });
};

const listJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query;
  const query = { createdBy: req.user.userId };

  if (status != "all") query.status = status;
  if (jobType != "all") query.type = jobType;
  if (search) {
    let filters = [];
    filters.push({position: { $regex: search, $options: "i" }})
    filters.push({company: { $regex: search, $options: "i" }})
    query.$or = filters;
  }

  let result = Job.find(query);

  switch (sort) {
    case "latest":
      result = result.sort('-createdAt');
      break;
    case "oldest":
      result = result.sort('createdAt');
      break;
    case "A-Z":
      result = result.sort('position');
      break;
    case "Z-A":
      result = result.sort('-position');
      break;

    default:
      break;
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  console.log(req.query.page);

  result = result.skip(skip).limit(limit);

  const jobList = await result;
  const totalJobs = await Job.countDocuments(query);
  const totalPages = Math.ceil(totalJobs / limit);

  res
    .status(StatusCodes.OK)
    .json({ jobList, totalJobs, totalPages});
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  stats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item; // accepts 0-11
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");

      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ stats, monthlyApplications });
};

export { createJob, deleteJob, listJobs, updateJob, showStats };
