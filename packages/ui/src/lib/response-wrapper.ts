export function parseApiError(error: any) {
  const responseData = error?.response?.data;
  const statusCode = responseData?.statusCode || error?.response?.status;
  
  let message = 'Something went wrong!';
  
  if (responseData?.message) {
    message = responseData.message;
  } else if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  }
  
  const enhancedError = new Error(message);
  (enhancedError as any).statusCode = statusCode;
  (enhancedError as any).response = error.response;
  
  return enhancedError;
}
