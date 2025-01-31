import { SocialProvider } from './model/types';

const BASE_REDIRECT_URI = process.env.NEXT_PUBLIC_WEB_URI;

const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;

const genRedirectUri = (provider: SocialProvider) =>
  `${BASE_REDIRECT_URI}/${provider}/callback`;

const kakaoRedirectUri = genRedirectUri('kakao');
const naverRedirectUri = genRedirectUri('naver');
const googleRedirectUri = genRedirectUri('google');
// const appleRedirectUri = genRedirectUri('apple');
const appleRedirectUri = `${BASE_REDIRECT_URI}/api/callback/apple`;

const KAKAO_SOCIAL_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${kakaoRedirectUri}&response_type=code`;
const NAVER_SOCIAL_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&redirect_uri=${naverRedirectUri}&response_type=code`;
const GOOGLE_SOCIAL_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${googleRedirectUri}&response_type=code&scope=email profile`;
const APPLE_SOCIAL_AUTH_URL = `https://appleid.apple.com/auth/authorize?client_id=${APPLE_CLIENT_ID}&redirect_uri=${appleRedirectUri}&response_type=code id_token&scope=name email&response_mode=form_post`;

const POLICY_URL = 'https://mewing-sun-887.notion.site/30a82fa5850c4a90b73f542f9916a735';
const PRIVACY_URL =
  'https://mewing-sun-887.notion.site/fcc610c6a4c04ae2813be8ff3d98c56b?pvs=4';

export {
  APPLE_SOCIAL_AUTH_URL,
  appleRedirectUri,
  BASE_REDIRECT_URI,
  GOOGLE_SOCIAL_AUTH_URL,
  googleRedirectUri,
  KAKAO_SOCIAL_AUTH_URL,
  kakaoRedirectUri,
  NAVER_SOCIAL_AUTH_URL,
  POLICY_URL,
  PRIVACY_URL,
};
