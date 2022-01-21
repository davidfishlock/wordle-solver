type ElementWithDisabledState = HTMLElement & {
  disabled?: boolean;
};

export const focusNext = () => {
  const focusList = Array.from(
    document.querySelectorAll(
      "a, button, input, select, textarea, [tabindex], [contenteditable]"
    )
  )
    .filter(function (element) {
      return (
        !(element as ElementWithDisabledState).disabled &&
        element.getAttribute("tabindex") != "-1"
      );
    })
    .sort(function (element1, element2) {
      const element1Index =
        parseFloat(element1.getAttribute("tabindex") || "99999") || 99999;
      const element2Index =
        parseFloat(element2.getAttribute("tabindex") || "99999") || 99999;
      return element1Index - element2Index;
    });

  const currentFocusIndex = document.activeElement
    ? focusList.indexOf(document.activeElement)
    : -1;
  const nextFocusIndex =
    currentFocusIndex < focusList.length - 1 ? currentFocusIndex + 1 : 0;
  const nextFocusElement = focusList[nextFocusIndex];

  if (!(nextFocusElement as HTMLElement).focus) {
    console.error(
      "nextFocusElement: no element found or element not focusable"
    );
    return;
  }

  (nextFocusElement as HTMLElement).focus();
};
