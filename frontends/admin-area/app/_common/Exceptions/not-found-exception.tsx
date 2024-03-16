class NotFoundException extends Error {
  constructor(message: string = "NotFound") {
    super(message);
    this.name = "NotFoundException";
  }
}

export default NotFoundException;
