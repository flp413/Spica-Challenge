export interface AuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface AuthCredentials {
  clientId: string;
  clientSecret: string;
}
