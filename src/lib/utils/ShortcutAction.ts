class ShortcutAction {
    private readonly name: string;
    private readonly shortcutHandler: ShortcutHandler|null;

    constructor(keyBinding: ShortcutAction.KeyBinding, f: () => void) {
        this.name = `karousel-${keyBinding.name}`;

        if (typeof registerShortcut === "function" && typeof unregisterShortcut === "function") {
            ShortcutAction.unregister(this.name);

            // Use KWin's native global shortcut helpers so bindings appear in KDE settings.
            registerShortcut(
                this.name,
                `Karousel: ${keyBinding.description}`,
                keyBinding.defaultKeySequence ?? "",
                f,
            );
            this.shortcutHandler = null;
        } else {
            this.shortcutHandler = ShortcutAction.initShortcutHandler(keyBinding);
            this.shortcutHandler.activated.connect(f);
        }
    }

    public destroy() {
        if (this.shortcutHandler !== null) {
            this.shortcutHandler.destroy();
            return;
        }

        ShortcutAction.unregister(this.name);
    }

    private static initShortcutHandler(keyBinding: ShortcutAction.KeyBinding) {
        const sequenceLine = keyBinding.defaultKeySequence !== undefined ?
            `    sequence: "${keyBinding.defaultKeySequence}";` :
            "";

        return Qt.createQmlObject(
            `import QtQuick 6.0
import org.kde.kwin 3.0
ShortcutHandler {
    name: "karousel-${keyBinding.name}";
    text: "Karousel: ${keyBinding.description}";
${sequenceLine}}`,
            qmlBase,
        ) as ShortcutHandler;
    }

    private static unregister(name: string) {
        if (typeof unregisterShortcut !== "function") {
            return;
        }

        try {
            unregisterShortcut(name);
        } catch (error: any) {
            log(error);
        }
    }
}

namespace ShortcutAction {
    export interface KeyBinding {
        name: string;
        description: string;
        defaultKeySequence?: string;
    }
}
