import { jwtDecode } from "jwt-decode";
import { Claims } from "../types";

function getAccessToken(): string | null {
  return sessionStorage.getItem("accessToken");
}

function getClaims(): Claims | undefined {
  const claims = sessionStorage.getItem("claims");
  if (!claims) {
    return undefined;
  }
  return JSON.parse(claims) as Claims;
}

function setAccessToken(token: string): Claims {
  sessionStorage.setItem("accessToken", token);
  const claims = jwtDecode<Claims>(token);
  sessionStorage.setItem("claims", JSON.stringify(claims));
  return claims;
}

function clear(): void {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("claims");
}

export default {
  getAccessToken,
  getClaims,
  setAccessToken,
  clear,
};
