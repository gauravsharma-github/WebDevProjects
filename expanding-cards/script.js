/* ============================================================================
   EXPANDING CARDS - CLIENT-SIDE LOGIC
   ============================================================================
   Purpose:
     Wire up click behavior so that clicking any panel marks it "active"
     (which the CSS uses to expand it) and simultaneously de-activates all
     the other panels.

   Design pattern: "single source of truth via a CSS class"
     All visual state lives in CSS, keyed off the `active` class.
     JavaScript's only job is to move that class from one element to another.
     This is the cleanest way to separate concerns:
       - CSS owns *how* things look and animate.
       - JS owns *which* element is currently selected.
     If we later want to change the animation, we touch only CSS.
     If we later want to change what triggers selection (hover, keyboard,
     etc.), we touch only JS.
   ============================================================================ */

/* ----------------------------------------------------------------------------
   Grab all panels once, up front.
   ----------------------------------------------------------------------------
   querySelectorAll returns a *static* NodeList — a snapshot of the DOM at
   the moment of the call. This is fine here because the panel set is fixed
   (defined in HTML and never added/removed at runtime).

   Why cache the NodeList in a const?
     - Avoids re-querying the DOM on every click (minor perf win).
     - Makes the intent explicit: "these are the panels we care about."

   If panels were added dynamically later, we'd need to either:
     a) Re-query after insertion, or
     b) Use event delegation on .container (one listener instead of N).
---------------------------------------------------------------------------- */
const panels = document.querySelectorAll(".panel");

/* ----------------------------------------------------------------------------
   Attach a click handler to each panel.
   ----------------------------------------------------------------------------
   For each panel, register a listener that:
     1. Clears the `active` class from *all* panels (including itself).
     2. Re-adds `active` to just the clicked panel.

   Why clear-then-set rather than toggle?
     - Toggle would allow multiple active panels or none at all.
     - The UI's contract is "exactly one active panel at a time."
     - Clearing first enforces that invariant unconditionally.

   Arrow functions are used so there's no need to worry about `this`
   rebinding — we never reference `this` here; we close over `panel` and
   the outer `panels` constant instead.

   Performance note:
     For 5 panels this is negligible. If this pattern scaled to hundreds
     of elements, event delegation on .container would be preferred:
       container.addEventListener('click', e => {
         const panel = e.target.closest('.panel');
         if (panel) { ... }
       });
     That uses a single listener regardless of panel count.
---------------------------------------------------------------------------- */
panels.forEach((panel) => {
  panel.addEventListener("click", () => {
    removeActiveClasses(); // step 1: clear state from everyone
    panel.classList.add("active"); // step 2: mark the clicked panel active
  });
});

/* ----------------------------------------------------------------------------
   Helper: strip the `active` class from every panel.
   ----------------------------------------------------------------------------
   Extracted into its own function for two reasons:
     1. Readability — the click handler reads top-to-bottom like English:
        "remove active classes, then add active to this one."
     2. Reuse — if we later add keyboard navigation or auto-cycling
        (e.g., change active panel every 5 seconds), this function is
        ready to be called from there without duplication.

   classList.remove() is safe to call even on elements that don't have
   the class — it's a no-op in that case, so no need to check first.
---------------------------------------------------------------------------- */
function removeActiveClasses() {
  panels.forEach((panel) => {
    panel.classList.remove("active");
  });
}

/* ----------------------------------------------------------------------------
   Possible enhancements (not implemented — listed for future reference):
   ----------------------------------------------------------------------------
     - Accessibility:
         * Add role="button" and tabindex="0" to panels so keyboard users
           can focus them.
         * Listen for 'keydown' on Enter/Space to trigger the same behavior
           as click.
         * Add aria-expanded / aria-selected to convey state to screen readers.
     - Guard against clicking the already-active panel:
         if (panel.classList.contains('active')) return;
         (Purely a micro-optimization; current code handles it correctly.)
     - Support dynamic panels:
         Switch to event delegation on .container so newly-added panels
         work without re-binding listeners.
---------------------------------------------------------------------------- */
