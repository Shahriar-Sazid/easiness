export const validationMessages: ErrorMessage[] = [
  {
    type: "required",
    message: "This field is required",
  },
  {
    type: "minlength",
    message: "Input is shorter than required",
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
    type: "invalidQty",
    message: "Quantity must be less than or equal to available quantity",
  },
  {
    type: "invalidUnit",
    message: "This unit is not allowed",
  },
  {
    type: "min",
    message: "Input is less than minimum limit"
  }, 
  {
    type: "samePlaceError",
    message: "Place can't be same"
  },
  {
    type: "max",
    message: "Input is greater than maximum limit"
  },
  {
    type: "invalidFromToAccount",
    message: "From and to account can't be same"
  }
];

interface ErrorMessage {
  type: string;
  message: string;
}
