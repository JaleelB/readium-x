export type UserProfile = {
  id: UserId;
  name: string | null;
  image: string | null;
};

export type UserId = string;

export type UserSession = {
  id: UserId;
};
