// 名字分析器类
window.NameAnalyzer = {
    // 分析名字
    async analyze(name, language) {
        console.log(`开始分析名字: ${name}, 语言: ${language}`);

        const systemPrompt = `你是一个专业的名字分析专家。你的任务是分析用户提供的名字，并以JSON格式返回分析结果。
请严格按照以下JSON格式返回，不要添加任何其他内容：
{
    "origin": "名字的来源和构成",
    "meaning": "字面含义",
    "characteristics": "体现的特点",
    "cultural": "文化内涵"
}`;

        const prompt = language === 'chinese' 
            ? `请分析这个中文名字："${name}"。直接返回JSON格式的分析结果，不要任何其他内容。`
            : `Please analyze this English name: "${name}". Return the analysis in JSON format only, no other content.`;

        try {
            console.log('发送分析请求...');
            const response = await window.API_CONFIG.callAPI([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ]);

            console.log('收到分析响应:', response);

            if (!response.choices?.[0]?.message?.content) {
                console.error('API响应格式错误:', response);
                throw new Error('API返回数据格式错误');
            }

            const content = response.choices[0].message.content.trim();
            console.log('解析返回内容:', content);

            let result;
            try {
                // 尝试提取JSON内容（以防API返回了额外的文本）
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error('返回内容中没有找到JSON格式数据');
                }
                result = JSON.parse(jsonMatch[0]);
            } catch (parseError) {
                console.error('解析错误:', parseError, '原始内容:', content);
                throw new Error('无法解析返回的数据格式');
            }

            // 验证必要字段
            const requiredFields = ['origin', 'meaning', 'characteristics', 'cultural'];
            const missingFields = requiredFields.filter(field => !result[field]);
            
            if (missingFields.length > 0) {
                console.error('缺少字段:', missingFields, '当前数据:', result);
                throw new Error(`返回数据缺少必要字段: ${missingFields.join(', ')}`);
            }

            return result;
        } catch (error) {
            console.error('名字分析错误:', error);
            throw new Error(error.message || '名字分析失败，请稍后重试');
        }
    }
};
