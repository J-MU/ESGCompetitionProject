const response = ({isSuccess, code, message}, result) => {
   return {
        isSuccess: isSuccess,
        code: code,
        message: message,
        result: result
   }
  };

  const errResponse = ({isSuccess, code, title, detail}) => {
    return {
        isSuccess: isSuccess,
        code: code,
        title: title,
        detail: detail
      }
  };
  
  module.exports = { response, errResponse };