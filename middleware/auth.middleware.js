const refreshTokenMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies?.refreshToken || req.headers("Authorization").split(" ")[1];
    if (!refreshToken) {
      throw new ApiError(400, "Unauthorized request");
    }
    const decodedUser = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!decodedUser) {
      throw new ApiError(400, "Invalid Token");
    }
    req.refreshToken = refreshToken;
    req.decodedUser = decodedUser;
    next();
  } catch (error) {
    throw new ApiError(
      400,
      "Invalid Refresh Token please login again to continue"
    );
  }
});
