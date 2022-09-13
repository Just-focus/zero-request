import type { AxiosResponse, AxiosError } from 'axios';
import type { BackendResultFormat, RequestConfig } from '..';

const notify = {
  response: {
    onFulfilled: (response: AxiosResponse<BackendResultFormat>) => {
      const { code, message } = response.data;
      const { desc, notifyWhenFailure, notifyWhenSuccess, method } =
        response.config as RequestConfig;
      if (desc) {
        // 对code为SUCCESS的响应做成功反馈
        if (code === 'SUCCESS') {
          if (notifyWhenSuccess !== false) {
            if (
              ['delete', 'put', 'post'].includes(method?.toLowerCase() || '') ||
              notifyWhenSuccess === true
            ) {
              console.log(`${desc}成功`);
            }
          }
          // 针对code不为0的响应做失败反馈
        } else if (notifyWhenFailure !== false) {
          console.log(`${desc}错误，原因：${message}`);
        }
      }
      return response;
    },
    onRejected: (error: AxiosError<BackendResultFormat>) => {
      const { response, config } = error;
      // 对4xx，5xx状态码做失败反馈
      const { desc } = config as RequestConfig;
      if (desc) {
        if (response?.status && response?.statusText) {
          console.log(`${desc}错误，原因：${response.data.message}`);
        } else {
          // 处理请求响应失败,例如网络offline，超时等做失败反馈
          console.log(`${desc}失败，原因：${error.message}`);
        }
      }
      return error;
    },
  },
};

export default notify;
