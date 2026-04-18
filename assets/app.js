document.addEventListener("DOMContentLoaded", () => {
  const shareButtons = document.querySelectorAll("[data-copy-url]");
  const finderForm = document.querySelector("[data-finder-form]");

  shareButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const statusSelector = button.dataset.copyStatus;
      const statusTarget = statusSelector ? document.querySelector(statusSelector) : null;
      const originalText = button.dataset.originalText || button.textContent.trim();
      const shareUrl = window.location.href;

      const setFeedback = (buttonText, statusText = "") => {
        button.textContent = buttonText;
        if (statusTarget) {
          statusTarget.textContent = statusText;
        }
      };

      // 只做一件事：把當前網址複製到剪貼簿
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareUrl);
          setFeedback("已複製", "網址已複製到剪貼簿");
        } else {
          // 舊瀏覽器 fallback：用隱藏的 textarea + document.execCommand
          const textarea = document.createElement("textarea");
          textarea.value = shareUrl;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "absolute";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand("copy");
            setFeedback("已複製", "網址已複製到剪貼簿");
          } catch (_) {
            window.prompt("請手動複製這個網址", shareUrl);
            setFeedback("請手動複製");
          }
          document.body.removeChild(textarea);
        }
      } catch (error) {
        window.prompt("請手動複製這個網址", shareUrl);
        setFeedback("請手動複製");
      }

      window.setTimeout(() => {
        setFeedback(originalText);
      }, 1800);
    });
  });

  if (finderForm) {
    finderForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const city = finderForm.querySelector('[name="city"]').value;
      const category = finderForm.querySelector('[name="category"]').value;
      window.location.href = `${city}/${category}/index.html`;
    });
  }
});
