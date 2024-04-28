import { axiosPrivate } from "./axios.helpers";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: process.env.API_URL }) =>
  async ({ url, method, data, params }) => {
    try {
      var result = await axiosPrivate({
        url: url.startsWith("http") ? url : baseUrl + url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
