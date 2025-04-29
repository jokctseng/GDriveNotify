// === 使用者設定區：有填的就推播 ===
const FOLDER_IDS = [
  "資料夾ID1",  // ← 修改成要通知的資料夾ID
  "資料夾ID2",  // ← 修改成要通知的資料夾ID
  "資料夾ID3" // ← 修改成要通知的資料夾ID
];

// 填你想用的推播工具
const TELEGRAM_BOT_TOKEN = "";   // ← 填你的 Telegram Bot Token
const TELEGRAM_CHAT_ID = "";     // ← 填你的 Telegram Chat ID
const EMAIL_ADDRESS = "";        // ← 填你的 Email 地址

// ===================

// 測試模式（true=每次都有假資料送出）
const TEST_MODE = false;
// ===================
function checkFolderChanges() {
  let updatedMessages = [];

  if (TEST_MODE) {
    // 自動產生假資料測試推播
    updatedMessages = [{
      folderName: "測試資料夾",
      updates: [{
        name: "測試檔案.txt",
        url: "https://example.com",
        updatedTime: (new Date()).toLocaleString()
      }]
    }];
  } else {
    const lastChecked = PropertiesService.getScriptProperties().getProperty('lastChecked') || new Date(0).toISOString();
    const lastCheckedDate = new Date(lastChecked);

    FOLDER_IDS.forEach(folderId => {
      const folder = DriveApp.getFolderById(folderId);
      const files = folder.getFiles();
      let folderUpdates = [];

      while (files.hasNext()) {
        const file = files.next();
        if (file.getLastUpdated() > lastCheckedDate) {
          folderUpdates.push({
            name: file.getName(),
            url: file.getUrl(),
            updatedTime: file.getLastUpdated().toLocaleString()
          });
        }
      }

      if (folderUpdates.length > 0) {
        updatedMessages.push({
          folderName: folder.getName(),
          updates: folderUpdates
        });
      }
    });

    PropertiesService.getScriptProperties().setProperty('lastChecked', new Date().toISOString());
  }

  if (updatedMessages.length > 0) {
    const telegramMessage = formatTelegramMessage(updatedMessages);
    const emailMessage = formatEmailMessage(updatedMessages);

    let sent = false;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        sendTelegram(telegramMessage);
        Logger.log("✅ Telegram訊息發送成功");
        sent = true;
      } catch (e) {
        Logger.log("❌ Telegram發送失敗: " + e.toString());
      }
    }

    if (EMAIL_ADDRESS) {
      try {
        sendEmail(emailMessage);
        Logger.log("✅ Email發送成功");
        sent = true;
      } catch (e) {
        Logger.log("❌ Email發送失敗: " + e.toString());
      }
    }

    if (!sent) {
      Logger.log("⚠️ 沒有設定任何推播方式，僅記錄變更。");
    }
  } else {
    Logger.log("ℹ️ 沒有偵測到任何資料夾更新。");
  }
}

// 🖋️ 格式化Telegram訊息（可Markdown）
function formatTelegramMessage(folders) {
  let message = "*📂 ＯＯ相關資料夾更新通知*\n\n";
  folders.forEach(folder => {
    message += `*📁 資料夾名稱：* ${escapeMarkdown(folder.folderName)}\n`;
    folder.updates.forEach(update => {
      message += `🔹 [${escapeMarkdown(update.name)}](${update.url})\n🕑 更新時間：${escapeMarkdown(update.updatedTime)}\n\n`;
    });
  });
  return message.trim();
}

// 🖋️ 格式化Email訊息（可HTML）
function formatEmailMessage(folders) {
  let message = `<h2>ＯＯ相關資料夾更新通知</h2>`;
  folders.forEach(folder => {
    message += `<h3>📁 資料夾名稱：${folder.folderName}</h3>`;
    folder.updates.forEach(update => {
      message += `🔹 <a href="${update.url}" target="_blank">${update.name}</a><br>🕑 更新時間：${update.updatedTime}<br><br>`;
    });
  });
  return message;
}

// 📩 發送Telegram訊息
function sendTelegram(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: "Markdown"
  };
  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}

// 📧 發送Email通知
function sendEmail(htmlMessage) {
  MailApp.sendEmail({
    to: EMAIL_ADDRESS,
    subject: "雲端助手｜ＯＯＯ相關雲端資料夾更新通知",
    htmlBody: htmlMessage
  });
}

// 📎 防止Telegram Markdown格式出錯
function escapeMarkdown(text) {
  return text.replace(/([\_\*\[\]\(\)\~\`\>\#\+\-\=\|\{\}\.\!])/g, "\\$1");
}