class EndlessScroller {
    public scrollToColumn(desktop: Desktop, column: Column) {
        desktop.scrollCenterRange(column);
    }
}
