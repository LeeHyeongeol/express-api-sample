const { User } = require('database/models');

const { decodeToken, setTokenCookie } = require('lib/token');

// access, refresh 둘다 없는 경우
// access 만료 후 refeesh 만 있는 경우 -> refresh의 uuid를 가지고 유저 식별 후 새로운 access 생성 후 클라로 전달

// 리프레시 토큰 생성
const refresh = async (res, refreshToken) => {
  try {
    const decoded = await decodeToken(refreshToken);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      throw new Error('Invalid User error');
    }

    const tokens = await user.refreshUserToken(decoded.exp, refreshToken);
    setTokenCookie(res, tokens);

    return user;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// access가 있으면 해독후 유저정보 확인
// access가 없으면 refresh 사용
const consumeToken = async (req, res, next) => {
  const { access_token: accessToken, refresh_token: refreshToken } =
    req.cookies;

  try {
    if (!accessToken) {
      throw new Error('No access token');
    }
    const accessTokenData = await decodeToken(accessToken);
    const { id: userId } = accessTokenData.user;
    const user = await User.findByPk(userId);
    req.user = user;

    //refresh token의 만료기간이 30분 미만 일 때
    const diff = accessTokenData.exp * 1000 - new Date().getTime();
    if (diff < 1000 * 60 * 60 * 30 && refreshToken) {
      await refresh(res, refreshToken);
    }
  } catch (err) {
    if (!refreshToken) return next();
    try {
      const user = await refresh(res, refreshToken);
      req.user = user;
    } catch (e) {
      return next(e);
    }
  }
  return next();
};

module.exports = consumeToken;
