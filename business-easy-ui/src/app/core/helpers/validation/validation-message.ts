export const validationMessages: ErrorMessage[] = [
  {
    type: "required",
    message: "This field is required",
  },
  {
    type: "minlength",
    message: "Input is shorter than reqired",
  },
  {
    type: "maxlength",
    message: "Input is longer than maximum limit",
  },
  {
    type: "email",
    message: "Input format is wrong",
  },
  {
    type: "phoneNumberInvalid",
    message: "Invalid phone no",
  },
];

interface ErrorMessage {
  type: string;
  message: string;
}
