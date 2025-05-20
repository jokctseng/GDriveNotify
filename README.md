# Google雲端硬碟更新通知工具

> Copyright (C) 2025 [KC Tseng]

 [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/C0C3ODORW)

---

## 專案簡介

這是一個基於 Google Apps Script (GAS) 開發的小工具，可以定時監控多個 Google Drive 資料夾檔案的更新狀態，  
並自動透過 Telegram 或 Email 推播更新通知。

### 背景

臺灣有許多學校、非營利組織及個人採用Gmail系統，因此透過Google雲端硬碟以及其辦公工具成為兼顧同步與協作的熱門選擇，然而除了桌面通知外，共享的雲端資料夾難有積極主動的通知，本工具試圖回應此問題，定時監控多個Google Drive資料夾的更新狀態，並自動推播更新通知。



## 🚀 功能特色
- 同時支援監控多個資料夾
- 推播至 Telegram 或寄送 Email
- 可以美化排版（Markdown / HTML）
- 推播失敗自動記錄錯誤Log
- 開啟測試模式可快速驗證部署狀態（預設**關閉**）


## 安裝與設定

1. 登入 [Google Apps Script](https://script.google.com/)，建立新專案
2. 複製 `drive_notifier_s.gs` 程式碼後再GAS貼上
3. 修改設定區：
   - 填寫需要監控的資料夾ID（可同時多個）
   - 填入 Telegram Bot Token 與 Chat ID，或填入 Email 地址
4. 儲存並手動執行一次 `checkFolderChanges()`，**同意完整授權**
5. 設定時間觸發器（需要即時通知的話建議每 5 分鐘一次；資料較多不需頻繁推播，可設置小時觸發）
    * 點選有時鐘圖案的`觸發條件` 設置
    * 點選右下角`新增觸發條件`
    * 選擇要執行的功能`checkFolderChanges`，選取活動來源`時間驅動`，根據需求設定時間觸發條件與間隔
    
    ![觸發條件示範圖片](https://ik.imagekit.io/kctseng/trigger.png?updatedAt=1745894510762)

完成設定後就會根據設定定時檢查，在有更新時推播如下

![電郵推播圖片](https://ik.imagekit.io/kctseng/IMG_4744.jpg?updatedAt=1745894863680)



---

### 如何取得資料夾ID
1.  打開 Google Drive
2.  點進目標資料夾
3.  複製網址列中 `/folders/` 後面那一段文字

### 如何取得Telegram相關資訊
1. 打開 Telegram App
2. 搜尋`@BotFather`（官方機器人）
3. 打開跟BotFather的對話，輸入 `/newbot`
4. 依指示取一個 Bot 名稱與帳號
5. 完成後，BotFather 會給你一組`Bot Token`
6. 將Bot Token複製到設定區的`TELEGRAM_BOT_TOKEN`
7. 搜尋或從BotFather給的連結並開啟你剛剛申請的 Bot
8. 對那個 Bot 發一個訊息（隨便打 Hi 就可以），稍等一下
9. 在瀏覽器打開下面這個網址（把`你的BotToken`這幾個字換成自己的 Bot Token）

```
https://api.telegram.org/bot你的BotToken/getUpdates

```
10. 此時會看到一堆 JSON，裡面有 `chat` 欄位，裡面的 `id` 就是你的 Chat ID
11. 請將上述看到的`id`填入設定區的`TELEGRAM_CHAT_ID`





---

## 常見問題

### 收不到推播？
- 請確認 Folder ID 是否正確
- 請確認有正確設定 Telegram Token / Chat ID 或 Email
- 請確認有新檔案或檔案有被更新
- 請確認 Apps Script **已授權 Drive 及 Gmail 存取**

### 可以同時推 Telegram 和 Email 嗎？
- 可以，兩個推播會同時發送
- 如果您只填其中一個也不影響推播

### 為什麼不推播到Line或Messenger？
- Line Notify已於2025年陸續終止服務，無法讓大家申請新帳號
- Messenger需要透過粉絲專頁以及有開發者帳號才能串接，門檻相對高

### 為什麼不能一鍵部署？
- 配置涉及Token等資訊，不建議使用者在非必要情況下將相關資料提交給他人（我）

### 為什麼沒有包含所有子資料夾的更新？
- 考慮所用資源，本版本未包含子資料夾的更新提醒
- 如果子資料夾超多，搜尋會大幅增加所需資源，GAS也會跑得比較慢
- 另有包含[子資料夾更新推播的版本](https://github.com/jokctseng/GDriveNotifyXL)，但如上所述，資料夾過多不建議使用


---

## 📄 授權

本專案以 GNU General Public License v3.0 (GPLv3) 授權釋出。  
您可以自由使用、修改、分享本程式，但必須遵守GPLv3條款。

完整授權條款請見 [LICENSE](./LICENSE) 或 [GNU官方網站](https://www.gnu.org/licenses/gpl-3.0.html)。

---


## 🤝 歡迎貢獻

歡迎任何形式的建議、意見、修正或功能擴充！

如果您想要貢獻：

- 您可以 Fork 本專案，進行修改後提出 Pull Request（PR）。
- 請在 Pull Request 清楚描述您修改或新增的功能。
- 您可以提出 Issue 說明建議或遇到的問題。             
- 請確保您的貢獻遵守本專案使用的 [GPLv3](https://www.gnu.org/licenses/gpl-3.0.html) 授權條款。


感謝您的使用與貢獻！

---
