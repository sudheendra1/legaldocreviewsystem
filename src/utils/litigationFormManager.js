import React, { createContext, useState, useContext } from "react";

const LitigationFormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    suitPermission: {},
    suitFiled: {},
    DRT: {},
    finalPage: {},
    type:'', 
  });

  return (
    <LitigationFormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </LitigationFormDataContext.Provider>
  );
};

export const useFormData = () => useContext(LitigationFormDataContext);