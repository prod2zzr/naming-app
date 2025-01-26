document.addEventListener('DOMContentLoaded', function() {
    // 获取页面元素
    const nameForm = document.getElementById('nameForm');
    const inputName = document.getElementById('inputName');
    const generateButton = document.getElementById('generateButton');
    const inputHint = document.getElementById('inputHint');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const results = document.getElementById('results');
    const error = document.getElementById('error');
    const nameAnalysis = document.getElementById('nameAnalysis');

    // 更新输入提示
    function updateInputHint(language) {
        const labelCn = document.querySelector('.label-cn');
        const labelEn = document.querySelector('.label-en');
        const detectedCn = document.querySelector('.detected-cn');
        const detectedEn = document.querySelector('.detected-en');

        // 重置所有提示为初始状态
        inputHint.textContent = '系统将自动识别您输入的语言';
        labelCn.style.display = 'block';
        labelEn.style.display = 'none';
        detectedCn.style.display = 'none';
        detectedEn.style.display = 'none';

        // 根据检测到的语言更新界面
        if (language === 'english') {
            labelCn.style.display = 'none';
            labelEn.style.display = 'block';
            detectedEn.style.display = 'block';
            inputHint.style.display = 'none';
        } else if (language === 'chinese') {
            detectedCn.style.display = 'block';
            inputHint.style.display = 'none';
        }
    }

    // 检测输入的语言
    function detectLanguage(text) {
        if (!text.trim()) {
            return null;
        }
        return /[a-zA-Z]/.test(text) ? 'english' : 'chinese';
    }

    // 监听输入变化
    inputName.addEventListener('input', function(e) {
        const text = e.target.value.trim();
        if (!text) {
            updateInputHint(null);
            return;
        }
        const language = detectLanguage(text);
        updateInputHint(language);
        
        // 根据输入内容的有效性更新按钮状态
        generateButton.disabled = !language;
    });

    // 当输入框失去焦点时，如果是英文则将首字母大写
    inputName.addEventListener('blur', function(e) {
        const text = e.target.value.trim();
        if (text && detectLanguage(text) === 'english') {
            const words = text.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            );
            this.value = words.join(' ');
        }
    });

    // 生成名字的主函数
    async function generateNames(name, language) {
        try {
            // 构建消息
            const messages = [
                {
                    role: "system",
                    content: language === 'english' ?
                        // 英文用户寻找中文名
                        "You are a Chinese name expert. When suggesting Chinese names for English speakers, focus on these aspects:\n" +
                        "1. Phonetic similarity to their English name\n" +
                        "2. Beautiful meanings in Chinese culture\n" +
                        "3. Easy pronunciation for English speakers\n" +
                        "Provide all explanations in English. Format your response in JSON:\n" +
                        "{\"analysis\":{\"origin\":\"Analysis of their English name\",\"meaning\":\"Name meaning\",\"characteristics\":\"Name characteristics\",\"cultural\":\"Cultural background\"},\n" +
                        "\"suggestions\":[{\"name\":\"中文名\",\"pronunciation\":\"Pinyin with tones\",\"meaning\":\"Detailed meaning of each character\",\"cultural\":\"Cultural significance\"}]}"
                        :
                        // 中文用户寻找英文名
                        "你是一位精通英文名字文化的专家。为中文用户推荐英文名时，请注重以下方面：\n" +
                        "1. 名字的文化典故和趣味性（如来自文学作品、历史人物、流行文化等）\n" +
                        "2. 名字在英语国家的流行程度和适用场景\n" +
                        "3. 名字是否容易记忆和拼写\n" +
                        "4. 名字是否适合用户的个性特征\n\n" +
                        "在分析中文名字时，请详细解释：\n" +
                        "1. 字义分析：解释每个汉字的本义、引申义和使用场景\n" +
                        "2. 文化渊源：说明名字中的典故、诗词出处或文化内涵\n" +
                        "3. 用字特点：分析名字的构字规律、声调搭配等\n" +
                        "4. 历史应用：列举历史上或当代使用过类似用字的名人，体现名字的文化价值\n\n" +
                        "请用中文解释，以便用户理解。按以下JSON格式返回：\n" +
                        "{\"analysis\":{\n" +
                        "  \"origin\":\"详细的名字来源分析，包括字义溯源、典故出处、历史应用等\",\n" +
                        "  \"meaning\":\"名字含义\",\n" +
                        "  \"characteristics\":\"特点\",\n" +
                        "  \"cultural\":\"文化背景\"\n" +
                        "},\n" +
                        "\"suggestions\":[{\n" +
                        "  \"name\":\"英文名\",\n" +
                        "  \"pronunciation\":\"发音指导\",\n" +
                        "  \"meaning\":\"名字背后的故事和含义\",\n" +
                        "  \"cultural\":\"文化背景和使用场景\"\n" +
                        "}]}"
                },
                {
                    role: "user",
                    content: language === 'english' ?
                        `Please suggest Chinese names for "${name}". Consider both phonetic similarity and cultural meaning. Explain each suggestion in detail.`
                        :
                        `请为"${name}"推荐有趣且富有文化内涵的英文名。重点说明每个名字背后的故事和文化内涵，以及这个名字在英语国家的使用场景。`
                }
            ];

            // 调用API
            const result = await NameGenerator.generate(messages);
            
            // 显示名字分析
            displayAnalysis(result.analysis);
            
            // 返回名字建议
            return result.suggestions;
        } catch (error) {
            console.error('生成名字时出错:', error);
            throw new Error(error.message || '生成名字失败，请稍后重试');
        }
    }

    // 显示名字分析结果
    function displayAnalysis(analysis) {
        if (!analysis) return;
        
        nameAnalysis.style.display = 'block';
        
        // 更新各个分析项
        const items = ['origin', 'meaning', 'characteristics', 'cultural'];
        items.forEach(item => {
            const element = nameAnalysis.querySelector(`.${item}`);
            if (element && analysis[item]) {
                element.textContent = analysis[item];
            }
        });
    }

    // 处理表单提交
    nameForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = inputName.value.trim();
        if (!name) return;

        const language = detectLanguage(name);
        
        try {
            clearResults();
            hideError();
            showLoading(true, language);  // 传入语言参数
            
            // 清除之前的结果和错误
            
            // 生成名字建议
            const suggestions = await generateNames(name, language);
            
            // 显示结果
            displayResults(suggestions, language);
        } catch (err) {
            showError(err.message);
        } finally {
            showLoading(false);
        }
    });

    // 显示/隐藏加载动画
    function showLoading(show, language = null) {
        const loadingSpinner = document.getElementById('loadingSpinner');
        const loadingText = loadingSpinner.querySelector('p');
        const generateButton = document.getElementById('generateButton');
        
        if (show) {
            loadingSpinner.style.display = 'block';
            generateButton.disabled = true;  // 禁用按钮
            // 根据语言设置加载提示文本
            loadingText.textContent = language === 'english' ? 
                'Generating names, please wait...' : 
                '正在生成名字，请稍候...';
        } else {
            loadingSpinner.style.display = 'none';
            generateButton.disabled = false;  // 恢复按钮
        }
    }

    // 显示错误信息
    function showError(message) {
        error.textContent = message;
        error.style.display = 'block';
    }

    // 隐藏错误信息
    function hideError() {
        error.style.display = 'none';
    }

    // 清除结果
    function clearResults() {
        results.innerHTML = '';
        nameAnalysis.style.display = 'none';
    }

    // 显示结果
    function displayResults(suggestions, sourceLanguage) {
        if (!suggestions || !Array.isArray(suggestions)) {
            throw new Error('无效的名字建议数据');
        }

        const resultTitle = sourceLanguage === 'chinese' ? '推荐英文名 Suggestion' : '推荐中文名 Suggestion';
        
        const resultHTML = `
            <h2>${resultTitle}</h2>
            ${suggestions.map((suggestion, index) => `
                <div class="name-suggestion">
                    <h3>推荐 ${index + 1}</h3>
                    <p class="name">${suggestion.name}</p>
                    ${sourceLanguage === 'english' ? 
                        `<p class="pronunciation">Pinyin: ${suggestion.pronunciation}</p>
                         <p class="meaning">Meaning: ${suggestion.meaning}</p>
                         ${suggestion.cultural ? `<p class="cultural">Cultural Background: ${suggestion.cultural}</p>` : ''}`
                        :
                        `<p class="pronunciation">发音 Pronunciation: ${suggestion.pronunciation}</p>
                         <p class="meaning">含义 Content: ${suggestion.meaning}</p>
                         ${suggestion.cultural ? `<p class="cultural">文化背景 Culture: ${suggestion.cultural}</p>` : ''}`
                    }
                </div>
            `).join('')}
        `;
        
        results.innerHTML = resultHTML;
    }
});
