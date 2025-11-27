tests.register("Endless scroller padding", 5, () => {
    const config = getDefaultConfig();
    config.scrollingLazy = false;
    config.scrollingCentered = false;
    config.scrollingGrouped = false;
    config.scrollingEndless = true;

    const { workspaceMock, world } = init(config);
    workspaceMock.createClientsWithFrames(new MockQmlRect(0, 0, 300, 200));

    world.do((clientManager, desktopManager) => {
        const desktop = desktopManager.getCurrentDesktop();

        desktop.setScroll(1200, false);
        desktop.arrange();
        Assert.equal(
            desktop.getCurrentVisibleRange().getLeft(),
            1200,
            { message: "Endless clamp should allow overscrolling to the right" },
        );

        desktop.setScroll(-900, false);
        desktop.arrange();
        Assert.equal(
            desktop.getCurrentVisibleRange().getLeft(),
            -900,
            { message: "Endless clamp should allow overscrolling to the left" },
        );
    });
});
