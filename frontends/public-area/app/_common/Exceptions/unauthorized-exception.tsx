class UnauthorizedException extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedException";
  }
}

export default UnauthorizedException;
