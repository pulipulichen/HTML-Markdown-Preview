export function bindSopSettingsModal({
    modal,
    openBtn,
    closeBtn,
    closeIconBtn,
    onClose
}) {
    function isSopSettingsModalOpen() {
        return modal && !modal.classList.contains("hidden");
    }

    function openSopSettingsModal() {
        if (!modal) {
            return;
        }

        modal.classList.remove("hidden");
        modal.classList.add("flex");
    }

    function closeSopSettingsModal() {
        if (!modal) {
            return;
        }

        modal.classList.add("hidden");
        modal.classList.remove("flex");
        onClose?.();
    }

    if (!modal) {
        return { openSopSettingsModal, closeSopSettingsModal, isSopSettingsModalOpen };
    }

    openBtn?.addEventListener("click", openSopSettingsModal);
    closeBtn?.addEventListener("click", closeSopSettingsModal);
    closeIconBtn?.addEventListener("click", closeSopSettingsModal);

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeSopSettingsModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && isSopSettingsModalOpen()) {
            closeSopSettingsModal();
        }
    });

    return { openSopSettingsModal, closeSopSettingsModal, isSopSettingsModalOpen };
}
