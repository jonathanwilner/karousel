tests.register("Visibility-aware arrange", 5, () => {
    const config = getDefaultConfig();
    config.visibilityAwareArrange = true;
    config.arrangeVisibleBuffer = 0;
    config.scrollingLazy = true;
    config.scrollingCentered = false;
    config.scrollingGrouped = false;

    const { workspaceMock, world } = init(config);

    const [client1, client2, client3] = workspaceMock.createClientsWithFrames(
        new MockQmlRect(0, 0, 400, 200),
        new MockQmlRect(0, 0, 400, 200),
        new MockQmlRect(0, 0, 400, 200),
    );

    const expectedOffscreenRect = new MockQmlRect(
        tilingArea.left + 816,
        tilingArea.top,
        400,
        tilingArea.height,
    );
    Assert.assert(
        !rectEquals(client3.frameGeometry, expectedOffscreenRect),
        { message: "Off-screen window should not be arranged" },
    );

    world.do((clientManager, desktopManager) => {
        const desktop = desktopManager.getCurrentDesktop();
        desktop.setScroll(400, false);
        desktop.arrange();
    });

    const expectedReenteredRect = new MockQmlRect(
        tilingArea.left + 416,
        tilingArea.top,
        400,
        tilingArea.height,
    );
    Assert.equalRects(client3.frameGeometry, expectedReenteredRect, { message: "Re-entering window should be arranged" });
    Assert.fullyVisible(client2.frameGeometry);
});
