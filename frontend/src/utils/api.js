export function getApiErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data || error;

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.errors && typeof responseData.errors === "object") {
    return Object.values(responseData.errors).join(" ");
  }

  return fallbackMessage;
}
