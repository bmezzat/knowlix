import { decodeJwt, createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

const REGION = process.env.COGNITO_REGION!;
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!;
const ISSUER = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;


export async function verifyCognitoAccessToken(token: string): Promise<JWTPayload> {
  const decoded = decodeJwt(token);
 
  const jwksUrl = `${decoded.iss}/.well-known/jwks.json`;
  const JWKS = createRemoteJWKSet(new URL(jwksUrl));
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER
    });
    if (payload.client_id !== process.env.COGNITO_CLIENT_ID) {
      throw new Error("Invalid client_id");
    }
    if ((payload as any).token_use !== 'access') {
      throw new Error('Not an access token');
    }
    return payload;
  } catch (err: any) {
    console.error("JWT verification error:", err);
    throw err;
  }
}
