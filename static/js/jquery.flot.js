function setupCanvases() {

    // Make sure the placeholder is clear of everything except canvases
    // from a previous plot in this container that we'll try to re-use.

    placeholder.css("padding", 0) // padding messes up the positioning
        .children().filter(function(){
            return !$(this).hasClass("flot-overlay") && !$(this).hasClass('flot-base');
        }).remove();

    if (placeholder.css("position") == 'static')
        placeholder.css("position", "relative"); // for positioning labels and overlay

    surface = new Canvas("flot-base", placeholder);
    overlay = new Canvas("flot-overlay", placeholder); // overlay canvas for interactive features

    ctx = surface.context;
    octx = overlay.context;

    // define which element we're listening for events on
    eventHolder = $(overlay.element).unbind();

    // If we're re-using a plot object, shut down the old one

    var existing = placeholder.data("plot");

    if (existing) {
        existing.shutdown();
        overlay.clear();
    }

    // save in case we get replotted
    placeholder.data("plot", plot);
}