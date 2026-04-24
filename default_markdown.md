# 歡迎使用 Markdown 編輯器

這是一個可以**即時預覽**並複製為**富文本**的工具。

## 功能特點：
1. **自動儲存**：重新整理網頁也不會不見。
2. **富文本複製**：按右上角按鈕，可直接貼到 Gmail/Word。
3. **簡單乾淨**：專注於內容寫作。

> 試著在這裡修改看看吧！

## 快速上手
- 在左側輸入 Markdown
- 在右側即時查看結果
- 點擊「複製富文本」按鈕

## 伺服器環境準備
本系統建議部署於安裝 `Ubuntu 22.04 LTS` 的伺服器環境中。選擇此作業系統版本，可有效避免安裝 Docker 時遭遇 AppArmor 安全性機制的阻擋。建議使用 PVE 的 CT 容器來建立此伺服器環境。

## 安裝 Docker 環境
透過 SSH 連線至伺服器後，請執行以下安裝指令，以自動下載並安裝 Docker。

<table>
<tr>
<td><pre>sudo apt install -y nano wget curl
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo rm -f get-docker.sh</pre></td>
</tr>
</table>

## 範例表格
| 功能 | 支援 | 備註 |
| :--- | :---: | :--- |
| 即時預覽 | ✅ | 打字即轉換 |
| 自動儲存 | ✅ | 瀏覽器快取 |
| 富文本複製 | ✅ | 適合貼至 Word/Gmail |

## 範例圖片
![Markdown Logo](https://markdown-here.com/img/icon256.png)

![Markdown Guide](https://storage.ghost.io/c/11/12/11129d96-48f2-4637-9c25-b077458f01e2/content/images/2021/01/image-131.png)
