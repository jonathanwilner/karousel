tests.register("Alt-Tab overview centers selection", 5, () => {
    const config = getDefaultConfig();
    config.scrollingLazy = true;
    config.scrollingCentered = false;
    config.scrollingGrouped = false;
    const { qtMock, workspaceMock } = init(config);

    const [client0, client1, client2] = workspaceMock.createClientsWithWidths(300, 300, 300);
    Assert.notFullyVisible(client0.frameGeometry);

    qtMock.fireShortcut("karousel-overview-focus-previous");
    Assert.centered(config, tilingArea, client1);

    qtMock.fireShortcut("karousel-overview-focus-previous");
    Assert.centered(config, tilingArea, client0);

    qtMock.fireShortcut("karousel-overview-focus-previous");
    Assert.centered(config, tilingArea, client2);

    qtMock.fireShortcut("karousel-overview-focus-next");
    Assert.centered(config, tilingArea, client0);
});
