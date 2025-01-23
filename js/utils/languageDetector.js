/**
 * 语言检测器
 * 用于自动识别输入文本的语言类型（中文/英文）
 */
window.LanguageDetector = {
    /**
     * 检测输入文本的语言类型
     * @param {string} text - 输入的文本
     * @returns {string} - 返回 'chinese' 或 'english'
     */
    detect(text) {
        if (!text || typeof text !== 'string') {
            console.log('无效的输入:', text);
            return null;
        }

        const trimmedText = text.trim();
        if (trimmedText.length === 0) {
            console.log('空输入');
            return null;
        }

        // 检测是否包含中文字符
        const containsChinese = /[\u4e00-\u9fa5]/.test(trimmedText);
        // 检测是否只包含英文字母和空格
        const isEnglishOnly = /^[a-zA-Z\s]+$/.test(trimmedText);

        console.log('语言检测结果:', {
            text: trimmedText,
            containsChinese,
            isEnglishOnly
        });

        if (containsChinese && !isEnglishOnly) {
            return 'chinese';
        } else if (isEnglishOnly) {
            return 'english';
        } else {
            console.log('无法识别的语言类型');
            return null;
        }
    },

    /**
     * 获取适当的按钮文本
     * @param {string} language - 语言类型 ('chinese' 或 'english')
     * @returns {string} - 返回对应的按钮文本
     */
    getButtonText(language) {
        switch (language) {
            case 'chinese':
                return '生成英文名';
            case 'english':
                return '生成中文名';
            default:
                return '生成译名';
        }
    },

    /**
     * 获取适当的提示文本
     * @param {string} language - 语言类型 ('chinese' 或 'english')
     * @returns {string} - 返回对应的提示文本
     */
    getHintText(language) {
        switch (language) {
            case 'chinese':
                return '已识别到中文输入，将为您生成匹配的英文名';
            case 'english':
                return '已识别到英文输入，将为您生成匹配的中文名';
            default:
                return '请输入中文或英文名字';
        }
    }
};
