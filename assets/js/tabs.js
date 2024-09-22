export function initTabs() {
    const tabs = document.querySelectorAll("[data-target]");
    const tabsContent = document.querySelectorAll("[data-content]");
  
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = document.querySelector(tab.dataset.target);
  
        tabsContent.forEach((tc) => {
          tc.classList.remove("filters__active");
        });
        target.classList.add("filters__active");
  
        tabs.forEach((t) => {
          t.classList.remove("filter-tab-active");
        });
        tab.classList.add("filter-tab-active");
      });
    });
  }
  