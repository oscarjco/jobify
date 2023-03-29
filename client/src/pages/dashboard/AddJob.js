import { useNavigate } from 'react-router-dom'
import { FormRow, Alert } from "../../components";
import { useAppContext } from "../../context/AppContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import FormRowSelect from "../../components/FormRowSelect";

const AddJob = () => {
  const {
    job,
    createJob,
    handleChange,
    clearValues,
    displayAlert,
    showAlert,
    isEditing,
    updateJob,
  } = useAppContext();
  

  const navigate = useNavigate();

  const { position, company, location } = job;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!position || !company || !location) {
      displayAlert();
      return;
    }

    if (isEditing) {
      updateJob();
      setTimeout(() => {
        navigate('/all-jobs');
      }, 3000);
      return;
    }

    createJob();
    setTimeout(() => {
      navigate('/all-jobs');
    }, 3000);
  };

  const handleJobInput = (e) => {
    handleChange({ name: e.target.name, value: e.target.value });
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? "edit job" : "add job"}</h3>
        {showAlert && <Alert />}

        <div className="form-center">
          <FormRow
            type="text"
            name="position"
            value={job.position}
            onChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="company"
            value={job.company}
            onChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="location"
            labelName="Location"
            value={job.location}
            onChange={handleJobInput}
          />
          <FormRowSelect
            name="type"
            value={job.type}
            onChange={handleJobInput}
            list={job.typeOptions}
          />
          <FormRowSelect
            name="status"
            value={job.status}
            onChange={handleJobInput}
            list={job.statusOptions}
          />
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                clearValues();
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
