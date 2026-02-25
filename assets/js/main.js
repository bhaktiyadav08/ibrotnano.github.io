function transformMermaidBlocks() {
    const blocks = document.querySelectorAll("pre code.language-mermaid");

    blocks.forEach((block) => {
        const pre = block.closest("pre");
        if (!pre) return;

        const wrapper = document.createElement("div");
        wrapper.className = "mermaid";
        wrapper.textContent = block.textContent;
        pre.replaceWith(wrapper);
    });
}

function initMermaid() {
    if (!document.querySelector("pre code.language-mermaid")) return;

    transformMermaidBlocks();

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.onload = () => {
        if (window.mermaid) {
            window.mermaid.initialize({
                startOnLoad: true,
                theme: "dark",
                darkMode: true,
                securityLevel: "loose"
            });
            window.mermaid.run();
        }
    };

    document.body.appendChild(script);
}

function enableCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll(".highlight pre, pre code");
    codeBlocks.forEach((block) => {
        const pre = block.tagName === "PRE" ? block : block.closest("pre");
        if (!pre || pre.dataset.copyReady === "true") return;
        if (pre.querySelector("code.language-mermaid")) return;

        pre.dataset.copyReady = "true";

        const container = document.createElement("div");
        container.className = "code-block-wrap";

        const button = document.createElement("button");
        button.type = "button";
        button.className = "copy-code-btn";
        button.textContent = "Copy";

        button.addEventListener("click", async () => {
            const codeElement = pre.querySelector("code");
            const text = codeElement ? codeElement.textContent || "" : pre.textContent || "";

            try {
                await navigator.clipboard.writeText(text.trim());
                button.textContent = "Copied";
            } catch {
                button.textContent = "Failed";
            }

            window.setTimeout(() => {
                button.textContent = "Copy";
            }, 1400);
        });

        const parent = pre.parentNode;
        if (!parent) return;

        parent.insertBefore(container, pre);
        container.appendChild(button);
        container.appendChild(pre);
    });
}

function sortCategoryPills() {
    const containers = document.querySelectorAll(".category-overview");
    if (!containers.length) return;

    containers.forEach((container) => {
        const pills = Array.from(container.querySelectorAll(".category-pill"));
        pills
            .sort((firstPill, secondPill) => {
                const firstCount = Number.parseInt(firstPill.dataset.count || "0", 10);
                const secondCount = Number.parseInt(secondPill.dataset.count || "0", 10);
                const countDifference = secondCount - firstCount;
                if (countDifference !== 0) {
                    return countDifference;
                }

                const firstLabel = firstPill.textContent?.trim() || "";
                const secondLabel = secondPill.textContent?.trim() || "";
                return firstLabel.localeCompare(secondLabel, "de", { sensitivity: "base" });
            })
            .forEach((pill) => container.appendChild(pill));
    });
}

function sortCategorySections() {
    const container = document.querySelector(".categories-list");
    if (!container) return;

    const sections = Array.from(container.querySelectorAll(".category-section"));
    sections
        .sort((firstSection, secondSection) => {
            const firstCount = Number.parseInt(firstSection.dataset.count || "0", 10);
            const secondCount = Number.parseInt(secondSection.dataset.count || "0", 10);
            const countDifference = secondCount - firstCount;
            if (countDifference !== 0) {
                return countDifference;
            }

            const firstName = firstSection.dataset.name || "";
            const secondName = secondSection.dataset.name || "";
            return firstName.localeCompare(secondName, "de", { sensitivity: "base" });
        })
        .forEach((section) => container.appendChild(section));
}

document.addEventListener("DOMContentLoaded", () => {
    sortCategoryPills();
    sortCategorySections();
    enableCodeCopyButtons();
    initMermaid();
});
