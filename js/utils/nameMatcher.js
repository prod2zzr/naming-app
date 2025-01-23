// 名字匹配器类
window.NameMatcher = {
    // 生成译名
    async match(name, language, analysis) {
        console.log(`开始生成译名: ${name}, 语言: ${language}`);
        console.log('分析结果:', analysis);

        const systemPrompt = `你是一个专业的名字翻译专家。你的任务是根据用户提供的名字分析，生成对应的译名建议。
请严格按照以下JSON数组格式返回3个建议，不要添加任何其他内容：
[
    {
        "name": "译名",
        "pronunciation": "发音指导",
        "meaning": "含义解释",
        "cultural": "文化背景"
    }
]`;

        const prompt = language === 'chinese'
            ? `基于以下中文名字"${name}"的分析结果：
${JSON.stringify(analysis, null, 2)}

请生成3个最匹配的英文名字。考虑：
1. 发音相近或谐音
2. 寓意相似
3. 文化适应性

直接返回JSON数组，不要其他内容。`
            : `Based on the analysis of the English name "${name}":
${JSON.stringify(analysis, null, 2)}

Generate 3 matching Chinese names considering:
1. Similar pronunciation
2. Similar meaning
3. Cultural adaptability

Return JSON array directly, no other content.`;

        try {
            console.log('发送生成请求...');
            const response = await window.API_CONFIG.callAPI([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ]);

            console.log('收到生成响应:', response);

            if (!response.choices?.[0]?.message?.content) {
                console.error('API响应格式错误:', response);
                throw new Error('API返回数据格式错误');
            }

            const content = response.choices[0].message.content.trim();
            console.log('解析返回内容:', content);

            let suggestions;
            try {
                // 尝试提取JSON数组内容
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                if (!jsonMatch) {
                    throw new Error('返回内容中没有找到JSON数组格式数据');
                }
                suggestions = JSON.parse(jsonMatch[0]);
            } catch (parseError) {
                console.error('解析错误:', parseError, '原始内容:', content);
                throw new Error('无法解析返回的数据格式');
            }

            // 验证数组格式
            if (!Array.isArray(suggestions)) {
                console.error('返回数据不是数组:', suggestions);
                throw new Error('返回数据格式错误：不是数组');
            }

            if (suggestions.length !== 3) {
                console.error('建议数量不正确:', suggestions.length);
                throw new Error('返回数据格式错误：建议数量不正确');
            }

            // 验证每个建议的格式
            const requiredFields = ['name', 'pronunciation', 'meaning', 'cultural'];
            suggestions.forEach((suggestion, index) => {
                const missingFields = requiredFields.filter(field => !suggestion[field]);
                if (missingFields.length > 0) {
                    console.error(`第${index + 1}个建议缺少字段:`, missingFields, '当前数据:', suggestion);
                    throw new Error(`第${index + 1}个建议缺少必要字段: ${missingFields.join(', ')}`);
                }
            });

            return suggestions;
        } catch (error) {
            console.error('名字生成错误:', error);
            throw new Error(error.message || '名字生成失败，请稍后重试');
        }
    }
};
