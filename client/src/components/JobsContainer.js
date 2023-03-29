import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";
import {Loading, Job, PageBtnContainer} from "./";
import Wrapper from "../assets/wrappers/JobsContainer";

const JobsContainer = () => {
  const { 
    listJobs, 
    jobList, 
    isLoading,
    totalPages,
    currentPage, 
    totalJobs, 
    search } = useAppContext();

    const {text, status, type, sort} = search;

  useEffect(() => {
    listJobs();
  }, [currentPage, text, status, type, sort]);

  if (isLoading) return <Loading center />;
  if (jobList.length === 0)
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );

  return (
    <Wrapper>
      <h5>
        {totalJobs} job{jobList.length > 1 && "s"} found | <i>Ordered by {sort}</i>
      </h5>
      <div className="jobs">
        {jobList.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
      {totalPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default JobsContainer;