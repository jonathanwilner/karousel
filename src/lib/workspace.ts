function initWorkspaceSignalHandlers(world: World, focusPasser: FocusPassing.Passer) {
    const manager = new SignalManager();

    manager.connect(Workspace.windowAdded, (kwinClient: KwinClient) => {
        world.do((clientManager, desktopManager) => {
            clientManager.addClient(kwinClient);
        });
    });

    manager.connect(Workspace.windowRemoved, (kwinClient: KwinClient) => {
        world.do((clientManager, desktopManager) => {
            clientManager.removeClient(kwinClient, FocusPassing.Type.Immediate);
        });
    });

    manager.connect(Workspace.windowActivated, (kwinClient: KwinClient|null) => {
        if (kwinClient === null) {
            focusPasser.activate();
        } else {
            focusPasser.clearIfDifferent(kwinClient);
            world.do((clientManager, desktopManager) => {
                desktopManager.selectScreen(kwinClient.output);
                clientManager.onClientFocused(kwinClient);
            });
        }
    });

    manager.connect(Workspace.currentDesktopChanged, () => {
        world.do(() => {}); // re-arrange desktop
    });

    manager.connect(Workspace.currentActivityChanged, () => {
        world.do(() => {}); // re-arrange desktop
    });

    manager.connect(Workspace.screensChanged, () => {
        world.do((clientManager, desktopManager) => {
            desktopManager.selectScreen(Workspace.activeScreen);
        });
    });

    manager.connect(Workspace.activitiesChanged, () => {
        world.do((clientManager, desktopManager) => {
            desktopManager.updateActivities();
        });
    });

    manager.connect(Workspace.desktopsChanged, () => {
        world.do((clientManager, desktopManager) => {
            desktopManager.updateDesktops();
        });
    });

    manager.connect(Workspace.virtualScreenSizeChanged, () => {
        world.onScreenResized();
    });

    return manager;
}
