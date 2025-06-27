/* script.js
   - Title で選択情報リセット
   - 各ページでの右上情報表示（ステップに応じて増加）
   - Title.html: 社員番号入力 & 次画面遷移
   - Detales1～3: 選択ボタンの保存 & 次画面遷移
   - Detales4: 計算式表示 & 実行
   - 固定戻るボタン関数
*/
// アプリ共通のバージョン番号
// ここだけを書き換えれば、全ページの <title> が更新される
const APP_VERSION = "1.1";

window.addEventListener("DOMContentLoaded", () => {
  // data-base 属性を持つ title 要素を取得
  const titleEl = document.querySelector("title[data-TabTitleBase]");
  if (!titleEl) return;  // もしなければスキップ

  // ベース部分を属性から読み取り
  const base = titleEl.getAttribute("data-TabTitleBase");

  // 新しいタイトルとして「ベース_バージョン」をセット
  titleEl.textContent = `${base}_v${APP_VERSION}`;
});
// 画面左下にバージョン番号を表示する処理
document.addEventListener("DOMContentLoaded", () => {
  const versionElement = document.querySelector(".AppVersionDisplay");
  if (versionElement) {
    versionElement.textContent = `v${APP_VERSION}`;
  }

});

document.addEventListener("DOMContentLoaded", () => {
  // Title.html なら選択ステップをリセット
  if (document.getElementById("employee-form")) {
    localStorage.removeItem("selectedLine");
    localStorage.removeItem("selectedWork");
    localStorage.removeItem("selectedTool");
  }

  // 共通：右上情報の表示
  const empDisplay = document.getElementById("emp-display");
  if (empDisplay) {
    const steps = [
      { key: "employeeNumber", label: "社員番号" },
      { key: "selectedLine",   label: "ライン名" },
      { key: "selectedWork",   label: "ワーク品種" },
      { key: "selectedTool",   label: "ツール" }
    ];
    let html = "";
    steps.forEach((step, idx) => {
      const val = localStorage.getItem(step.key);
      if (val) {
        html += `${step.label}: ${val}<br>`;
      }
    });
    empDisplay.innerHTML = html || "";
  }

  // Title.html: 社員番号入力＆Detales1.html遷移
  const form = document.getElementById("employee-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const num = document.getElementById("empNumber").value.trim();
      if (!num) {
        alert("社員番号を入力してください");
        return;
      }
      if (!/^\d{7}$/.test(num)) {
        alert("社員番号は7桁の数字のみ入力してください");
        return;
      }
      localStorage.setItem("employeeNumber", num);
      location.href = "Detales1.html";
    });
  }

  // Detales4: 計算式セット & 計算実行
  const calcBtn = document.getElementById("calculate-btn");
  if (calcBtn) {
    const tool = localStorage.getItem("selectedTool");
    const formulaMap = {
      T001: "(狙い目-入力値) ÷ 2",
      T002: "(狙い目-入力値) ÷2",
      T003: "(狙い目-入力値) ÷2",
      T004: "(狙い目-入力値)",
      T005: "(狙い目-入力値)"
    };
    const fd = document.getElementById("formula-display");
    if (fd) fd.innerText = "計算式: " + (formulaMap[tool] || "未定義");

    calcBtn.addEventListener("click", () => {
      const v = document.getElementById("operator-input").value;
      const n = Number(v);
      if (isNaN(n)) {
        alert("数値を正しく入力してください");
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });

      let result = n;
      switch (tool) {
        case "T001": result = (63-n) / 2; break;
        case "T002": result = (103.5-n) / 2; break;
        case "T003": result = (150-n) / 2; break;
        case "T004": result = 223.98-n ; break;
        case "T005": result = 150.4-n ; break;
      }
      const out = document.getElementById("result");
      if (out) out.innerText = "結果: " + result;
    });
  }
});

// 固定戻るボタン関数
function backToTitle() {
  location.href = "Title.html";
}
function backToLineSelection() {
  location.href = "Detales1.html";
}
function backToWorkSelection() {
  location.href = "Detales2.html";
}
function backToToolSelection() {
  location.href = "Detales3.html";
}

// 各選択ステップ関数
function goToLine(id) {
  localStorage.setItem("selectedLine", id);
  location.href = "Detales2.html";
}
function selectWorkType(type) {
  localStorage.setItem("selectedWork", type);
  location.href = "Detales3.html";
}
function selectTool(id) {
  localStorage.setItem("selectedTool", id);
  location.href = "Detales4.html";
}