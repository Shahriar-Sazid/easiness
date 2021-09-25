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
  {
    type: "min",
    message: "Input is less than minimum limit"
  },
  {
    type: "max",
    message: "Input is greater than maximum limit"
  }
];

interface ErrorMessage {
  type: string;
  message: string;
}
