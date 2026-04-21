const markdownInput = document.getElementById('markdown-input');
const previewArea = document.getElementById('preview-area');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const messageBox = document.getElementById('message-box');

// 初始化：從 LocalStorage 讀取
window.onload = async () => {
    const savedContent = localStorage.getItem('markdown_content');
    if (savedContent) {
        markdownInput.value = savedContent;
    } else {
        // 從外部檔案讀取預設內容
        try {
            const response = await fetch('default_markdown.md');
            const defaultContent = await response.text();
            markdownInput.value = defaultContent.trim();
        } catch (err) {
            console.error('無法讀取預設內容:', err);
            markdownInput.value = "# Markdown Editor";
        }
    }
    updatePreview();
};

// 即時轉換與儲存
markdownInput.addEventListener('input', () => {
    updatePreview();
    localStorage.setItem('markdown_content', markdownInput.value);
});

function updatePreview() {
    const rawValue = markdownInput.value;
    // 使用 marked.js 轉換
    previewArea.innerHTML = marked.parse(rawValue);
}

// 複製富文本功能
copyBtn.addEventListener('click', () => {
    if (markdownInput.value.trim() === "") return;

    // 建立一個 Range 物件來選取預覽區的內容
    const range = document.createRange();
    range.selectNode(previewArea);
    
    // 選取該 Range
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
        // 執行複製命令
        const successful = document.execCommand('copy');
        if (successful) {
            showToast("富文本已成功複製！");
        }
    } catch (err) {
        showToast("複製失敗，請手動選取。");
    }

    // 清除選取狀態
    selection.removeAllRanges();
});

// 清空功能
clearBtn.addEventListener('click', () => {
    if (confirm("確定要清空所有內容嗎？")) {
        markdownInput.value = "";
        updatePreview();
        localStorage.removeItem('markdown_content');
    }
});

// 提示訊息動畫
function showToast(msg) {
    messageBox.textContent = msg;
    messageBox.style.opacity = "1";
    setTimeout(() => {
        messageBox.style.opacity = "0";
    }, 2000);
}
