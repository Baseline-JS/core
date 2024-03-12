export function getErrorMessage(error: unknown) {
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else {
    message = String(error);
  }
  return message;
}
