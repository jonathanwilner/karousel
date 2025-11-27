tests.register("Restart tiling rebuilds layout", 5, () => {
    const config = getDefaultConfig();
    const { qtMock, workspaceMock, world } = init(config);

    const [client1, client2, client3] = workspaceMock.createClientsWithWidths(200, 200, 200);

    workspaceMock.activeWindow = client2;
    qtMock.fireShortcut("karousel-window-move-left");

    let preRestartColumns: KwinClient[][] = [];
    world.do((clientManager, desktopManager) => {
        const desktop = desktopManager.getCurrentDesktop();
        preRestartColumns = Array.from(desktop.grid.getColumns(), column =>
            Array.from(column.getWindows(), window => window.client.kwinClient),
        );
    });

    Assert.equal(preRestartColumns.length, 2, { message: "Second window should have merged into the first column" });
    Assert.equal(preRestartColumns[0].length, 2, { message: "First column should hold two windows before restart" });

    qtMock.fireShortcut("karousel-restart-tiling");

    world.do((clientManager, desktopManager) => {
        const desktop = desktopManager.getCurrentDesktop();
        const columns = Array.from(desktop.grid.getColumns(), column =>
            Array.from(column.getWindows(), window => window.client.kwinClient),
        );

        Assert.equal(columns.length, 3, { message: "Restart should rebuild one column per window" });
        Assert.equalArrays(columns[0], [client1]);
        Assert.equalArrays(columns[1], [client2]);
        Assert.equalArrays(columns[2], [client3]);
    });

    Assert.assert(workspaceMock.activeWindow === client2, { message: "Focused window should stay focused after restart" });
});
