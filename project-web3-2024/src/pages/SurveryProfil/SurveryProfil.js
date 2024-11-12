import React, { useState } from 'react';
import Form from '@rjsf/core';
import AJV8Validator from '@rjsf/validator-ajv8';
import { motion } from 'framer-motion';
import './Survery.css';

const CompleteProfileForm = ({ onClose, initialData }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    prenom: initialData.prenom || '',
    nom: initialData.nom || '',
    email: initialData.email || '',  // Add email from initial data if available
  });

  const steps = [
    {
      title: 'Personal Information',
      schema: {
        title: "Personal Information",
        type: "object",
        properties: {
          prenom: { type: "string", title: "First Name", readOnly: true },
          nom: { type: "string", title: "Last Name", readOnly: true },
        },
      },
    },
    {
      title: 'Contact Information',
      schema: {
        title: "Contact Information",
        type: "object",
        properties: {
          email: { type: "string", title: "Email", readOnly: true },
          phone: { type: "string", title: "Phone Number *" },
        },
      },
    },
    {
      title: 'Additional Details',
      schema: {
        title: "Additional Details",
        type: "object",
        properties: {
          age: { type: "integer", title: "Age *" },
          gender: {
            type: "string",
            title: "Gender *",
            enum: ["male", "female"],
            enumNames: ["Male", "Female"],
          },
        },
      },
    },
    {
      title: 'Preferences',
      schema: {
        title: "Preferences",
        type: "object",
        properties: {
          notifications: { type: "boolean", title: "Receive Notifications" },
        },
      },
    },
  ];

  const uiSchema = {
    "ui:submitButtonOptions": {
      norender: true, // Disable rendering of the default submit button
    },
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = ({ formData }) => {
    console.log("Submitted data:", formData);
    onClose(); // Close modal on final submit
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="complete-profile-form"
    >
      <div className="form-progress">
        <p>Step {currentStep + 1} out of {steps.length}</p>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <h2>{steps[currentStep].title}</h2>
      <Form
        schema={steps[currentStep].schema}
        uiSchema={uiSchema} // Apply the custom uiSchema to hide the submit button
        formData={formData}
        validator={AJV8Validator}
        onChange={(e) => setFormData(e.formData)}
        onSubmit={currentStep === steps.length - 1 ? handleSubmit : handleNext}
      />

      <div className="form-navigation">
        {currentStep > 0 && <button onClick={handlePrevious}>Previous</button>}
        <button onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}>
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </motion.div>
  );
};

export default CompleteProfileForm;
