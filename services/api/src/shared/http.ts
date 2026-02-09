type ApiError = {
  error: string;
};

export const errorResponse = (message: string): ApiError => ({
  error: message,
});
