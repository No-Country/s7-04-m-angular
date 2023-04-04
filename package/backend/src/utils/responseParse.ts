export type ResponseParsed = {
  statusCode: number;
  response: any;
};

const ResponseParse = (statusCode: number, response: any): ResponseParsed => {
  //Error handling
  if (statusCode >= 400 && statusCode <= 500) {
    if (typeof response === "string") {
      return { statusCode: statusCode, response: { error: response } };
    }
    return { statusCode: statusCode, response: response };
  }

  //Success handling
  if (typeof response === "string") {
    return { statusCode: statusCode, response: { message: response } };
  }
  return { statusCode: statusCode, response: response };
};

export default ResponseParse;
