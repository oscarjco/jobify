import express from "express"
const jobsRouter = express.Router()

import {
  createJob,
  deleteJob,
  listJobs,
  updateJob,
  showStats,
} from "../controller/jobsController.js"

jobsRouter.route("/")
    .get(listJobs)
    .post(createJob)
jobsRouter.route("/stats")
    .get(showStats)
jobsRouter.route("/:id")
    .patch(updateJob)
    .delete(deleteJob)

export default jobsRouter