export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

export type UserSignupPayloadType = {
  firstName: string;
  lastName: string;
  roles: string[];
};

export type UserLoginPayloadType = {
  password: string;
  email: string;
};
