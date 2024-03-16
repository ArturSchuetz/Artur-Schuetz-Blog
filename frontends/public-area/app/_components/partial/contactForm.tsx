"use client"
import React, { FormEvent, useState } from "react";

import { sendContactFormData } from "@/app/_services/contact.service";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function validateForm(data: {
    name: string;
    email: string;
    message: string;
  }) {
    let errors = [];

    if (!data.name.trim()) {
      errors.push("Name is required");
    }

    if (
      !data.email.trim() ||
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)
    ) {
      errors.push("Valid email is required");
    }

    if (!data.message.trim()) {
      errors.push("Message is required");
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);

    if (validationErrors.length > 0) {
      setErrorMsg(validationErrors.join(", "));
      return;
    }

    const { success, message } = await sendContactFormData(formData);

    if (success) {
      setSuccessMsg(message);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setErrorMsg(null);
    } else {
      setErrorMsg(message);
    }
};

return <>{!successMsg && (
    <form onSubmit={handleSubmit}>
        <div className="row contact-form-row">
        <div className="col-md-6">
            <input
            id="name"
            className="form-control"
            type="text"
            placeholder="Name *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            />
        </div>
        <div className="col-md-6">
            <input
            id="email"
            className="form-control"
            type="email"
            placeholder="Email *"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            />
        </div>
        </div>
        <textarea
        className="form-control contact-form-textarea"
        id="message"
        rows={6}
        placeholder="Message *"
        name="message"
        value={formData.message}
        onChange={handleInputChange}
        ></textarea>
        {errorMsg && <p className="text-danger">{errorMsg}</p>}
        <button type="submit" className="btn">
        <i className="pe-7s-paper-plane"></i> Send
        </button>
    </form>
    )}
    {successMsg && (
    <p className="text-success">
        <div>
        <p>{successMsg}</p>
        </div>
    </p>
    )}</>;
};