class ErrorHandler {
    static handle(error) {
        if (error.response) {
            // API 错误响应
            console.error('API Error:', {
                status: error.response.status,
                message: error.response.data
            });
            return {
                success: false,
                error: '服务暂时不可用，请稍后重试'
            };
        } else if (error.request) {
            // 请求发送失败
            console.error('Request Error:', error.request);
            return {
                success: false,
                error: '网络连接失败，请检查网络设置'
            };
        } else {
            // 其他错误
            console.error('General Error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default ErrorHandler;