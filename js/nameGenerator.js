/**
 * 名字生成器
 * 负责协调名字分析和匹配过程
 */
window.NameGenerator = {
    /**
     * 生成名字建议
     * @param {Array} messages - 包含系统提示和用户输入的消息数组
     * @returns {Object} 包含分析结果和名字建议的对象
     */
    async generate(messages) {
        console.log('开始名字生成流程，消息:', messages);

        try {
            // 调用 API 获取结果
            const response = await window.API_CONFIG.callAPI(messages);
            
            try {
                // 检查响应格式
                if (!response.choices || !response.choices[0] || !response.choices[0].message) {
                    console.error('API响应格式不正确:', response);
                    throw new Error('API响应格式不正确');
                }

                // 获取消息内容
                const content = response.choices[0].message.content;
                if (!content) {
                    console.error('API响应内容为空');
                    throw new Error('API响应内容为空');
                }

                // 提取JSON部分
                let jsonStr = content.trim();
                const jsonStart = jsonStr.indexOf('{');
                const jsonEnd = jsonStr.lastIndexOf('}');
                
                if (jsonStart === -1 || jsonEnd === -1) {
                    console.error('API返回内容中未找到JSON:', content);
                    throw new Error('返回的数据格式不正确');
                }
                
                jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
                console.log('解析的JSON字符串:', jsonStr);
                
                // 解析JSON结果
                const result = JSON.parse(jsonStr);
                
                // 验证结果格式
                if (!result.analysis || !result.suggestions || !Array.isArray(result.suggestions)) {
                    console.error('API返回的数据结构不正确:', result);
                    throw new Error('返回的数据格式不正确');
                }

                return result;
            } catch (jsonError) {
                console.error('JSON解析错误:', jsonError);
                console.log('API返回的完整响应:', response);
                throw new Error('生成结果格式有误，请重试');
            }
        } catch (error) {
            console.error('名字生成过程出错:', error);
            throw error;
        }
    }
};
