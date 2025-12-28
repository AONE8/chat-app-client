import { decodeToken } from "react-jwt";

import { Token } from "@/types/tokenType";

type TokenType = {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  exp: number;
};

export function parseToken(token: string): Token {
  const decodedToken = decodeToken(token) as TokenType;

  return {
    raw: token,
    user: {
      name: decodedToken[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ],
      email:
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
      id: decodedToken[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ],
    },
    exp: decodedToken.exp,
  };
}
