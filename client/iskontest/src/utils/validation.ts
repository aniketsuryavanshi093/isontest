import type { FormErrors } from "../types";

export const validateEmail = (email: string): string | undefined => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters long";
  return undefined;
};

export const validateName = (name: string): string | undefined => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters long";
  return undefined;
};

export const validateRequired = (
  value: string,
  fieldName: string
): string | undefined => {
  if (!value || value.trim() === "") return `${fieldName} is required`;
  return undefined;
};

export const validateDate = (date: string): string | undefined => {
  if (!date) return "Date is required";
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) return "Date cannot be in the past";
  return undefined;
};

export const validateTime = (time: string): string | undefined => {
  if (!time) return "Time is required";
  return undefined;
};

export const validateCapacity = (capacity: string): string | undefined => {
  if (!capacity) return "Capacity is required";
  const num = parseInt(capacity);
  if (isNaN(num) || num < 1) return "Capacity must be a positive number";
  return undefined;
};

export const validateForm = (
  data: Record<string, any>,
  validators: Record<string, (value: any) => string | undefined>
): FormErrors => {
  const errors: FormErrors = {};

  Object.keys(validators).forEach((field) => {
    const validator = validators[field];
    const error = validator(data[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};
