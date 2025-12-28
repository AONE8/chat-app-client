interface UserToken {
  name: string;
  email: string;
  id: string;
}

export interface Token {
  raw: string;
  user: UserToken;
  exp: number;
}
