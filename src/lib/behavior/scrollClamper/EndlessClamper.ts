class EndlessClamper {
    private readonly paddingByDesktop: WeakMap<Desktop, { left: number, right: number }>;

    constructor() {
        this.paddingByDesktop = new WeakMap();
    }

    private getPadding(desktop: Desktop) {
        let padding = this.paddingByDesktop.get(desktop);
        if (padding === undefined) {
            padding = { left: 0, right: 0 };
            this.paddingByDesktop.set(desktop, padding);
        }
        return padding;
    }

    public clampScrollX(desktop: Desktop, x: number) {
        const padding = this.getPadding(desktop);
        const threshold = desktop.tilingArea.width;

        let minScroll = -padding.left;
        let maxScroll = desktop.grid.getWidth() - desktop.tilingArea.width + padding.right;

        while (x < minScroll + threshold) {
            padding.left += threshold;
            minScroll = -padding.left;
            maxScroll = desktop.grid.getWidth() - desktop.tilingArea.width + padding.right;
        }
        while (x > maxScroll - threshold) {
            padding.right += threshold;
            maxScroll = desktop.grid.getWidth() - desktop.tilingArea.width + padding.right;
            minScroll = -padding.left;
        }

        const paddedMinScroll = -padding.left;
        const paddedMaxScroll = desktop.grid.getWidth() - desktop.tilingArea.width + padding.right;
        if (paddedMaxScroll < paddedMinScroll) {
            return paddedMinScroll;
        }
        return clamp(x, paddedMinScroll, paddedMaxScroll);
    }
}
