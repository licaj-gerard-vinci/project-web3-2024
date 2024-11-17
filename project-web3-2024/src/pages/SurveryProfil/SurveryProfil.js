import React, { useState } from 'react';
import Form from '@rjsf/core';
import AJV8Validator from '@rjsf/validator-ajv8';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { db } from '../../firebaseConfig';
import './Survery.css';

const CompleteProfileForm = ({ onClose, initialData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    age: initialData.age || '',
    gender: initialData.gender || '',
    Weight: initialData.Weight || '',
    Height: initialData.Height || '',
  });

  const steps = [
    {
      title: 'Personal Information',
      schema: {
        title: "Personal Information",
        type: "object",
        properties: {
          firstName: { type: "string", title: "First Name", readOnly: true },
          lastName: { type: "string", title: "Last Name", readOnly: true },
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
          },
        },
      },
    },
    {
      title: 'Additional Details',
      schema: {
        title: "Additional Details",
        type: "object",
        properties: {
          Weight: { type: "integer", title: "Weight" },
          Height: { type: "integer", title: "Height" },
          
        },
      },
    },
  ];

  const uiSchema = {
    "ui:submitButtonOptions": {
      norender: true, // Disable rendering of the default submit button
    },
    additionalDetails: {
      gender: {
        "ui:enumNames": ["Male", "Female"], // Use ui:enumNames instead of enumNames
      },
    },
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async ({ formData: submittedData }) => {
    console.log("Submitted data:", submittedData);

    if (!submittedData || Object.keys(submittedData).length === 0) {
      console.error("No data to submit.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(db, `users/${user.uid}`);
      try {
        await update(userRef, {
          firstName: submittedData.firstName,
          lastName: submittedData.lastName,
          age: submittedData.age,
          gender: submittedData.gender,
          Weight: submittedData.Weight,
          Height: submittedData.Height,
        });
        console.log("Data saved successfully in Firebase!");
      } catch (error) {
        console.error("Error saving data to Firebase:", error);
      }
    } else {
      console.error("No authenticated user found.");
    }

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
        uiSchema={uiSchema}
        formData={formData}
        validator={AJV8Validator}
        onChange={(e) => setFormData(e.formData)}
        onSubmit={(e) => {
          if (currentStep === steps.length - 1) {
            handleSubmit(e);
          } else {
            handleNext();
          }
        }}
      />

      <div className="form-navigation">
        {currentStep > 0 && <button onClick={handlePrevious}>Previous</button>}
        <button onClick={() => {
          if (currentStep === steps.length - 1) {
            handleSubmit({ formData });
          } else {
            handleNext();
          }
        }}>
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </motion.div>
  );
};

export default CompleteProfileForm;
