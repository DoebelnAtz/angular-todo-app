class CustomError extends Error {
  constructor(
    public response: string = "Internal server error",
    public status: number = 500,
    public description: string = "",
    public message: string = "Something went wrong"
  ) {
    super();
  }
}

export default CustomError;
