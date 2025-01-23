// API配置
window.API_CONFIG = {
    baseURL: 'https://api.deepseek.com/v1',
    key: 'sk-ab52623e799b451bbed7cc0ff6cadd05',
    model: 'deepseek-chat',
    
    // 添加默认的请求配置
    defaultParams: {
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0
    },

    // 添加统一的API调用方法
    async callAPI(messages) {
        const maxRetries = 3;
        let lastError = null;

        for (let i = 0; i < maxRetries; i++) {
            try {
                console.log(`尝试API调用 (${i + 1}/${maxRetries})`);
                console.log('请求内容:', JSON.stringify(messages, null, 2));
                
                const response = await fetch(`${this.baseURL}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.key}`
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages: messages,
                        ...this.defaultParams
                    })
                });

                const data = await response.json();
                console.log('API响应:', data);

                if (!response.ok) {
                    throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
                }

                return data;
            } catch (error) {
                console.error(`API调用失败 (尝试 ${i + 1}/${maxRetries}):`, error);
                lastError = error;
                
                if (i < maxRetries - 1) {
                    console.log(`等待${(i + 1) * 1000}ms后重试...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                }
            }
        }

        throw new Error(`API调用失败 (已重试${maxRetries}次): ${lastError.message}`);
    }
};
