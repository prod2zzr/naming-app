/**
 * 名字生成器
 * 负责协调名字分析和匹配过程
 */
window.NameGenerator = {
    /**
     * 生成名字建议
     * @param {string} name - 输入的名字
     * @param {string} language - 输入的语言类型 ('chinese' 或 'english')
     * @returns {Object} 包含分析结果和名字建议的对象
     */
    async generate(name, language) {
        console.log(`开始名字生成流程: ${name}, 语言: ${language}`);

        try {
            // 1. 分析名字
            console.log('步骤1: 开始分析名字...');
            const analysis = await window.NameAnalyzer.analyze(name, language);
            console.log('名字分析完成:', analysis);
            
            // 2. 生成译名建议
            console.log('步骤2: 开始生成译名...');
            const suggestions = await window.NameMatcher.match(name, language, analysis);
            console.log('译名生成完成:', suggestions);
            
            // 3. 返回结果
            return {
                analysis: analysis,
                suggestions: suggestions
            };
        } catch (error) {
            console.error('名字生成过程出错:', error);
            // 根据错误类型返回不同的错误信息
            if (error.message.includes('API')) {
                throw new Error('服务暂时不可用，请稍后重试');
            } else if (error.message.includes('JSON') || error.message.includes('格式')) {
                throw new Error('生成结果格式有误，请重试');
            } else if (error.message.includes('分析失败')) {
                throw new Error('名字分析失败，请稍后重试');
            } else if (error.message.includes('生成失败')) {
                throw new Error('译名生成失败，请稍后重试');
            } else {
                throw new Error('处理过程出错，请稍后重试');
            }
        }
    }
};
