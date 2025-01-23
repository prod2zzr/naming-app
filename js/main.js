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

    // 当输入变化时实时检测语言
    inputName.addEventListener('input', function(e) {
        const text = e.target.value;
        const language = LanguageDetector.detect(text);
        
        // 更新按钮文本和提示信息
        generateButton.textContent = LanguageDetector.getButtonText(language);
        inputHint.textContent = LanguageDetector.getHintText(language);
        
        // 根据输入内容的有效性更新按钮状态
        generateButton.disabled = !language;
    });

    // 当输入框失去焦点时，如果是英文则将首字母大写
    inputName.addEventListener('blur', function(e) {
        const text = e.target.value.trim();
        if (text && LanguageDetector.detect(text) === 'english') {
            const words = text.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            );
            this.value = words.join(' ');
        }
    });

    // 生成名字的主函数
    async function generateNames(name, language) {
        try {
            // 使用 NameGenerator 类生成名字
            const result = await NameGenerator.generate(name, language);
            
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
        const language = LanguageDetector.detect(name);
        
        if (!language) {
            showError('请输入有效的中文或英文名字');
            return;
        }

        try {
            // 显示加载动画
            showLoading(true);
            
            // 清除之前的结果和错误
            clearResults();
            hideError();

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
    function showLoading(show) {
        loadingSpinner.style.display = show ? 'block' : 'none';
        generateButton.disabled = show;
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

        const resultTitle = sourceLanguage === 'chinese' ? '推荐英文名' : '推荐中文名';
        
        const resultHTML = `
            <h2>${resultTitle}</h2>
            ${suggestions.map((suggestion, index) => `
                <div class="name-suggestion">
                    <h3>推荐 ${index + 1}</h3>
                    <p class="name">${suggestion.name}</p>
                    <p class="pronunciation">发音: ${suggestion.pronunciation}</p>
                    <p class="meaning">含义: ${suggestion.meaning}</p>
                    ${suggestion.cultural ? `<p class="cultural">文化背景: ${suggestion.cultural}</p>` : ''}
                </div>
            `).join('')}
        `;
        
        results.innerHTML = resultHTML;
    }
});
