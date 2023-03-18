import React, { Component } from "react";
import { Form, Text, NestedForm } from "react-form";

const Job = ({ i }) => (
  <NestedForm field={["jobs", i]} key={`nested-job-${i}`}>
    <Form>
      {(formApi) => (
        <div>
          <h2>Job</h2>
          <label htmlFor={`nested-job-first-${i}`}>First name</label>
          <Text field="firstName" id={`nested-job-first-${i}`} />
          <label htmlFor={`nested-job-last-${i}`}>Last name</label>
          <Text field="lastName" id={`nested-job-last-${i}`} />
        </div>
      )}
    </Form>
  </NestedForm>
);

class FormWithArrayOfNestedForms extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Form onSubmit={(submittedValues) => console.log(submittedValues)}>
          {(formApi) => (
            <div>
              <form onSubmit={formApi.submitForm} id="form3">
                {formApi.values.jobs &&
                  formApi.values.jobs.map((f, i) => (
                    <div key={i}>
                      <Job i={i} />
                      <button
                        onClick={() => formApi.removeValue("jobs", i)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                <button
                  onClick={() =>
                    formApi.addValue("jobs", {
                      firstName: "",
                      lastName: ""
                    })
                  }
                  type="button"
                  className="mb-4 mr-4 btn btn-success"
                >
                  Add Job
                </button>
                <button type="submit" className="mb-4 btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          )}
        </Form>
      </div>
    );
  }
}

export default FormWithArrayOfNestedForms;
